import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const appendFileAsync = promisify(fs.appendFile);
const statAsync = promisify(fs.stat);

class LogService {
  private logFilePath: string;
  private maxFileSize: number; // Maximum log file size in bytes
  private logLevel: string; // Current log level (e.g., INFO, WARN, ERROR)
  private logToConsole: boolean; // Whether to log to the console

  constructor() {
    this.logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, '../../logs/app.log');
    this.maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE || '5242880', 10); // Default to 5 MB
    this.logLevel = process.env.LOG_LEVEL || 'INFO'; // Default to INFO
    this.logToConsole = process.env.NODE_ENV !== 'production'; // Log to console in non-production environments

    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    }
  }

  private async rotateLogFile() {
    try {
      const stats = await statAsync(this.logFilePath);
      if (stats.size >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFilePath = `${this.logFilePath}.${timestamp}`;
        fs.renameSync(this.logFilePath, rotatedFilePath);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error rotating log file:', error);
      }
    }
  }

  private async writeLog(level: string, message: string, meta?: Record<string, any>) {
    const levels = ['ERROR', 'WARN', 'INFO'];
    if (levels.indexOf(level) > levels.indexOf(this.logLevel)) {
      return; // Skip logging if the level is below the current log level
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };
    const logString = JSON.stringify(logEntry) + '\n';

    if (this.logToConsole) {
      console.log(`[${level}] ${message}`, meta || '');
    }

    try {
      await this.rotateLogFile();
      await appendFileAsync(this.logFilePath, logString);
    } catch (error) {
      console.error('Error writing log:', error);
    }
  }

  info(message: string, meta?: Record<string, any>) {
    this.writeLog('INFO', message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.writeLog('WARN', message, meta);
  }

  error(message: string, meta?: Record<string, any>) {
    this.writeLog('ERROR', message, meta);
  }
}

const logService = new LogService();
export default logService;
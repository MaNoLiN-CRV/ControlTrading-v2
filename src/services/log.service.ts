import fs from 'fs';
import path from 'path';

class LogService {
  private logFilePath: string;

  constructor() {
    this.logFilePath = path.join(__dirname, '../../logs/app.log');
    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    }
  }

  private writeLog(level: string, message: string, meta?: Record<string, any>) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };
    const logString = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logFilePath, logString);
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
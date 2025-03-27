import app from "./app";
import https from 'https';
import http from 'http';
import fs from 'fs';
import ApiConfig from "./config/api.config";
import createEnvFile from "./config/init.config";

// Initialize configuration
createEnvFile();

const PORT = process.env.PORT || 3000;

if (ApiConfig.USE_SSL) {
  try {
    const options = {
        key: fs.readFileSync(ApiConfig.SSL_OPTIONS.key!),
        cert: fs.readFileSync(ApiConfig.SSL_OPTIONS.cert!)
    };

    const server = https.createServer(options, app);
    server.listen(PORT, () => {
        console.log(`HTTPS Server running on https://localhost:${PORT}`);
    });
  }
  catch (error) {
    console.error('Error starting HTTPS server:', error);
    // Fallback to HTTP server
    console.log('Falling back to HTTP server...');
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`HTTP Server running on http://localhost:${PORT}`);
    });
  }
} else {
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`HTTP Server running on http://localhost:${PORT}`);
    });
}

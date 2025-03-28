import fs from 'fs';
import path from 'path';

const createEnvFile = () => {
  const envPath = path.join(process.cwd(), '.env');

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    const envContent = `# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=manel
DB_NAME=trading

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# SSL Configuration
USE_SSL=false
SSL_KEY_PATH=/path/to/your/private.key
SSL_CERT_PATH=/path/to/your/certificate.crt

# Cache Configuration
CACHE_TTL=300 # 5 minutes in seconds

# Log Configuration
LOG_LEVEL=INFO          # Nivel de log: INFO, WARN, ERROR
LOG_FILE_PATH=logs/app.log # Ruta del archivo de logs
LOG_MAX_FILE_SIZE=5242880 # Tamaño máximo del archivo de log en bytes (5 MB)`;

    try {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env file created successfully');
    } catch (error) {
      console.error('❌ Error creating .env file:', error);
    }
  }
};

export default createEnvFile;
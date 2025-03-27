class ApiConfig {
    static readonly CACHE_TTL = 60 * 5; // 5 minutes
    static readonly USE_SSL = process.env.USE_SSL === 'true';
    static readonly SSL_OPTIONS = {
        key: process.env.SSL_KEY_PATH,
        cert: process.env.SSL_CERT_PATH
    };
}

export default ApiConfig;
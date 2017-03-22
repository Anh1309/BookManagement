const devConfig = {
    env: 'development',
    jwtSecret: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
    db: 'mongodb://localhost/test',
    port: 3000,
    expireTime: 86400 * 15, // expireTime == 15 days
};

module.exports = devConfig;
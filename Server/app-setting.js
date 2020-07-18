module.exports = {
    portNo: 4000,
    db: {
        mongo: {
            main: {
                name: 'Hand-Held-Gate-Way-DB',
                address: 'localhost:27017'
            },
            log: {
                name: 'Hand-Held-Gate-Way-log',
                address: 'localhost:27017'
            }
        },
        sqlConfig: {
            driver: 'mssql',
            config: {
                user: 'dev',
                password: 'sin@',
                server: '10.0.0.11',
                database: 'BCTS980412'
            }
        }
    },
    jwtExpireTime: 3000,
    tokenHashKey: 'YOUR_TOKEN_HASH_KEY',
    jwtSecret: "YOUR_JWT_SECRET_KEY"


}

const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api', {
        // target: 'http://192.168.2.116:9001',
        target: 'https://www.morningxy.com',
        secure: false,
        changeOrigin: true
    }));
};

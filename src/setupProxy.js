const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(proxy('/**', { target: 'https://lighthouse-back-dev.herokuapp.com' }));
    // app.use(proxy('/otherApi/**', { target: 'http://localhost:5000' }));
};
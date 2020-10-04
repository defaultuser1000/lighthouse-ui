const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
    app.use(
        '/api',
        createProxyMiddleware('/api',
            {
                target: "https://lighthouse-back-dev.herokuapp.com/",
                changeOrigin: true
            })
    );
};
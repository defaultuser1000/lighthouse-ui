const { createProxyMiddleware } = require("http-proxy-middleware");

console.log(process.env.NODE_ENV);
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
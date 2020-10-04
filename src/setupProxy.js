const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
    app.use(createProxyMiddleware("/api/*", { target: "https://lighthouse-back-dev.herokuapp.com/" }));
};
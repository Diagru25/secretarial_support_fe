const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_BASE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
  app.use(
    "/upload",
    createProxyMiddleware({
      target: "http://192.168.1.125:4444/api",
      changeOrigin: true,
      pathRewrite: {
        "^/upload": "",
      },
    })
  );
};

const { createProxyMiddleware } = require("http-proxy-middleware");

console.log("Loading setupProxy.js");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
};

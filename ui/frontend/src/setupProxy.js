const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/rest/v1/bcm/api",
    createProxyMiddleware({
      // 👇️ make sure to update your target
      target: "http://localhost:8080/",
      changeOrigin: true,
    })
  );
};

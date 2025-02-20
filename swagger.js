const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Endpoints for managing users, addresses, and blogs",
    },
    servers: [
      {
        url: "http://localhost:3000", // آدرس سرور
        description: "Local Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // مسیر فایل‌های روت
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;

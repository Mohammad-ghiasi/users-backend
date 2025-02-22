import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: Options = {
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

const swaggerDocs = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;

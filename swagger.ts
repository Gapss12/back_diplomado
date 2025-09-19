import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentación",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de desarrollo"
      },
    ],
  },
  // Cambiado para buscar archivos .ts y .js
  apis: ["./src/**/*.ts", "./src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
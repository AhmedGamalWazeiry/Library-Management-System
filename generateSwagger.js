const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output3.json";
const endpointsFiles = ["./src/authors/routes.js"]; // Add any additional files with your routes here

swaggerAutogen(outputFile, endpointsFiles);

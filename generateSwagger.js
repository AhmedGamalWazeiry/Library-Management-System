const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output2.json";
const endpointsFiles = ["./src/borrowers/routes.js"]; // Add any additional files with your routes here

swaggerAutogen(outputFile, endpointsFiles);

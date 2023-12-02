const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecolink API documentation',
      version: '1.0.0',
      description: 'Fully documented API for Ecolink',
    },
  },
  apis: ['./routes/*.js'], // Update the path based on your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

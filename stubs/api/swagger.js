const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Emotion Diary API',
      version: '1.0.0',
      description: 'API для системы дневника эмоций и отслеживания настроения',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:8099/api',
        description: 'Локальный сервер разработки',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Эндпоинты для аутентификации и регистрации',
      },
    ],
  },
  apis: [path.join(__dirname, '**/*.js')], // Путь к файлам с аннотациями
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


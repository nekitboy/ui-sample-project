require('dotenv').config()
const { Router } = require('express')
const path = require('node:path')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const authRouter = require('./auth')

const router = Router()

const timer = (time = 300) => (req, res, next) => setTimeout(next, time);

// Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Emotion Diary API Documentation'
}))

router.use(timer());
router.use('/auth', authRouter)

// Глобальный обработчик ошибок (должен быть последним middleware)
router.use((err, req, res, next) => {
  // Если ответ уже был отправлен, передаем ошибку дальше
  if (res.headersSent) {
    return next(err);
  }

  // Определяем статус код
  const status = err.status || err.statusCode || 500;
  
  // Формируем сообщение об ошибке
  let message = err.message || 'Внутренняя ошибка сервера';
  
  // Если это ошибка от внешнего API (например, GigaChat)
  if (err.response?.data) {
    message = err.response.data.message || err.response.data.error || message;
  } else if (err.data) {
    message = err.data.message || message;
  }

  // Логируем ошибку (но не весь огромный объект)
  console.error('Ошибка в API:', {
    status,
    message,
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

  // Отправляем ошибку клиенту
  res.status(status).json({
    ok: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && status === 500 && { 
      stack: err.stack 
    })
  });
});

// Обработчик для несуществующих маршрутов
router.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Маршрут не найден'
  });
});

module.exports = router;

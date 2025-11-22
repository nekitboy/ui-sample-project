const { Router } = require('express')
const router = Router()

const users = new Map()

users.set('nikita', {
    "login": "nikita",
    "password": "123"
})

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя (опционально)
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Неправильные данные
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Неправильные данные"
 */
router.post('/', (req, res, next) => {
    try {
        const { login, email, password } = req.body;

        if (!login || !password) {
            return res.status(400).send({ok: false, message: 'Неправильные данные'})
        }

        if (users.has(login)) {
            const error = new Error('Пользователь уже существет')
            error.status = 409
            return next(error)
        }
        
        users.set(login, {
            login, email, password
        })
        
        res.send({
            ok: true
        })
    } catch (err) {
        next(err)
    }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *                 example: "nikita"
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 */
router.post('/login', (req, res, next) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).send({ ok: false, message: 'Логин и пароль обязательны' })
        }

        if (!users.has(login)) {
            return res.status(401).send({ ok: false, message: 'Пользователь не найден' })
        }

        if (users.get(login)?.password === password) {
            return res.send({
                ok: true
            })
        } else {
            const error = new Error('Неверный пароль')
            error.status = 401
            return next(error)
        }
    } catch (err) {
        next(err)
    }
})



module.exports = router;

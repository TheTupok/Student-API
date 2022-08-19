const Router = require('../framework/router');
const controller = require('./controllers/user-controller')

const router = new Router()

router.get('/users', controller.getUsers)

router.post('/users', controller.createUser)

module.exports = router
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const signRouter = require('./sign');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('', signRouter);

module.exports = router;

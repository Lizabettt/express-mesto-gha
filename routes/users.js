const userRouter = require('express').Router();

const {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserId);
userRouter.get('/me', getUserMy);
userRouter.patch('/me', changeUserData);
userRouter.patch('/me/avatar', changeAvatar);

module.exports = userRouter;

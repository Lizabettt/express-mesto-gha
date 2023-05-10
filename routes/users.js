const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line
const regURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const {
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserMy);
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserId,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  changeUserData,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regURL).required(),
    }),
  }),
  changeAvatar,
);

module.exports = userRouter;

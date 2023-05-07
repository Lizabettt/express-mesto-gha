const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const {
 // createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
} = require('../controllers/users');

//userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserId
);
userRouter.get('/me', getUserMy);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  changeUserData
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regURL),
    }),
  }),
  changeAvatar
);

module.exports = userRouter;

const User = require('../models/users');
const { NotFound, BadRequest, ServerError } = require('../errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Ошибка заполнения поля' });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
    });
};

const getUserMy = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(NotFound)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch(() => {
      res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NotFound)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const changeUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NotFound)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NotFound)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
    });
};
module.exports = {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
};

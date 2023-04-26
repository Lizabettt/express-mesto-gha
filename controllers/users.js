const User = require('../models/users');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ newUser }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка заполнения поля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

const getUserMy = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch(() => {
      res.status(404).send({ message: 'Пользователь потерян...' });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Не найден');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'Не найден') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
    });
};

const changeUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new Error('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new Error('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
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

const User = require('../models/users');

const {Conflict, BadRequest, ServerError, NotFound } = require('../errors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
  .then((hash) => {
    User.create({ name, about, avatar, email, password: hash }) // записываем хеш в базу
      .then((newUser) =>
        res.status(201).send({
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
          email: newUser.email,
          _id: newUser._id,
        })
      )
      .catch((err) => {
        //надо сделать error.code === 11000
        if (err.code === 11000) {
          res.status(Conflict).send({ message: 'Пользователь с такими данными уже зарегистрирован'})
        } else if (err.name === 'ValidationError') {
          res.status(BadRequest).send({ message: 'Ошибка заполнения поля' });
        } else {
          res
            .status(ServerError)
            .send({ message: 'Что-то на серверной стороне...' });
        }
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      if (!user) {
        throw new AuthorizationError('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали
          return new AuthorizationError('Неверные почта или пароль');
        }
        const token = jwt.sign({ _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
          expiresIn: '3d', // 3 дня -это время, в течение которого токен остаётся действительным.
        });
        res.cookie('auth', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        return res.send({ token }); // аутентификация успешна
      });
    })
    .catch(() => {
      res
        .status(ServerError)
        .send({ message: 'Что-то на серверной стороне...' });
    }); // ошибка аутентификации
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res
        .status(ServerError)
        .send({ message: 'Что-то на серверной стороне...' });
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
      res
        .status(ServerError)
        .send({ message: 'Что-то на серверной стороне...' });
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
        res
          .status(BadRequest)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(ServerError)
          .send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const changeUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
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
      res
        .status(ServerError)
        .send({ message: 'Что-то на серверной стороне...' });
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
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
      res
        .status(ServerError)
        .send({ message: 'Что-то на серверной стороне...' });
    });
};
module.exports = {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
  login
};

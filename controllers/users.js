const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

// console.log(User);
const {
  Conflict,
  BadRequest,
  NotFound,
//  AuthorizationError,
} = require('../errors');

const { JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }) // записываем хеш в базу
      .then((newUser) => res.status(201).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(
            new Conflict('Пользователь с такими данными уже зарегистрирован'),
          );
        } if (err.name === 'ValidationError') {
          next(
            new BadRequest('Ошибка заполнения поля'),
          );
        }
        next(err);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);

      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        {
          expiresIn: '7d', // 7 дня -это время, в течение которого токен остаётся действительным.
        },
      );
      // res.cookie('auth', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      // });
      res.send({ token }); // аутентификация успешна
    })
  //    })
    .catch(next); // ошибка аутентификации
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUserMy = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь по указанному _id не найден'),
        );
      }
      res.send({ user });
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь по указанному _id не найден'),
        );
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

const changeUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь по указанному _id не найден'));
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при обновлении профиля'),
        );
      }
      next(err);
    });
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь по указанному _id не найден'),
        );
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequest('Переданы некорректные данные при обновлении профиля'),
        );
      }
      return next(err);
    });
};
module.exports = {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
  login,
};

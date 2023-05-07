const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const AuthorizationError = require('../errors/authorizationError');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator: (url) => isURL(url),
      message: 'Введёнa некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // уникальное поле
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email })
    .then((user) => { // получаем объект пользователя, если почта и пароль подошли
      if (!user) { // не нашёлся — отклоняем промис
        return Promise.reject(
          new AuthorizationError('Неправильные почта или пароль'),
        );
      }
      return bcrypt
        .compare(password, user.password) // нашёлся — сравниваем хеши
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new AuthorizationError('Неправильные почта или пароль'),
            );
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);

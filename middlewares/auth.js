const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // убеждаемся, что он есть или начинается с Bearer
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', ''); // извлечём токенТаким образом, в переменную token запишется только JWT.
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // попытаемся верифицировать токен
  } catch (err) {
     return next(new AuthorizationError('Необходима авторизация')); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
module.exports = auth;
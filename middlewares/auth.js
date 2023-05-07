const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок
console.log(req.headers)
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // убеждаемся, что он есть или начинается с Bearer
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', ''); // извлечём токенТаким образом, в переменную token запишется только JWT.
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // попытаемся верифицировать токен
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация')); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

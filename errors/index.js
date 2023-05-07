const AuthorizationError = require('./authorizationError');
const BadRequest = require('./badRequestError');
const Conflict = require('./conflictError');
const Forbiden = require('./forbidenError');
const ServerError = require('./InternalServerError');
const NotFound = require('./notFoundError');

module.exports = {
  AuthorizationError,
  BadRequest,
  Conflict,
  Forbiden,
  ServerError,
  NotFound,
};

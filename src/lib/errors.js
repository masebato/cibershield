'use strict';

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name   = this.constructor.name;
    this.status = status;
  }
}

class BadRequestError   extends AppError { constructor(msg) { super(msg, 400); } }
class UnauthorizedError extends AppError { constructor(msg) { super(msg, 401); } }
class ForbiddenError    extends AppError { constructor(msg) { super(msg, 403); } }
class NotFoundError     extends AppError { constructor(msg) { super(msg, 404); } }
class ConflictError     extends AppError { constructor(msg) { super(msg, 409); } }

module.exports = { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError };

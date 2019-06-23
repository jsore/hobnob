/**
 * hobnob/src/validators/errors/validation-error/index.js
 *
 * from: hobnob/src/validators/errors/validation-error.js
 *
 * extension of Error object to define a custom error,
 * shared interface between handling requests and request
 * validation errors
 */

class ValidationError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export default ValidationError;

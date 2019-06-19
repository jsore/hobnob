/**
 * hobnob/src/validators/users/create.js
 *
 * module for user create validation logic
 */

/** custom module for request validation failures */
import ValidationError from '../errors/validation-error';


/**
 * operating on response object directly is not in scope
 *
 * instead return instances of ValidationErrors using
 * the custom defined interface imported here
function validate (req) {
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({
      message: 'Payload must contain at least the email and password fields',
    });
  }
  ...
*/

function validate(req) {

  /** ensures user entered required fields */
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    return new ValidationError(
      'Payload must contain at least the email and password fields',
    );
  }

  /** emails and PWs should only be strings */
  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
  ) {
    return new ValidationError(
      'The email and password fields must be of type string'
    );
  }

  /** and we only want actual email addresses */
  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError(
      'The email field must be a valid email.'
    );
  }

  /** validation successfull */
  return undefined;
}

export default validate;

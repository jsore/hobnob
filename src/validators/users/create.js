/**
 * hobnob/src/validators/users/create.js
 *
 * module for user create validation logic
 */


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


/** json schema validation library and our libraries */
import Ajv from 'ajv';
import profileSchema from '../../schema/users/profile.json';
import createUserSchema from '../../schema/users/create.json';

/** custom module for request validation failures */
import ValidationError from '../errors/validation-error';
import generateValidationErrorMessage from '../errors/messages';


/**
 * refactor: instead of using if statements to validate, use
 * custom defined JSON Schema and Schema validation library
function validate(req) {
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    return new ValidationError(
      'Payload must contain at least the email and password fields',
    );
  }
  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
  ) {
    return new ValidationError(
      'The email and password fields must be of type string'
    );
  }
  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError(
      'The email field must be a valid email.'
    );
  }
  return undefined;
}
*/
function validate(req) {
  const ajvValidate = new Ajv()
    /** overwrites default method for checking email */
    // .addFormat('email', /^[\w.+]+@\w+\.\w+$/)  // missing \ in front of .
    // eslint-disable-next-line no-useless-escape
    .addFormat('email', /^[\w\.+]+@\w+\.\w+$/)
    /** bring in sub-schemas */
    .addSchema([profileSchema, createUserSchema])
    /** returns the actual validation function */
    .compile(createUserSchema);

  const valid = ajvValidate(req.body);
  if (!valid) {
    /**
     * Ajv holds errors in ajvValidate.errors array of
     * objects, short-circuited upon first error encountered
     * if not called with:  new Ajv({allErrors: true})
     */
    // return new ValidationError(
    //   'The profile provided is invalid.'
    // );
    return new ValidationError(
      generateValidationErrorMessage(ajvValidate.errors)
    );
  }
  return true;
}


export default validate;

/**
 * hobnob/src/validators/errors/messages.js
 *
 * specifies the error messages to return upon encountering
 * a ValidationError from parsing JSON Schema's
 */


/**
 * refactor: too coupled with Create User endpoint, instead
 * use a generalized format for all validation errors, which
 * provides local consistency; all validators will have a
 * consistent structure/format for their error messages
function generateValidationErrorMessage(errors) {
  const error = errors[0];
  if (error.dataPath.indexOf('.profile') === 0) {
    return 'The profile provided is invalid.';
  }
  if (error.keyword === 'required') {
    return 'Payload must contain at least the email and password fields';
  }
  if (error.keyword === 'type') {
    return 'The email and password fields must be of type string';
  }
  if (error.keyword === 'format') {
    return 'The email field must be a valid email';
  }
  return 'The object is invalid';
}
*/
function generateValidationErrorMessage(errors) {
  const error = errors[0];
  if (error.keyword === 'required') {
    return `The '${error.dataPath}.${error.params.missingProperty}' field is missing`;
  }
  if (error.keyword === 'type') {
    return `The '${error.dataPath}' field must be a of type ${error.params.type}`;
  }
  if (error.keyword === 'format') {
    return `The '${error.dataPath}' field must be a valid ${error.params.format}`;
  }
  if (error.keyword === 'additionalProperties') {
    return `The '${error.dataPath}' object does not support the field '${error.params.additionalProperty}'`;
  }
  return 'The object is not valid';
}

export default generateValidationErrorMessage;

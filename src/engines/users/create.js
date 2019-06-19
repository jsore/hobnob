/**
 * hobnob/src/engines/users/create.js
 *
 * engine for receiving a request, processing the request
 * then respond with that operation's results
 *
 * request will be received from /users POST request handler
 */

import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/users/create';

/**
 * validate the request and write the user document to the
 * database, returns result back to request handler
 *
 * async, so it should return a promise
 */
function create(req, db) {

  /**
   * validate 1st and reject if required to
   */
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  /**
   * operate on the request ( try to index the supplied user
   * document ) and return the result
   */
  return db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body,
  });
}

export default create;

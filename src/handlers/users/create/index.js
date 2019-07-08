/**
 * src/handlers/users/create/index.js
 *
 * from: hobnob/src/handlers/users/create.js
 *
 * request handler for POST's to /users
 */

/**
 * import create from '../../../engines/users/create';
 * function createUser(req, res, db) {
 *   return create(req, db)
 *     .then(onPromiseFulfilled, onPromiseRejected)
 *     .catch( ... );
 * }
 */

/** db = the ES client passed from injectHandlerDependencies */
/** refactor: following the dependency injection patter */
// function createUser(req, res, db) {
function create(
  req,
  res,
  db,
  engine,
  validator,
  ValidationError
) {
  /**
   * create engine and ValidationError class get injected
   * into this handler from
   * src/index.js & injectHandlerDependencies()
   */

  /** refactor: move validation logic to module */

  /** refactor: the engine should handle the validation logic */

  /** refactor: dependency injection for unit testing */

  /**
   * always return Promises if dealing with async operations
   */
  return engine(req, db, validator, ValidationError)
    // .then((result) => {
    .then((userId) => {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      // return res.send(userId._id);
      return res.send(userId);
    }, (err) => {
      if (err instanceof ValidationError) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        return res.json({ message: err.message });
      }
      // return undefined /** returns a resolved promise */
      /**
       * let error propagate down the promise chain on err
       * received that isn't a ValidationError
       */
      throw err;
    }).catch(() => {
      res.status(500);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'Internal Server Error' });
    });
}

export default create;

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
function createUser(
  req,
  res,
  db,
  createUserEngine,
  createUserValidator,
  ValidationError
) {
  /**
   * create engine and ValidationError class get injected
   * into this handler from
   * src/index.js & injectHandlerDependencies()
   */

  /** refactor: move validation logic to module */
  //  /** ensures user entered required fields */
  //  if (
  //    !Object.prototype.hasOwnProperty.call(req.body, 'email')
  //    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  //  ) {
  //    res.status(400);
  //    res.set('Content-Type', 'application/json');
  //    return res.json({
  //      message: 'Payload must contain at least the email and password fields',
  //    });
  //  }
  //
  //  /** emails and PWs should only be strings */
  //  if (
  //    typeof req.body.email !== 'string'
  //    || typeof req.body.password !== 'string'
  //  ) {
  //    res.status(400);
  //    res.set('Content-Type', 'application/json');
  //    return res.json({
  //      message: 'The email and password fields must be of type string',
  //    });
  //  }
  //
  //  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
  //    res.status(400);
  //    res.set('Content-Type', 'application/json');
  //    return res.json({
  //      message: 'The email field must be a valid email.',
  //    });
  //  }
  /** refactor: the engine should handle the validation logic */
  //  const validationResults = validate(req);
  //  if (validationResults instanceof ValidationError) {
  //    res.status(400);
  //    res.set('Content-Type', 'application/json');
  //    return res.json({
  //      message: validationResults.message
  //    });
  //  }
  //
  //  /** refactor: use the existing client to index the user document */
  //  // client.index({
  //  db.index({
  //    index: process.env.ELASTICSEARCH_INDEX,
  //    type: 'user',
  //    body: req.body,
  //  }).then(function (result) {
  //    res.status(201);
  //    res.set('Content-Type', 'text/plain');
  //    res.send(result._id);
  //    return;
  //  }, function (err) {
  //    res.status(500);
  //    res.set('Content-Type', 'application/json');
  //    res.json({
  //      message: 'Internal Server Error',
  //    });
  //    return;
  //  });
  /** refactor: dependency injection for unit testing */
  // create(req, db).then((result) => {

  /* ===================================================================
  =            what's in the book 'improving test coverage'            =
  =================================================================== */
  /**
   * always return Promises if dealing with async operations
   */
  return createUserEngine(req, db, createUserValidator, ValidationError)
    .then((result) => {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      return res.send(result._id);
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
  /* =======================================================
  =            what's in the src code Chapter 6            =
  ======================================================= */
  // //// return createUserEngine(req, db, createUserValidator, ValidationError)
  // ////   .then((result) => {
  // ////     res.status(201);
  // ////     res.set('Content-Type', 'text/plain');
  // ////     return res.send(result._id);
  // ////   })
  // ////   .catch((err) => {
  // ////     if (err instanceof ValidationError) {
  // ////       res.status(400);
  // ////       res.set('Content-Type', 'application/json');
  // ////       res.json({ message: err.message });
  // ////       return err;
  // ////     }
  // ////     res.status(500);
  // ////     res.set('Content-Type', 'application/json');
  // ////     res.json({ message: 'Internal Server Error' });
  // ////     return err;
  // ////   });
}

export default createUser;

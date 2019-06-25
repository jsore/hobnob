/**
 * src/handlers/users/create/index.js
 *
 * from: hobnob/src/handlers/users/create.js
 *
 * request handler for POST's to /users
 */

// import ValidationError from '../../validators/errors/validation-error';
/** refactor: following the dependency injection patter */
// import ValidationError from '../../../validators/errors/validation-error'; // /index.js

/** validation shouldn't happen here */
// import validate from '../../validators/users/create';
/** use the engine to handle validation instead */
// import create from '../../engines/users/create';
/** refactor: following the dependency injection patter */
// import create from '../../../engines/users/create'; // /index.js


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
  /**
   * always return Promises if dealing with async operations
   */
  // return create(req, db, createUserValidator, ValidationError)
  // ////// return createUserEngine(req, db, createUserValidator, ValidationError)
  // //////   .then((result) => {
  // //////     /**
  // //////      * handle successfull request operation...
  // //////      */
  // //////     // 201 created
  // //////     res.status(201);
  // //////     res.set('Content-Type', 'text/plain');
  // //////     // the new indexed thing
  // //////     return res.send(result._id);
  // //////   /**
  // //////    * ...or handle validation ( request ) errors...
  // //////    */
  // //////   }, (err) => {
  // //////     if (err instanceof ValidationError) {
  // //////       res.status(400);
  // //////       res.set('Content-Type', 'application/json');
  // //////       return res.json({
  // //////         message: err.message,
  // //////       });
  // //////     }
  // //////     // caller expects ID back on success
  // //////     return undefined;
  // //////   /**
  // //////    * ...or handle server ( code ) errors
  // //////    */
  // //////   })
  // //////   .catch(() => {
  // //////     res.status(500);
  // //////     res.set('Content-Type', 'application/json');
  // //////     return res.json({
  // //////       message: 'Internal Server Error',
  // //////     });
  // //////   });
  return createUserEngine(req, db, createUserValidator, ValidationError)
    .then((result) => {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      return res.send(result._id);
    }) // ////// }, (err) => {
    // //////   if (err instanceof ValidationError) {
    // //////     res.status(400);
    // //////     res.set('Content-Type', 'application/json');
    // //////     return res.json({ message: err.message });
    // //////   }
    // //////   return undefined;
    // ////// }) // <- closing paren for then((result => {}))

    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({ message: err.message });
        return err;
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal Server Error' });
      return err;
    });
}

export default createUser;

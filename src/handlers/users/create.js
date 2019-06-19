/**
 * hobnob/src/handlers/users/create.js
 *
 * handle requests to /users
 */

/** db = the ES client passed from injectHandlerDependencies */
function createUser(req, res, db) { /* eslint-disable */

  /** ensures user entered required fields */
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

  /** emails and PWs should only be strings */
  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({
      message: 'The email and password fields must be of type string',
    });
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({
      message: 'The email field must be a valid email.',
    });
  }

  // client.index({
  /** use the existing client instead */
  db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body,
  }).then(function (result) {
    res.status(201);
    res.set('Content-Type', 'text/plain');
    res.send(result._id);
    return;
  }, function (err) {
    res.status(500);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'Internal Server Error',
    });
    return;
  });

  return;
}

export default createUser;

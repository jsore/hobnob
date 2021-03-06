/**
 * src/handlers/users/retrieve/index.js
 *
 * Clients should be able to send a request to our API in
 * order to retrieve an user.
 */

/** dependencies previously injected with injectHandlerDependencies */

function retrieveUser(req, res, db, engine) {
  return engine(req, db).then((result) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    return res.send(result);
  }).catch((err) => {
    if (err.message === 'Not Found') {
      res.status(404);
      res.set('Content-Type', 'application/json');
      return res.json({ message: err.message });
    }
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Internal Server Error' });
  });
}

export default retrieveUser;

/**
 * hobnob/src/middlewares/check-content-type-is-set/index.js
 */

function checkContentTypeIsSet(req, res, next) {
  /** headers with content must specify their body is JSON */
  if (
    // pre-unit testing code:
    // req.headers['content-length']
    // && req.headers['content-length'] !== '0'
    // && !req.headers['content-type']
    ['POST', 'PATCH', 'PUT'].includes(req.method)
    && req.headers['content-length'] !== '0'
    && !req.headers['content-type']
  ) {
    /** if not, form a failure response */
    res.status(400);
    res.set('Content-Type', 'application/json');
    // res.json({
    //   message: 'The "Content-Type" header must be set for requests with a non-empty payload',
    // });
    return res.json({
    // res.json({
      message: 'The "Content-Type" header must be set for requests with a non-empty payload',
    });
    // return;
  }
  return next();
  // next();
}

export default checkContentTypeIsSet;

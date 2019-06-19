/**
 * hobnob/src/middlewares/check-content-type-is-json.js
 */

function checkContentTypeIsJson(req, res, next) {
  /** if reqyest payload isn't JSON or is malformed JSON */
  if (!req.headers['content-type'].includes('application/json')) {
    /** then form a failure response */
    res.status(415);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'The "Content-Type" header must always be "application/json"',
    });
    return;
  }
  next();
}

export default checkContentTypeIsJson;

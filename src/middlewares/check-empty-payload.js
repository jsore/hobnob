/**
 * hobnob/src/middlewares/check-empty-payload.js
 *
 * for POST, PATCH, PUT requests, enpoint expects a payload
 */

function checkEmptyPayload(req, res, next) {
  /** if client request payload is empty */
  if (
    ['POST', 'PATCH', 'PUT'].includes(req.method)
    && req.headers['content-length'] === '0'
  ) {
    /** then form a failure response */
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'Payload should not be empty',
    });
    return;
  }
  next();
}

// export default checkContentLength;
export default checkEmptyPayload;

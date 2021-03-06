/**
 * src/engines/users/delete/index.js
 */

function del(req, db) {
  return db.delete({
    index: process.env.ES_INDEX,
    type: 'user',
    id: req.params.userId,
  }).then(() => undefined)
    .catch((err) => {
      if (err.status === 404) {
        return Promise.reject(new Error('Not Found'));
      }
      return Promise.reject(new Error('Internal Server Error'));
    });
}

export default del;

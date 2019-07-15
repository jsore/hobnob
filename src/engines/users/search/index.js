/**
 * src/engines/users/search/index.js
 */

function search(req, db, validator, ValidationError) {
  const validationResults = validator(req);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  const query = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    /**
     * this is a breaking change in the ES API
     */
    // _sourceExclude: 'password',
    _source_exclude: 'password',
  };

  /** ??? */
  if (req.query.query !== '') {
    query.q = req.query.query;
  }

  return db.search(query)
    .then(res => res.hits.hits.map(hit => hit._source))
    .catch(() => Promise.reject(new Error('Internal Server Error')));
    /** testing for the breaking change on line 17/18 */
    // .catch((err) => Promise.reject(err));
}

export default search;

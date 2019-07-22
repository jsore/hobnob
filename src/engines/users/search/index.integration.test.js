/**
 * src/engines/users/search/index.integration.test.js
 */
import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import validator from '../../../validators/users/search';
import search from '.';

const db = new elasticsearch.Client({
  // host: `${process.env.ES_PROTOCOL}://${process.env.ES_HOSTNAME}:${process.env.ES_PORT}`,
  host: `${process.env.ES_HOSTNAME}:${process.env.ES_PORT}`,
});

const SEARCH_TERM = 'apple banana carrot';
const USER_ID = 'TEST_USER_ID';
const USER_OBJ = {
  email: 'e@ma.il',
  password: 'hunter2',
  profile: {
    summary: SEARCH_TERM,
  },
};
const SEARCH_USER_OBJ = {
  email: 'e@ma.il',
  profile: {
    summary: SEARCH_TERM,
  },
};

describe('Engine - Users - Search', function () {
  const req = {
    query: {
      query: SEARCH_TERM,
    },
  };
  let promise;
  beforeEach(function () {
    promise = search(req, db, validator, ValidationError);
    return promise;
  });
  describe('When there are no users that matches the search term', function () {
    it('should return with a promise that resolves to an array', function () {
      /**
       * these two lines are testing for the breaking change noted in engines/.../search/index.js
       */
      // const newtestresult = promise.then(result => assert(Array.isArray(result)));
      // console.log(newtestresult);
      return promise.then(result => assert(Array.isArray(result)));
    });
    it('which is empty', function () {
      return promise.then(result => assert.equal(result.length, 0));
    });
  });
  describe('When there are users that matches the search term', function () {
    beforeEach(function () {
      // Creates a user with _id set to USER_ID
      return db.index({
        index: process.env.ES_INDEX,
        type: 'user',
        id: USER_ID,
        body: USER_OBJ,
        refresh: 'true',
      });
    });
    afterEach(function () {
      return db.delete({
        index: process.env.ES_INDEX,
        type: 'user',
        id: USER_ID,
        refresh: 'true',
      });
    });
    describe('When the Elasticsearch operation is successful', function () {
      beforeEach(function () {
        promise = search(req, db, validator, ValidationError);
        return promise;
      });
      it('should return with a promise that resolves to an array', function () {
        return promise.then(result => assert(Array.isArray(result)));
      });
      it('which is empty', function () {
        return promise.then(result => assert.deepEqual(result[0], SEARCH_USER_OBJ));
      });
    });
  });
});

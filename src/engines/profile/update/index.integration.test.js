/**
 * src/engines/profile/update/index.integration.test.js
 */

import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import validator from '../../../validators/profile/update';
import update from '.';

const USER_ID = 'TEST_USER_ID';
const ORIGINAL_USER_OBJ = {
  email: 'e@ma.il',
  password: 'hunter2',
  profile: {
    summary: 'test',
    bio: 'test',
  },
};
const NEW_USER_OBJ = {
  email: 'e@ma.il',
  password: 'hunter2',
  profile: {
    summary: 'summary',
    bio: 'test',
  },
};
const db = new elasticsearch.Client({
  // host: `${process.env.ES_PROTOCOL}://${process.env.ES_HOSTNAME}:${process.env.ES_PORT}`,
  host: `${process.env.ES_HOSTNAME}:${process.env.ES_PORT}`,
});

describe('Engine - Profile - Update', function () {
  let req;
  let promise;
  describe('When the request is not valid', function () {
    beforeEach(function () {
      req = {};
      return update(req, db, validator, ValidationError)
        .catch(err => assert(err instanceof ValidationError));
    });
  });
  describe('When the request is valid', function () {
    beforeEach(function () {
      req = {
        body: {
          summary: 'summary',
        },
        params: {
          userId: USER_ID,
        },
      };
    });
    describe('When the user does not exists', function () {
      beforeEach(function () {
        promise = update(req, db, validator, ValidationError);
      });
      it('should return with a promise that rejects with an Error object', function () {
        return promise.catch(err => assert(err instanceof Error));
      });
      it("that has the mesage 'Not Found'", function () {
        return promise.catch(err => assert.equal(err.message, 'Not Found'));
      });
    });
    describe('When the user exists', function () {
      beforeEach(function () {
        // Creates a user with _id set to USER_ID
        promise = db.index({
          index: process.env.ES_INDEX,
          type: 'user',
          id: USER_ID,
          body: ORIGINAL_USER_OBJ,
          refresh: true,
        }).then(() => update(req, db, validator, ValidationError));
        return promise;
      });
      afterEach(function () {
        return db.delete({
          index: process.env.ES_INDEX,
          type: 'user',
          id: USER_ID,
        });
      });
      describe('When the Elasticsearch operation is successful', function () {
        it('should return with a promise that resolves', function () {
          return promise.then(() => assert(true));
        });
        it('to undefined', function () {
          return promise.then(res => res === 'undefined');
        });
        it('should have updated the user profile object', function () {
          return db.get({
            index: process.env.ES_INDEX,
            type: 'user',
            id: USER_ID,
          })
            .then(user => user._source)
            .then(user => assert.deepEqual(user, NEW_USER_OBJ));
        });
      });
    });
  });
});

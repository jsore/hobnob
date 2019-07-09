/**
 * src/engines/users/create/index.integration.test.js
 *
 * tests createUserEngine -> DB compatibility
 */

import assert from 'assert';

/**
 * don't stub out functionality, bring in the modules instead
 */
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import createUserValidator from '../../../validators/users/create';
import create from '.';

/** instantiate an Elasticsearch JavaScript client */
const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
  // host: 'http://localhost:9200', ELASTICSEACH_HOSTNAME
});

// describe('User Create Engine', function () {
describe('Engine - User - Create', function () {

  describe('When invoked with invalid req', function () {
    it('should return promise that rejects with an instance of ValidationError',
    function () {

      const req = {};
      // create(req, db, createUserValidator, ValidationError)
      return create(req, db, createUserValidator, ValidationError)
        .catch(err => assert(err instanceof ValidationError));
    });
  });

  describe('When invoked with valid req', function () {
    it('should return a success object containing the user ID', function () {
      const req = {
        body: {
          email: 'e@ma.il',
          password: 'password',
          profile: {},
        },
      };
      // create(req, db, createUserValidator, ValidationError)
      return create(req, db, createUserValidator, ValidationError)
        .then((result) => {
          // assert.equal(result.result, 'created');
          // assert.equal(typeof result._id, 'string');
          assert.equal(typeof result, 'string');
        });
    });
  });

});

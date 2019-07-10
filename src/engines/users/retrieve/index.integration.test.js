/* eslint-disable */
/**
 * src/engines/users/retrieve/index.integration.test.js
 */


/**
 * dont forget to remove the linting disable rule
 */


import assert from 'assert';
import elasticsearch from 'elasticsearch';
import retrieve from '.';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

const USER_ID = 'TEST_USER_ID';
const RETRIEVE_USER_OBJ = {
  email: 'e@ma.il',
};

describe('Engine - Users - Retrieve', function () {
  const req = {
    params: {
      userId: USER_ID,
    },
  };
  let promise;

  describe('When the user does not exist', function () {

  });

  describe('When the user exists', function () {
    beforeEach(function () {

    });
    afterEach(function () {

    });
    describe('When the Elasticsearch operation is successful', function () {

    });
  });
});

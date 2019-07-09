/* eslint-disable */
/**
 * src/engines/users/retrieve/index.integration.test.js
 */


/**
 * dont forget to remove the linting disable rule
 */


import assert from 'assert';
import retrieve from '.';
import elasticsearch from 'elasticsearch';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

describe('Engine - Users - Retrieve', function () {
  beforeEach(function () {

  });
});

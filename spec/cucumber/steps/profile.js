/**
 * hobnob/spec/cucumber/steps/profile.js
 */

import assert from 'assert';
import { After } from 'cucumber';
import elasticsearch from 'elasticsearch';
const esHost = process.env.ELASTICSEACH_HOSTNAME;
const esPort = process.env.ELASTICSEACH_PORT;
const testEsIndex = process.env.ELASTICSEARCH_INDEX_TEST;

const client = new elasticsearch.Client({
  host: `${esHost}:${esPort}`,
});

After({tags: "@profile"}, function deleteUser(testCase, callback){
  client.delete({
    index: testEsIndex,
    type: 'user',
    id: this.userId
  })
  .then(function (res) {
    assert.equal(res.result, 'deleted');
    callback();
  })
  .catch(callback);
});

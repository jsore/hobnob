/**
 * hobnob/spec/cucumber/steps/index.js
 *
 * Step definitions for Feature tests in .feature files.
 *
 * Cucumber runs the appropriate definition by matching the
 * string patterns from a Feature's Scenario' or 'Scenario
 * Outline' Steps.
 *
 * Path to find the Feature specifications ( "root" ):
 *
 * hobnob/spec/cucumber/features/<feature>/<sub-feature>
 */
import superagent from 'superagent';
import { When, Then } from 'cucumber';
/** Node module, specify expected and actual test results easier */
import assert from 'assert';
import { getValidPayload, convertStringToArray } from './utils';
import elasticsearch from 'elasticsearch';


/**
 * refactored: no more static global values
 * let different scenarios from .feature files share step
 * definitions from definition file(s) but use different
 * values ( parameters ) and isolating scenario contexts by
 * using contxt objects ( Cucumber 'Worlds' )
 */
// let request;
// let result;
// let error;
// let payload;

/**
 *----------  root/main.feature  --------------------------
 *
 * General test scenarios, things applicable globally
 *
 * 1. Client sends a POST|PATCH|PUT to any endpoint
 *
 *
 * ----------  root/users/create/main.feature  ----------
 *
 * Create User Feature test scenarios
 *
 * 1. Handle Bad Client Requests ( headers )
 *   - POST request payloads to /users that are empty
 *   - POST request payloads to /users that aren't JSON
 *   - POST request payloads to /users with malformed JSON
 *   - failure responses must be JSON with an HTTP stat code
 *
 * 2. Handle Bad Request Payloads ( bodies )
 */


const host = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;
const esProtocol = process.env.ELASTICSEACH_PROTOCOL;
const esHost = process.env.ELASTICSEACH_HOSTNAME;
const esPort = process.env.ELASTICSEACH_PORT;


/** give ES instance a custom host option */
const client = new elasticsearch.Client({
  host: `${esProtocol}://${esHost}:${esPort}`,
});


When (/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function(method, path) {
  /** start a new request with a new request object */
  this.request = superagent(method, `${host}:${port}${path}`);
});


When(/^attaches a generic (.+) payload$/, function (payloadType) {
  /** case values pulled from scenario outline's datatable */
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "justin@jsore.com", name: }')
        .set('Content-Type', 'application/json');
      // break;
      return;
    case 'non-JSON':
      this.request
        // .send(`${createUserCaseXML}`)
        .send('<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>')
        // .set('Content-Type', 'text/html');
        .set('Content-Type', 'text/xml');
      // break;
      return;
    /** superagent sends a blank payload by default, use it */
    case 'empty':
    default:
    return;
  }
});


When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
  // return;
});


When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {  // refactor me
  /** attach dummy user payload with a field missing */
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  /** convert extracteed paramter str to arr... */
  const fieldsToDelete = missingFields.split(',')
    /** ...loop through each object prop and clean it... */
    .map(s => s.trim()).filter(s => s !== '');
    /** ...delete one and feed incomplete payload into req */
  fieldsToDelete.forEach(field => delete payload[field]);
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});


When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {  // refactor
  const payload = {
    email: 'e@mai.il',
    password: 'password',
  };
  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    string: {
      is: 'string',
      not: 10,
    },
  };
  const fieldsToModify = fields.split(',')
    .map(s => s.trim()).filter(s => s !== '');
  fieldsToModify.forEach((field) => {
    payload[field] = sampleValues[typeKey][invertKey];
  });
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});


// When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
//   const payload = {
//     email: 'e@ma.il',
//     password: 'password',
//   };
//   const fieldsToModify = fields.split(',').map(s => s.trim()).filter(s => s !== '');
//   fieldsToModify.forEach((field) => {
//     payload[field] = value;
//   });
//   this.request
//     .send(JSON.stringify(payload))
//     .set('Content-Type', 'application/json');
// });
When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(fields);
  fieldsToModify.forEach((field) => {
    this.requestPayload[field] = value;
  });
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});


When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});


When(/^sends the request$/, function(callback) {
  /** wait until response received... */
  this.request
    .then((response) => {
      /** ...then store it */
      this.response = response.res;
      callback();
    })
    .catch((error) => {
      this.response = error.response;
      callback();
    });
});


Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});


Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (payloadType === 'JSON object') {
    /** verify header */
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of Content-Type application/json');
    }
    /** make sure it's valid JSON */
    try {
      this.responsePayload = JSON.parse(this.response.text);
    } catch (e) {
      throw new Error('Response not a valid JSON object');
    }
  }
  else if (payloadType === 'string') {
    /** verify header */
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of Content-Type text/plain');
    }
    /** make sure it's a string */
    this.responsePayload = this.response.text;
    if (typeof this.responsePayload !== 'string') {
      throw new Error('Response not a string');
    }
  }
});


Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});


/**
 * string the Create User payload returns, which gets stored
 * in this.responsePayload, should be the ID, if we can find
 * that user document then it was stored successfully
 */
Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/, function (type, callback) {
  /** persist user type ( mock for tests VS real users ) */
  this.type = type;
  /**
   * find a document by ID, get a JSON doc from the index,
   * the user document is stored in _source key
   */
  client.get({
    index: 'hobnob',
    type: type,
    id: this.responsePayload
  }).then((result) => {
    /** confirm _source doc and request are the same */
    assert.deepEqual(result._source, this.requestPayload);
    callback();
  }).catch(callback);
});


Then('the newly-created user should be deleted', function () {
  /** delete mock users by ID */
  client.delete({
    index: 'hobnob',
    type: this.type,
    id: this.responsePayload,
  }).then(function (res) {
    /** on delete success result property = 'deleted' */
    assert.equal(res.result, 'deleted');
    callback();
  }).catch(callback);
});

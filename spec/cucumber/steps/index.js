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


// dirty, but it keeps away long expressions ¯\_(ツ)_/¯
const host = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;
const createUserWhenHTTP = /^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/;
const createUserCaseXML = '<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>';
const createUserFirstThen = /^our API should respond with a ([1-5]\d{2}) HTTP status code$/;
const createUserSecondThen = /^the payload of the response should be a JSON object$/;
const createUserThirdThen = /^contains a message property which says (?:"|')(.*)(?:"|')$/;
const createUserWhenMissingField = /^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/;
const createUserNotTypeStr = /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/;
const generalButWhen = /^without a (?:"|')([\w-]+)(?:"|') header set$/;

/**
 * When the client creates a POST request to /users...
 */
When (createUserWhenHTTP, function(method, path) {
  /** start a new request with a new request object */
  this.request = superagent(method, `${host}:${port}${path}`);
});

/**
 * ...And attaches a generic <payloadType> payload...
 */
When(/^attaches a generic (.+) payload$/, function (payloadType) {
  /** case values pulled from scenario outline's datatable */
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "justin@jsore.com", name: }')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send(`${createUserCaseXML}`)
        //.set('Content-Type', 'text/html');
        .set('Content-Type', 'text/xml');
      break;
    /** superagent sends a blank payload by default, use it */
    case 'empty':
    default:
  }
});

// attaches a valid payload

/**
 * ...And attaches a payload with missing <missingFields> field
 */
When(createUserWhenMissingField, function (payloadType, missingFields) {  // refactor me
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

When(createUserNotTypeStr, function (payloadType, fields, invert, type) {  // refactor
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

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  const fieldsToModify = fields.split(',').map(s => s.trim()).filter(s => s !== '');
  fieldsToModify.forEach((field) => {
    payload[field] = value;
  });
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

/**
 * ...But wihtout a "Content-Type" header set...
 */
When(generalButWhen, function (headerName) {
  this.request.unset(headerName);
});

/**
 * ...And sends the request
 */
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


/**
 * Then our API should respond with a <statusCode> HTTP status code...
 */
Then(createUserFirstThen, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

/**
 * ...And the payload of the response should be a JSON object...
 */
Then(createUserSecondThen, function () {
  /** parse header to verify we're sending back JSON */
  const contentType = this.response.headers['Content-Type'] ||
    this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type application/json');
  }
  try {
    /** check for valid JSON, throws error if .parse() fails */
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});

// ...And contains a message property which says <message>
Then(createUserThirdThen, function (message) {
  assert.equal(this.responsePayload.message, message);
});




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

/**----------  root/main.feature  --------------------------
 *
 * General test scenarios, things applicable globally
 *
 * 1. Client sends a POST|PATCH|PUT to any endpoint
 */

// dirty, but it keeps away long expressions ¯\_(ツ)_/¯
const generalButWhen = /^without a (?:"|')([\w-]+)(?:"|') header set$/;

/** But wihtout a "Content-Type" header set */
When(generalButWhen, function (headerName) {
  this.request.unset(headerName);
});
/**
 * ----------  root/users/create/main.feature  ----------
 *
 * Create User Feature test scenarios
 *
 * 1. Handle Bad Client Requests
 *   - POST request payloads to /users that are empty
 *   - POST request payloads to /users that aren't JSON
 *   - POST request payloads to /users with malformed JSON
 *   - responses for failures must be JSON and include a HTTP status code
 */

// dirty, but it keeps away long expressions ¯\_(ツ)_/¯
const host = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;
const createUserWhenHTTP = /^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/;
const createUserCaseXML = '<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>';
const createUserFirstThen = /^our API should respond with a ([1-5]\d{2}) HTTP status code$/;
const createUserSecondThen = /^the payload of the response should be a JSON object$/;
const createUserThirdThen = /^contains a message property which says (?:"|')(.*)(?:"|')$/;

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
        .set('Content-Type', 'text/html');
      break;
    /** superagent sends a blank payload by default, use it */
    case 'empty':
    default:
  }
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




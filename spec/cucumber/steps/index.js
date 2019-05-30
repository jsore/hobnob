/**
 * hobnob/spec/cucumber/steps/index.js
 *
 * JS representation of Gherkin .feature steps
 * ( step definitions )
 *
 * run: $ yarn run test:e2e    # after starting API server
 *
 * depreciated usage:
 *
 *   $ cucumber-js spec/cucumber/features \
 *     --require-module @babel/register \
 *     --require spec/cucumber/steps
 *
 *   $ npx cucumber-js spec/cucumber/features \
 *     --require spec/cucumber/steps
 */

import superagent from 'superagent';
import { When, Then } from 'cucumber';
/** Node module for specifying expected and actual test results */
import assert from 'assert';


/** file scoped variables, accessible by each subsequent step */
// let request;
// let result;
// let error;
// let payload;
/**
 * refactored: account for different scenarios in this file
 * using the same definitions, but having different properties
 * for the same variables
 * ( isolating scenario contexts by using contxt objects )
 * ( Cucumber 'worlds' )
 */


/*----------  scenarios  ----------*/
/**
 * 1. Client sends `POST` to `/users` with empty payload
 *    API responds with `400 Bad Request` & JSON object with
 *    error message
 *
 * 2. Client sends `POST` to `/users` with non-JSON payload
 *    API responds with `415 Unsupported Media Type` & JSON
 *    object with error message
 *
 * 3. Client sends `POST` to `/users` with malformed JSON
 *    API responds with `400 Bad Request` & JSON object with
 *    error message
 */


/*----------  step definitions  ----------*/

/** Cucumber runs the appropriate definition due to pattern matching */


/** refactor: stay "DRY'er" */
// /**
//  * start building the request with a new request object...
//  */
// When('the client creates a POST request to /users', function () {
//   /** refactor: use context object instead of global var */
//   // request = superagent('POST', 'localhost:8080/users');
//   /** refactor: remove hardcoded vals, use .env */
//   // this.request = superagent('POST', 'localhost:8080/users');
//   this.request = superagent(
//     'POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`
//   );
// });
//
// When('attaches a generic empty payload', function () {
//   /** sending empty payloads is superagent's default behavior */
//   return undefined;
// });
//
// When('attaches a generic non-JSON payload', function () {
//   this.request.send(
//     '<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>'
//   );
//   this.request.set('Content-Type', 'text/xml');
// });
//
// When('attaches a generic malformed payload', function () {
//   this.request.send('{"email": "justin@jsore.com", name: }');
//   this.request.set('Content-Type', 'application/json');
// });
//
// /**
//  * ...complete and send request to testing API server with a
//  * callback specified to keep next step from running early...
//  */
// When('sends the request', function (callback) {
//   //request
//   this.request
//     .then((response) => {
//       /**
//        * ...and save the response elsewhere then finally hit
//        * callback() after response received and saved
//        */
//       this.response = response.res;
//       callback();
//     })
//     .catch((error) => {
//       this.response = error.response;
//       callback();
//     });
// });
//
// /**
//  * scenario 1: check method and path of req in requestHandler,
//  * if match POST & /users, send 400
//  */
// /** refactor: use regex to escape special characters */
// // Then('our API should respond with a 400 HTTP status code', function () {
// /** refactor: use parameters to keep DRY */
// // Then(/^our API should respond with a 400 HTTP status code$/, function () {
// Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
//   /** refactor: be more concise */
//   // if (this.response.statusCode !== 400) {
//   //   /** generic assertion failure */
//   //   // throw new Error();
//   //   /** verbose failure messages */
//   //   throw new AssertionError({
//   //     expected: 400,
//   //     actual: this.response.statusCode,
//   //   });
//   // }
//   /** throw AssertionError if paramters are not equal */
//   //assert.equal(this.response.statusCode, 400);
//   assert.equal(this.response.statusCode, statusCode);
// });
//
// //Then('our API should respond with a 415 HTTP status code', function () {
// Then(/^our API should respond with a 415 HTTP status code$/, function () {
//   assert.equal(this.response.statusCode, 415);
// });
//
// // Then('contains a message property which says \'The "Content-Type" header must always be "application/json"\'', function () {
// // fails: Gherkin uses /'s as "alternative text" feature, replace with regex
// Then(/^contains a message property which says 'The "Content-Type" header must always be "application\/json"'$/, function () {
//   assert.equal(this.responsePayload.message, 'The "Content-Type" header must always be "application/json"');
// });
//
// // Then('contains a message property which says "Payload should be in JSON format"', function () {
// Then(/^contains a message property which says "Payload should be in JSON format"$/, function () {
//   assert.equal(this.responsePayload.message, 'Payload should be in JSON format');
// });
//
// /**
//  * scenario 2: client must send valid JSON object
//  */
// // Then('the payload of the response should be a JSON object', function () {
// Then(/^the payload of the response should be a JSON object$/, function () {
//   const response = result || error;
//   /** review body and content-type header for JSON */
//   const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
//   if (!contentType || !contentType.includes('application/json')) {
//     /** generic assertion failure */
//     throw new Error('Response not of Content-Type application/json');
//   }
//   /** review validity of the JSON if JSON received */
//   try {
//     //payload = JSON.parse(response.text);
//     this.responsePayload = JSON.parse(this.response.text);
//   } catch (e) {
//     /** generic assertion failure */
//     throw new Error('Response not a valid JSON object');
//   }
// });
//
// /**
//  * scenario 3: error object must contain property of message
//  * with appropriate message text
//  */
// // Then('contains a message property which says "Payload should not be empty"', function () {
// Then(/^contains a message property which says "Payload should not be empty"$/, function () {
//   // if (payload.message !== 'Payload should not be empty') {
//   /** refactor: be more concise, use assert.equal */
//   // if (this.responsePayload.message !== 'Payload should not be empty') {
//   //   /** generic assertion failure */
//   //   throw new Error();
//   // }
//   assert.equal(this.responsePayload.message, 'Payload should not be empty');
// });


/**
 * this is probably a bad practice, but I'm sick of overly
 * long expressions...nobody is gonna see this so ¯\_(ツ)_/¯
 */
const host = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;
const whenHTTP = /^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/;
const caseXML = '<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>';
const firstThen = /^our API should respond with a ([1-5]\d{2}) HTTP status code$/;
const secondThen = /^the payload of the response should be a JSON object$/;
const thirdThen = /^contains a message property which says (?:"|')(.*)(?:"|')$/;

/** start a new request with a new request object */
When (whenHTTP, function(method, path) {
  this.request = superagent(method, `${host}:${port}${path}`);
});

/** case values pulled from scenario outline's datatable */
When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "justin@jsore.com", name: }')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send(`${caseXML}`)
        .set('Content-Type', 'text/html');
      break;
    /** superagent sends a blank payload by default, use it */
    case 'empty':
    default:
  }
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


Then(firstThen, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});


Then(secondThen, function () {
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


Then(thirdThen, function (message) {
  assert.equal(this.responsePayload.message, message);
});

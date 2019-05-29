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
// import { AssertionError } from 'assert';
/** refactor: let's access other assert features instead */
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


/*----------  step definitions  ----------*/


/** Cucumber runs the appropriate definition due to pattern matching */


/**
 * start building the request with a new request object...
 */
When('the client creates a POST request to /users', function () {
  /** refactor: use context object instead of global var */
  // request = superagent('POST', 'localhost:8080/users');
  /** refactor: remove hardcoded vals, use .env */
  // this.request = superagent('POST', 'localhost:8080/users');
  this.request = superagent(
    'POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`
  );
});

When('attaches a generic empty payload', function () {
  /** sending empty payloads is superagent's default behavior */
  return undefined;
});

/**
 * ...complete and send request to testing API server with a
 * callback specified to keep next step from running early...
 */
When('sends the request', function (callback) {
  //request
  this.request
    .then((response) => {
      /**
       * ...and save the response elsewhere then finally hit
       * callback() after response received and saved
       */
      this.response = response.res;
      callback();
    })
    .catch((error) => {
      this.response = error.response;
      callback();
    });
});



/**
 * to pass: check method and path of req in requestHandler,
 * if match POST & /users, send 400
 */
Then('our API should respond with a 400 HTTP status code', function () {
  /** refactor: be more concise */
  // if (this.response.statusCode !== 400) {
  //   /** generic assertion failure */
  //   // throw new Error();
  //   /** verbose failure messages */
  //   throw new AssertionError({
  //     expected: 400,
  //     actual: this.response.statusCode,
  //   });
  // }
  /** throw AssertionError if paramters are not equal */
  assert.equal(this.response.statusCode, 400);
});

/**
 * to pass: client must send valid JSON object
 */
Then('the payload of the response should be a JSON object', function () {
  const response = result || error;

  /** review body and content-type header for JSON */
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    /** generic assertion failure */
    throw new Error('Response not of Content-Type application/json');
  }

  /** review validity of the JSON if JSON received */
  try {
    //payload = JSON.parse(response.text);
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    /** generic assertion failure */
    throw new Error('Response not a valid JSON object');
  }
});

/**
 * to pass: error object must contain property of message
 * with appropriate message text
 */
Then('contains a message property which says "Payload should not be empty"', function () {
  // if (payload.message !== 'Payload should not be empty') {
  /** refactor: be more concise */
  // if (this.responsePayload.message !== 'Payload should not be empty') {
  //   /** generic assertion failure */
  //   throw new Error();
  // }
  assert.equal(this.responsePayload.message, 'Payload should not be empty');
});
/**
 * hobnob/spec/cucumber/steps/index.js
 *
 * JS representation of Gherkin .feature steps
 * ( step definitions )
 *
 * run: $ yarn run test:e2e
 *
 * depreciated usage:
 *
 *   $ npx cucumber-js spec/cucumber/features --require spec/cucumber/steps
 */

import superagent from 'superagent';
import { When, Then } from 'cucumber';
/** file scoped variables, accessible by each subsequent step */
let request;
let result;
let error;

/** Cucumber runs the appropriate definition due to pattern matching */

/** 1st step definition... */
When('the client creates a POST request to /users', function () {
  /** start a new request object */
  request = superagent('POST', 'localhost:8080/users');
});

/** ...2nd step definition... */
When('attaches a generic empty payload', function () {
  /** sending empty payloads is superagent's default behavior */
  return undefined;
});

/** ...3rd step definition... */
When('sends the request', function (callback) {
  /** specify a callback so the next step doesn't run prematurely */

  /** send request from 1st & 2nd steps to testing API server... */
  request
    .then((response) => {
      /** ...and save the response elsewhere... */
      result = response.res;
      /** ...then finally callback() after response received and saved */
      callback();
    })
    .catch((errResponse) => {
      error = errResponse.response;
      callback();
    });
});

/** ...4th step definition... */
Then('our API should respond with a 400 HTTP status code', function () {
  /**
   * passing: check method and path of req in requestHandler,
   * if match POST & /users, send 400
   */
  if (error.statusCode !== 400) {
    throw new Error();
  }
});

/** ...5th step definition... */
Then('the payload of the response should be a JSON object', function (callback) {
  callback(null, 'pending');
});

/** ...6th step definition */
Then('contains a message property which says "Payload should not be empty"', function (callback) {
  callback(null, 'pending');
});
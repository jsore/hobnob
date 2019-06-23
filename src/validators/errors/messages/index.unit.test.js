/**
 * hobnob/src/validators/errors/messages/index.unit.test.js
 *
 * unit test for error message generation function
 *
 * this is the first unit test written for this project
 */

import assert from 'assert';
import generateValidationErrorMessage from '.';


/**
 * describe: group of relevant test cases, just here to give
 * context to readers, has no influence on test outcome
 *
 * it: test case, holds the assertions, which should all
 * throw AssertionErrors on failure, otherwise Mocha
 * assumes the test passed
 */
describe('generateValidationErrorMessage', function () {

  /** if (error.keyword === 'required') { } */
  it('should return the correct string when error.keyword is "required"', function () {
    /** dummy errors array, mimics Ajv's errors array */
    const errors = [{
      keyword: 'required',
      dataPath: '.test.path',
      params: {
        missingProperty: 'property',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path.property' field is missing";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  /** if (error.keyword === 'type') { } */
  it('should return the correct string when error.keyword is "type"', function () {
    const errors = [{
      keyword: 'type',
      dataPath: '.test.path',
      params: {
        type: 'string',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be of type string";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  /** if (error.keyword === 'format') { } */
  it('should return the correct string when error.keyword is "format"', function () {
    const errors = [{
      keyword: 'format',
      dataPath: '.test.path',
      params: {
        format: 'email',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be a valid email";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  /** if (error.keyword === 'additionalProperties') { } */
  it('should return the correct string when error.keyword is "additionalProperties"', function () {
    const errors = [{
      keyword: 'additionalProperties',
      dataPath: '.test.path',
      params: {
        additionalProperty: 'email',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' object does not support the field 'email'";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});

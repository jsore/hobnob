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
 */
describe('generateValidationErrorMessage', function () {
  /**
   * it: test case, holds the assertions, which should all
   * throw AssertionErrors on failure, otherwise Mocha
   * assumes the test passed
   */
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
});

/**
 * src/tests/spies/res/index.js
 *
 * helper util for creating res spies for unit tests
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { spy } from 'sinon';

function generateResSpy() {
  return {
    status: spy(),
    set: spy(),
    json: spy(),
    send: spy(),
  };
}

export default generateResSpy;

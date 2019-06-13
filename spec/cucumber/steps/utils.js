/**
 * hobnob/spec/cucumber/steps/utils.js
 *
 * general testing support, generate test payloads
 */

/**
 * generate a valid Create User payload when called
 */
function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'e@ma.il',
        password: 'password',
      };
    default:
      return undefined;
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}

export {
  getValidPayload,
  convertStringToArray,
};

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
    case 'replace user profile':
      return {
        summary: 'foo'
      };
    case 'update user profile':
      return {
        name: {
          middle: 'd4nyll'
        }
      };
    // //// default:
    // ////   return undefined;
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}

function substitutePath (context, path) {
  /** split the path into parts */
  return path.split('/').map(part => {
    /**
     * if the path starts with a colon, value should be an ID
     * substitute it with the value of the context property
     * of the same name
     */
     if (part.startsWith(':')) {
      const contextPath = part.substr(1);
      return context[contextPath];
     }
     return part;
  }).join('/');
}

function processPath (context, path) {
  /** no substitution needed for paths not starting with ':' */
  if (!path.includes(':')) {
    return path;
  }
  return substitutePath(context, path);
}

export {
  getValidPayload,
  convertStringToArray,
  processPath,
};

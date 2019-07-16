/**
 * ../spec/cucumber/steps/utils.js
 *
 * general testing support, generate test payloads
 */

import objectPath from 'object-path';

/**
 * generate a valid Create User payload when called
 */
// //// function getValidPayload(type) {
//   const lowercaseType = type.toLowerCase();
//   switch (lowercaseType) {
//     case 'create user':
//       return {
//         email: 'e@ma.il',
//         password: 'password',
//       };
//     case 'replace user profile':
//       //// return {
//       ////   summary: 'foo'
//       //// };
//     case 'update user profile':
//       return {
//         name: {
//           middle: 'd4nyll'
//         }
//       };
//   }
// //// }

// refactor point 1: add context
function getValidPayload(type, context = {}) {

  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {

    case 'create user':
      return {
        email: 'e@ma.il',
        password: 'password',
      };
    case 'replace user profile':
      // refactor 2: add context
      return {
        summary: context.summary || 'foo',
      };
    case 'update user profile':
      return {
        // refactor 3: add context
        name: context.name || {
          middle: 'd4nyll',
        },
      };

    // refactor 4: uncomment default switch statement
    default:
      return undefined;
  }
}


// no refactoring here
function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}


function substitutePath (context, path) {
  /** split the path into parts */
  return path.split('/').map((part) => {
    /**
     * ID values start with :'s, if found then substitute
     * it with the value of the context property of the
     * same name
     */
    if (part.startsWith(':')) {
      const contextPath = part.substr(1);
      // refactor 5: use objectPath to resolve paths
      // return context[contextPath];
      return objectPath.get(context, contextPath);
    }
    return part;
  }).join('/');
}


// no refactoring here
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

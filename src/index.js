/**
 * hobnob/src/index.js
 *
 * entry point for server and API
 *
 * run: $ yarn run watch
 *
 * ported from old.index.js for refactoring
 */

import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';

import injectHandlerDependencies from './utils/inject-handler-dependencies';
import ValidationError from './validators/errors/validation-error';

// validators
import createUserValidator from './validators/users/create'; // create.js
import searchUserValidator from './validators/users/search';
import replaceProfileValidator from './validators/profile/replace';
import updateProfileValidator from './validators/profile/update';

// handlers
import createUserHandler from './handlers/users/create';
import retrieveUserHandler from './handlers/users/retrieve';
import searchUserHandler from './handlers/users/search';
import replaceProfileHandler from './handlers/profile/replace';
import updateProfileHandler from './handlers/profile/update';
import deleteUserHandler from './handlers/users/delete';

// engines
import createUserEngine from './engines/users/create';
import retrieveUserEngine from './engines/users/retrieve';
import searchUserEngine from './engines/users/search';
import replaceProfileEngine from './engines/profile/replace';
import updateProfileEngine from './engines/profile/update';
import deleteUserEngine from './engines/users/delete';


/** dependency injections handled by magic now aparently */


/**
 * maps of handler to <xyz> for relaying dependencies
 *
 * ES6 feature, a key-value store where a key or value can be
 * any type ( primitives, objs, arrays, funcs ) unlike in an
 * object literal where keys have to be strings or Symbols
 *
 *   Map([ [key, value] ]);
 */
const handlerToEngineMap = new Map([
  [createUserHandler, createUserEngine],
  [retrieveUserHandler, retrieveUserEngine],
  [searchUserHandler, searchUserEngine],
  [replaceProfileHandler, replaceProfileEngine],
  [updateProfileHandler, updateProfileEngine],
  [deleteUserHandler, deleteUserEngine],
]);

const handlerToValidatorMap = new Map([
  [createUserHandler, createUserValidator],
  [searchUserHandler, searchUserValidator],
  [replaceProfileHandler, replaceProfileValidator],
  [updateProfileHandler, updateProfileValidator],
]);


/** ...why is this necesary? */
// if (process.env.NODE_ENV === 'test') {
//   // test with $ yarn run test:env test:env.test
//   process.env.ES_INDEX = process.env.ES_INDEX_TEST;
//   process.env.SERVER_PORT = process.env.SERVER_PORT_TEST;
// } else {
//   process.env.ES_INDEX = process.env.ES_INDEX_DEV;
//   process.env.SERVER_PORT = process.env.SERVER_PORT_DEV;
// }


const client = new elasticsearch.Client({
  // host: `${process.env.ELASTICSEACH_HOSTNAME}:${process.env.ELASTICSEACH_PORT}`,
  host: `${process.env.ES_HOSTNAME}:${process.env.ES_PORT}`,
});


const app = express();


/**
 * payload body parsing and header validators
 *
 * bodyParser.json method returns middleware, use it to parse
 * JSON requests and assign parsed payload to req object body
 */
// app.use(middlewares.check...
app.use(bodyParser.json({ limit: 1e6 }));
app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

// And the payload object should be added to the database,
// grouped under the "user" type # spec/cucumber/steps/response.js:52
//     Error: Incorrect HTTP method for uri [/test/user/] and method [GET], allowed: [POST]

/** create a user */
app.post('/users', injectHandlerDependencies(
  createUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));
/**  search for user(s) */
app.get('/users/', injectHandlerDependencies(
  searchUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));
/** retrieve a user object */
app.get('/users/:userId', injectHandlerDependencies(
  retrieveUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));
/** replace an existing user profile */
app.put('/users/:userId/profile', injectHandlerDependencies(
  replaceProfileHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));
/** update an existing user profile */
app.patch('/users/:userId/profile', injectHandlerDependencies(
  updateProfileHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));
/** delete a user object */
app.delete('/users/:userId', injectHandlerDependencies(
  deleteUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError
));

app.use(errorHandler);

// app.listen(process.env.SERVER_PORT, () => {
const server = app.listen(process.env.SERVER_PORT, async () => {
  const indexParams = { index: process.env.ES_INDEX };
  const indexExists = await client.indices.exists(indexParams);
  if (!indexExists) {
    await client.indices.create(indexParams);
  }

  /** disable console.log linting errors for server init msg */
  // eslint-disable-next-line no-console
  console.log(
    'Hobnob API server running on port '
    + `${process.env.SERVER_PORT}.`
  );
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

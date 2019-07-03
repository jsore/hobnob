/**
 * hobnob/src/index.js
 *
 * entry point for server and API
 *
 * run: $ yarn run watch
 *
 * ported from old.index.js for refactoring
 */


// import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
// import elasticsearch from 'elasticsearch';

import * as middlewares from './middlewares';
import * as handlers from './handlers';
// import checkEmptyPayload from './middlewares/check-empty-payload';
// import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
// import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
// import errorHandler from './middlewares/error-handler';

/** dependency injections, handled by magic now aparently */
// import injectHandlerDependencies from './utils/inject-handler-dependencies';
// import ValidationError from './validators/errors/validation-error';
// import createUserHandler from './handlers/users/create';
// import createUserEngine from './engines/users/create';
// import createUserValidator from './validators/users/create'; // create.js


/**
 * globals from environment
 * should probably remove these and find a better way to
 * carry these values across the infrastructure...
 */
// //////// const esHost = process.env.ELASTICSEACH_HOSTNAME;
// //////// const esPort = process.env.ELASTICSEACH_PORT;
// const env = process.env; // ?????
if (process.env.NODE_ENV === 'test') {
  process.env.ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX_TEST;
}

// console.log( process.env.PATH );


/** init */


// //////// /** Elasticsearch client and Express init */
// //////// const client = new elasticsearch.Client({
// ////////   // host: `${esProtocol}://${esHost}:${esPort}`,
// ////////   host: `${esHost}:${esPort}`,
// //////// });
const app = express();

/**
 * payload body parsing and header validators
 *
 * bodyParser.json method returns middleware, use it to parse
 * JSON requests and assign parsed payload to req object body
 */
app.use(bodyParser.json({ limit: 1e6 }));
app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

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
]);
const handlerToValidatorMap = new Map([
  [createUserHandler, createUserValidator],
]);

/** refactor: modularization, move to app.use(middleware) */
// app.post('/users', (req, res) => {
//   /** handle empty payloads from client */
//   // ...
//     res.json({ message: 'Payload should not be empty', });
//   // ...
//   /** handle non-json payloads */
//   // ...
//     res.json({ message: 'The "Content-Type" header must always be "application/json"', });
//   // ...
// });
/** refactor: move request handlers to middlewares */
// app.post('/users', createUser);
app.post('/users', injectHandlerDependencies(
  createUserHandler,
  client,
  handlerToEngineMap,
  handlerToValidatorMap,
  ValidationError
));

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  /** disable console.log linting errors for server init msg */
  // eslint-disable-next-line no-console
  console.log(
    'Hobnob API server running on port '
    + `${process.env.SERVER_PORT}.`
  );
});

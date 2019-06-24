/**
 * hobnob/src/index.js
 *
 * entry point for server and API
 *
 * run: $ yarn run watch     # add nodemon for auto restarts
 *
 * depreciated usage:
 *
 *   $ rm -rf dist/ && npx babel src -d dist   # build
 *   $ node dist/index.js                      # run it
 *
 *   $ yarn run build       # build
 *   $ node dist/index.js   # run it
 *
 *   $ yarn run serve       # build then run it
 */


/** Babel handles transpiling ESNext features */


/** CommonJS syntax */
// const http = require('http');

/** ECMA2015/ES6 */
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

/** custom middleware modules */
import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';
// import createUser from './handlers/users/create';

/** dependency injection */
import injectHandlerDependencies from './utils/inject-handler-dependencies';
/** ./handlers/.../index.createUser() dependency */
/** ./engines/.../index.create() dependency */
import ValidationError from './validators/errors/validation-error';
/** users/createUser() handler for app.post() */
import createUserHandler from './handlers/users/create';
/** users/create() engine for handler.createUesr() */
import createUserEngine from './engines/users/create';
/** ./handlers/.../index.createUser() dependency, sent to engine via create() */
import createUserValidator from './validators/users/create'; // create.js


/** globals from environment, probably needs to be removed */
const esHost = process.env.ELASTICSEACH_HOSTNAME;
const esPort = process.env.ELASTICSEACH_PORT;


/** Elasticsearch client and Express init */
const client = new elasticsearch.Client({
  // host: `${esProtocol}://${esHost}:${esPort}`,
  host: `${esHost}:${esPort}`,
});
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
 * maps of handler functions to engine functions
 *
 * ES6 feature, a key-value store where a key or value can be
 * any type ( primitives, objs, arrays, funcs ) unlike in an
 * object literal where keys have to be strings or Symbols
 *
 *   Map([
 *     [key, value]
 *   ])
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
/** using an existing ES client, pass it to a req handler */
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

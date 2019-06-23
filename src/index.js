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
import createUser from './handlers/users/create';
import injectHandlerDependencies from './utils/inject-handler-dependencies';
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
app.post('/users', injectHandlerDependencies(createUser, client));


app.use(errorHandler);


app.listen(process.env.SERVER_PORT, () => {
  /** disable console.log linting errors for server init msg */
  // eslint-disable-next-line no-console
  console.log(
    'Hobnob API server running on port '
    + `${process.env.SERVER_PORT}.`
  );
});

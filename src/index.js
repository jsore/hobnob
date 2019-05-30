/**
 * hobnob/src/index.js
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


// const server = http.createServer(requestHandler);
const app = express();


/**
 * bodyParser.json method returns middleware, use it to parse
 * requests with JSON bodies with a set max size limit, the
 * parsed payload is assigned to body property of req object
 */
app.use(bodyParser.json({ limit: 1e6 }));


app.post('/users', (req, res) => {
  /** handle empty payloads from client */
  if (req.headers['content-length'] === '0') {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'Payload should not be empty',
    });
    return;
  }
  /** handle non-json payloads */
  if (req.headers['content-type'] !== 'application/json') {
    res.status(415);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'The "Content-Type" header must always be "application/json"',
    });
  }
});


/**
 * otherwise, POST was a JSON payload that got malformed, so
 * use an error handler middleware to check for error this
 * scenario ends up causing ( due to artifact of the .json()
 * method of bodyParser middleware )
 *
 */
app.use((err, req, res, next) => {
  /** every day i stray further from the light */
  if (
    err instanceof SyntaxError
    && err.status === 400
    && 'body' in err
    && err.type === 'entity.parse.failed'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Payload should be in JSON format' });
    return;
  }
  next();
});


/** refactor: improve request handler definitions for each route */
// const requestHandler = function (req, res) {
//   /** block clients from sending POST's to /users endpoint */
//   // if (req.method === 'POST' && req.url === '/users') {
//   //   /** refactor: send back a valid JSON object in payload */
//   //   // res.statusCode = 400;
//   //   // res.end();
//   //   res.writeHead(400, { 'Content-Type': 'application/json' });
//   //   /** this is the error object */
//   //   res.end(JSON.stringify({
//   //     message: 'Payload should not be empty',
//   //   }));
//   //   return;
//   // }
//   if (req.method === 'POST' && req.url === '/users') {
//     const payloadData = [];
//     /**
//      * bodies can be big, use req's ReadleStream interface to
//      * grab each data chunk as it arrives
//      */
//     req.on('data', (data) => {
//       payloadData.push(data);
//     });
//
//     /** wait until req's data stream is done ( 'end' event ) */
//     req.on('end', () => {
//       /** handle a client's Empty Payload */
//       if (payloadData.length === 0) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         /** send JSON object back to client */
//         res.end(JSON.stringify({
//           message: 'Payload should not be empty',
//         }));
//         return;
//       }
//       /** handle payloads using Unsupported Media Type */
//       if (req.headers['content-type'] !== 'application/json') {
//         res.writeHead(415, { 'Content-Type': 'application/json' });
//         /** send JSON object back to client */
//         res.end(JSON.stringify({
//           message: 'The "Content-Type" header must always be "application/json"',
//         }));
//         return;
//       }
//       /** try to parse the req, looking for malformed JSON */
//       try {
//         /**
//          * Buffer is the param passed into event listener for
//          * data events, representing a chunk of raw data
//          */
//         const bodyString = Buffer.concat(payloadData).toString();
//         /** each chunk should be JSON, this fails if its not */
//         JSON.parse(bodyString);
//       } catch (e) {
//         /** catch any JSON.parse SyntaxError's ( malformed JSON ) */
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         /** send JSON object back to client */
//         res.end(JSON.stringify({
//           message: 'Payload should be in JSON format',
//         }));
//       }
//     });
//   } else {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     /** finish prepping response and send to client */
//     res.end('I know a UDP joke, but you might not get it.');
//   }
// };


// server.listen(8080);
app.listen(process.env.SERVER_PORT, () => {
  /** disable console.log linting errors for server init msg */
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server running on port ${process.env.SERVER_PORT}...`);
});

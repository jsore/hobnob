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
import http from 'http';

const requestHandler = function (req, res) {
  /** block clients from sending POST's to /users endpoint */
  // if (req.method === 'POST' && req.url === '/users') {
  //   /** refactor: send back a valid JSON object in payload */
  //   // res.statusCode = 400;
  //   // res.end();
  //   res.writeHead(400, { 'Content-Type': 'application/json' });
  //   /** this is the error object */
  //   res.end(JSON.stringify({
  //     message: 'Payload should not be empty',
  //   }));
  //   return;
  // }
  if (req.method === 'POST' && req.url === '/users') {
    const payloadData = [];
    /**
     * bodies can be big, use req's ReadleStream interface to
     * grab each data chunk as it arrives
     */
    req.on('data', (data) => {
      payloadData.push(data);
    });

    /** wait until req's data stream is done ( 'end' event ) */
    req.on('end', () => {
      /** handle a client's Empty Payload */
      if (payloadData.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        /** send JSON object back to client */
        res.end(JSON.stringify({
          message: 'Payload should not be empty',
        }));
        return;
      }
      /** handle payloads using Unsupported Media Type */
      if (req.headers['content-type'] !== 'application/json') {
        res.writeHead(415, { 'Content-Type': 'application/json' });
        /** send JSON object back to client */
        res.end(JSON.stringify({
          message: 'The "Content-Type" header must always be "application/json"',
        }));
        return;
      }
      /** try to parse the req, looking for malformed JSON */
      try {
        /**
         * Buffer is the param passed into event listener for
         * data events, representing a chunk of raw data
         */
        const bodyString = Buffer.concat(payloadData).toString();
        /** each chunk should be JSON, this fails if its not */
        JSON.parse(bodyString);
      } catch (e) {
        /** catch any JSON.parse SyntaxError's ( malformed JSON ) */
        res.writeHead(400, { 'Content-Type': 'application/json' });
        /** send JSON object back to client */
        res.end(JSON.stringify({
          message: 'Payload should be in JSON format',
        }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    /** finsih prepping response and send to client */
    res.end('I know a UDP joke, but you might not get it.');
  }
};

const server = http.createServer(requestHandler);
server.listen(8080);

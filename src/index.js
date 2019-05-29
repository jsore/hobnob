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
  if (req.method === 'POST' && req.url === '/users') {
    /** refactor: send back a valid JSON object in payload */
    // res.statusCode = 400;
    // res.end();
    res.writeHead(400, { 'Content-Type': 'application/json' });

    /** this is the error object */
    res.end(JSON.stringify({
      message: 'Payload should not be empty',
    }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  /** finsih prepping response and send to client */
  res.end('I know a UDP joke, but you might not get it.');
};

const server = http.createServer(requestHandler);
server.listen(8080);

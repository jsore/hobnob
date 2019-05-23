"use strict";

require("@babel/polyfill");

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * hobnob/src/index.js
 *
 * run: $ yarn run watch     # add nodemon for auto restarts
 *
 * depreciated:
 *
 *   $ rm -rf dist/ && npx babel src -d dist   # build
 *   $ node dist/index.js                      # run it
 *
 *   $ yarn run build       # build
 *   $ node dist/index.js   # run it
 *
 *   $ yarn run serve       # build then run it
 *
 */

/** bring in ESNext features */
//const http = require('http');   // CommonJS syntax
// ECMA2015/ES6
const requestHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  /** finsih prepping response and send to client */

  res.end('Yo yo yo');
};

const server = _http.default.createServer(requestHandler);

server.listen(8080);
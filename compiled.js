"use strict";

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const http = require('http');   // CommonJS syntax
// ES6 syntax
const requestHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  /** finsih prepping response and send to client */

  res.end('Yo');
};

const server = _http.default.createServer(requestHandler);

server.listen(8080);

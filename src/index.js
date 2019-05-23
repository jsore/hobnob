/**
 * hobnob/src/index.js
 */

//const http = require('http');   // CommonJS syntax
import http from 'http';        // ES6 syntax
const requestHandler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  /** finsih prepping response and send to client */
  res.end('Yo');
}
const server = http.createServer(requestHandler);
server.listen(8080);
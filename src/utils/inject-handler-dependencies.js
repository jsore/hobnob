/**
 * hobnob/src/utils/inject-handler-dependencies.js
 *
 * using an existing ES client, pass it to a request handler
 *
 * take a request handler function and the Elasticsearch
 * client ( new elasticsearch.Client({ ... }) ) and return
 * a new function that calls the request handler but passes
 * the client as a parameter
 *
 * keeps from creating a new ES client for every request
 */

/**
 * high order function, operates on or returns other funcs
 */
function injectHandlerDependencies(handler, db) {
  return (req, res) => { handler(req, res, db); };
}

export default injectHandlerDependencies;

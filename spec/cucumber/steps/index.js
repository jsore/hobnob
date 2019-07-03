/**
 * hobnob/spec/cucumber/steps/index.js
 *
 * e2e tests for create user feature
 *
 * Step definitions for Feature tests in .feature files.
 *
 * Cucumber runs the appropriate definition by matching the
 * string patterns from a Feature's Scenario' or 'Scenario
 * Outline' Steps.
 *
 * Path to find the Feature specifications ( "root" ):
 *
 *   hobnob/spec/cucumber/features/<feature>/<sub-feature>
 */
import assert from 'assert';
/** read/write JSON files - Node only, no browser support */
import jsonfile from 'jsonfile';
import superagent from 'superagent';
import { Given, When, Then } from 'cucumber';
import elasticsearch from 'elasticsearch';
/** access deep properties of objects and arrays */
import objectPath from 'object-path';
import { processPath, getValidPayload, convertStringToArray } from './utils';


const host = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT; // should pick up test port 8888
// const testPort = process.env.SERVER_PORT_TEST;
// const esProtocol = process.env.ELASTICSEACH_PROTOCOL;
const esHost = process.env.ELASTICSEACH_HOSTNAME;
const esPort = process.env.ELASTICSEACH_PORT;
const esIndex = process.env.ELASTICSEARCH_INDEX;
// const testEsIndex = process.env.ELASTICSEARCH_INDEX_TEST;


/** give ES instance a custom host option */
const client = new elasticsearch.Client({
  // host: `${esProtocol}://${esHost}:${esPort}`,
  host: `${esHost}:${esPort}`,
});


/** tests should always conclude with deletion of test users */
Given(/^all documents of type (?:"|')([\w-]+)(?:"|') are deleted$/,
function (type) {

  return client.deleteByQuery({
    index: esIndex,
    type: type,
    body: {
      "query": {
        "match_all": {}
      }
    },
    conflicts: "proceed",
    refresh: true,
  });
});


// $
// Given(/^(\d+|all) documents in the (?:"|')([\w-]+)(?:"|') sample are added to the index with type (?:"|')([\w-]+)(?:"|')$/,
// ?
Given(/^(\d+|all) documents in the (?:"|')([\w-]+)(?:"|') sample are added to the index with type (?:"|')([\w-]+)(?:"|')?/,
function (count, sourceFile, type) {

  if (count < 1) {
    return;
  }
  if (count === "all") {
    count = Infinity;
  }

  /**
   * get the data, note: method is alternative to 'require()'
   */
  const source = jsonfile.readFileSync(
    `${__dirname}/../sample-data/${sourceFile}.json`
  );

  /**
   * map data to an array of objects as expected by ES's API
   */
  const action = {
    index: {
      _index: esIndex,
      _type: type,
    }
  };
  const operations = [];
  for (let i = 0, len = source.length; i < len && i < count; i++) {
    operations.push(action);
    operations.push(source[i]);
  }

  /**
   * do a bulk index, refreshing the index to ensure its
   * immediately searchable in subsequent steps
   */
  return client.bulk({
    body: operations,
    refresh: 'true'
  });
});


/** start a new request with a new request object */
When (/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([\/\w-:]+)$/,
function(method, path) {

  // TODO: Failing Tests
  // console.log(`| superagent(method, http://host:portpath) -> ${method}, http://${host}:${port}${path} | ES client.host -> ${esHost}:${esPort} |`);
  const processedPath = processPath(this, path);
  // //// this.request = superagent(method, `http://${host}:${port}${path}`);
  this.request = superagent(method, `http://${host}:${port}${processedPath}`);
});


When(/^attaches (.+) as the payload$/,
function (payload) {

  this.requestPayload = JSON.parse(payload);
  this.request
    .send(payload)
    .set('Content-Type', 'application/json');
  return;
});


When(/^attaches a generic (.+) payload$/,
function (payloadType) {

  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "justin@jsore.com", name: }')
        .set('Content-Type', 'application/json');
      return;
    case 'non-JSON':
      this.request
        .send('<?xml version="1.0" encoding="UTF-8" ?><email>justin@jsore.com</email>')
        .set('Content-Type', 'text/xml');
      return;
    /** superagent sends a blank payload by default, use it */
    case 'empty':
    default:
      return;
  }
});


When(/^attaches a valid (.+) payload$/,
function (payloadType) {

  this.requestPayload = getValidPayload(payloadType);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
  return;
});


When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/,
function (payloadType, missingFields) {

  /** attach dummy user payload with a field missing */
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToDelete = convertStringToArray(missingFields);
  fieldsToDelete.forEach(field => delete this.requestPayload[field]);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
  return;
});


When(/^attaches an? (.+) payload which has the additional ([a-zA-Z0-9, ]+) fields?$/,
function (payloadType, additionalFields) {

  this.requestPayload = getValidPayload(payloadType);
  const fieldsToAdd = convertStringToArray(additionalFields);
  fieldsToAdd.forEach(field => objectPath.set(this.requestPayload, field, 'foo'));
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
  return;
});


// When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? ...
Given(/^attaches an? (.+) payload where the ([a-zA-Z0-9\., ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/,
function (payloadType, fields, invert, type) {

  this.requestPayload = getValidPayload(payloadType);

  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    object: {
      is: {},
      not: 'string'
    },
    string: {
      is: 'string',
      not: 10,
    },
  };
  const fieldsToModify = convertStringToArray(fields);

  fieldsToModify.forEach((field) => {
    // payload[field] = sampleValues[typeKey][invertKey];
    // this.requestPayload[field] = sampleValues[typeKey][invertKey];
    objectPath.set(
      this.requestPayload,
      field,
      sampleValues[typeKey][invertKey]
    );
  });
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
  return;
});


// When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/,
Given(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/,
function (payloadType, fields, value) {

  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(fields);
  fieldsToModify.forEach((field) => {
    this.requestPayload[field] = value;
  });
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
  return;
});


When(/^without a (?:"|')([\w-]+)(?:"|') header set$/,
function (headerName) {

  this.request.unset(headerName);
});


When(/^sends the request$/,
function(callback) {

  /** wait until response received... */
  this.request
    .then((response) => {
      /** ...then store it */
      this.response = response.res;
      callback();
    })
    .catch((error) => {
      this.response = error.response;
      callback();
    });
});


When(/^saves the response text in the context under ([\w.]+)$/,
function (contextPath) {
  objectPath.set(
    this,
    contextPath,
    this.response.text
  );
});


Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/,
function (statusCode) {

  // TODO: Failing Tests
  // console.log(this.response);
  // console.log(this.response.statusCode);
  assert.equal(this.response.statusCode, statusCode);
});


Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/,
function (payloadType) {

  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (payloadType === "JSON object"
    || payloadType === "array"
  ) {
    /** check content-type header */
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of Content-Type application/json');
    }
    /** check for valid JSON */
    try {
      this.responsePayload = JSON.parse(this.response.text);
    } catch (e) {
      throw new Error('Response not a valid JSON object');
    }
  } else if (payloadType === 'string') {
    /** verify header */
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of Content-Type text/plain');
    }
    /** make sure it's a string */
    this.responsePayload = this.response.text;
    if (typeof this.responsePayload !== 'string') {
      throw new Error('Response not a string');
    }
  }
});


Then(/^the response should contain (\d+) items$/,
function (count) {

  assert.equal(this.responsePayload.length, count);
});


Then(/^the ([\w.]+) property of the response should be an? ([\w.]+) with the value (.+)$/,
function (responseProperty, expectedResponseType, expectedResponse) {

  if (responseProperty === 'root') {
    responseProperty = '';
  }
  const parsedExpectedResponse = (function () {
    switch (expectedResponseType) {
      case 'object':
        return JSON.parse(expectedResponse);
      case 'string':
        return expectedResponse.replace(/^(?:["'])(.*)(?:["'])$/, '$1');
      default:
        return expectedResponse;
    }
  })();
  assert.deepEqual(
    objectPath.get(this.responsePayload, responseProperty),
    parsedExpectedResponse
  );
});


Then(/^the ([\w.]+) property of the response should be the same as context\.([\w.]+)$/,
function (responseProperty, contextProperty) {

  if (responseProperty === 'root') {
    responseProperty = '';
  }
  assert.deepEqual(
    objectPath.get(this.responsePayload, responseProperty),
    objectPath.get(this, contextProperty)
  );
});


Then(/^the ([\w.]+) property of the response should be the same as context\.([\w.]+) but without the ([\w.]+) fields$/,
function (responseProperty, contextProperty, missingFields) {

  if (responseProperty === 'root') {
    responseProperty = '';
  }
  const contextObject = objectPath.get(this, contextProperty);
  const fieldsToDelete = convertStringToArray(missingFields);
  fieldsToDelete.forEach(field => delete contextObject[field]);
  assert.deepEqual(objectPath.get(
    this.responsePayload, responseProperty),
    contextObject
  );
});


Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/,
function (message) {

  assert.equal(this.responsePayload.message, message);
});


/**
 * string the Create User payload returns, which gets stored
 * in this.responsePayload, should be the ID, if we can find
 * that user document then it was stored successfully
 */
Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/,
function (type, callback) {

  /** persist user type ( mock for tests VS real users ) */
  this.type = type;
  /**
   * find a document by ID, get a JSON doc from the index,
   * the user document is stored in _source key
   */
  client.get({
    // index: 'hobnob',
    index: esIndex,
    type: type,
    id: this.responsePayload,
    // ignore: 404,
  }).then((result) => {
    /** confirm _source doc and request are the same */
    assert.deepEqual(result._source, this.requestPayload);
    callback();
  }).catch(callback);
});


// Then('the newly-created user should be deleted',
Then(/^the entity of type (\w+), with ID stored under ([\w\.]+), should be deleted$/,
// function (callback) {
function (type, idPath, callback) {

  /** delete mock users by ID */
  client.delete({
    index: esIndex,
    // type: this.type,
    type: type,
    // id: this.responsePayload,
    id: objectPath.get(this, idPath),
    // ignore: 404,
  }).then(function (res) {
    /** on delete success result property = 'deleted' */
    assert.equal(res.result, 'deleted');
    callback();
  }).catch(callback);
});


Then(/^the first item of the response should have property ([\w\.]+) set to (.+)$/,
function (path, value) {

  assert.equal(
    objectPath.get(this.responsePayload[0], path),
    value
  );
});

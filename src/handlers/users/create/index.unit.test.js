/**
 * src/handlers/users/create/index.unit.test.js
 */

//  //// import { stub } from 'sinon';
//  //// import ValidationError from '../../../validators/errors/validation-error';
//  //// import createUser from '.';

/**
 * stubbing the create() function
 *
 * createStubs.success()
 * -> req object to be passed into createUser is valid
 *
 * createStubs.validationError()
 * -> req object causes createUser to reject with ValidationError
 *
 * createStubs.otherError()
 * -> createUser rejects due to codebase, not the request
 */
// const createStubs = {
//   success: stub().resolves({ _id: 'foo' }),
//   validationError: stub().rejects(new ValidationError()),
//   otherError: stub().rejects(new Error()),
// }

//  //// const generateCreateStubs = {
//  ////   success: () => stub().resolves({ _id: 'foo' }),
//  //// };
//  ////
//  //// describe('create', function () {
//  ////   describe('When called with valid request object', function (done) {
//  ////     // ...
//  ////
//  ////     // createUser(req, res, db, generateCreateStubs.success(), ValidationError)
//  ////     //   .then((result) => {
//  ////     //     // Assertions go here
//  ////     //   });
//  ////     beforeEach(function () {
//  ////       create = generateCreateStubs.success();
//  ////       return createUser(req, res, db, create, ValidationError);
//  ////     });
//  ////
//  ////   });
//  //// });

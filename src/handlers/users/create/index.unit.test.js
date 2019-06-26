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
//  ////  const createStubs = {
//  ////    success: stub().resolves({ _id: 'foo' }),
//  ////    validationError: stub().rejects(new ValidationError()),
//  ////    otherError: stub().rejects(new Error()),
//  ////  }
//  ////
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

import assert from 'assert';
// import { stub, match, spy } from 'sinon';
// import { stub, spy } from 'sinon';
import { stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import generateResSpy from '../../../tests/spies/res';
// import generateCreateUserStubs,
//   { VALIDATION_ERROR_MESSAGE as CREATE_USER_VALIDATION_ERROR_MESSAGE }
// from '../../../tests/stubs/engines/users/create';
import createUser from '.';

/** import'ed? */
const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';
const GENERIC_ERROR_MESSAGE = 'Internal Server Error';

/**
 * mimic'ing the engine/users/create function
 *
 * example:
 *
 *   generateCreateStubs.success() -> engine returns res Obj
 *   on a successfull operation, handler expects an ID to be
 *   available @ result._id
 */
const generateCreateStubs = {
  success: () => stub().resolves({ _id: 'foo' }),
  // genericError: () => stub().rejects(new Error()),
  genericError: () => stub().rejects(new Error(GENERIC_ERROR_MESSAGE)),
  validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
};

// describe('createUser', function () {
describe('User Create Handler', function () {

  let req;
  let res;
  let db;
  let validator; // validator just returns true
  let create;


  // describe('When called with valid request object', function (done) {
  describe('When called with valid request object', function () {

    beforeEach(function () {
      req = {};
      res = generateResSpy();
      db = {};
      create = generateCreateStubs.success();
      return createUser(req, res, db, create, validator, ValidationError);
    });

    describe('should set res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 201', function () {
        assert(res.status.calledWithExactly(201));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });
      it('with a text/plain content-type header', function () {
        assert(res.set.calledWithExactly('Content-Type', 'text/plain'));
      });
    });

    describe('should call res.send()', function () {
      it('once', function () {
        assert(res.send.calledOnce);
      });
      it('with the string resolved', function () {
        assert(res.send.calledWithExactly('foo'));
      });
    });
  });


  /** createUser called with invalid request object */
  describe('When create rejects with an instance of ValidationError', function () {
    beforeEach(function () {
      create = generateCreateStubs.validationError();
      res = generateResSpy();
      return createUser(req, res, db, create, validator, ValidationError);
    });

    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 400', function () {
        assert(res.status.calledWithExactly(400));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });
      it('with the arguments "Content-Type" and "application/json"', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });
      it('with a generic error object', function () {
        assert(res.json.calledWithExactly({ message: VALIDATION_ERROR_MESSAGE }));
      });
    });
  });


  /** createUser throws an unexpected ( server/code ) error */
  describe('When create rejects with an instance of Error', function () {
    beforeEach(function () {
      create = generateCreateStubs.genericError();
      res = generateResSpy();
      return createUser(req, res, db, create, validator, ValidationError);
    });

    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 500', function () {
        assert(res.status.calledWithExactly(500));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });
      it('with the arguments "Content-Type" and "application/json"', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });
      it('with a generic error object', function () {
        assert(res.json.calledWithExactly({ message: GENERIC_ERROR_MESSAGE }));
      });
    });


  });
});

/**
 * hobnob/src/middlewares/check-empty-payload/index.unit.test.js
 */

/**
 * bring in some lodash methods for deep object cloning and
 * deep object comparison
 *
 *   $ yarn add lodash.isequal lodash.clonedeep --dev
 */
import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy, stub } from 'sinon';
// import checkEmptyPayload from '.';
// import checkEmptyPayload from './index.js';
import checkEmptyPayload from './index';


describe('checkEmptyPayload', function () {
  let req;
  let res;
  let next;

  /**
   * POST, PATCH, PUT requests should always carry a
   * non-empty payload, if request is a GET res shouldn't be
   * modified and next() should be invoked once
   */
  describe('When req.method is not one of POST, PATCH or PUT', function () {

    /** check res before and after checkEmptyPayload call */
    let clonedRes;
    /** Mocha-injected func, runs before each it() block */
    beforeEach(function () {
      req = { method: 'GET' };
      res = {};
      /** assign next() a new spy for func call recording */
      next = spy();
      clonedRes = deepClone(res);
      /** then invoke prior to assertion testing */
      checkEmptyPayload(req, res, next);
    });
    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });
    it('should call next() once', function () {
      /** check calledOnce property on spy for truthfullness */
      assert(next.calledOnce);
    });
  });

  /**
   * or if req.method is one of POST, PATCH or PUT
   */
  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method}`, function () {

      /** if it's not empty it should do nothing but next() */
      describe('and the content-length header is not "0"', function () {
        let clonedRes;
        beforeEach(function () {
          req = {
            method,
            headers: {
              'content-length': '1',
            },
          };
          res = {};
          next = spy();
          clonedRes = deepClone(res);
          checkEmptyPayload(req, res, next);
        });
        it('should not modify res', function () {
          assert(deepEqual(res, clonedRes));
        });
        it('should call next()', function () {
          assert(next.calledOnce);
        });
      });

      /** if empty it should fail with res methods called */
      describe('and the content-length header is "0"', function () {
        /** what res.json stub returns */
        let resJsonReturnValue;
        /** holder for checkEmptyPayload return data */
        let returnedValue;

        beforeEach(function () {
          req = {
            method,
            headers: {
              'content-length': '0',
            },
          };
          resJsonReturnValue = {};
          res = {
            status: spy(),
            set: spy(),
            /**
             * refactor: use res.json as stub to return a
             * reference to an object
             */
            // json: spy(),
            json: stub().returns(resJsonReturnValue),
          };
          next = spy();
          // checkEmptyPayload(req, res, next);
          returnedValue = checkEmptyPayload(req, res, next);
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
          it('with the correct error object', function () {
            assert(res.json.calledWithExactly({ message: 'Payload should not be empty' }));
          });
          // it('should return whatever res.json() returns', function () {
          //   assert.strictEqual(returnedValue, resJsonReturnValue);
          // });
        });

        it('should not call next()', function () {
          assert(next.notCalled);
        });

        it('should return whatever res.json() returns', function () {
          assert.strictEqual(returnedValue, resJsonReturnValue);
        });

      });
    });
  });
});

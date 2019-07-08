/* eslint-disable import/no-extraneous-dependencies */
/**
 * hobnob/src/middlewares/check-content-type-is-set/index.unit.test.js
 */

import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy } from 'sinon';
import checkContentTypeIsSet from './index';

describe('checkContentTypeIsSet', function () {

  describe('When req.method is not one of POST, PATCH or PUT', function () {
    const req = { method: 'GET' };
    const res = {};
    const next = spy();
    const clonedRes = deepClone(res);
    checkContentTypeIsSet(req, res, next);

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });
    it('should call next()', function () {
      assert(next.calledOnce);
    });

  });


  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method} but the content-length header is 0`, function () {
      const req = {
        method,
        headers: {
          'content-length': '0',
        },
      };
      const res = {};
      const next = spy();
      const clonedRes = deepClone(res);
      checkContentTypeIsSet(req, res, next);

      it('should not modify res', function () {
        assert(deepEqual(res, clonedRes));
      });
      it('should call next()', function () {
        assert(next.calledOnce);
      });

    });
  });


  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method} but request has no content-type header set`, function () {
      const req = {
        method,
        headers: {
          'content-length': '1',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      checkContentTypeIsSet(req, res, next);

      it('should set res with a 400 status code', function () {
        assert(res.status.calledOnce);
        assert(res.status.calledWithExactly(400));
      });
      it('should set res with an application/json content-type header', function () {
        assert(res.set.calledOnce);
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
      it('should set res.json with error code', function () {
        assert(res.json.calledOnce);
        assert(res.json.calledWithExactly(
          { message: 'The "Content-Type" header must be set for requests with a non-empty payload' }
        ));
      });

    });
  });


  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method} and the content-type header is set`, function () {
      const req = {
        method,
        headers: {
          'content-length': '1',
          /** don't care what content is, just that it exists */
          // 'content-type': 'application/json',
          'content-type': ' ',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      const clonedRes = deepClone(res);
      checkContentTypeIsSet(req, res, next);

      it('should not modify res', function () {
        assert(deepEqual(res, clonedRes));
      });
      it('should call next()', function () {
        assert(next.calledOnce);
      });
    });
  });
});

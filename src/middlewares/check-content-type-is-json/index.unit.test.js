/**
 * src/middlewares/check-content-type-is-json/index.unit.test.js
 */

import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy } from 'sinon';
import checkContentTypeIsJson from './index';

describe('checkContentTypeIsJson', function () {

  describe('When req.method is not one of POST, PATCH or PUT', function () {
    const req = { method: 'GET' };
    const res = {};
    const next = spy();
    const clonedRes = deepClone(res);
    checkContentTypeIsJson(req, res, next);

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });
    it('should call next()', function () {
      assert(next.calledOnce);
    });

  });


  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method} but the content-type header is not application/json`, function () {
      const req = {
        method,
        headers: {
          'content-length': '1',
          'content-type': 'application/xml',
          // 'content-type': 'application/json',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      checkContentTypeIsJson(req, res, next);

      it('should set res with a 415 status code', function () {
        assert(res.status.calledOnce);
        assert(res.status.calledWithExactly(415));
      });
      it('should set res with an application/json content-type header', function () {
        assert(res.set.calledOnce);
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
      it('should set res.json with error code', function () {
        assert(res.json.calledOnce);
        assert(res.json.calledWithExactly({ message: 'The "Content-Type" header must always be "application/json"' }));
      });
    });
  });


  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method} and the content-type header is application/json`, function () {
    // describe(`When req.method is ${method} and the content-type header is set`, function () {
      const req = {
        method,
        headers: {
          'content-length': '1',
          'content-type': 'application/json',
          // 'content-type': ' ',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      const clonedRes = deepClone(res);
      checkContentTypeIsJson(req, res, next);

      it('should not modify res', function () {
        assert(deepEqual(res, clonedRes));
      });
      it('should call next()', function () {
        assert(next.calledOnce);
      });
    });
  });
});

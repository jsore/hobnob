/* eslint-disable import/no-extraneous-dependencies */
/**
 * src/tests/stubs/engines/users/retrieve/index.js
 */

import { stub } from 'sinon';
import NotFoundError from '../../../elasticsearch/errors/not-found';

const RETRIEVE_USER_RESPONSE_OBJECT = {
  email: 'e@ma.il',
};
const GENERIC_ERROR_MESSAGE = 'Internal Server Error';
const generate = () => ({
  success: stub().resolves(RETRIEVE_USER_RESPONSE_OBJECT),
  notFoundError: stub().rejects(new NotFoundError()),
  genericError: stub().rejects(new Error(GENERIC_ERROR_MESSAGE)),
});

export {
  generate as default,
  RETRIEVE_USER_RESPONSE_OBJECT,
  GENERIC_ERROR_MESSAGE,
};

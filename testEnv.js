/**
 * got tired of worrying about my env variables
 *
 *   "test:env": "dotenv -e envs/.env node testEnv.js",
 *   "test:env.test": "dotenv -e envs/test.env -e envs/.env node testEnv.js",
 */

console.log(`NODE_ENV:    ${process.env.NODE_ENV}`);

console.log(
  'SANITY_TEST: '
  + `${process.env.SANITY_TEST}`
);
// $ yarn run test:env
// > SANITY_TESTING is currently equal to envs/.env
// > SERVER_PORT is currently equal to 8080


console.log(
  'SERVER_PORT: '
  + `${process.env.SERVER_PORT}`
);
// $ yarn run test:env.test
// > SANITY_TESTING is currently equal to envs/test.env
// > SERVER_PORT is currently equal to 8888

/*
 * Import the main ESLint config and use it to create and export a new config just for files in the
 * spec/ directory
 *
 */
const mainConfig = require('../.eslintrc');

const env = Object.assign(
  {},
  mainConfig.env,
  { jasmine: true }
);

module.exports = Object.assign(
  {},
  mainConfig,
  { env }
);

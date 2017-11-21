const URL = require('url');

/**
 * A method for causing the event url to be parsed by URL.parse
 *
 * @param {URL} event
 */
const transform = (event) => {
  const mutable = event;
  mutable.url = URL.parse(mutable.url, true);
};

transform.events = [
  'loading',
];

module.exports = transform;

const fetch = require('node-fetch');
const util = require('util');
const EventEmitter = require('events');
const localTransforms = require('./transforms');
const tense = require('./support/tense');
const extendArachnid = require('./support/extendArachnid');

const state = {
  finished: 0,
  running: 0,
};

/**
 * Arachnid
 *
 * @param {String|Array.<String>} urls
 * @param {Object} options
 *
 * @constructor
 */
function Arachnid(urls = [], options = {}) {
  EventEmitter.call(this);

  // TODO: Update to leverage the use method.
  extendArachnid(this, localTransforms);

  this.urls = [];
  this.concurent = options.concurent || 8;
  this.running = false;

  if (options.autoStart === true) {
    this.on(tense.past('load'), this.start);
  }

  this.on('pause', () => {
    this.running = false;
  });

  this.load(urls);
}

util.inherits(Arachnid, EventEmitter);

/**
 * @return {Promise}
 */
const noop = () => Promise.resolve();

/**
 * Loads the provided url or urls into the crawler for later processing.
 *
 * @param {String|Array.<String>} urls
 *
 * @return {Arachnid}
 */
Arachnid.prototype.load = function load(urls) {
  const urlsArray = Array.isArray(urls) ? urls : [urls];

  urlsArray.forEach((url) => {
    this.emitTransform('load', { url }, event => this.urls.push(event.url));
  });

  return this;
};

/**
 * Start the scraper at scraping the loaded actions.
 *
 * @return {Arachnid}
 */
Arachnid.prototype.start = function start() {
  if (!this.running) {
    this.running = true;
    this.operate();
  }
  return this;
};

/**
 * Processes the number of actions that as can be run concurrently.
 *
 * @return {Arachnid}
 */
Arachnid.prototype.operate = function operate() {
  const toStart = this.concurent - state.running;

  for (let i = 0; i < toStart; i += 1) {
    this.process();
  }
  return this;
};

/**
 * Process the first action off the top of the stack.
 */
Arachnid.prototype.process = function process() {
  if (this.hasActions() && this.concurent > state.running) {
    state.running += 1;
    const url = this.urls.pop();
    const requestEvent = {
      url,
      req: {
        method: 'GET',
      },
    };

    this.emitTransform('request', requestEvent, event => fetch(event.url, event.req))
      .then((response) => {
        this.emit('response', response);
        return response.text();
      })
      .then((body) => {
        this.emitTransform('parse', { body }, bodyEvent => bodyEvent);
      })
      .catch((err) => {
        this.emit('error', err);
      })
      .then(() => {
        state.running -= 1;
        state.finished += 1;
        if (this.urls.length <= 0 && state.running <= 0) {
          this.emit('pause');
        }
        this.operate();
      });
  }
};

/**
 * Determines if there are any available actions for the crawler to take.
 *
 * @return {Boolean}
 */
Arachnid.prototype.hasActions = function hasActions() {
  return this.urls.length > 0;
};

/**
 * Standardized event emit method allowing transformation of event though listeners.
 *
 * @param {String} type
 * @param {Object} event
 * @param {Function} callback
 *
 * @return {Promise}
 */
Arachnid.prototype.emitTransform = function emitTransform(type, event, callback = noop) {
  const mutable = event;
  mutable[type] = true;

  this.emit(tense.present(type), mutable);

  return new Promise((resolve, reject) => {
    if (mutable[type]) {
      this.prependOnceListener(type, () => {
        resolve(callback(event));
      });
      this.emit(type, mutable);
    } else {
      reject(new Error('Event Rejected by pre-event'));
    }
  }).then((data) => {
    this.emit(tense.past(type), mutable);
    return data;
  }).catch((err) => {
    this.emit('error', err);
  });
};

/**
 * Loads external plugins into the Scraper for modifying it's functionality
 *
 * @param {{transforms: Array.<{events: Array}>}} plugin
 *
 * @return {Arachnid}
 */
Arachnid.prototype.use = function use(plugin) {
  extendArachnid(this, plugin.transforms);

  return this;
};

module.exports = Arachnid;

const util = require('util');
const EventEmitter = require('events');
const localTransforms = require('./transforms');
const tense = require('./support/tense');
const extendArachnid = require('./support/extendArachnid');
const process = require('./process');

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

  this.load(urls);
}

util.inherits(Arachnid, EventEmitter);

/**
 * @return {Promise}
 */
const noop = () => Promise.resolve();

/**
 * Loads the provided url or urls into the scraper for later processing.
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
 * Start the scraper at scraping the loaded urls.
 *
 * @return {Boolean}  true if the scraper was not previously running false otherwise.
 */
Arachnid.prototype.start = function start() {
  if (!this.running) {
    this.running = true;
    process(this);
    return true;
  }
  return false;
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

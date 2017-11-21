const fetch = require('node-fetch');

const state = {
  running: 0,
};

/**
 * Process a scrapers list of urls that should be targeted.
 *
 * @param {Arachnid} scraper
 */
const process = (scraper) => {
  while (scraper.urls.length > 0 && scraper.concurent > state.running) {
    state.running += 1;
    const url = scraper.urls.pop();
    const requestEvent = {
      url,
      req: {
        method: 'GET',
        timeout: 5000,
      },
    };

    // TODO: Convert this to using native http/https client to remove dependency,
    // with request event having been renamed to req all should be good now.
    scraper.emitTransform('request', requestEvent, event => fetch(event.url, event.req))
      .then((response) => {
        scraper.emit('response', response);
        return response.text();
      })
      .then((body) => {
        scraper.emitTransform('parse', { body }, bodyEvent => bodyEvent);
      })
      .catch((err) => {
        scraper.emit('error', err);
      })
      .then(() => {
        state.running -= 1;
        if (scraper.urls.length <= 0 && state.running <= 0) {
          scraper.emit('pause');
        }
      });
  }
};

module.exports = process;

/**
 * Used to extend the functionality of the Arachnid
 *
 * @param {Arachnid} emitter
 * @param {Array.<{events: Array}>} transforms
 */
const extendArachnid = (emitter, transforms) => {
  transforms.forEach((transform) => {
    transform.events.forEach((event) => {
      emitter.on(event, transform);
    });
  });
};

module.exports = extendArachnid;

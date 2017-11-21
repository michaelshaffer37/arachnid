/**
 *
 * Module used to convert tenses of event types.
 *
 */

const tense = {
  present: (verb) => {
    const cleanedVerb = (verb.match(/e$/)) ? verb.replace(/e$/, '') : verb;
    return `${cleanedVerb}ing`;
  },
  past: (verb) => {
    const cleanedVerb = (verb.match(/e$/)) ? verb.replace(/e$/, '') : verb;
    return `${cleanedVerb}ed`;
  },
};

module.exports = tense;

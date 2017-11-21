const tense = require('../../../../src/support/tense');

/**
 * An array of verb cases to test the transformation of.
 *
 * @type {Array.<{verb: String, past: String, present: String}>}
 */
const verbs = [
  {
    verb: 'load',
    past: 'loaded',
    present: 'loading',
  },
  {
    verb: 'parse',
    past: 'parsed',
    present: 'parsing',
  },
  {
    verb: 'request',
    past: 'requested',
    present: 'requesting',
  },
];

describe('The tense module', () => {
  it('should be an object', () => {
    expect(tense).toEqual(jasmine.any(Object));
  });

  it('should have a past method', () => {
    expect(tense.past).toEqual(jasmine.any(Function));
  });

  it('should have a present method', () => {
    expect(tense.present).toEqual(jasmine.any(Function));
  });

  describe('The past method', () => {
    verbs.forEach((verbCase) => {
      it(`should return ${verbCase.past} when given the verb ${verbCase.verb}`, () => {
        expect(tense.past(verbCase.verb)).toBe(verbCase.past);
      });
    });
  });

  describe('The present method', () => {
    verbs.forEach((verbCase) => {
      it(`should return ${verbCase.present} when given the verb ${verbCase.verb}`, () => {
        expect(tense.present(verbCase.verb)).toBe(verbCase.present);
      });
    });
  });
});


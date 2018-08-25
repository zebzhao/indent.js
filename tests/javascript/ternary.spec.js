var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('ternary', function () {
  it('simple ternary', function () {
    var expected = `
a += b ? b(date, $locale.DATETIME_FORMATS)
  : c.replace(/(^'|'$)/g, '').replace(/''/g, "'");
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
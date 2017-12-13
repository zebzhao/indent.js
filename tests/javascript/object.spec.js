var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('object', function () {
  it('all', function () {
    var expected = `
{
  a: {
    b: c, d: e,
    f: g,
    h: i,
  },
  j: function () {
    return {k: l,
      m: n}
  }
}
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
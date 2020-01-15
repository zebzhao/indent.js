var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('object', function () {
  it('complex object declaration', function () {
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
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('empty object declaration', function () {
    var expected = `
{
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('empty object with brackets', function () {
    var expected = `({
})`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

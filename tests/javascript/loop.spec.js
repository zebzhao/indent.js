var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('loop', function () {
  it('for: single line', function () {
    var expected = `
for (var a in b) c.push(d);
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('for: nested single lines', function () {
    var expected = `
for (var a in b)
  c.push(d);
for (var a in b)
  for (var c in d)
    c.push(d);
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('do-while: simple', function () {
    var expected = `
do {
  // comment
} while (
  a !== ( a = b() / c ) && d !== 1 && --e
);
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
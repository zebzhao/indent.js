var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('statements', function () {

  it('if: single line with object', function () {
    var expected = `
if (a)
  b = {
    c: 0,
    d: 1
  }
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('if: single line', function () {
    var expected = `
if (a)
  statement;
else if (b)
  statement
else
  for (var i=0; i<10; i++;)
    statement
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('if: multiple lines before expression', function () {
    var expected = `
if (a)
  
  
  statement;
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

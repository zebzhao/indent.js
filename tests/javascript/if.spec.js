var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('if', function () {

  it('if: single line with object', function () {
    var expected = `
if (a)
  b = {
    c: 0,
    d: 1
  }
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('if: single line with object and comment', function () {
    var expected = `
if (a) // Test
  b = {
    c: 0,
    d: 1
  }
`;
    expect(sut(expected, {tabString: ts})).to.equal(
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
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('if: single line', function () {
    var expected = `
if (a)
  if (b) {var c=0;}
else var d=0;
for(var e=0)
  statement(f);
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('if: single line with multiple lines before expression', function () {
    var expected = `
if (a)
  
  
  statement;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

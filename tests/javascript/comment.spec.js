var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('comment', function () {
  
  it('multi-line: indents kept', function () {
    var expected = `
/**
* a
  * b
  *	c, d,
*/
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('single-line: simple', function () {
    var expected = `
// (abc
// 012)
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('single-line: interleaved', function () {
    var expected = `
if (
  a, // comment
  b // comment
) { // comment
  var c = { // comment
    d: 0 //comment
  } // comment
} // comment
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
  
});
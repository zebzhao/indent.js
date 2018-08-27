var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('function', function () {

  it('function with multiline comment', function () {
    var expected = `
function test () {
  /*Test
    Multiline comment
  */
  if (test) return;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('function with multiline string', function () {
    var expected = `
function test () {
  \`Test
    Multiline comment
  \`
  if (test) return;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

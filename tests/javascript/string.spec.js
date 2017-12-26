var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('string', function () {

  it('simple empty string declarations', function () {
    var expected = `
var a = '',
  b = "",
  c =\`\`;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('multiline: unicode escape characters', function () {
    var expected = `
var a = "\u0301-\u036f\u0483-\u0487\u0591",
  b = \`
\u0301
  \u036f
\u0483
\`
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('multiline: indentation', function () {
    var expected = `
var a = \`
  0
1
  2
3
\`
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('escape quotes', function () {
    var expected = `
var a = '0\\'',
  b = "1\\"",
  c = \`2\\\`\`
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('quotes inside quotes', function () {
    var expected = `
var a = '"',
  b = "'",
  c = "\`",
  d = \`"\`,
  e = \`'\`
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

});
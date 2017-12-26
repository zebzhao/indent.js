var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('destruct', function () {

  it('object: basic', function () {
    var expected = `
var {a, b} = c
var {
  a,
  b
} = c
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('array: basic', function () {
    var expected = `
var [a, b] = c,
  [
    a,
    b
  ] = c
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
  
});
var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('try', function () {
  it('simple try catch', function () {
    var expected = `
try {
  (new RegExp(a));
  return {
    b: 0
  };
}
catch(e) {
  return {c: 1};
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
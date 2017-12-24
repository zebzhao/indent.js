var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('brackets', function () {
  it('multiple open and close brackets on same line', function () {
    var expected = `
({
  a: [
    b
  ],
  c: [d],
  e: [{
    f: (((
      g))),
    h: ((i,
      j,
    ))
  }]
})
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('iife', function () {
    var expected = `
(function() {
  function a(b, c) {
    statement;
  }
})();

(function() {
  function a(b, c) {
    statement;
  }
}());
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

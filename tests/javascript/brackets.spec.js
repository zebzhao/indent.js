var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('dot-chain', function () {
  it('all', function () {
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
});

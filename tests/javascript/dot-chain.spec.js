var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('dot-chain', function () {
  it('complex dot-chain definition', function () {
    var expected = `
a.test
  .body(b,
    c, d,
    
    e)
  .append(
    [1,
      2,
    ]
  ).
  
  extend(function () {
    f.
      g.h.
      
      i([]);
    
    j.
      k;
  });

.0
.1
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('simple multiple single line chains', function () {
    var expected = `
a.b('0')
  .d(1, 2, 3);
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var declaration with next line dot-chain', function () {
    var expected = `
var a = b
  .c("0")
  .d("1")
  .e("2", true);
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('dot at end of line', function () {
    var expected = `
a.b('').
  c.
  d;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('dot without semicolon termination', function () {
    var expected = `
a = b.append("0")
  .attr("1", width/2)

function d(e) {
  e
    .attr("2", function(d) { return; })
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('dot chain inside iife function', function () {
    var expected = `
(function () {
  statement().
    a().
    b()
})()
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

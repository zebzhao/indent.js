var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('dot-chain', function () {
  it('all', function () {
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
    // invalid
    var f.
      
      g.h.
      
      i;
    
    .test
  });

.0
.1
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

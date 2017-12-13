var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('string', function () {
  it('all', function () {
    var expected = `
"\""

{
  a: 1
}

'""'

{
  b: 2
}

'\''
{
  c: 3
}
`;
    expect(expected).toBe(sut(expected, ts));
  });
});
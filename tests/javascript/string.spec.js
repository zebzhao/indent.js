var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('string', function () {

  it('simple empty string def', function () {
    var expected = `
var a = '',
  b = "",
  c =\`\`;
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

});
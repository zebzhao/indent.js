var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('apostrophe', function () {
  it('Apostrophe in tag', function () {
    var expected = `
<div>
  <p>I'm the best</p>
</div>
<div>
  <p>I"m the best</p>
</div>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
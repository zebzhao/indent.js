var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('void-tag', function () {
  it('void tags', function () {
    var expected = `
<area>
<area />
<base>
<base />
<br>
<br />
<col>
<col />
<command>
<command />
<embed>
<embed />
<hr>
<hr />
<img>
<img />
<input>
<input />
<keygen>
<keygen />
<link>
<link />
<menuitem>
<menuitem />
<meta>
<meta />
<param>
<param />
<source>
<source />
<track>
<track />
<wbr>
<wbr />
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
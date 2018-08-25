var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('script', function () {
  it('script: simple example', function () {
    var expected = `
<script>
  var a = {
    b: (!window.location.href.match(/0123/)),
    c: false,
    d: null // comment
  };
  do {
    if (a) {
      b = b.substr(c.length).replace(/[s+]/, '');
      d += d + "\\n";
    }
  } while (found);
</script>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
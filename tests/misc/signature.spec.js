var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('doctype', function () {
  it('basic doctype', function () {
    var expected = `
<!DOCTYPE html>
<!doctype html>
<html>
<body>
\t<script></script>
</body>
</html>
`;
    expect(sut(expected)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

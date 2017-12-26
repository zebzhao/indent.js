var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('tag-attributes', function () {
  it('wrapped attributes', function () {
    var expected = `
<body>
  <svg xmlns="http://www.w3.org/2000/svg"
    version="1.1" width="100%" height="100%" viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid meet"></svg>
  <script type="text/javascript" src="https://cdn.example.com"></script>
  <script type="text/javascript" src="index.js"></script>
</body>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
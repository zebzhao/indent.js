var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('tag', function () {
  it('basic script tag', function () {
    var expected = `
<body>
  <script type="text/javascript" src="index.js">
    window.Object(
      null
    );
  </script>
</body>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('tag with dot', function () {
    var expected = `
<Menu.Item>
  <Menu.Item>
  </Menu.Item>
</Menu.Item>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('tag with dash', function () {
    var expected = `
<Menu-Item>
  <Menu-Item>
  </Menu-Item>
</Menu-Item>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

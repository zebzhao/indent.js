var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('style', function () {
  it('style: simple', function () {
    var expected = `
<style>
  body {
    background: #eee;
    color: #333;
  }
  a.self {
    font-weight: bold;
    border-bottom: 1px solid #aaa
  }
  p, select, label, .blurb, a.turn-off-codemirror {
    font:13px/1.231 arial, sans-serif;
  }
  button.submit {
    width: 100%;
    padding: 10px 0;
  }
  table#options {
    float: right;
  }
</style>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
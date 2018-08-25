var sut = require('../../lib/indent').html;
var expect = require('chai').expect;
var ts = '  ';

describe('table', function () {
  it('basic table', function () {
    var expected = `
<table id="options">
  <tr>
    <td>
      <select
        name="tabsize"
        id="tabsize">
        <option
          value="1">
        </option>
      </select>
    </td>
    <td>
      <br>
    </td>
  </tr>
</table>
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
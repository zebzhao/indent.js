
var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('jsx-dom', function () {
  it('basic dom', function () {
    var expected = `
class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  render() {
    return  (
      <div className="">
        <Title label={this.props.title} />
        <Title label="this.props.title" />
      </div>
    )
  }
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});

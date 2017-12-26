var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('switch', function () {

  it('simple switch', function () {
    var expected = `
switch (a) {
  case '0':
    statement();
    break;
  default:
    return;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('switch: with fall through', function () {
    var expected = `
switch(a){
  case '1':
  case '2';
    statement;
    break;
  case 3:
  default 4:
  default 5:
    return;
}`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('switch: brackets next line', function () {
    var expected = `
switch (a)
{
  case 1:
    break;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('switch: nested switch', function () {
    var expected = `
switch (a) {
  case 0:
    switch (b)
    {
      case 1:
      default:
        statement;
        break;
    }
    break;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

});
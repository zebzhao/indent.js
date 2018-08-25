var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('regex', function () {

  it('complex regex with escaped chars', function () {
    var expected = `
var a = /<()([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g,
  b;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('random assortment', function () {
    var expected = `
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
var rtagName = ( /<([\w:-]+)/ );
var rscriptType = ( /^$|\/(?:java|ecma)script/i );
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('multiple slashes', function () {
    var expected = `
var a = /[,=:!&|?};][\s]*\/[^/]|^\/[^/]/,
  b;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

});
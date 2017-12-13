var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('var', function () {
  it('all', function () {
    var expected = `
var a,
  b=c,
  c,d

  ,e

let a
  ,b
  ,c=[0
    ,1]

const
  a, b=[1
    ,2]

var a = {
  b: c,
  d: e,
};

let a = {
    b: c,
    d: e,
  },
  
  f=1, g, h;
  
const a = function () {
    statement;
  }
  ,b = function () {
    statement;
  },
  c = 10;

// invalid
var a;,
,b

`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
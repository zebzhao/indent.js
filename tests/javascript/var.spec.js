var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('var', function () {
  it('function', function () {
    var expected = `
const a = function () {
    statement;
    statement;
  }
  ,b = function () {
    statement;
    statement;
  },
  c = 10;

var
  a = function () {
    statement;
    statement;
  }

let a = function () {
  statement;
  statement;
}

// invalid
var a;,
,b
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('all', function () {
    var expected = `
let a
  ,b
  ,c=[0
    ,1]

var a,
  b=c,
  c,d

  ,e

const
  
  a, b=[1
    ,2],
  
  c = [
    1,
    2
  ]
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('=', function () {
    var expected = `
let
  a, b={
    c: d,
    e: f,
  }
statement;
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var', function () {
    var expected = `
var a = {
  b: c,
  d: e,
};

let a = {
    b: c,
    d: e,
  },
  
  f=1, g, h;
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('function', function () {
    var expected = `
function () {
  statement;
}
`;
    expect(sut(expected, ts)).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });
});
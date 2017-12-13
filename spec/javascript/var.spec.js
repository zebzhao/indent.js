var sut = require('../../lib/indent').js;
var ts = '  ';

describe('', function () {
  it('', function () {
    var expected = `
var a,
  b=c,
  c

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
  f=1;
  
const a = function () {
    statement;
  }
  ,b = function () {
    statement;
  },
  c = 10;

`;
    expect(expected).toBe(sut(expected, ts));
  });
});
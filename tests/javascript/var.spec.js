var sut = require('../../lib/indent').js;
var expect = require('chai').expect;
var ts = '  ';

describe('var', function () {

  it('const: multi array declaration', function () {
    var expected = `
const
  
  a, b=[1
    ,2],
  
  c = [
    1,
    2
  ]
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('const: multiple commas', function () {
    var expected = `
const a = "",
  b;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('const: multiple equals', function () {
    var expected = `
var a = 0,
  b = 1,
  c = 2;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('const: post comma double indent', function () {
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
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var: multiple spacing between declarations', function () {
    var expected = `
var a,
  
  b=[
    
    0,
    
    1,
  ],
  
  
  c={}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var: next line function indent', function () {
    var expected = `
var
  a = function () {
    statement;
    statement;
  }
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var: semicolon terminate', function () {
    var expected = `
// invalid
var a;,
,b
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });


  it('var: array declaration', function () {
    var expected = `
let a
  ,b
  ,c=[0
    ,1]
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var: multiple', function () {
    var expected = `
var a,
  b=c,
  c,d

  ,e
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('var: proper equal with object and semicolon', function () {
    var expected = `
var a = {
  b: c,
  d: e,
};
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('let: no comma object', function () {
    var expected = `
let a = function () {
  statement;
  statement;
}
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('let: next line, comma then equal with object', function () {
    var expected = `
let
  a, b={
    c: d,
    e: f,
  }
statement;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('let: post comma with more comma separated', function () {
    var expected = `
let a = {
    b: c,
    d: e,
  },
  
  f=1, g, h;
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

  it('let: multiple array, objects, regex', function () {
    var expected = `
let a=[0,
    1, {
      b: 1}
  ]
  ,c="",
  d=[
    2,3,
    /^([^.]*)/
  ]
`;
    expect(sut(expected, {tabString: ts})).to.equal(
      expected.replace(/\r*\n/g, '\r\n'));
  });

});

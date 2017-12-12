describe('statements.spec.js', function() {
  it('should handle indent var declarations', function () {
    var input = hereDoc(function () {/*!
var
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
rdisplayswap = /^(none|table(?!-c[ea]).+)/,
cssShow = { position: "absolute", visibility: "hidden", display: "block" },
cssNormalTransform = {
letterSpacing: "0",
fontWeight: "400"
},
cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
emptyStyle = document.createElement( "div" ).style;
var
rkeyEvent = /^key/,
rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
*/
    });
    var expected = hereDoc(function () {/*!
var
  // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssNormalTransform = {
    letterSpacing: "0",
    fontWeight: "400"
  },
  cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
  emptyStyle = document.createElement( "div" ).style;
var
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
  rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
*/
    });
    expect(indent.indentJS(input, '  ')).toEqual(expected);
  });

  it('should handle indent let declarations', function () {
    var input = hereDoc(function () {/*!
let
test1,
test2,
test3;

let test1,
test2,
test3 = 10,
test4 = [10,
12,
13];
*/
    });
    var expected = hereDoc(function () {/*!
let
  test1,
  test2,
  test3;

let test1,
  test2,
  test3 = 10,
  test4 = [10,
    12,
    13];
*/
    });
    expect(indent.indentJS(input, '  ')).toEqual(expected);
  });
});

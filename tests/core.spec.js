describe('core.spec.js', function() {
    it('should handle overflow/stacked indents with 1 indent', function() {
        var input = hereDoc(function() {/*!
(function() {
function css_beautify(source_text, options) {
var pos = -1,
ch;
var parenLevel = 0;
}
})();
*/
        });
        var expected = hereDoc(function() {/*!
(function() {
  function css_beautify(source_text, options) {
    var pos = -1,
      ch;
    var parenLevel = 0;
  }
})();

*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });

    it('should handle if with nested brackets', function() {
        var input = hereDoc(function() {/*!
if ((insideRule || enteringConditionalGroup) &&
!(lookBack("&") || foundNestedPseudoClass()) &&
!lookBack("(")) {
// 'property: value' delimiter
// which could be in a conditional group query
insidePropertyValue = true;
output.push(':');
print.singleSpace();
}
*/
        });
        var expected = hereDoc(function() {/*!
if ((insideRule || enteringConditionalGroup) &&
  !(lookBack("&") || foundNestedPseudoClass()) &&
  !lookBack("(")) {
  // 'property: value' delimiter
  // which could be in a conditional group query
  insidePropertyValue = true;
  output.push(':');
  print.singleSpace();
}

*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });

    it('should handle indent var declarations', function() {
        var input =  hereDoc(function() {/*!
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
        var expected = hereDoc(function() {/*!
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
});

describe('statements.spec.js', function() {
    it('should handle switch statements', function() {
        var input = hereDoc(function() {/*!
switch (process.env.TEST_SUITE) {
case 'built-tests':
console.log('suite: built-tests');
generateBuiltTests();
break;
case 'old-jquery-and-extend-prototypes':
console.log('suite: old-jquery-and-extend-prototypes');
generateOldJQueryTests();
generateExtendPrototypeTests();
break;
case 10:
return null;
case 11:
return;
default:
baz=null;
return;
default:
baz=null;
}
*/
        });
        var expected = hereDoc(function() {/*!
switch (process.env.TEST_SUITE) {
  case 'built-tests':
    console.log('suite: built-tests');
    generateBuiltTests();
    break;
  case 'old-jquery-and-extend-prototypes':
    console.log('suite: old-jquery-and-extend-prototypes');
    generateOldJQueryTests();
    generateExtendPrototypeTests();
    break;
  case 10:
    return null;
  case 11:
    return;
  default:
    baz=null;
    return;
  default:
    baz=null;
}
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


    it('should handle do-while statements', function() {
        var input =  hereDoc(function() {/*!
do {
// Break the loop if scale is unchanged or perfect, or if we've just had enough.
} while (
scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
);
*/
        });
        var expected = hereDoc(function() {/*!
do {
  // Break the loop if scale is unchanged or perfect, or if we've just had enough.
} while (
  scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
);
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });

    it('should handle single line statements', function() {
        var input =  hereDoc(function() {/*!
if (test)
execute();
if (test)
if (is) {var t=0}
else var s=0;
for(var i=0)
execute();
*/
        });
        var expected = hereDoc(function() {/*!
if (test)
  execute();
if (test)
  if (is) {var t=0}
  else var s=0;
for(var i=0)
  execute();
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });

    it('should handle terminate bracket on same line', function() {
        var input =  hereDoc(function() {/*!
if (test) {
cool();}
else if (test) {
cool();}
*/
        });
        var expected = hereDoc(function() {/*!
if (test) {
  cool();}
else if (test) {
  cool();}
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });
    
    it('should handle single line for loop', function() {
        var input =  hereDoc(function() {/*!
for (var key in obj) keys.push(key);
keys.sort();
*/
        });
        var expected = hereDoc(function() {/*!
for (var key in obj) keys.push(key);
keys.sort();
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });

    it('should handle conditionals', function() {
        var input =  hereDoc(function() {/*!
forEach(parts, function(value){
  text += fn ? fn(date, $locale.DATETIME_FORMATS)
  : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
});
*/
        });
        var expected = hereDoc(function() {/*!
forEach(parts, function(value){
  text += fn ? fn(date, $locale.DATETIME_FORMATS)
  : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
});
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });
});
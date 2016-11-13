describe('regex.spec.js', function() {
    it('should handle regex definitions', function() {
        var input = hereDoc(function() {/*!
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
var rtagName = ( /<([\w:-]+)/ );
var rscriptType = ( /^$|\/(?:java|ecma)script/i );
*/
        });
        var expected = hereDoc(function() {/*!
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
var rtagName = ( /<([\w:-]+)/ );
var rscriptType = ( /^$|\/(?:java|ecma)script/i );
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });


    it('should handle complex regex with escaped chars', function() {
        var input = hereDoc(function() {/*!
var startXmlRegExp = /<()([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;
followingDoc();
*/
        });
        var expected = hereDoc(function() {/*!
var startXmlRegExp = /<()([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;
followingDoc();
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });


    it('should handle another regex with brackets', function() {
        var input = hereDoc(function() {/*!
{
name: "regex",
startToken: [function(string, rule) {
var re = /[,=:!&|?};][\s]*\/[^/]|^\/[^/]/;
var startIndex = string.search(re);
if (startIndex != -1) {
startIndex = string.indexOf('/', startIndex);
var substr = string.substring(startIndex);
var match = searchAny(substr, rule.endToken, rule);
if (match.matchIndex != -1) {
substr = substr.substring(0, match.matchIndex);
try {
(new RegExp(substr));
return {
matchIndex: startIndex,
length: 1
};
}
catch(e) {
return {matchIndex: -1};
}
}
}
return {matchIndex: -1};
}]
}
*/
        });
        var expected = hereDoc(function() {/*!
{
  name: "regex",
  startToken: [function(string, rule) {
    var re = /[,=:!&|?};][\s]*\/[^/]|^\/[^/]/;
    var startIndex = string.search(re);
    if (startIndex != -1) {
      startIndex = string.indexOf('/', startIndex);
      var substr = string.substring(startIndex);
      var match = searchAny(substr, rule.endToken, rule);
      if (match.matchIndex != -1) {
        substr = substr.substring(0, match.matchIndex);
        try {
          (new RegExp(substr));
          return {
            matchIndex: startIndex,
            length: 1
          };
        }
        catch(e) {
          return {matchIndex: -1};
        }
      }
    }
    return {matchIndex: -1};
  }]
}
*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });
});

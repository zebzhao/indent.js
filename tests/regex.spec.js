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
});

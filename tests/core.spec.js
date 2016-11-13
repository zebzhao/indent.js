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
});

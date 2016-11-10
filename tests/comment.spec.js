describe('comment.spec.js', function() {
    it('should ignore line comment', function() {
        var input = hereDoc(function() {/*!
if (last_type !== 'TK_END_EXPR') {
if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
// no need to force newline on 'var': for (var x = 0...)
if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
// no newline for } else if {
output.space_before_token = true;
} else {
print_newline();
}
}
}
*/
        });
        var expected = hereDoc(function() {/*!
if (last_type !== 'TK_END_EXPR') {
  if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
    // no need to force newline on 'var': for (var x = 0...)
    if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
      // no newline for } else if {
      output.space_before_token = true;
    } else {
      print_newline();
    }
  }
}

*/
        });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });
});

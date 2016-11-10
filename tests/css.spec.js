describe('css.spec.js', function() {
    it('should handle css animation', function() {
        var input = hereDoc(function() {/*!
@keyframes bounce {
from, 20%, 53%, 80%, to {
-webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
-webkit-transform: translate3d(0,0,0);
transform: translate3d(0,0,0);
}
}
*/
        });
        var expected = hereDoc(function() {/*!
@keyframes bounce {
  from, 20%, 53%, 80%, to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
  }
}

*/
        });
        expect(indent.indentCSS(input, '  ')).toEqual(expected);
    });
});

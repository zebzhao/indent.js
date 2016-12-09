describe('chaining.spec.js', function() {
    it('should indent when chaining', function() {
        var input = hereDoc(function() {/*!
angular.module('test')
.config()
.test()
.chaining();
*/
            });
        var expected = hereDoc(function() {/*!
angular.module('test')
  .config()
  .test()
  .chaining();
*/
            });
        expect(indent.indentJS(input, '  ')).toEqual(expected);
    });
});

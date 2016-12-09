describe('html.spec.js', function() {
    it('should handle basic tags', function() {
        var input = hereDoc(function() {/*!
<body>
<script type="text/javascript" src="index.js"></script>
</body>
*/
        });
        var expected = hereDoc(function() {/*!
<body>
  <script type="text/javascript" src="index.js"></script>
</body>
*/
        });
        expect(indent.indentHTML(input, '  ')).toEqual(expected);
    });

    it('should handle wrapped attrs', function() {
        var input = hereDoc(function() {/*!
<body>
<svg xmlns="http://www.w3.org/2000/svg"
version="1.1" width="100%" height="100%" viewBox="0 0 400 400"
preserveAspectRatio="xMidYMid meet"></svg>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js"></script>
<script type="text/javascript" src="index.js"></script>
</body>
*/
        });
        var expected = hereDoc(function() {/*!
<body>
  <svg xmlns="http://www.w3.org/2000/svg"
    version="1.1" width="100%" height="100%" viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid meet"></svg>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js"></script>
  <script type="text/javascript" src="index.js"></script>
</body>
*/
        });
        expect(indent.indentHTML(input, '  ')).toEqual(expected);
    });
});
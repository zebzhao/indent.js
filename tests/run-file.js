var fs = require('fs');
var indent = require('./../src/indent.js');
var self = this;

fs.readFile( __dirname + '/file.js', function (err, data) {
    if (err)
        throw err;
    console.log(
        indent.indent.indentJS(data.toString(), '  ')
    );
});

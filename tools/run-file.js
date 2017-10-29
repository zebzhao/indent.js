var fs = require('fs');
var indent = require('./../lib/indent.js');

fs.readFile( __dirname + '/file.js', function (err, data) {
    if (err)
        throw err;
    console.log(
        indent.js(data.toString(), '  ')
    );
});

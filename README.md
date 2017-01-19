# indent.js - pure code indentation for jsx, tsx, ts, js, html, css, less, scss

[![Build Status](https://travis-ci.org/zebzhao/indent.js.svg?branch=master)](https://travis-ci.org/zebzhao/indent.js)

Fast minimalistic pure code indentation. Indents JavaScript, Typescript, TSX, JSX, CSS, and HTML. Does not do any beautifying of your code, leave it as it is, only correctly indents it following some basic rules.

[Online indent.js demo](https://zebzhao.github.io/indent.js/)

---

You have following options to get indent.js:

1. Install with [bower](http://bower.io): ```bower install indent.js```
2. Install with [npm](https://www.npmjs.com): ```npm install indent.js```

## Download

* [Minified (~5 kB) no gzip](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)
* [Not minified (~11 kB) no gzip](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)


## Usage
---

### Browser Global
```javascript
var indented = indent.indentJS(code, '\t');
console.log(indented);
```

### Browser using AMD
```javascript
define(['indent'] , function (indent) {
    var indented = indent.indentJS(code, '\t');
    console.log(indented);
});
```

### Node
```javascript
var indent = require('indent');
var indented = indent.indentJS(code, '  ');
console.log(indented);
```

*If you like this project please leave a star. Your support is greatly appreciated.*

## Projects with indent.js:

1. [Spck.io - An offline web editor that keeps your data private](https://spck.io/)


## Languages still not supported:

1. CoffeeScript
2. Pug

## Getting the project

1. Run `npm install` to install dependencies
2. Run `npm test` to run tests in `tests` folder
3. Run `npm run build` to build the project

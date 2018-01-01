# indent.js

[![Build Status](https://travis-ci.org/zebzhao/indent.js.svg?branch=master)](https://travis-ci.org/zebzhao/indent.js)

Fast minimalistic pure indentation of JavaScript (ES5, ES6, ES7), TypeScript, CSS, Less, Sass, and HTML.
Indents better than most tools, test it out in the demo.

[Online indent.js demo](https://zebzhao.github.io/indent.js/)

---

You have following options to get indent.js:

1. Install with [bower](http://bower.io): ```bower install indent.js```
2. Install with [npm](https://www.npmjs.com): ```npm install indent.js```

### Download

* [Minified and gzip (~2.7 kB)](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.min.js)
* [Minified (~7 kB)](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.min.js)
* [Not minified (~20 kB)](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)

Usage
---

### Browser Global
```javascript
var indented = indent.js(code, '\t');
console.log(indented);
```

### Browser using AMD
```javascript
define(['indent'] , function (indent) {
    var indented = indent.js(code, '\t');
    console.log(indented);
});
```

### Node
```javascript
var indent = require('indent');
// JS code
indent.js(code, {tabString: '  '});
// TypeScript code
indent.ts(code, {tabString: '\t'});
// CSS code
indent.css(code);
// HTML code
indent.html(code, {tabString: '    '});
```

Developers
---

The rules this library uses are very simple and work on most languages with syntax using (), {}, etc...
The languages below have not been fully tested and may fail to indent properly for some special cases.

###Languages supported

1. JavaScript/TypeScript
2. HTML
3. JSX (Partial support)
4. CSS/Less/Sass

###Getting the project

1. Run `npm install` to install dependencies
2. Run `npm test` to run tests in `tests` folder
3. Run `npm run build` to build the project

## Contributing

This project follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model).
The ```master``` branch always reflects a production-ready state while the latest development is taking place in the ```develop``` branch.

Each time you want to work on a fix or a new feature, create a new branch based on the ```develop``` branch: ```git checkout -b BRANCH_NAME develop```. Only pull requests to the ```develop``` branch will be merged.

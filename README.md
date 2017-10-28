# indent.js

[![Build Status](https://travis-ci.org/zebzhao/indent.js.svg?branch=master)](https://travis-ci.org/zebzhao/indent.js)

Fast minimalistic pure indentation of JavaScript, CSS, and HTML.

[Online indent.js demo](https://zebzhao.github.io/indent.js/)

---

You have following options to get indent.js:

1. Install with [bower](http://bower.io): ```bower install indent.js```
2. Install with [npm](https://www.npmjs.com): ```npm install indent.js```

### Download

* [Minified (~4 kB)](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)
* [Not minified (~11 kB)](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)

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
var indented = indent.js(js, '  ');
// CSS code
var indented = indent.css(css, '  ');
// HTML code
var indented = indent.html(html, '  ');
console.log(indented);
```

---

This project is great for code editors and file watchers. I'd love to hear about how your projects use indent.js.

Developers
---

The rules this library uses are very simple and work on most languages with syntax using (), {}, etc...
The languages below have not been fully tested and may fail to indent properly for some special cases.

###Languages still not fully supported:

1. TypeScript (partial?)
2. Less/Sass (partial?)

###Getting the project

1. Run `npm install` to install dependencies
2. Run `npm test` to run tests in `tests` folder
3. Run `npm run build` to build the project

## Contributing

This project follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model).
The ```master``` branch always reflects a production-ready state while the latest development is taking place in the ```develop``` branch.

Each time you want to work on a fix or a new feature, create a new branch based on the ```develop``` branch: ```git checkout -b BRANCH_NAME develop```. Only pull requests to the ```develop``` branch will be merged.

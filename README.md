# indent.js

[![Build Status](https://travis-ci.org/zebzhao/indent.js.svg?branch=master)](https://travis-ci.org/zebzhao/indent.js)

Fast minimalistic pure indentation of JavaScript, CSS, and HTML.

[Online Demo](https://zebzhao.github.io/indent.js/)

---

You have following options to get indent.js:

1. Install with [Bower](http://bower.io): ```bower install indent.js```
2. Install with [npm](https://www.npmjs.com): ```npm install indent.js```

Usage
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

Developers
---

1. Run `npm install` to install dependencies
2. Run `npm test` to run tests in `tests` folder
3. Run `npm run build` to build the project

## Contributing

This project follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model). The ```master``` branch always reflects a production-ready state while the latest development is taking place in the ```develop``` branch.

Each time you want to work on a fix or a new feature, create a new branch based on the ```develop``` branch: ```git checkout -b BRANCH_NAME develop```. Only pull requests to the ```develop``` branch will be merged.

# indent.js - pure code indentation for jsx, tsx, ts, js, html, css, less, scss

[![Build Status](https://travis-ci.org/zebzhao/indent.js.svg?branch=master)](https://travis-ci.org/zebzhao/indent.js)

Fast minimalistic pure code indentation. Indents JavaScript, Typescript, TSX, JSX, CSS, and HTML. Does not do any beautifying of your code, leave it as it is, only correctly indents it following some basic rules.

*If you like this project please leave a star. Your support is greatly appreciated.*

[Online indent.js demo](https://zebzhao.github.io/indent.js/)

You have following options to get indent.js:

1. Install with [bower](http://bower.io): ```bower install indent.js```
2. Install with [npm](https://www.npmjs.com): ```npm install indent.js```

## Download

* [Minified (~5 kB) no gzip](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)
* [Not minified (~11 kB) no gzip](https://raw.githubusercontent.com/zebzhao/indent.js/master/lib/indent.js)


## Usage

Browser Global
```javascript
var indented = indent.js(code, {tabString: '\t'});
console.log(indented);
```

Browser using AMD
```javascript
define(['indent'] , function (indent) {
    var indented = indent.js(code, {tabString: '\t'});
    console.log(indented);
});
```

Node/CommonJS
```javascript
var indent = require('indent');
var indented = indent.js(code, {tabString: '  '});
console.log(indented);
```

ES6/ES2015 Modules
```javascript
import {indent} from 'indent.js';

var indentedJs = indent.js(code);  // JSX as well
var indentedTs = indent.ts(code);  // TSX as well
var indentedCss = indent.css(code);
var indentedHtml = indent.html(code);
```

## Projects using indent.js:

1. [Spck Editor - Full-fledged code editor for the web](https://spck.io/)

## API Reference

### Methods

```javascript
js(code: String, options: Object): String
ts(code: String, options: Object): String
css(code: String, options: Object): String
html(code: String, options: Object): String
```

#### Options

|Field|Type|Description|
|:--- |:--- |:--- |
|`tabString`|`string`|String to indent the code with. Counts as 1 indent.|
|`indentHtmlTag`|`bool`|Whether to indent contents inside `<html>` tag or not. Valid only for `html(...)`.|

## Languages still not supported:

1. CoffeeScript
2. Pug

## Getting the project

1. Clone the repo.
2. Run `npm install` to install dependencies
3. Run `npm test` to run tests in `tests` folder
4. Run `npm run build` to build the project

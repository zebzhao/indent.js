function changeExample(id) {
  mode = id.split(':')[0];
  editorWindow.postMessage({
    text: EXAMPLES[id],
    mode: mode
  }, origin);
}

function changeTabSize(size) {
  var tabSizeMap = {
    '2': 2,
    '4': 4,
    'tab': 4
  };
  tabSize = size;
  editorWindow.postMessage({
    tabSize: tabSizeMap[size]
  }, origin);
}

function indentCode() {
  var channel = new MessageChannel();
  channel.port1.onmessage = function (e) {
    var modeMap = {
      'less': 'css',
      'scss': 'css',
      'css': 'css',
      'tsx': 'ts',
      'jsx': 'js',
      'html': 'html'
    };
    var tabStringMap = {
      '2': '  ',
      '4': '    ',
      'tab': '\t'
    };
    editorWindow.postMessage({
      text: indent[modeMap[mode]](e.data, {tabString: tabStringMap[tabSize]})
    }, origin);
  };  
  editorWindow.postMessage('text', origin, [channel.port2]);
}

var mode;
var origin = 'http://localhost:8123';
var editorWindow = document.getElementById('editor').contentWindow;
var tabSize = '2';

var EXAMPLES = {
  'jsx:class': function () {/*
class Main extends React.Component {
constructor (props) {
super(props);
this.state = {};
}

render() {
return  (
<div className="">
<Title label={this.props.title} />
</div>
)
}
}
*/
  },
  'tsx:class': function () {/*
interface Props {
foo: string;
}

class MyComponent extends React.Component<Props, {}> {
render() {
return <span>{this.props.foo}</span>
}
}
*/
  },
  'html:': function () {/*
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<title>indent.js - pure code indenter</title>
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

<style>
body {
margin: 0;
font-size: 14px;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>
</head>

<body>
<script>
function changeTabSize(size) {
tabSize = size;
}
</script>
</body>
</html>
*/
  },
  'scss:': function () {/*
$primary-color: #333;
body {
color: $primary-color;
}

nav {
ul {
margin: 0;
padding: 0;
list-style: none;
}

li { display: inline-block; }
}
*/
  },
  'less:': function () {/*
@primary:  green;
@secondary: blue;

.section {
@color: primary;

.element {
color: @@color;
}
}
*/
  }
};

for (var id in EXAMPLES) {
  if (EXAMPLES.hasOwnProperty(id)) EXAMPLES[id] = multiline(EXAMPLES[id]);
}

function init() {
  setTimeout(function () {
    changeExample('jsx:class');
  }, 1500);
}

function multiline(f) {
  return f.toString()
    .replace(/^[^\/]+\/\*[\s\n\r]*/, '')
    .replace(/\*\/[^\/]+$/, '')
    .replace(/[\r]?\n/gi, '\r\n');
}
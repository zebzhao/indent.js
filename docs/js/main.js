function changeExample(id) {
  var mode = id.split(':')[0];
  editorWindow.postMessage({
    text: EXAMPLES[id],
    mode: mode
  }, origin);
}

function changeTabSize(size) {
  tabSize = size;
}

function indentCode() {
  editorWindow.postMessage('text', origin, [channel.port2]);
}

channel.port1.onmessage = function () {
  indent.js
};

var channel = new MessageChannel();
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
  }
};

for (var id in EXAMPLES) {
  if (EXAMPLES.hasOwnProperty(id)) EXAMPLES[id] = multiline(EXAMPLES[id]);
}

function multiline(f) {
  return f.toString()
    .replace(/^[^\/]+\/\*[\s\n\r]*/, '')
    .replace(/\*\/[^\/]+$/, '')
    .replace(/[\r]?\n/gi, '\r\n');
}
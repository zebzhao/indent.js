var mode;
var editor = new SpckEditor('#editor');
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
  'jsx:ant-design': function () {/*
import React from 'react';
import ReactDOM from 'react-dom';

import {
Layout,
Menu,
Breadcrumb,
Icon,
Skeleton
} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

ReactDOM.render(
<Layout>
<Header className="header">
<div className="logo" />
<Menu
theme="dark"
mode="horizontal"
defaultSelectedKeys={['2']}
style={{ lineHeight: '64px' }}
>
<Menu.Item key="1">Home</Menu.Item>
<Menu.Item key="2">App</Menu.Item>
</Menu>
</Header>
<Layout>
<Sider width={200} style={{ background: '#fff' }}>
<Menu
mode="inline"
defaultSelectedKeys={['1']}
defaultOpenKeys={['sub1']}
style={{ height: '100%', borderRight: 0 }}
>
<SubMenu key="sub1" title={<span><Icon type="user" />User</span>}>
<Menu.Item key="1">option1</Menu.Item>
<Menu.Item key="2">option2</Menu.Item>
<Menu.Item key="3">option3</Menu.Item>
<Menu.Item key="4">option4</Menu.Item>
</SubMenu>
<SubMenu key="sub2" title={<span><Icon type="laptop" />Device</span>}>
<Menu.Item key="5">option5</Menu.Item>
<Menu.Item key="6">option6</Menu.Item>
<Menu.Item key="7">option7</Menu.Item>
<Menu.Item key="8">option8</Menu.Item>
</SubMenu>
<SubMenu key="sub3" title={<span><Icon type="notification" />Notifications</span>}>
<Menu.Item key="9">option9</Menu.Item>
<Menu.Item key="10">option10</Menu.Item>
<Menu.Item key="11">option11</Menu.Item>
<Menu.Item key="12">option12</Menu.Item>
</SubMenu>
</Menu>
</Sider>
<Layout style={{ padding: '0 24px 24px' }}>
<Breadcrumb style={{ margin: '16px 0' }}>
<Breadcrumb.Item>Home</Breadcrumb.Item>
<Breadcrumb.Item>List</Breadcrumb.Item>
<Breadcrumb.Item>App</Breadcrumb.Item>
</Breadcrumb>
<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
<Skeleton />
</Content>
</Layout>
</Layout>
</Layout>,
mountNode);
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
  editor.connect().then(function () {
    changeExample('jsx:class');
  })
}

function multiline(f) {
  return f.toString()
    .replace(/^[^\/]+\/\*[\s\n\r]*/, '')
    .replace(/\*\/[^\/]+$/, '')
    .replace(/[\r]?\n/gi, '\r\n');
}

function changeExample(id) {
  mode = id.split(':')[0];
  editor.send({
    editor: {
      text: EXAMPLES[id],
      mode: mode
    }
  });
}

function changeTabSize(size) {
  var tabSizeMap = {
    '2': 2,
    '4': 4,
    'tab': 4
  };
  tabSize = size;
  editor.send({
    editor: {tabSize: tabSizeMap[size]}
  });
}

function indentCode() {
  editor.getText().then(function (text) {
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
    return editor.send({
      editor: {
        text: indent[modeMap[mode]](text, {tabString: tabStringMap[tabSize]})
      }
    });
  });
}

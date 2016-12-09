describe('big-bang.spec.js', function() {
    it('should handle full html file', function() {
        var input = hereDoc(function() {/*!
<!DOCTYPE html>
<html>
<!--
-->
<head>
<!-- if you feel an urge to move this to bootstrap or something, you're most welcome -->
<meta charset="utf-8">
<title>Online JavaScript beautifier</title>
<link rel="icon" href="web/favicon.png" type="image/png">
<script src="web/third-party/codemirror/mode/javascript/javascript.js"></script>
<style>
body {
    background: #eee;
    color: #333;
}
a.self {
    font-weight: bold;
    border-bottom: 1px solid #aaa
}
p, select, label, .blurb, a.turn-off-codemirror {
    font:13px/1.231 arial, sans-serif;
*font-size:small;
}
a.turn-off-codemirror {
    margin-left: 25px;
}
button.submit {
    width: 100%;
    padding: 10px 0;
}
button.submit em {
}
select {
    width: 220px;
}
table#options {
    float: right;
}
.col-6 {
    width: 50%;
    float: left;
}
#about p {
    margin: 0 6px 6px 0;
}
.uses li.sep {
    margin-top: 8px;
}
</style>
<script>
var the = {
    use_codemirror: (!window.location.href.match(/without-codemirror/)),
    beautify_in_progress: false,
    editor: null // codemirror editor
};
function run_tests() {
    var st = new SanityTest();
    Urlencoded.run_tests(st);
    var results = st.results_raw()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;');
    $('#testresults').html(results).show();
}
function read_settings_from_cookie() {
    $('#detect-packers').prop('checked', $.cookie('detect-packers') !== 'off');
    $('#break-chained-methods').prop('checked', $.cookie('break-chained-methods') === 'on');
    $('#space-before-conditional').prop('checked', $.cookie('space-before-conditional') !== 'off');
    $('#end-with-newline').prop('checked', $.cookie('end-with-newline') === 'on');
    $('#comma-first').prop('checked', $.cookie('comma-first') === 'on');
    $('#e4x').prop('checked', $.cookie('e4x') === 'on');
}
        comment = '',
        unpacked = '',
        found = false;
    do {
        if (/^\s*\//.test(source)) {
            source = source.substr(comment.length).replace(/^\s+/, '');
            trailing_comments += comment + "\n";
        } else if (/^\s*\/\//.test(source)) {
            comment = source.match(/^\s*\//)[0];
            source = source.substr(comment.length).replace(/^\s+/, '');
        }
    } while (found);
</script>
</head>
<body>
<div id="about">
<p>
<a class="self" href="./">Beautify, unpack or deobfuscate JavaScript and HTML, make JSON/JSONP readable, etc.</a>
</p>
<p>
All of the source code is completely free and open, available on <a href="https://github.com/beautify-web/js-beautify">GitHub</a> under MIT licence,
<br>and we have a command-line version, python library and a <a href="https://npmjs.org/package/js-beautify">node package</a> as well.
</p>
</div>
<table id="options">
    <tr>
    <td>
    <select name="tabsize" id="tabsize">
    <option value="1">Indent with a tab character</option>
<option value="2">Indent with 2 spaces</option>
</select>
</td>
<td>
<input class="checkbox" type="checkbox" id="break-chained-methods">
    <label for="break-chained-methods">Break lines on chained methods?</label>
<br>
<input class="checkbox" type="checkbox" id="unescape-strings">
    <label for="unescape-strings">Unescape printable chars encoded as \xNN or \uNNNN?</label>
<br>
<input class="checkbox" type="checkbox" id="indent-inner-html">
    <label for="indent-inner-html">Indent &lt;head&gt; and &lt;body&gt; sections?</label>
<br><a href="?without-codemirror" class="turn-off-codemirror">Use a simple textarea for code input?</a>
</td>
</tr>
</table>
<script>
var _gaq = [
    ['_trackPageview']
];
(function (d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = '//www.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g, s);
}(document, 'script'));
</script>
</body>
</html>
*/
        });
        var expected = hereDoc(function() {/*!
<!DOCTYPE html>
<html>
  <!--
  -->
  <head>
    <!-- if you feel an urge to move this to bootstrap or something, you're most welcome -->
    <meta charset="utf-8">
    <title>Online JavaScript beautifier</title>
    <link rel="icon" href="web/favicon.png" type="image/png">
    <script src="web/third-party/codemirror/mode/javascript/javascript.js"></script>
    <style>
      body {
        background: #eee;
        color: #333;
      }
      a.self {
        font-weight: bold;
        border-bottom: 1px solid #aaa
      }
      p, select, label, .blurb, a.turn-off-codemirror {
        font:13px/1.231 arial, sans-serif;
        *font-size:small;
      }
      a.turn-off-codemirror {
        margin-left: 25px;
      }
      button.submit {
        width: 100%;
        padding: 10px 0;
      }
      button.submit em {
      }
      select {
        width: 220px;
      }
      table#options {
        float: right;
      }
      .col-6 {
        width: 50%;
        float: left;
      }
      #about p {
        margin: 0 6px 6px 0;
      }
      .uses li.sep {
        margin-top: 8px;
      }
    </style>
    <script>
      var the = {
        use_codemirror: (!window.location.href.match(/without-codemirror/)),
        beautify_in_progress: false,
        editor: null // codemirror editor
      };
      function run_tests() {
        var st = new SanityTest();
        Urlencoded.run_tests(st);
        var results = st.results_raw()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/ /g, '&nbsp;');
        $('#testresults').html(results).show();
      }
      function read_settings_from_cookie() {
        $('#detect-packers').prop('checked', $.cookie('detect-packers') !== 'off');
        $('#break-chained-methods').prop('checked', $.cookie('break-chained-methods') === 'on');
        $('#space-before-conditional').prop('checked', $.cookie('space-before-conditional') !== 'off');
        $('#end-with-newline').prop('checked', $.cookie('end-with-newline') === 'on');
        $('#comma-first').prop('checked', $.cookie('comma-first') === 'on');
        $('#e4x').prop('checked', $.cookie('e4x') === 'on');
      }
      comment = '',
      unpacked = '',
      found = false;
      do {
        if (/^\s*\//.test(source)) {
          source = source.substr(comment.length).replace(/^\s+/, '');
          trailing_comments += comment + "\n";
        } else if (/^\s*\/\//.test(source)) {
          comment = source.match(/^\s*\//)[0];
          source = source.substr(comment.length).replace(/^\s+/, '');
        }
      } while (found);
    </script>
  </head>
  <body>
    <div id="about">
      <p>
        <a class="self" href="./">Beautify, unpack or deobfuscate JavaScript and HTML, make JSON/JSONP readable, etc.</a>
      </p>
      <p>
        All of the source code is completely free and open, available on <a href="https://github.com/beautify-web/js-beautify">GitHub</a> under MIT licence,
        <br>and we have a command-line version, python library and a <a href="https://npmjs.org/package/js-beautify">node package</a> as well.
      </p>
    </div>
    <table id="options">
      <tr>
        <td>
          <select name="tabsize" id="tabsize">
            <option value="1">Indent with a tab character</option>
            <option value="2">Indent with 2 spaces</option>
          </select>
        </td>
        <td>
          <input class="checkbox" type="checkbox" id="break-chained-methods">
          <label for="break-chained-methods">Break lines on chained methods?</label>
          <br>
          <input class="checkbox" type="checkbox" id="unescape-strings">
          <label for="unescape-strings">Unescape printable chars encoded as \xNN or \uNNNN?</label>
          <br>
          <input class="checkbox" type="checkbox" id="indent-inner-html">
          <label for="indent-inner-html">Indent &lt;head&gt; and &lt;body&gt; sections?</label>
          <br><a href="?without-codemirror" class="turn-off-codemirror">Use a simple textarea for code input?</a>
        </td>
      </tr>
    </table>
    <script>
      var _gaq = [
        ['_trackPageview']
      ];
      (function (d, t) {
        var g = d.createElement(t),
          s = d.getElementsByTagName(t)[0];
        g.src = '//www.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s);
      }(document, 'script'));
    </script>
  </body>
</html>
*/
        });
        var actual = indent.indentHTML(input, '  ');
        expect(actual).toEqual(expected);
    });
});

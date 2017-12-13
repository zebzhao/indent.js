;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.indent = factory();
  }
}(this, function() {
var indent = (function () {
  var rulesCache = {};

  function filterRules(language, rules) {
    if (rulesCache[language])
      return rulesCache[language];
    var ret = [];
    rulesCache[language] = ret;
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].langs.indexOf(language.toLowerCase()) != -1)
        ret.push(rules[i]);
    }
    return ret;
  }

  var NEW_LINE_REGEX = /\r*\n/;
  var SEMICOLON = /;/;

  /**
   * indent - whether rule will cause indent
   * ignore - ignore further rule matching as long as this is last active rule, e.g. string, comments
   * advance - advance the cursor to the end of the endTokens
   * endTokenIndent - keep the indent rule active for the endTokens
   * head - match at beginning of line only
   * langs - used to filter by language later
   * lineOffset - added to the line field when rule is applied
   * lastRule - used to continue a previous rule
   * countdown - terminate rule after this number of lines
   *
   * Always keep NEW_LINE_REGEX endToken as last element,
   * as otherwise it will be matched first, and subsequent ones may be ignored
   * and skipped permanently by other rules.
   */
  var masterRules = [
    {
      langs: "html",
      name: "comment",
      startToken: [/\<\!\-\-/],
      endToken: [/\-\-\>/],
      ignore: true,
      advance: true
    },
    {
      langs: "html",
      name: "doctype",
      startToken: [/\<\!doctype html>/i],
      endToken: [NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "html",
      name: "link|br|hr|input|img|meta",
      startToken: [/\<(link|br|hr|input|img|meta)/i],
      endToken: [/>/],
      advance: true
    },
    {
      langs: "html",
      name: "mode switch js",
      startToken: [function (string) {
        var start = /<script[\s>].*/i;
        var end = /<\/script>/i;
        var startMatch = start.exec(string);
        var endMatch = end.exec(string);

        if (startMatch && (!endMatch || endMatch.index < startMatch.index)) {
          return {
            matchIndex: startMatch.index,
            length: startMatch[0].length
          };
        }
        return {matchIndex: -1};
      }],
      endToken: [/<\/script>/i],
      rules: "js",
      advance: true,
      indent: true
    },
    {
      langs: "html",
      name: "mode switch css",
      startToken: [function (string) {
        var start = /<style[\s>].*/i;
        var end = /<\/style>/i;
        var startMatch = start.exec(string);
        var endMatch = end.exec(string);

        if (startMatch && (!endMatch || endMatch.index < startMatch.index)) {
          return {
            matchIndex: startMatch.index,
            length: startMatch[0].length
          };
        }
        return {matchIndex: -1};
      }],
      endToken: [/<\/style>/i],
      rules: "css",
      advance: true,
      indent: true
    },
    {
      langs: "html",
      name: "close-tag",
      startToken: [/<\/[A-Za-z0-9\-]+>/],
      endToken: [/./],
      indent: true
    },
    {
      langs: "html",
      name: "tag attr",
      startToken: [/<[A-Za-z0-9\-]+/],
      endToken: [/>/],
      indent: true
    },
    {
      langs: "html",
      name: "tag",
      startToken: [/>/],
      endToken: [/<\/[A-Za-z0-9\-]+>/],
      indent: true,
      advance: true
    },
    {
      langs: "js",
      name: "line comment",
      startToken: [/\/\//],
      endToken: [NEW_LINE_REGEX],
      ignore: true
    },
    {
      langs: "js css",
      name: "block comment",
      startToken: [/\/\*/],
      endToken: [/\*\//],
      ignore: true
    },
    {
      langs: "js",
      name: "regex",
      startToken: [function (string, rule) {
        var re = /[(,=:[!&|?{};][\s]*\/[^/]|^[\s]*\/[^/]/;
        var startIndex = string.search(re);
        if (startIndex != -1) {
          startIndex = string.indexOf('/', startIndex);
          var substr = string.substring(startIndex + 1);
          var match = searchAny(substr, rule.endToken, rule);
          if (match.matchIndex != -1) {
            substr = substr.substring(0, match.matchIndex);
            try {
              (new RegExp(substr));
              return {
                matchIndex: startIndex,
                length: 1
              };
            }
            catch (e) {
              return {matchIndex: -1};
            }
          }
        }
        return {matchIndex: -1};
      }],
      endToken: [function (string) {
        var fromIndex = 0;
        var index = string.indexOf('/');
        while (index != -1) {
          try {
            (new RegExp(string.substring(0, index)));
            break;
          }
          catch (e) {
            index = string.indexOf('/', fromIndex);
            fromIndex = index + 1;
          }
        }
        return {
          matchIndex: index,
          length: index == -1 ? 0 : 1
        };
      }],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      startToken: [/\"/],
      endToken: [/\"/, NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      startToken: [/\'[^']/],
      endToken: [/[^\\]\'/, NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      startToken: [/\`[^`]/],
      endToken: [/[^\\]\`/],
      ignore: true,
      advance: true
    },
    {
      langs: "js",
      name: "if",
      startToken: [/^if[\s]*(?=\()/, /[\s]+if[\s]*(?=\()/],
      endToken: [/else[\s]+/, /\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js",
      name: "for",
      startToken: [/^for[\s]*(?=\()/],
      endToken: [/\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js",
      name: "else",
      startToken: [/else[\s]+/],
      endToken: [/if/, /\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js css",
      name: "bracket",
      startToken: [/\([\s]*(var)?/],
      endToken: [/\)/],
      indent: true,
      advance: true
    },
    {
      langs: "js",
      name: "dot-chain",
      startToken: [/^\../],
      endToken: [SEMICOLON, NEW_LINE_REGEX],
      indent: true,
      head: true,
      lineOffset: -1
    },
    {
      langs: "js",
      name: "dot-chain",
      startToken: [/\.\s*$/],
      endToken: [function (string) {
        return {
          matchIndex: string.length ? 1 : -1,
          length: string.length ? 0 : 1
        };
      }],
      indent: true
    },
    {
      langs: "js css",
      name: "array",
      startToken: [/\[/],
      endToken: [/]/],
      indent: true,
      advance: true
    },
    {
      langs: "js css",
      name: "block",
      startToken: [/\{/],
      endToken: [/}/],
      indent: true,
      advance: true
    },
    {
      langs: "js",
      name: "var/let/const",
      startToken: [/(var|let|const)[\s]*$/],
      endToken: [/./],
      indent: true,
      endTokenIndent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      startToken: [/(var|let|const)[\s]+[\w$]+/],
      endToken: [/./]
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: "var/let/const",
      startToken: [/,[\s]*\r*\n$/],
      endToken: [/./],
      endTokenIndent: true,
      indent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: "var/let/const",
      startToken: [/^,/],
      endToken: [/./],
      head: true,
      indent: true,
      lineOffset: -1
    },
    {
      langs: "js",
      name: "case",
      startToken: [/^case[\s]+/],
      endToken: [/break[\s;]+/, /^case[\s]+/, /^default[\s]+/, /^return([\s]+|;)/, /}/],
      endTokenIndent: true,
      indent: true
    },
    {
      langs: "js",
      name: "default",
      startToken: [/^default[\s]*:/],
      endToken: [/break[\s;]+/, /^case[\s]+/, /^default[\s]+/, /^return([\s]+|;)/, /}/],
      endTokenIndent: true,
      indent: true
    },
    {
      langs: "js",
      name: "semicolon",
      startToken: [SEMICOLON],
      endToken: [/./]
    }
  ];

  var cssRules = filterRules('css', masterRules),
      jsRules = filterRules('js', masterRules),
      htmlRules = filterRules('html', masterRules);

  var exports = {
    css: function (code, tabString) {
      return indent(code || '', cssRules, tabString === undefined ? '\t' : tabString);
    },
    js: function (code, tabString) {
      return indent(code || '', jsRules, tabString === undefined ? '\t' : tabString);
    },
    html: function (code, tabString) {
      return indent(code || '', htmlRules, tabString === undefined ? '\t' : tabString);
    },
    /**
     * @deprecated Since version 0.2.0. Will be deleted in version 0.3.0. Use js instead.
     */
    indentJS: function (code, indentString) {
      if (console && console.warn) console.warn("Calling deprecated function!");
      return exports.js(code, indentString);
    },
    /**
     * @deprecated Since version 0.2.0. Will be deleted in version 0.3.0. Use css instead.
     */
    indentCSS: function (code, indentString) {
      if (console && console.warn) console.warn("Calling deprecated function!");
      return exports.css(code, indentString);
    },
    /**
     * @deprecated Since version 0.2.0. Will be deleted in version 0.3.0. Use html instead.
     */
    indentHTML: function (code, indentString) {
      if (console && console.warn) console.warn("Calling deprecated function!");
      return exports.html(code, indentString);
    }
  };

  return exports;


  function indent(code, baseRules, indentation) {
    var lines = code.split(/[\r]?\n/gi);
    var lineCount = lines.length;
    var newLines = [];
    var indentBuffer = [];
    var activeRules = [];
    var activeCountdowns = [];
    var currentRule;
    var currentCountdown;
    var lastInactiveRule;
    var indents = 0;
    var l = 0;
    var pos = 0;
    var matchEnd, matchStart;
    var modeRules = null;

    while (l < lineCount) {
      var line = lines[l].trim();
      var lineToMatch = cleanEscapedChars(line) + '\r\n';

      matchStart = matchStartRule(lineToMatch, modeRules || baseRules, pos);

      if (activeRules.length) {
        matchEnd = matchEndRule(lineToMatch, currentRule, pos);
        if (matchEnd.matchIndex == -1) {
          if (currentRule.ignore) {
            // last rule is still active, and it's telling us to ignore.
            incrementLine();
            continue;
          } else if (currentCountdown) {
            currentCountdown--;
            if (currentCountdown === 0) {
              removeCurrentRule();
            }
          }
        }
        else if (
          currentRule.ignore ||
          matchStart.matchIndex == -1 ||
          matchEnd.matchIndex <= matchStart.matchIndex) {
          removeCurrentRule();
          pos = matchEnd.cursor;
          continue;  // Repeat process for matching line start/end
        }
      }

      if (matchStart.matchIndex != -1) {
        implementRule(matchStart);
      }
      else {
        // No new token match end, no new match start
        incrementLine();
      }
    }

    return newLines.join('\r\n');

    function implementRule(match) {
      pos = match.cursor;
      currentRule = match.rule;
      currentCountdown = match.countdown;
      activeRules.push(currentRule);
      activeCountdowns.push(currentRule.countdown);
      if (currentRule.indent) {
        incrementIndentation(currentRule.lineOffset);
      }
      if (currentRule.rules) {
        modeRules = filterRules(currentRule.rules);
      }
      if (currentRule.debug) {
        debugger;
      }
    }

    function removeCurrentRule() {
      if (currentRule.indent) {
        consumeIndentation();
        if (!currentRule.endTokenIndent && matchEnd.matchIndex == 0) {
          calculateIndents();
        }
      }
      if (currentRule.rules) {
        modeRules = null;
      }
      activeRules.pop();
      activeCountdowns.pop();
      lastInactiveRule = currentRule;
      currentRule = activeRules[activeRules.length - 1];
      currentCountdown = activeCountdowns[activeCountdowns.length - 1];
    }

    function calculateIndents() {
      indents = 0;
      for (var b, i = 0; i < indentBuffer.length; i++) {
        b = indentBuffer[i];
        if (b.open && b.line != l)
          indents++;
      }
    }

    function incrementLine() {
      newLines[l] = repeatString(indentation, indents) + line;
      l++;
      pos = 0;
      calculateIndents();
    }

    function incrementIndentation(lineOffset) {
      var matched = indentBuffer[indentBuffer.length - 1];
      if (matched && matched.line == l) {
        matched.indent++;
      }
      else {
        indentBuffer.push({
          indent: 1,
          open: true,
          line: lineOffset ? l + lineOffset : l
        });
        if (lineOffset < 0) calculateIndents();
      }
    }

    function consumeIndentation() {
      var lastElem = indentBuffer[indentBuffer.length - 1];
      if (lastElem) {
        lastElem.open = l == lastElem.line;
        if (--lastElem.indent <= 0) {
          indentBuffer.pop();
        }
      }
    }

    function matchStartRule(string, rules, index) {
      string = string.substring(index, string.length);
      var result = null;
      var minIndex = string.length;
      var minMatch;
      var match;
      for (var rule, r = 0; r < rules.length; r++) {
        rule = rules[r];
        if (!rule.lastRule ||
            (lastInactiveRule && lastInactiveRule.name === rule.lastRule)
        ) {
          match = searchAny(string, rule.startToken, rule);
          if (match.matchIndex != -1 && match.matchIndex < minIndex
            && (!rule.head || index == 0)) {
            minIndex = match.matchIndex;
            minMatch = match;
            result = rule;
          }
        }
      }
      return {
        rule: result,
        matchIndex: result ? minIndex + index : -1,
        cursor: result ? minIndex + index + minMatch.matchLength : -1
      };
    }

  }

  function repeatString(baseString, repeat) {
    return (new Array(repeat + 1)).join(baseString);
  }

  function cleanEscapedChars(string) {
    return string.replace(/\\(u[0-9A-Za-z]{4}|u\{[0-9A-Za-z]{1,6}]\}|x[0-9A-Za-z]{2}|.)/g, '0');
  }
  
  function matchEndRule(string, rule, offset) {
    string = string.substr(offset, string.length);
    var match = searchAny(string, rule.endToken, rule);
    var cursor = rule.advance ? match.matchIndex + match.matchLength : match.matchIndex;
    return {
      matchIndex: match.matchIndex == -1 ? -1 : match.matchIndex + offset,
      cursor: cursor == -1 ? -1 : cursor + offset
    };
  }

  function searchAny(string, patterns, rule) {
    var index = -1;
    var length = 0;
    for (var pat, p = 0; p < patterns.length; p++) {
      pat = patterns[p];
      if (typeof pat == 'function') {
        var match = pat(string, rule);
        index = match.matchIndex;
        length = match.length;
      }
      else {
        index = string.search(pat);
        if (index != -1) {
          length = string.match(pat)[0].length;
          break;
        }
      }
    }
    return {
      matchIndex: index,
      matchLength: length,
      cursor: index + length,
      patternIndex: p
    };
  }
}());

return indent;
}));

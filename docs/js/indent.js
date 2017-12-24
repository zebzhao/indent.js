var indent = (function (root) {
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
   * Soft dedent: this type of dedent has the opposite effect and will actually indent every line
   * starting from the opening line.
   */

  /**
   * indent - whether rule will cause indent
   * ignore - ignore further rule matching as long as this is last active rule, e.g. string, comments
   * advance - advance the cursor to the end of the ends
   * endsIndent - keep the indent rule active for the ends
   * ends - list of regex to terminate the rule
   * starts - list of regex to start the rule
   * head - match at beginning of line only
   * langs - used to filter by language later
   * lineOffset - added to the line field when rule is applied
   * lastRule - used to continue a previous rule
   * countdown - terminate rule after this number of lines
   * scope - used to determine if rule creates a new scope, used for lastRule
   *
   * Always keep NEW_LINE_REGEX ends as last element,
   * as otherwise it will be matched first, and subsequent ones may be ignored
   * and skipped permanently by other rules.
   */
  var masterRules = [
    {
      langs: "html",
      name: "comment",
      starts: [/\<\!\-\-/],
      ends: [/\-\-\>/],
      ignore: true,
      advance: true
    },
    {
      langs: "html",
      name: "doctype",
      starts: [/\<\!doctype html>/i],
      ends: [NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "html",
      name: "link|br|hr|input|img|meta",
      starts: [/\<(link|br|hr|input|img|meta)/i],
      ends: [/>/],
      advance: true
    },
    {
      langs: "html",
      name: "mode switch js",
      starts: [function (string) {
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
        return null;
      }],
      ends: [/<\/script>/i],
      rules: "js",
      advance: true,
      indent: true,
      scope: true
    },
    {
      langs: "html",
      name: "mode switch css",
      starts: [function (string) {
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
        return null;
      }],
      ends: [/<\/style>/i],
      rules: "css",
      advance: true,
      indent: true,
      scope: true
    },
    {
      langs: "html",
      name: "close-tag",
      starts: [/<\/[A-Za-z0-9\-]+>/],
      ends: [/./],
      indent: true
    },
    {
      langs: "html",
      name: "tag-attr",
      starts: [/<[A-Za-z0-9\-]+/],
      ends: [/>/],
      indent: true
    },
    {
      langs: "html",
      name: "tag",
      starts: [/>/],
      ends: [/<\/[A-Za-z0-9\-]+>/],
      indent: true,
      advance: true
    },
    {
      langs: "js",
      name: "line-comment",
      starts: [/\/\//],
      ends: [NEW_LINE_REGEX],
      ignore: true
    },
    {
      langs: "js css",
      name: "block-comment",
      starts: [/\/\*/],
      ends: [/\*\//],
      ignore: true
    },
    {
      langs: "js",
      name: "regex",
      starts: [function (string, rule) {
        var re = /[(,=:[!&|?{};][\s]*\/[^/]|^[\s]*\/[^/]/;
        var startIndex = string.search(re);
        if (startIndex != -1) {
          startIndex = string.indexOf('/', startIndex);
          var substr = string.substring(startIndex + 1);
          var match = searchAny(substr, rule.ends, rule);
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
              return null;
            }
          }
        }
        return null;
      }],
      ends: [function (string) {
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
        return index == -1 ? null : {
          matchIndex: index,
          length: 1
        };
      }],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      starts: [/\"/],
      ends: [/\"/, NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      starts: [/\'[^']/],
      ends: [/[^\\]\'/, NEW_LINE_REGEX],
      ignore: true,
      advance: true
    },
    {
      langs: "js css html",
      name: "string",
      starts: [/\`[^`]/],
      ends: [/[^\\]\`/],
      ignore: true,
      advance: true
    },
    {
      langs: "js",
      name: "if",
      starts: [/^if[\s]*(?=\()/, /[\s]+if[\s]*(?=\()/],
      ends: [/else[\s]+/, /\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js",
      name: "for",
      starts: [/^for[\s]*(?=\()/],
      ends: [/\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js",
      name: "else",
      starts: [/else[\s]+/],
      ends: [/if/, /\{/, SEMICOLON],
      countdown: 2,
      indent: true
    },
    {
      langs: "js css",
      name: "bracket",
      starts: [/\([\s]*(var)?/],
      ends: [/\)/],
      indent: true,
      advance: true,
      scope: true
    },
    {
      langs: "js",
      name: "dot-chain",
      starts: [/^\.[A-Za-z$_]/],
      ends: [/\./],
      indent: true,
      head: true,
      lineOffset: -1
    },
    {
      langs: "js",
      name: "dot-chain",
      starts: [/\.\s*\r*\n/],
      ends: [/[^\s]\s*\r*\n/],
      indent: true
    },
    {
      langs: "js css",
      name: "array",
      starts: [/\[/],
      ends: [/]/],
      indent: true,
      advance: true,
      scope: true
    },
    {
      langs: "js css",
      name: "block",
      starts: [/\{/],
      ends: [/}/],
      indent: true,
      advance: true,
      scope: true
    },
    {
      langs: "js",
      name: "var/let/const",
      starts: [/(var|let|const)[\s]*\r*\n/],
      ends: [nonWhitespaceFollowByNewline],
      indent: true,
      endsIndent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      starts: [/(var|let|const)\s+[\w$]+/],
      ends: [/[,;=]/, nonWhitespaceFollowByNewline],
      indent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: ["var/let/const", "="],
      starts: [/,[\s]*\r*\n/],
      ends: [/,/, nonWhitespaceFollowByNewline],
      indent: true,
      callback: postIndentForCommaAfterEqual
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: ["var/let/const", "="],
      starts: [/^,/],
      ends: [/,/, nonWhitespaceFollowByNewline],
      head: true,
      indent: true,
      lineOffset: -1,
      callback: postIndentForCommaAfterEqual
    },
    {
      langs: "js",
      name: "=",
      starts: [/=/],
      ends: [/[,;]/, NEW_LINE_REGEX]
    },
    {
      langs: "js",
      name: "case",
      starts: [/^case[\s]+/],
      ends: [/break[\s;]+/, /^case[\s]+/, /^default[\s]+/, /^return([\s]+|;)/, /}/],
      endsIndent: true,
      indent: true,
      scope: true
    },
    {
      langs: "js",
      name: "default",
      starts: [/^default[\s]*:/],
      ends: [/break[\s;]+/, /^case[\s]+/, /^default[\s]+/, /^return([\s]+|;)/, /}/],
      endsIndent: true,
      indent: true,
      scope: true
    },
    {
      langs: "js",
      name: "semicolon",
      starts: [SEMICOLON],
      ends: [/./]
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
    /**
     * Algorithm assumptions
     *
     * indentDeltas - store the the deltas in indentation
     *              - can be manipulated directly to alter the indentation
     * indentBuffer - used to keep tabs on the number of open indentations on each line
     * dedentBuffer - each line in the buffer has an array storing open indent lines to be closed
     *              - an array of numbers is used to reference the opening line
     *              - a negative number is used to signify a soft dedent (see note about soft dedent)
     *
     * Each line can create at most 1 indentation.
     * When a line is 'used up' for dedent, it cannot be used again, hence the indentBuffer.
     */
    var lines = code.split(/[\r]?\n/gi);
    var lineCount = lines.length;
    var indentBuffer = intArray(lineCount);
    var dedentBuffer = arrayOfArrays(lineCount);
    var activeMatches = [];
    var lastMatches= [null];
    var currentCountdown;
    var l = 0;
    var pos = 0;
    var matchEnd, matchStart;
    var modeRules = null;

    while (l < lineCount) {
      var line = lines[l].trim();
      var lineToMatch = cleanEscapedChars(line) + '\r\n';

      matchStart = matchStartRule(lineToMatch, modeRules || baseRules, pos);

      if (activeMatches.length) {
        var activeMatch = activeMatches[activeMatches.length-1];
        matchEnd = matchEndRule(lineToMatch, activeMatch, pos);
        if (matchEnd.matchIndex == -1) {
          if (activeMatch.rule.ignore) {
            // last rule is still active, and it's telling us to ignore.
            l++; pos = 0;
            continue;
          } else if (currentCountdown) {
            currentCountdown--;
            if (currentCountdown === 0) {
              removeCurrentRule();
            }
          }
        }
        else if (
          activeMatch.rule.ignore ||
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
        l++; pos = 0;
      }
    }

    console.log(dedentBuffer);
    console.log(indentBuffer);

    var
      hardIndentCount,
      dedentLines, dedentLine, dedents,
      i, j, indents = 0,
      hardIndents = indentBuffer.slice(),
      indentDeltas = intArray(lineCount),
      newLines = [];

    for (i=0; i<lineCount; i++) {
      dedentLines = dedentBuffer[i];
      dedents = 0;
      for (j=0; j<dedentLines.length; j++) {
        dedentLine = dedentLines[j];
        if (dedentLine < 0) {
          indentDeltas[-dedentLine]++;
          dedents += 1;
        }
        else if (hardIndents[dedentLine] > 0) {
          hardIndents[dedentLine]--;
          dedents += dedentLine !== i;
        }
      }
      hardIndentCount = hardIndents[i];
      indentDeltas[i] = hardIndentCount > dedents ? 1 :
        (hardIndentCount < dedents ? hardIndentCount - dedents : 0);
      hardIndents[i] = hardIndentCount > 0 ? 1 : 0;
    }

    for (i=0; i<lineCount; i++) {
      indents += indentDeltas[i] || 0;
      newLines.push((indents > 0 ? repeatString(indentation, indents) : '') + lines[i].trim());
    }

    console.log(hardIndents);
    console.log(indentDeltas);

    return newLines.join('\r\n');


    function implementRule(match) {
      pos = match.cursor;
      currentCountdown = match.countdown;

      var rule = match.rule;
      var line = (l + 1) + (rule.lineOffset || 0);
      match.line = line;
      activeMatches.push(match);

      if (rule.debug) {
        debugger;
      }
      if (rule.indent) {
        indentBuffer[line]++;
      }
      if (rule.rules) {
        modeRules = filterRules(rule.rules);
      }
      if (rule.scope) {
        lastMatches.push(null);
      }
      if (rule.callback) {
        debugger
        rule.callback(match, indentBuffer, dedentBuffer);
      }
    }

    function removeCurrentRule() {
      var match = activeMatches.pop(),
        line = match.line,
        rule = match.rule;
      if (rule.debug) {
        debugger;
      }
      if (rule.indent) {
        var offset = !rule.endsIndent && matchEnd.matchIndex === 0 ? 0 : 1;
        dedentBuffer[l + offset].push(line);
      }
      if (rule.rules) {
        modeRules = null;
      }
      if (rule.scope) {
        lastMatches.pop();
      }
      lastMatches[lastMatches.length - 1] = match;
      currentCountdown = activeMatches.length ? activeMatches[activeMatches.length - 1].rule.countdown : 0;
    }

    function matchStartRule(string, rules, index) {
      string = string.substring(index, string.length);
      var result = null;
      var minIndex = string.length;
      var minMatch;
      var match;

      var lastMatch = lastMatches[lastMatches.length - 1];
      var lastRuleInScope = lastMatch ? lastMatch.rule.name : '';

      for (var rule, r = 0; r < rules.length; r++) {
        rule = rules[r];
        if (!rule.lastRule ||
            (lastRuleInScope && rule.lastRule.indexOf(lastRuleInScope) !== -1)
        ) {
          match = searchAny(string, rule.starts, rule);
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
        cursor: result ? index + minMatch.cursor : -1,
        state: match.state,
        lastMatch: lastMatch
      };
    }
  }

  function arrayOfArrays(length) {
    var array = new Array(length);
    for (var i=0; i<length; i++) array[i] = [];
    return array;
  }

  function intArray(length) {
    if (root.Int16Array) {
      return new Int16Array(length);
    } else {
      var array = new Array(length);
      for (var i=0; i<length; i++) array[i] = 0;
      return array;
    }
  }

  function repeatString(baseString, repeat) {
    return (new Array(repeat + 1)).join(baseString);
  }

  function cleanEscapedChars(string) {
    return string.replace(/\\(u[0-9A-Za-z]{4}|u\{[0-9A-Za-z]{1,6}]\}|x[0-9A-Za-z]{2}|.)/g, '0');
  }

  function postIndentForCommaAfterEqual(match, indentBuffer, dedentBuffer) {
    var lastMatch = match.lastMatch;
    if (lastMatch && lastMatch.rule.name === "=") {
      dedentBuffer[match.line].push(-lastMatch.line);
    }
  }

  function nonWhitespaceFollowByNewline(string, rule, state) {
    if (rule.debug) {
      debugger
    }
    if (!state.newline) {
      state.newline = string.search(/[^\s\r\n]/) !== -1;
    } else {
      var index = string.search(/[;,=]?\r*\n/);
      if (index !== -1) {
        return {
          matchIndex: index,
          length: 1
        }
      }
    }
    return null;
  }
  
  function matchEndRule(string, active, offset) {
    string = string.substr(offset, string.length);
    var rule = active.rule;
    var match = searchAny(string, rule.ends, rule, active.state);
    var cursor = rule.advance ? match.cursor : match.matchIndex;
    return {
      matchIndex: match.matchIndex === -1 ? -1 : match.matchIndex + offset,
      cursor: cursor == -1 ? -1 : cursor + offset,
      state: match.state
    };
  }

  function searchAny(string, patterns, rule, state) {
    state = state || {};

    var index = -1,
      length = 0,
      match;

    for (var pat, p = 0; p < patterns.length; p++) {
      pat = patterns[p];
      if (typeof pat == 'function') {
        match = pat(string, rule, state);
        if (match) {
          index = match.matchIndex;
          length = match.length;
          break;
        }
      }
      else {
        match = string.match(pat);
        if (match) {
          index = string.search(pat);
          length = match[0].length;
          break;
        }
      }
    }
    return {
      matchIndex: index,
      cursor: index + length,
      state: state
    };
  }
}(this));

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
   * matchLineIndent - line must have existing indent, otherwise no indent
   * ignore - ignore further rule matching as long as this is last active rule, e.g. string, comments
   * advance - advance the cursor to the end of the ends
   * endsIndent - keep the indent rule active for the ends
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
        return {matchIndex: -1};
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
        return {matchIndex: -1};
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
              return {matchIndex: -1};
            }
          }
        }
        return {matchIndex: -1};
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
      ends: [NEW_LINE_REGEX],
      indent: true,
      head: true,
      lineOffset: -1
    },
    {
      langs: "js",
      name: "dot-chain",
      starts: [/\.\s*$/],
      ends: [/[\w$]/],
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
      starts: [/(var|let|const)[\s]*\r*\n$/],
      ends: [/[\w$]/],
      indent: true,
      endsIndent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      starts: [/(var|let|const)[\s]+[\w$]+/],
      ends: [/./]
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: ["var/let/const", "="],
      starts: [/,[\s]*\r*\n$/],
      ends: [/./],
      endsIndent: true,
      indent: true
    },
    {
      langs: "js",
      name: "var/let/const",
      lastRule: ["var/let/const", "="],
      starts: [/^[,=]/],
      ends: [/[,=]/, NEW_LINE_REGEX],
      head: true,
      indent: true,
      lineOffset: -1
    },
    {
      langs: "js",
      name: "=",
      starts: [/=/],
      ends: [/[,=]/, NEW_LINE_REGEX],
      indent: true,
      matchLineIndent: true,
      debug: true
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
     * indentBuffer - used to keep tabs on which lines have open indentation, reset to 0 when closed
     *              - should be all 0s at the end of each run ideally, can be used to detect errors
     * activeRuleLines - used to store the active rule's indentation line (this is with offset)
     *                 - used to keep track of lines for later reference in indentBuffer when dedenting
     *
     * Each line can create at most 1 indentation.
     * When a line is 'used up' for dedent, it cannot be used again, hence the indentBuffer.
     */
    var lines = code.split(/[\r]?\n/gi);
    var lineCount = lines.length;
    var indentDeltas = [];
    var indentBuffer = [];
    var activeRules = [];
    var activeRuleLines = [];
    var lastRules= [null];
    var activeCountdowns = [];
    var currentRule;
    var currentCountdown;
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

    var
      indents = 0,
      newLines = [];

    for (var i=0; i<lines.length; i++) {
      indents += indentDeltas[i] || 0;
      newLines.push((indents > 0 ? repeatString(indentation, indents) : '') + lines[i].trim());
    }

    console.log(indentDeltas);
    console.log(indentBuffer);

    return newLines.join('\r\n');


    function implementRule(match) {
      pos = match.cursor;
      currentRule = match.rule;
      currentCountdown = match.countdown;

      var line = l + (currentRule.lineOffset || 0);
      activeRuleLines.push(line);
      activeRules.push(currentRule);
      activeCountdowns.push(currentRule.countdown);

      if (currentRule.debug) {
        debugger;
      }
      if (currentRule.indent) {
        // var hasLineIndent = (indentBuffer[l] || 0) > 0;
        // if (!currentRule.matchLineIndent || hasLineIndent) {
          incrementIndentation(line + 1);
          indentBuffer[line] = indentBuffer[line] || 0;
          indentBuffer[line]++;
        // }
      }
      if (currentRule.rules) {
        modeRules = filterRules(currentRule.rules);
      }
      if (currentRule.scope) {
        lastRules.push(null);
      }
    }

    function removeCurrentRule() {
      var line = activeRuleLines.pop();
      if (currentRule.debug) {
        debugger;
      }
      if (currentRule.indent) {
        // consume indentation
        var matchingIndent = indentBuffer[line] || 0;
        if (matchingIndent > 0) {
          // If matching line indent, it means another rule uses the same line
          if (!currentRule.matchLineIndent) indentBuffer[line] = 0;
          var offset = !currentRule.endsIndent && matchEnd.matchIndex === 0 ? 0 : 1;
          decrementIndentation(l + offset);
        }
      }
      if (currentRule.rules) {
        modeRules = null;
      }
      if (currentRule.scope) {
        lastRules.pop();
      }
      activeRules.pop();
      activeCountdowns.pop();
      lastRules[lastRules.length - 1] = currentRule;
      currentRule = activeRules[activeRules.length - 1];
      currentCountdown = activeCountdowns[activeCountdowns.length - 1];
    }

    function incrementLine() {
      l++;
      pos = 0;
    }

    function incrementIndentation(line, force) {
      var indentsAtLine = indentDeltas[line] || 0;
      if (force || indentsAtLine < 0) {
        indentDeltas[line] = indentsAtLine + 1;
      }
      else if (indentsAtLine === 0) {
        indentDeltas[line] = 1;
      }
    }

    function decrementIndentation(line) {
      var indentsAtLine = indentDeltas[line] || 0;
      indentDeltas[line] = indentsAtLine - 1;
    }

    function matchStartRule(string, rules, index) {
      string = string.substring(index, string.length);
      var result = null;
      var minIndex = string.length;
      var minMatch;
      var match;
      var lastRuleInScope;
      for (var rule, r = 0; r < rules.length; r++) {
        rule = rules[r];
        lastRuleInScope = lastRules[lastRules.length - 1];
        if (!rule.lastRule ||
            (lastRuleInScope && rule.lastRule.indexOf(lastRuleInScope.name) !== -1)
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
    var match = searchAny(string, rule.ends, rule);
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

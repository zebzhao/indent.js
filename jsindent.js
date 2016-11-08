(function(exports) {
    exports.indenter = {
        indentCSS: indentJS,
        indentJS: indentJS,
        indentHTML: indentHTML
    };

    var NEW_LINE_REGEX = /\r*\n/;
    var jsRules = [
        {
            name: "line comment",
            startToken: [/$\/\//, /[^\\]\/\//],
            endToken: [NEW_LINE_REGEX],
            ignore: true,
            indent: false
        },
        {
            name: "block comment",
            startToken: [/\/\*/],
            endToken: [/\*\//],
            ignore: true,
            indent: false
        },
        {
            name: "regex",
            startToken: [function(string, rule) {
                var startIndex = string.indexOf('/');
                if (startIndex != -1) {
                    var substr = string.substring(startIndex);
                    var match = searchAny(substr, rule.endToken, rule);
                    if (match.matchIndex != -1) {
                        substr = substr.substring(match.cursor);
                        try {
                            eval(substr);
                            return startIndex;
                        }
                        catch(e) {
                            return -1;
                        }
                    }
                }
                return -1;
            }],
            endToken: [/[^\\]\//, /\\\\\//, /$\//, NEW_LINE_REGEX],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "string",
            startToken: [/\"/],
            endToken: [/\"/, NEW_LINE_REGEX],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "string",
            startToken: [/\'/],
            endToken: [/\'/, NEW_LINE_REGEX],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "string",
            startToken: [/\`/],
            endToken: [/\`/],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "if",
            startToken: [/^if[\s]*\([^\)]*\)[\s]*/],
            endToken: [/else/, /\{/, NEW_LINE_REGEX],
            indent: true
        },
        {
            name: "if",
            startToken: [/^if[\s]*\([^\)]*/],
            endToken: [/\)/],
            indent: true
        },
        {
            name: "else",
            startToken: [/else[\s]*/],
            endToken: [/if/, /\{/, NEW_LINE_REGEX],
            indent: true
        },
        {
            name: "bracket",
            startToken: [/\(/],
            endToken: [/\)/],
            indent: true,
            advance: true
        },
        {
            name: "array",
            startToken: [/\[/],
            endToken: [/\]/],
            indent: true,
            advance: true
        },
        {
            name: "bracket",
            startToken: [/\{/],
            endToken: [/\}/],
            indent: true,
            advance: true
        },
        {
            name: "var",
            startToken: [/var[\s]+/],
            endToken: [/\;/, /\=/],
            indent: true
        },
        {
            name: "case",
            startToken: [/case[\s]+[^:]*[\s]*\:/],
            endToken: [/break/, /case/, /default/, /}/],
            indent: true
        }
    ];

    var htmlRules = [
        {
            name: "comment",
            startToken: [/\<\!\-\-/],
            endToken: [/\-\-\>/],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "doctype",
            startToken: [/\<\!/],
            endToken: [NEW_LINE_REGEX],
            ignore: true,
            indent: false,
            advance: true
        },
        {
            name: "tag",
            startToken: [/<(\"[^\"]*\"|'[^']*'|[^'\">])*>/],
            endToken: [/\<\/[^\>]+\>/],
            indent: true,
            advance: true
        },
        {
            name: "tag",
            startToken: [/<(\"[^\"]*\"|'[^']*'|[^'\">])*/],
            endToken: [/\/\>/],
            indent: false,
            advance: true
        }
    ].concat(jsRules);

    function indentJS(code, indentString) {
        return indent(code, jsRules, indentString);
    }

    function indentHTML(code, indentString) {
        return indent(code, htmlRules, indentString);
    }

    function indent(code, rules, indentation) {
        var lines = code.split(/[\r]?\n/gi);
        var lineCount = lines.length;
        var newLines = [];
        var indents = 0;
        var indentAfter = 0;
        var activeRules = [];
        var lastRule;
        var l = 0;
        var pos = 0;
        var matchEnd, matchStart;

        while (l < lineCount) {
            var line = lines[l].trim()+'\r\n';

            matchStart = matchStartRule(line, rules, pos);

            if (activeRules.length) {
                matchEnd = matchEndRule(line, lastRule, pos);
                if (matchEnd.matchIndex == -1) {
                    if (lastRule.ignore) {
                        // last rule is still active, and it's telling us to ignore.
                        newLines[l] = getIndentation() + line;
                        incrementLine();
                        continue;
                    }
                }
                else if (lastRule.ignore || matchStart.matchIndex == -1 || matchEnd.matchIndex <= matchStart.matchIndex) {
                    if (matchEnd.matchIndex == 0 && lastRule.indent) {
                        indents--;
                    }
                    else if (lastRule.indent) {
                        indentAfter--;
                    }
                    pos = matchEnd.cursor;
                    removeLastRule();
                    continue;  // Repeat process for matching line start/end
                }
            }

            if (matchStart.matchIndex != -1) {
                implementRule(matchStart);
            }
            else {
                // No new token match end, no new match start
                newLines[l] = getIndentation() + line;
                incrementLine();
            }
        }

        return newLines.join("");

        function implementRule(match) {
            pos = match.cursor;
            lastRule = match.rule;
            activeRules.push(lastRule);
            if (lastRule.indent) indentAfter++;
        }

        function removeLastRule() {
            activeRules.pop();
            lastRule = activeRules[activeRules.length-1];
        }

        function getIndentation() {
            return (new Array(indents+1)).join(indentation);
        }

        function incrementLine() {
            l++;
            pos = 0;
            if (indentAfter) {
                indents += indentAfter;
                indentAfter = 0;
            }
        }
    }

    function matchStartRule(string, rules, index) {
        string = string.substring(index, string.length);
        var result = null;
        var minIndex = string.length;
        var minMatch;
        var match;
        for (var rule,r=0; r<rules.length; r++) {
            rule = rules[r];
            match = searchAny(string, rule.startToken, rule);
            if (match.matchIndex != -1 && match.matchIndex < minIndex) {
                minIndex = match.matchIndex;
                minMatch = match;
                result = rule;
            }
        }
        return {
            rule: result,
            matchIndex: result ? minIndex + index : -1,
            cursor: result ? minIndex + index + minMatch.matchLength : -1
        };
    }

    function matchEndRule(string, rule, offset) {
        string = string.substring(offset, string.length);
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
        for (var pat,p=0; p<patterns.length; p++) {
            pat = patterns[p];
            index = typeof pat == 'function' ? pat(string, rule) : string.search(pat);
            if (index != -1) {
                length = string.match(pat)[0].length;
                break;
            }
        }
        return {
            matchIndex: index,
            matchLength: length,
            patternIndex: p
        };
    }
})(this);


var code = `
function calculateDifficulty() {
      var learnedWords = w.ccmState.learnedWords.length;
      var difficulty = -Math.cos(Math.pow(learnedWords, 0.65)) + learnedWords/100 + 1;
        return {
          maxChars: learnedWords < 25 ? 3 : Math.log(difficulty+1)*2+3,
          frequencyCap: learnedWords < 100 ? 250 : learnedWords + Math.pow(difficulty+10, 2),
          separation: learnedWords < 30 ? Math.round(learnedWords/10)+1 : Math.round(difficulty)+2,
            moves: Math.round(Math.pow(difficulty+5, 0.5)*12 + Math.random())
            }
            }
            
            function findLinks(wd, degree, maxIndex) {
              var results;
              if (degree > 0) {
                var radicals = reFindAll(wd + '(.)', w.graphData, 1, maxIndex);
                var derived = reFindAll('(.)' + wd, w.graphData, 1, maxIndex);
                var joined = radicals.concat(derived);
                
                if (degree > 1) {
                  var sub = [];
                  for (var i;i<joined.length;i++) {
                    sub = sub.concat(findLinks(joined[i], degree-1));
                  }
                  joined = joined.concat(sub);
                }
                results = joined;
              }
              return results || [];
            }
            
            function reFindAll(pattern, s, g, maxIndex) {
              var ret = [];
              var re = new RegExp(pattern, 'g');
              var m;
              while (m = re.exec(s)) {
                if (m.index > maxIndex) {
                  break;
                } else {
                  ret.push(m[g]);
                }
              }
              return ret;
            }
            
            function getCharByIndex(i) {
              return w.graphData.substr(i*3, 1);
            }
            
            function loadVariables() {
              try {
                w.ccmState = JSON.parse(localStorage.ccmState);
              }
              catch(e) {
                w.ccmState = {
                  learnedWords: "",
                  startChar: getCharByIndex(Math.round(Math.random()*30))
                };
              }
            }
            
            function saveVariables() {
              localStorage.ccmState = JSON.stringify(w.ccmState);
            }
`
var test = `
      var difficulty = -Math.cos(Math.pow(learnedWords, 0.65)) + learnedWords/100 + 1;
       var learnedWords = w.ccmState.learnedWords.length;
      var difficulty = -Math.cos(Math.pow(learnedWords, 0.65)) + learnedWords/100 + 1;
       `
// console.log(10
// /10/ 1)
console.log(
    this.indenter.indentJS(code, '  ')
);


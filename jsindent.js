var NEW_LINE_REGEX = /\r*\n/;
var jsRules = [
    {
        name: "line comment",
        startToken: [/\/\//],
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
        startToken: [/\//],
        endToken: [/\//, NEW_LINE_REGEX],
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
        indent: false
    },
    {
        name: "tag",
        startToken: [/\<[^\>\/]/],
        endToken: [/\<\/[^\>]\>/],
        indent: true
    },
    {
        name: "tag",
        startToken: [/\<[^\>\/]/],
        endToken: [/\/\>/],
        indent: false
    }
];

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
            else if (matchStart.matchIndex == -1 || matchEnd.matchIndex <= matchStart.matchIndex) {
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
        match = searchAny(string, rule.startToken);
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
    var match = searchAny(string, rule.endToken);
    var cursor = rule.advance ? match.matchIndex + match.matchLength : match.matchIndex;
    return {
        matchIndex: match.matchIndex == -1 ? -1 : match.matchIndex + offset,
        cursor: cursor == -1 ? -1 : cursor + offset
    };
}

function searchAny(string, patterns) {
    var index = -1;
    var length = 0;
    for (var p=0; p<patterns.length; p++) {
        index = string.search(patterns[p]);
        if (index != -1) {
            length = string.match(patterns[p])[0].length;
            break;
        }
    }
    return {
        matchIndex: index,
        matchLength: length,
        patternIndex: p
    };
}

var test = `
function(){
angular
.module('app')
.run(function(a, b) {
/**this function() {} for() {
if() {
test();
}
}**/
var test,
p= 100;
var c = {
a: 100,
b:200
};
switch(b) {
case 100:
break;
case 9:
default:
    console.log("awesome");
}
});

for(i=0){
if (test) {
var i=0;
}
}
}
`;
var self= `

function indent(code, rules, indentation) {
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

        matchStart = matchStartRule(line, rules, pos);

        if (activeRules.length) {
            matchEnd = matchEndRule(line, lastRule, pos);
            if (matchEnd.matchIndex == -1) {
                if (lastRule.ignore) {
                    // last rule is still active, and it's telling us to ignore.
                    newLines[l] = getIndentation() + line;
                    incrementLine();
                }
            }
            else if (matchStart.matchIndex == -1 || matchEnd.matchIndex <= matchStart.matchIndex) {
                if (matchEnd.matchIndex == 0 && lastRule.indent) {
                    indents--;
                }
                else if (lastRule.indent) {
                    indentAfter--;
                }
                pos = matchEnd.matchIndex;
                removeLastRule();
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
        pos = match.matchIndex;
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
        match = searchAny(string, rule.startToken);
        if (match.matchIndex != -1 && match.matchIndex < minIndex) {
            minIndex = match.matchIndex;
            minMatch = match;
            result = rule;
        }
    }
    return {
        rule: result,
        matchIndex: result ? minIndex + index + minMatch.matchLength : -1
    };
}

function matchEndRule(string, rule, offset) {
    string = string.substring(offset, string.length);
    var match = searchAny(string, rule.endToken);
    var cursor = rule.advance ? match.matchIndex + match.matchLength : match.matchIndex;
    return {
        matchIndex: cursor == -1 ? cursor : cursor + offset
    };
}

function searchAny(string, patterns) {
    var index = -1;
    var length = 0;
    for (var p=0; p<patterns.length; p++) {
        index = string.search(patterns[p]);
        if (index != -1) {
            length = string.match(patterns[p])[0].length;
            break;
        }
    }
    return {
        matchIndex: index,
        matchLength: length,
        patternIndex: p
    };
}
`
var comment = `
angular
.module('app')
.run(function(a, b) {
/** this function() {} for() {
if() {
test();
}
}**/
});
var awesome=10;
`
console.log(indent(test, jsRules, '  '))
ace.define('ace/mode/liquid_template_highlight_rules', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(acequire, exports, module) {
  "use strict";

    var oop = acequire("../lib/oop");

    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var LiquidTemplateHighlightRules = function() {
      let XmlHighlightRules = ace.acequire('ace/mode/xml_highlight_rules').XmlHighlightRules;
      let emailRules = {token : "liquid", regex : "[^'{{]*[REPLACE, ME, WITH, DESIRED, LINK, BUTTON, TEXT]+?(?=')"};

      this.$rules = new XmlHighlightRules().getRules();
      this.$rules.start.push(emailRules);
    };

    oop.inherits(LiquidTemplateHighlightRules, TextHighlightRules);

    exports.LiquidTemplateHighlightRules = LiquidTemplateHighlightRules;
});

ace.define('ace/mode/folding/cstyle', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(acequire, exports, module) {
    var oop = acequire("../../lib/oop");
    var Range = acequire("../../range").Range;
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function() {

        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)|^note /;
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)|^end/;

        this.getFoldWidgetRange = function(session, foldStyle, row) {
            var line = session.getLine(row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i + match[0].length, 1);
            }

            if (foldStyle !== "markbeginend")
                return;

            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };

    }).call(FoldMode.prototype);
});

ace.define('ace/mode/liquid_template', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/liquid_template_highlight_rules', 'ace/mode/folding/cstyle'], function(acequire, exports, module) {
    "use strict";
    var oop = acequire("../lib/oop");
    var TextMode = acequire("./text").Mode;
    var Tokenizer = acequire("../tokenizer").Tokenizer;
    var LiquidTemplateHighlightRules = acequire("./liquid_template_highlight_rules").LiquidTemplateHighlightRules;
    var FoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function() {
        var highlighter = new LiquidTemplateHighlightRules();
        this.foldingRules = new FoldMode();
        this.$tokenizer = new Tokenizer(highlighter.getRules());
        this.$keywordList = highlighter.$keywordList;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.lineCommentStart = "'";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

define(
  'ace/mode/logiql_highlight_rules',
  [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules',
  ],
  function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'),
      i = e('./text_highlight_rules').TextHighlightRules,
      s = function () {
        (this.$rules = {
          start: [
            {
              token: 'comment.block',
              regex: '/\\*',
              push: [
                { token: 'comment.block', regex: '\\*/', next: 'pop' },
                { defaultToken: 'comment.block' },
              ],
            },
            { token: 'comment.single', regex: '//.*' },
            {
              token: 'constant.numeric',
              regex: '\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fd]?',
            },
            {
              token: 'string',
              regex: '"',
              push: [
                { token: 'string', regex: '"', next: 'pop' },
                { defaultToken: 'string' },
              ],
            },
            { token: 'constant.language', regex: '\\b(true|false)\\b' },
            {
              token: 'entity.name.type.logicblox',
              regex: '`[a-zA-Z_:]+(\\d|\\a)*\\b',
            },
            { token: 'keyword.start', regex: '->', comment: 'Constraint' },
            {
              token: 'keyword.start',
              regex: '-->',
              comment: 'Level 1 Constraint',
            },
            { token: 'keyword.start', regex: '<-', comment: 'Rule' },
            { token: 'keyword.start', regex: '<--', comment: 'Level 1 Rule' },
            { token: 'keyword.end', regex: '\\.', comment: 'Terminator' },
            { token: 'keyword.other', regex: '!', comment: 'Negation' },
            { token: 'keyword.other', regex: ',', comment: 'Conjunction' },
            { token: 'keyword.other', regex: ';', comment: 'Disjunction' },
            {
              token: 'keyword.operator',
              regex: '<=|>=|!=|<|>',
              comment: 'Equality',
            },
            { token: 'keyword.other', regex: '@', comment: 'Equality' },
            {
              token: 'keyword.operator',
              regex: '\\+|-|\\*|/',
              comment: 'Arithmetic operations',
            },
            { token: 'keyword', regex: '::', comment: 'Colon colon' },
            {
              token: 'support.function',
              regex: '\\b(agg\\s*<<)',
              push: [
                { include: '$self' },
                { token: 'support.function', regex: '>>', next: 'pop' },
              ],
            },
            { token: 'storage.modifier', regex: '\\b(lang:[\\w:]*)' },
            {
              token: ['storage.type', 'text'],
              regex:
                '(export|sealed|clauses|block|alias|alias_all)(\\s*\\()(?=`)',
            },
            {
              token: 'entity.name',
              regex:
                '[a-zA-Z_][a-zA-Z_0-9:]*(@prev|@init|@final)?(?=(\\(|\\[))',
            },
            {
              token: 'variable.parameter',
              regex: '([a-zA-Z][a-zA-Z_0-9]*|_)\\s*(?=(,|\\.|<-|->|\\)|\\]|=))',
            },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(s, i), (t.LogiQLHighlightRules = s);
  },
),
  define(
    'ace/mode/folding/coffee',
    [
      'require',
      'exports',
      'module',
      'ace/lib/oop',
      'ace/mode/folding/fold_mode',
      'ace/range',
    ],
    function (e, t, n) {
      'use strict';
      var r = e('../../lib/oop'),
        i = e('./fold_mode').FoldMode,
        s = e('../../range').Range,
        o = (t.FoldMode = function () {});
      r.inherits(o, i),
        function () {
          (this.getFoldWidgetRange = function (e, t, n) {
            var r = this.indentationBlock(e, n);
            if (r) return r;
            var i = /\S/,
              o = e.getLine(n),
              u = o.search(i);
            if (u == -1 || o[u] != '#') return;
            var a = o.length,
              f = e.getLength(),
              l = n,
              c = n;
            while (++n < f) {
              o = e.getLine(n);
              var h = o.search(i);
              if (h == -1) continue;
              if (o[h] != '#') break;
              c = n;
            }
            if (c > l) {
              var p = e.getLine(c).length;
              return new s(l, a, c, p);
            }
          }),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n),
                i = r.search(/\S/),
                s = e.getLine(n + 1),
                o = e.getLine(n - 1),
                u = o.search(/\S/),
                a = s.search(/\S/);
              if (i == -1)
                return (
                  (e.foldWidgets[n - 1] = u != -1 && u < a ? 'start' : ''), ''
                );
              if (u == -1) {
                if (i == a && r[i] == '#' && s[i] == '#')
                  return (
                    (e.foldWidgets[n - 1] = ''),
                    (e.foldWidgets[n + 1] = ''),
                    'start'
                  );
              } else if (
                u == i &&
                r[i] == '#' &&
                o[i] == '#' &&
                e.getLine(n - 2).search(/\S/) == -1
              )
                return (
                  (e.foldWidgets[n - 1] = 'start'),
                  (e.foldWidgets[n + 1] = ''),
                  ''
                );
              return (
                u != -1 && u < i
                  ? (e.foldWidgets[n - 1] = 'start')
                  : (e.foldWidgets[n - 1] = ''),
                i < a ? 'start' : ''
              );
            });
        }.call(o.prototype);
    },
  ),
  define(
    'ace/mode/matching_brace_outdent',
    ['require', 'exports', 'module', 'ace/range'],
    function (e, t, n) {
      'use strict';
      var r = e('../range').Range,
        i = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1;
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t),
              i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length,
              o = e.findMatchingBracket({ row: t, column: s });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(i.prototype),
        (t.MatchingBraceOutdent = i);
    },
  ),
  define(
    'ace/mode/logiql',
    [
      'require',
      'exports',
      'module',
      'ace/lib/oop',
      'ace/mode/text',
      'ace/mode/logiql_highlight_rules',
      'ace/mode/folding/coffee',
      'ace/token_iterator',
      'ace/range',
      'ace/mode/behaviour/cstyle',
      'ace/mode/matching_brace_outdent',
    ],
    function (e, t, n) {
      'use strict';
      var r = e('../lib/oop'),
        i = e('./text').Mode,
        s = e('./logiql_highlight_rules').LogiQLHighlightRules,
        o = e('./folding/coffee').FoldMode,
        u = e('../token_iterator').TokenIterator,
        a = e('../range').Range,
        f = e('./behaviour/cstyle').CstyleBehaviour,
        l = e('./matching_brace_outdent').MatchingBraceOutdent,
        c = function () {
          (this.HighlightRules = s),
            (this.foldingRules = new o()),
            (this.$outdent = new l()),
            (this.$behaviour = new f());
        };
      r.inherits(c, i),
        function () {
          (this.lineCommentStart = '//'),
            (this.blockComment = { start: '/*', end: '*/' }),
            (this.getNextLineIndent = function (e, t, n) {
              var r = this.$getIndent(t),
                i = this.getTokenizer().getLineTokens(t, e),
                s = i.tokens,
                o = i.state;
              if (/comment|string/.test(o)) return r;
              if (s.length && s[s.length - 1].type == 'comment.single')
                return r;
              var u = t.match();
              return /(-->|<--|<-|->|{)\s*$/.test(t) && (r += n), r;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n)
                ? !0
                : n !== '\n' && n !== '\r\n'
                  ? !1
                  : /^\s+/.test(t)
                    ? !0
                    : !1;
            }),
            (this.autoOutdent = function (e, t, n) {
              if (this.$outdent.autoOutdent(t, n)) return;
              var r = t.getLine(n),
                i = r.match(/^\s+/),
                s = r.lastIndexOf('.') + 1;
              if (!i || !n || !s) return 0;
              var o = t.getLine(n + 1),
                u = this.getMatching(t, { row: n, column: s });
              if (!u || u.start.row == n) return 0;
              s = i[0].length;
              var f = this.$getIndent(t.getLine(u.start.row));
              t.replace(new a(n + 1, 0, n + 1, s), f);
            }),
            (this.getMatching = function (e, t, n) {
              t == undefined && (t = e.selection.lead),
                typeof t == 'object' && ((n = t.column), (t = t.row));
              var r = e.getTokenAt(t, n),
                i = 'keyword.start',
                s = 'keyword.end',
                o;
              if (!r) return;
              if (r.type == i) {
                var f = new u(e, t, n);
                f.step = f.stepForward;
              } else {
                if (r.type != s) return;
                var f = new u(e, t, n);
                f.step = f.stepBackward;
              }
              while ((o = f.step())) if (o.type == i || o.type == s) break;
              if (!o || o.type == r.type) return;
              var l = f.getCurrentTokenColumn(),
                t = f.getCurrentTokenRow();
              return new a(t, l, t, l + o.value.length);
            }),
            (this.$id = 'ace/mode/logiql');
        }.call(c.prototype),
        (t.Mode = c);
    },
  );
(function () {
  window.require(['ace/mode/logiql'], function (m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();

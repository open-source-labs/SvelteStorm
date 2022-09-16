// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.
// JAVI NOTE: Probalby want to fix transparency of search bar 

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("node_modules/codemirror/lib/codemirror.js"), require("node_modules/codemirror/addon/search/searchcursor.js"), require("src/CodeEditor/newDialog.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["node_modules/codemirror/lib/codemirror.js", "node_modules/codemirror/addon/search/searchcursor.js", "src/CodeEditor/newDialog.js"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  // default search panel location
  // addons: 
  var replaceDialog = `
    <div class="row find">
      <label for="CodeMirror-find-field">Replace:</label>
      <input id="CodeMirror-find-field" type="text" class="CodeMirror-search-field" placeholder="Find" />
      <span class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>
      <span class="CodeMirror-search-count"></span>
    </div>
    <div class="row replace">
      <label for="CodeMirror-replace-field">With:</label>
      <input id="CodeMirror-replace-field" type="text" class="CodeMirror-search-field" placeholder="Replace" />
    </div>
    <div class="buttons">
      <button>Find Previous</button>
      <button>Find Next</button>
      <button>Replace</button>
      <button>Replace All</button>
      <button>Close</button>
    </div>
  `;

  var findDialog = `
    <div class="row find">
      <label for="CodeMirror-find-field">Find:</label>
      <input id="CodeMirror-find-field" type="text" class="CodeMirror-search-field" placeholder="Find" />
      <div class="hints-container">
        <span class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>
        <span class="CodeMirror-search-count"></span>
      </div>
    </div>
    <div class="buttons">
      <button>Previous</button>
      <button>Next</button>
      <button>Close</button>
    </div>
  `
  let foundCount = 0;

  CodeMirror.defineOption("search", {bottom: false});

  function searchOverlay(query, caseInsensitive) {
    if (typeof query == "string")
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    else if (!query.global)
      query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return {token: function(stream) {
      query.lastIndex = stream.pos;
      var match = query.exec(stream.string);
      if (match && match.index == stream.pos) {
        stream.pos += match[0].length || 1;
        return "searching";
      } else if (match) {
        stream.pos = match.index;
      } else {
        stream.skipToEnd();
      }
    }};
  }

  function SearchState() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
  }

  function getSearchState(cm) {
    return cm.state.search || (cm.state.search = new SearchState());
  }

  function queryCaseInsensitive(query) {
    return typeof query == "string" && query == query.toLowerCase();
  }

  function getSearchCursor(cm, query, pos) {
    // Heuristic: if the query string is all lowercase, do a case insensitive search.
    return cm.getSearchCursor(query, pos, {caseFold: queryCaseInsensitive(query), multiline: true});
  }

  // function persistentDialog(cm, text, deflt, onEnter, onKeyDown) {
  //   cm.openDialog(text, onEnter, {
  //     value: deflt,
  //     selectValueOnOpen: true,
  //     closeOnEnter: false,
  //     onClose: function() { clearSearch(cm); },
  //     onKeyDown: onKeyDown,
  //     bottom: cm.options.search.bottom
  //   });
  // }

  // function dialog(cm, text, shortText, deflt, f) {
  //   if (cm.openDialog) cm.openDialog(text, f, {value: deflt, selectValueOnOpen: true, bottom: cm.options.search.bottom});
  //   else f(prompt(shortText, deflt));
  // }

  // function confirmDialog(cm, text, shortText, fs) {
  //   if (cm.openConfirm) cm.openConfirm(text, fs);
  //   else if (confirm(shortText)) fs[0]();
  // }

  function parseString(string) {
    return string.replace(/\\([nrt\\])/g, function(match, ch) {
      if (ch == "n") return "\n"
      if (ch == "r") return "\r"
      if (ch == "t") return "\t"
      if (ch == "\\") return "\\"
      return match
    })
  }

  function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
      try { query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i"); }
      catch(e) {} // Not a regular expression after all, do a string search
    } else {
      query = parseString(query)
    }
    if (typeof query == "string" ? query == "" : query.test(""))
      query = /x^/;
    return query;
  }

  function startSearch(cm, state, query) {
    state.queryText = query;
    state.query = parseQuery(query);
    cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
    state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
    cm.addOverlay(state.overlay);
    if (cm.showMatchesOnScrollbar) {
      if (state.annotate) { state.annotate.clear(); state.annotate = null; }
      state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
    }
  }
  let doSearch = (cm, query, reverse, moveToNext) => {
    var hiding = null;
    var state = getSearchState(cm);
    if (query != state.queryText) {
      startSearch(cm, state, query);
      state.posFrom = state.posTo = cm.getCursor();
    }
    if (moveToNext || moveToNext === undefined) {
      findNext(cm, (reverse || false));
    }
    updateCount(cm);
  }

  let clearSearch = (cm) => {
    cm.operation(() => {
      var state = getSearchState(cm);
      state.lastQuery = state.query;
      if (!state.query) return;
      state.query = state.queryText = null;
      cm.removeOverlay(state.overlay);
      if (state.annotate) {
        state.annotate.clear();
        state.annotate = null;
      }
    });
  }

  let findNext = (cm, reverse, callback) => {
    cm.operation(() => {
      var state = getSearchState(cm);
      var cursor = getSearchCursor(cm, state.query, reverse ? state.posFrom : state.posTo);
      // console.log(cursor);
      if (!cursor.find(reverse)) {
        cursor = getSearchCursor(cm, state.query, reverse ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
        if (!cursor.find(reverse)) return;
      }
      cm.setSelection(cursor.from(), cursor.to());
      const { left, top } = cm.getScrollInfo();
      // cm.scrollIntoView({
      //   from: cursor.from(),
      //   to: cursor.to()
      // }, 20);
      
      state.posFrom = cursor.from();
      state.posTo = cursor.to();
      cm.scrollIntoView({line: cursor.pos.from.line, char: cursor.pos.from.ch}, 200);
      if (callback) callback(cursor.from(), cursor.to())
    });
  }

  let replaceNext = (cm, query, text) => {
    let cursor = getSearchCursor(cm, query, cm.getCursor('from'));
    let start = cursor.from();
    let match = cursor.findNext();
    if (!match) {
      cursor = getSearchCursor(cm, query);
      match = cursor.findNext();
      if (!match ||
        (start && cursor.from().line === start.line && cursor.from().ch === start.ch)) return;
    }
    cm.setSelection(cursor.from(), cursor.to());
    cm.scrollIntoView({
      from: cursor.from(),
      to: cursor.to()
    });
    cursor.replace(typeof query === 'string' ? text :
      text.replace(/\$(\d)/g, (_, i) => {
        return match[i];
      }));
  }

  let replaceAll = (cm, query, text) => {
    cm.operation(() => {
      for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
        if (typeof query != "string") {
          var match = cm.getRange(cursor.from(), cursor.to()).match(query);
          cursor.replace(text.replace(/\$(\d)/g, (_, i) => {
            return match[i];
          }));
        } else cursor.replace(text);
      }
    });
  }

  let closeSearchCallback = (cm, state) => {
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
    clearSearch(cm);
  }

  let getOnReadOnlyCallback = (callback) => {
    let closeFindDialogOnReadOnly = (cm, opt) => {
      if (opt === 'readOnly' && !!cm.getOption('readOnly')) {
        callback();
        cm.off('optionChange', closeFindDialogOnReadOnly);
      }
    }
    return closeFindDialogOnReadOnly;
  };

  let updateCount = (cm) => {
    let state = getSearchState(cm);
    let value = cm.getDoc().getValue();
    let globalQuery;
    let queryText = state.queryText;

    if (!queryText || queryText === '') {
      resetCount(cm);
      return;
    }

    while (queryText.charAt(queryText.length - 1) === '\\') {
      queryText = queryText.substring(0, queryText.lastIndexOf('\\'));
    }

    if (typeof state.query === 'string') {
      globalQuery = new RegExp(queryText, 'ig');
    } else {
      globalQuery = new RegExp(state.query.source, state.query.flags + 'g');
    }

    let matches = value.match(globalQuery);
    let count = matches ? matches.length : 0;

    let countText = count === 1 ? '1 match found.' : count + ' matches found.';
    cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = countText;
  }

  let resetCount = (cm) => {
    cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = '';
  }

  let getFindBehaviour = (cm, defaultText, callback) => {
    if (!defaultText) {
      defaultText = '';
    }
    let behaviour = {
      value: defaultText,
      focus: true,
      selectValueOnOpen: true,
      closeOnEnter: false,
      closeOnBlur: false,
      callback: (inputs, e) => {
        let query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, !!e.shiftKey);
      },
      onInput: (inputs, e) => {
        let query = inputs[0].value;
        if (!query) {
          resetCount(cm);
          clearSearch(cm);
          return;
        };
        doSearch(cm, query, !!e.shiftKey, false);
      }
    };
    if (!!callback) {
      behaviour.callback = callback;
    }
    return behaviour;
  }

  let getFindPrevBtnBehaviour = (cm) => {
    return {
      callback: (inputs) => {
        let query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, true);
      }
    }
  };

  let getFindNextBtnBehaviour = (cm) => {
    return {
      callback: (inputs) => {
        let query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, false);
      }
    }
  };

  let closeBtnBehaviour = {
    callback: null
  };

  CodeMirror.commands.find = (cm) => {
    if (cm.getOption("readOnly")) return;
    clearSearch(cm);
    let state = getSearchState(cm);
    var query = cm.getSelection() || getSearchState(cm).lastQuery;
    let closeDialog = cm.openAdvancedDialog(findDialog, {
      shrinkEditor: true,
      inputBehaviours: [
        getFindBehaviour(cm, query)
      ],
      buttonBehaviours: [
        getFindPrevBtnBehaviour(cm),
        getFindNextBtnBehaviour(cm),
        closeBtnBehaviour
      ],
      onClose: () => {
        closeSearchCallback(cm, state);
      }
    });

    cm.on("optionChange", getOnReadOnlyCallback(closeDialog));
    startSearch(cm, state, query);
    updateCount(cm);
  };

  CodeMirror.commands.replace = (cm, all) => {
    if (cm.getOption("readOnly")) return;
    clearSearch(cm);

    let replaceNextCallback = (inputs) => {
      let query = parseQuery(inputs[0].value);
      let text = parseString(inputs[1].value);
      if (!query) return;
      replaceNext(cm, query, text);
      doSearch(cm, query);
    };

    let state = getSearchState(cm);
    let query = cm.getSelection() || state.lastQuery;
    let closeDialog = cm.openAdvancedDialog(replaceDialog, {
      shrinkEditor: true,
      inputBehaviours: [
        getFindBehaviour(cm, query, (inputs) => {
          inputs[1].focus();
          inputs[1].select();
        }),
        {
          closeOnEnter: false,
          closeOnBlur: false,
          callback: replaceNextCallback
        }
      ],
      buttonBehaviours: [
        getFindPrevBtnBehaviour(cm),
        getFindNextBtnBehaviour(cm),
        {
          callback: replaceNextCallback
        },
        {
          callback: (inputs) => {
            // Replace all
            let query = parseQuery(inputs[0].value);
            let text = parseString(inputs[1].value);
            if (!query) return;
            replaceAll(cm, query, text);
          }
        },
        closeBtnBehaviour
      ],
      onClose: () => {
        closeSearchCallback(cm, state);
      }
    });

    cm.on("optionChange", getOnReadOnlyCallback(closeDialog));
    startSearch(cm, state, query);
    updateCount(cm);
  };
});

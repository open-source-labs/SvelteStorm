// SS 5.0 Note - Code adapted from Marijn Haverbeke's https://github.com/Maloric/CodeMirror-RevisedSearch with some edits for SS Customization and updates to variable declarations - recommend updating to CodeMirror 6.0 to avoid this type of solution down the line"
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("node_modules/codemirror/lib/codemirror.js"), require("node_modules/codemirror/addon/search/searchcursor.js"), require("src/CodeEditor/CustomDialog/newDialog.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["node_modules/codemirror/lib/codemirror.js", "node_modules/codemirror/addon/search/searchcursor.js", "src/CodeEditor/CustomDIalog/newDialog.js"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  const replaceDialog = `
    <div class="row find">
      <label for="CodeMirror-find-field" CodeMirror-find-label>Replace:</label>
      <input id="CodeMirror-find-field" type="text" class="CodeMirror-search-field" placeholder="Find (Use /re/ syntax for regexp search)" />
      <span class="CodeMirror-search-count"></span>
    </div>
    <div class="row replace">
      <label for="CodeMirror-replace-field" CodeMirror-find-label>With:</label>
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

  const findDialog = `
    <div class="row find">
      <label for="CodeMirror-find-field" class='CodeMirror-find-label'>Find:</label>
      <input id="CodeMirror-find-field" type="text" class="CodeMirror-search-field" placeholder="Find or Use /re/ syntax for regexp search"/>
      <span class="CodeMirror-search-count"></span>
    </div>
    <div class="buttons">
      <button>Previous</button>
      <button>Next</button>
      <button>Close</button>
    </div>
  `

  CodeMirror.defineOption("search", {bottom: false});

  function searchOverlay(query, caseInsensitive) {
    if (typeof query == "string")
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    else if (!query.global)
      query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return {token: function(stream) {
      query.lastIndex = stream.pos;
      const match = query.exec(stream.string);
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
    const isRE = query.match(/^\/(.*)\/([a-z]*)$/);
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
  const doSearch = (cm, query, reverse, moveToNext) => {
    const state = getSearchState(cm);
    if (query != state.queryText) {
      startSearch(cm, state, query);
      state.posFrom = state.posTo = cm.getCursor();
    }
    if (moveToNext || moveToNext === undefined) {
      findNext(cm, (reverse || false));
    }
    updateCount(cm);
  }

  const clearSearch = (cm) => {
    cm.operation(() => {
      const state = getSearchState(cm);
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

  const findNext = (cm, reverse, callback) => {
    cm.operation(() => {
      const state = getSearchState(cm);
      let cursor = getSearchCursor(cm, state.query, reverse ? state.posFrom : state.posTo);
      // console.log(cursor);
      if (!cursor.find(reverse)) {
        cursor = getSearchCursor(cm, state.query, reverse ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
        if (!cursor.find(reverse)) return;
      }
      cm.setSelection(cursor.from(), cursor.to());
      
      state.posFrom = cursor.from();
      state.posTo = cursor.to();
      cm.scrollIntoView({line: cursor.pos.from.line, char: cursor.pos.from.ch}, 200);
      if (callback) callback(cursor.from(), cursor.to())
    });
  }

  const replaceNext = (cm, query, text) => {
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

  const replaceAll = (cm, query, text) => {
    cm.operation(() => {
      for (let cursor = getSearchCursor(cm, query); cursor.findNext();) {
        if (typeof query != "string") {
          const match = cm.getRange(cursor.from(), cursor.to()).match(query);
          cursor.replace(text.replace(/\$(\d)/g, (_, i) => {
            return match[i];
          }));
        } else cursor.replace(text);
      }
    });
  }

  const closeSearchCallback = (cm, state) => {
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
    clearSearch(cm);
  }

  const getOnReadOnlyCallback = (callback) => {
    const closeFindDialogOnReadOnly = (cm, opt) => {
      if (opt === 'readOnly' && !!cm.getOption('readOnly')) {
        callback();
        cm.off('optionChange', closeFindDialogOnReadOnly);
      }
    }
    return closeFindDialogOnReadOnly;
  };

  const updateCount = (cm) => {
    const state = getSearchState(cm);
    const value = cm.getDoc().getValue();
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

    const matches = value.match(globalQuery);
    const count = matches ? matches.length : 0;

    const countText = count === 1 ? '1 match found.' : count + ' matches found.';
    cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = countText;
  }

  const resetCount = (cm) => {
    cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = '';
  }

  const getFindBehaviour = (cm, defaultText, callback) => {
    if (!defaultText) {
      defaultText = '';
    }
    const behaviour = {
      value: defaultText,
      focus: true,
      selectValueOnOpen: true,
      closeOnEnter: false,
      closeOnBlur: false,
      callback: (inputs, e) => {
        const query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, !!e.shiftKey);
      },
      onInput: (inputs, e) => {
        const query = inputs[0].value;
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

  const getFindPrevBtnBehaviour = (cm) => {
    return {
      callback: (inputs) => {
        const query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, true);
      }
    }
  };

  const getFindNextBtnBehaviour = (cm) => {
    return {
      callback: (inputs) => {
        const query = inputs[0].value;
        if (!query) return;
        doSearch(cm, query, false);
      }
    }
  };

  const closeBtnBehaviour = {
    callback: null
  };

  CodeMirror.commands.find = (cm) => {
    if (cm.getOption("readOnly")) return;
    clearSearch(cm);
    const state = getSearchState(cm);
    const query = cm.getSelection() || getSearchState(cm).lastQuery;
    const closeDialog = cm.openAdvancedDialog(findDialog, {
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

    const replaceNextCallback = (inputs) => {
      const query = parseQuery(inputs[0].value);
      const text = parseString(inputs[1].value);
      if (!query) return;
      replaceNext(cm, query, text);
      doSearch(cm, query);
    };

    const state = getSearchState(cm);
    const query = cm.getSelection() || state.lastQuery;
    const closeDialog = cm.openAdvancedDialog(replaceDialog, {
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
            const query = parseQuery(inputs[0].value);
            const text = parseString(inputs[1].value);
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

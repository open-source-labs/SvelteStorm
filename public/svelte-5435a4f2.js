
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src\components\monaco\monaco-editor.svelte generated by Svelte v3.38.2 */

function create_fragment$3(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			attr(div, "class", "monaco-container");
			set_style(div, "height", "100%");
			set_style(div, "text-align", "left");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			/*div_binding*/ ctx[3](div);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*div_binding*/ ctx[3](null);
		}
	};
}

let monaco_promise;
let _monaco;
monaco_promise = import('./monaco-8619836c.js').then(function (n) { return n.m; });

monaco_promise.then(mod => {
	_monaco = mod.default;
});

function instance$3($$self, $$props, $$invalidate) {
	let monaco;
	let container;
	let { value } = $$props;
	let { language } = $$props;
	console.log(language);

	onMount(() => {
		if (_monaco) {
			monaco = _monaco;

			monaco.editor.create(container, {
				value: value.join("\n"),
				language: `${language}`
			});
		} else {
			console.log("VALUE", value);

			monaco_promise.then(async mod => {
				monaco = mod.default;

				monaco.editor.create(container, {
					value: value.join("\n"),
					language: `${language}`
				});
			});
		}

		return () => {
			console.log("destroyed");
			destroyed = true;
		};
	});

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			container = $$value;
			$$invalidate(0, container);
		});
	}

	$$self.$$set = $$props => {
		if ("value" in $$props) $$invalidate(1, value = $$props.value);
		if ("language" in $$props) $$invalidate(2, language = $$props.language);
	};

	return [container, value, language, div_binding];
}

class Monaco_editor extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 1, language: 2 });
	}
}

/* src\Directory\FileTest.svelte generated by Svelte v3.38.2 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i].path;
	child_ctx[4] = list[i].name;
	child_ctx[5] = list[i].items;
	return child_ctx;
}

// (17:4) {:else}
function create_else_block$1(ctx) {
	let li;
	let t_value = /*name*/ ctx[4] + "";
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			li = element("li");
			t = text(t_value);
			attr(li, "class", "liFiles svelte-5tamfx");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);

			if (!mounted) {
				dispose = listen(li, "click", function () {
					if (is_function(/*toggleVisibility*/ ctx[2](/*path*/ ctx[3]))) /*toggleVisibility*/ ctx[2](/*path*/ ctx[3]).apply(this, arguments);
				});

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*fileTree*/ 1 && t_value !== (t_value = /*name*/ ctx[4] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

// (15:4) {#if items.length > 0}
function create_if_block_1(ctx) {
	let li;
	let t_value = /*name*/ ctx[4] + "";
	let t;
	let li_class_value;
	let mounted;
	let dispose;

	return {
		c() {
			li = element("li");
			t = text(t_value);

			attr(li, "class", li_class_value = "" + (null_to_empty(!/*fileState*/ ctx[1][/*path*/ ctx[3]]
			? "liFolderClosed"
			: "liFolderOpen") + " svelte-5tamfx"));
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);

			if (!mounted) {
				dispose = listen(li, "click", function () {
					if (is_function(/*toggleVisibility*/ ctx[2](/*path*/ ctx[3]))) /*toggleVisibility*/ ctx[2](/*path*/ ctx[3]).apply(this, arguments);
				});

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*fileTree*/ 1 && t_value !== (t_value = /*name*/ ctx[4] + "")) set_data(t, t_value);

			if (dirty & /*fileState, fileTree*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(!/*fileState*/ ctx[1][/*path*/ ctx[3]]
			? "liFolderClosed"
			: "liFolderOpen") + " svelte-5tamfx"))) {
				attr(li, "class", li_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

// (20:4) {#if fileState[path] && items.length > 0}
function create_if_block$1(ctx) {
	let filetest;
	let current;

	filetest = new FileTest({
			props: { fileTree: /*items*/ ctx[5].sort(func) }
		});

	return {
		c() {
			create_component(filetest.$$.fragment);
		},
		m(target, anchor) {
			mount_component(filetest, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const filetest_changes = {};
			if (dirty & /*fileTree*/ 1) filetest_changes.fileTree = /*items*/ ctx[5].sort(func);
			filetest.$set(filetest_changes);
		},
		i(local) {
			if (current) return;
			transition_in(filetest.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(filetest.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(filetest, detaching);
		}
	};
}

// (13:0) {#each fileTree as {path,name, items}}
function create_each_block(ctx) {
	let ul;
	let t0;
	let t1;
	let current;

	function select_block_type(ctx, dirty) {
		if (/*items*/ ctx[5].length > 0) return create_if_block_1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*fileState*/ ctx[1][/*path*/ ctx[3]] && /*items*/ ctx[5].length > 0 && create_if_block$1(ctx);

	return {
		c() {
			ul = element("ul");
			if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
		},
		m(target, anchor) {
			insert(target, ul, anchor);
			if_block0.m(ul, null);
			append(ul, t0);
			if (if_block1) if_block1.m(ul, null);
			append(ul, t1);
			current = true;
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(ul, t0);
				}
			}

			if (/*fileState*/ ctx[1][/*path*/ ctx[3]] && /*items*/ ctx[5].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*fileState, fileTree*/ 3) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(ul, t1);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(ul);
			if_block0.d();
			if (if_block1) if_block1.d();
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let current;
	let each_value = /*fileTree*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "directory svelte-5tamfx");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*fileTree, fileState, toggleVisibility*/ 7) {
				each_value = /*fileTree*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

const func = (a, b) => {
	return b.items.length - a.items.length;
};

function instance$2($$self, $$props, $$invalidate) {
	let { fileTree } = $$props;
	const fileState = {};

	const toggleVisibility = path => {
		if (!fileState[path]) $$invalidate(1, fileState[path] = true, fileState); else $$invalidate(1, fileState[path] = false, fileState);
	};

	console.log(fileTree);

	$$self.$$set = $$props => {
		if ("fileTree" in $$props) $$invalidate(0, fileTree = $$props.fileTree);
	};

	return [fileTree, fileState, toggleVisibility];
}

class FileTest extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { fileTree: 0 });
	}
}

/* src\Directory\FileDir.svelte generated by Svelte v3.38.2 */

function create_fragment$1(ctx) {
	let div;
	let filetest;
	let current;

	filetest = new FileTest({
			props: { fileTree: /*savedTree*/ ctx[0] }
		});

	return {
		c() {
			div = element("div");
			create_component(filetest.$$.fragment);
			attr(div, "class", "directoryContainer svelte-jjeu0z");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(filetest, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const filetest_changes = {};
			if (dirty & /*savedTree*/ 1) filetest_changes.fileTree = /*savedTree*/ ctx[0];
			filetest.$set(filetest_changes);
		},
		i(local) {
			if (current) return;
			transition_in(filetest.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(filetest.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(filetest);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	var remote = window.require("electron").remote;
	var electronFs = remote.require("fs");
	const { ipcRenderer } = require("electron");
	let savedTree = [];
	let directory;

	ipcRenderer.on("folder-opened", function (evt, file, content) {
		directory = content;

		if (directory && directory[0]) {
			var fileTree = new FileTree(directory[0]);
			fileTree.build();

			//this.setState({fileTree});
			$$invalidate(0, savedTree = fileTree.items);

			savedTree.sort((a, b) => {
				return b.items.length - a.items.length;
			});

			//console.log(Array.isArray(savedTree))
			console.log("fileTree", savedTree);
		}
	});

	class FileTree {
		constructor(path, name = null) {
			this.path = path;
			this.name = name;
			this.items = [];

			this.state = {
				path,
				name,
				items: [],
				color: "white",
				isOpen: false
			};
		} //this.handleToggle = this.handleToggle.bind(this);

		//method to build file tree
		build() {
			this.items = FileTree.readDir(this.path);
		}

		static readDir(path) {
			var fileArray = [];

			electronFs.readdirSync(path).forEach(file => {
				var fileInfo = new FileTree(`${path}/${file}`, file);
				var stat = electronFs.statSync(fileInfo.path);

				if (stat.isDirectory()) {
					fileInfo.items = FileTree.readDir(fileInfo.path);
				}

				fileArray.push(fileInfo);
			});

			return fileArray;
		}
	}

	return [savedTree];
}

class FileDir extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
	}
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var xtermAddonFit = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(self,(function(){return (()=>{var e={775:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.FitAddon=void 0;var r=function(){function e(){}return e.prototype.activate=function(e){this._terminal=e;},e.prototype.dispose=function(){},e.prototype.fit=function(){var e=this.proposeDimensions();if(e&&this._terminal){var t=this._terminal._core;this._terminal.rows===e.rows&&this._terminal.cols===e.cols||(t._renderService.clear(),this._terminal.resize(e.cols,e.rows));}},e.prototype.proposeDimensions=function(){if(this._terminal&&this._terminal.element&&this._terminal.element.parentElement){var e=this._terminal._core;if(0!==e._renderService.dimensions.actualCellWidth&&0!==e._renderService.dimensions.actualCellHeight){var t=window.getComputedStyle(this._terminal.element.parentElement),r=parseInt(t.getPropertyValue("height")),i=Math.max(0,parseInt(t.getPropertyValue("width"))),n=window.getComputedStyle(this._terminal.element),o=r-(parseInt(n.getPropertyValue("padding-top"))+parseInt(n.getPropertyValue("padding-bottom"))),a=i-(parseInt(n.getPropertyValue("padding-right"))+parseInt(n.getPropertyValue("padding-left")))-e.viewport.scrollBarWidth;return {cols:Math.max(2,Math.floor(a/e._renderService.dimensions.actualCellWidth)),rows:Math.max(1,Math.floor(o/e._renderService.dimensions.actualCellHeight))}}}},e}();t.FitAddon=r;}},t={};return function r(i){if(t[i])return t[i].exports;var n=t[i]={exports:{}};return e[i](n,n.exports,r),n.exports}(775)})()}));
//# sourceMappingURL=xterm-addon-fit.js.map
});

unwrapExports(xtermAddonFit);
var xtermAddonFit_1 = xtermAddonFit.FitAddon;

/* src\App.svelte generated by Svelte v3.38.2 */

function create_else_block(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "Get A File";
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (95:12) {#if monacoValue !== ''}
function create_if_block(ctx) {
	let monaco_1;
	let current;

	let monaco_1_props = {
		value: /*monacoValue*/ ctx[0],
		language: /*monacoLanguage*/ ctx[2]
	};

	monaco_1 = new Monaco_editor({ props: monaco_1_props });
	/*monaco_1_binding*/ ctx[5](monaco_1);

	return {
		c() {
			create_component(monaco_1.$$.fragment);
		},
		m(target, anchor) {
			mount_component(monaco_1, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const monaco_1_changes = {};
			if (dirty & /*monacoValue*/ 1) monaco_1_changes.value = /*monacoValue*/ ctx[0];
			if (dirty & /*monacoLanguage*/ 4) monaco_1_changes.language = /*monacoLanguage*/ ctx[2];
			monaco_1.$set(monaco_1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(monaco_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(monaco_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			/*monaco_1_binding*/ ctx[5](null);
			destroy_component(monaco_1, detaching);
		}
	};
}

function create_fragment(ctx) {
	let body;
	let main;
	let div0;
	let filedir;
	let t0;
	let div1;
	let current_block_type_index;
	let if_block;
	let t1;
	let div2;
	let t3;
	let div5;
	let t4;
	let div7;
	let current;
	filedir = new FileDir({});
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*monacoValue*/ ctx[0] !== "") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			body = element("body");
			main = element("main");
			div0 = element("div");
			create_component(filedir.$$.fragment);
			t0 = space();
			div1 = element("div");
			if_block.c();
			t1 = space();
			div2 = element("div");
			div2.innerHTML = `<h1>State Manager</h1>`;
			t3 = space();
			div5 = element("div");
			div5.innerHTML = `<div><div><webview src="http://localhost:3000/"></webview></div></div>`;
			t4 = space();
			div7 = element("div");
			div7.innerHTML = `<div id="xterm"></div>`;
			attr(div0, "class", "box a svelte-khjrvb");
			attr(div1, "class", "box b svelte-khjrvb");
			attr(div2, "class", "box c svelte-khjrvb");
			attr(div5, "class", "box d svelte-khjrvb");
			attr(div7, "class", "box e svelte-khjrvb");
			attr(main, "class", "wrapper svelte-khjrvb");
			attr(body, "class", "svelte-khjrvb");
			toggle_class(body, "orientation", /*orientation*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, body, anchor);
			append(body, main);
			append(main, div0);
			mount_component(filedir, div0, null);
			append(main, t0);
			append(main, div1);
			if_blocks[current_block_type_index].m(div1, null);
			append(main, t1);
			append(main, div2);
			append(main, t3);
			append(main, div5);
			append(main, t4);
			append(main, div7);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div1, null);
			}

			if (dirty & /*orientation*/ 2) {
				toggle_class(body, "orientation", /*orientation*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(filedir.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(filedir.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(body);
			destroy_component(filedir);
			if_blocks[current_block_type_index].d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	const { ipcRenderer } = require("electron");
	const Terminal = requirw("xterm").Terminal;
	const fitAddon = new xtermAddonFit_1();
	const term = new Terminal({ cursorBlink: true });

	onMount(() => {
		console.log("the component has mounted");

		// get dom element by id
		//intervals functions
		// Open the terminal in #terminal-container
		term.loadAddon(fitAddon);

		term.open(document.getElementById("xterm"));
		fitAddon.fit();

		term.onData(e => {
			ipcRenderer.send("terminal-into", e);
		});

		ipcRenderer.on("terminal-incData", (event, data) => {
			term.write(data);
		});
	});

	let { name } = $$props;
	let { orientation = "columns" } = $$props;
	let { monacoValue = "" } = $$props;
	let { monacoLanguage = "" } = $$props;

	ipcRenderer.on("file-opened", function (evt, file, content) {
		$$invalidate(0, monacoValue = content.split(/\r?\n/));
	});

	let monaco;
	window["monaco"] = monaco;
	name = "World";

	function monaco_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			monaco = $$value;
			$$invalidate(3, monaco);
		});
	}

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(4, name = $$props.name);
		if ("orientation" in $$props) $$invalidate(1, orientation = $$props.orientation);
		if ("monacoValue" in $$props) $$invalidate(0, monacoValue = $$props.monacoValue);
		if ("monacoLanguage" in $$props) $$invalidate(2, monacoLanguage = $$props.monacoLanguage);
	};

	return [monacoValue, orientation, monacoLanguage, monaco, name, monaco_1_binding];
}

class App extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			name: 4,
			orientation: 1,
			monacoValue: 0,
			monacoLanguage: 2
		});
	}
}

const app = new App({
    target: document.body,
	props: {
		name: 'world'
	}
});

export { commonjsGlobal as a, app as b, createCommonjsModule as c };
//# sourceMappingURL=svelte-5435a4f2.js.map

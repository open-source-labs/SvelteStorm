
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
<<<<<<< HEAD
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
=======
function is_empty(obj) {
    return Object.keys(obj).length === 0;
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
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
function empty() {
    return text('');
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
    if (text.data !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
<<<<<<< HEAD
function add_resize_listener(element, fn) {
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    const object = document.createElement('object');
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    object.type = 'text/html';
    object.tabIndex = -1;
    let win;
    object.onload = () => {
        win = object.contentDocument.defaultView;
        win.addEventListener('resize', fn);
    };
    if (/Trident/.test(navigator.userAgent)) {
        element.appendChild(object);
        object.data = 'about:blank';
    }
    else {
        object.data = 'about:blank';
        element.appendChild(object);
    }
    return {
        cancel: () => {
            win && win.removeEventListener && win.removeEventListener('resize', fn);
            element.removeChild(object);
        }
    };
}
=======
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
<<<<<<< HEAD
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
=======
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
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
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment && $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
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
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
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
        $$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, props) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
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
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (key, ret, value = ret) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
            return ret;
        })
        : prop_values;
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
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
    $set() {
        // overridden by instance, if it has props
    }
}

/* src/components/monaco/monaco-editor.svelte generated by Svelte v3.14.1 */

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
			ctx.div_binding(div);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			ctx.div_binding(null);
		}
	};
}

let monaco_promise;
let _monaco;
<<<<<<< HEAD
monaco_promise = import('./monaco-7c325c45.js').then(function (n) { return n.m; });
=======
monaco_promise = import('./monaco-299bd239.js').then(function (n) { return n.m; });
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

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
		console.log(language);

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

	afterUpdate(() => {
		console.log("update");
	});

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate("container", container = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("value" in $$props) $$invalidate("value", value = $$props.value);
		if ("language" in $$props) $$invalidate("language", language = $$props.language);
	};

	return { container, value, language, div_binding };
}

class Monaco_editor extends SvelteComponent {
	constructor(options) {
		super();
<<<<<<< HEAD
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 0, language: 0 });
	}
}

/**
 * Clamp `num` to the range `[min, max]`
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
function clamp(num, min, max) {
	return num < min ? min : num > max ? max : num;
}

/* src/SplitPlane.svelte generated by Svelte v3.14.1 */
const get_c_slot_changes = () => ({});
const get_c_slot_context = () => ({});
const get_b_slot_changes = () => ({});
const get_b_slot_context = () => ({});
const get_a_slot_changes = () => ({});
const get_a_slot_context = () => ({});

// (204:1) {#if !fixed}
function create_if_block_1$1(ctx) {
	let div;
	let div_class_value;
	let div_style_value;
	let drag_action;
	let touchDrag_action;

	return {
		c() {
			div = element("div");
			attr(div, "class", div_class_value = "" + (ctx.type + " divider" + " svelte-1k0d9r4"));
			attr(div, "style", div_style_value = "" + (ctx.side + ": calc(" + ctx.pos + "% - 8px)"));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			drag_action = ctx.drag.call(null, div, ctx.setPos) || ({});
			touchDrag_action = ctx.touchDrag.call(null, div, ctx.setTouchPos) || ({});
		},
		p(changed, ctx) {
			if (changed.type && div_class_value !== (div_class_value = "" + (ctx.type + " divider" + " svelte-1k0d9r4"))) {
				attr(div, "class", div_class_value);
			}

			if ((changed.side || changed.pos) && div_style_value !== (div_style_value = "" + (ctx.side + ": calc(" + ctx.pos + "% - 8px)"))) {
				attr(div, "style", div_style_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if (drag_action && is_function(drag_action.destroy)) drag_action.destroy();
			if (touchDrag_action && is_function(touchDrag_action.destroy)) touchDrag_action.destroy();
		}
	};
}

// (209:0) {#if dragging}
function create_if_block$2(ctx) {
	let div;
=======
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 1, language: 2 });
	}
}

/* src/Directory/FileTest.svelte generated by Svelte v3.38.2 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i].path;
	child_ctx[4] = list[i].name;
	child_ctx[5] = list[i].items;
	return child_ctx;
}

// (15:0) {#if fileTree}
function create_if_block$1(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*fileTree*/ ctx[0];
	let each_blocks = [];
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

<<<<<<< HEAD
function create_fragment$3(ctx) {
	let div3;
	let div0;
	let div0_style_value;
	let t0;
	let div1;
	let div1_style_value;
	let t1;
	let div2;
	let div2_style_value;
	let t2;
	let div3_resize_listener;
	let t3;
	let if_block1_anchor;
	let current;
	const a_slot_template = ctx.$$slots.a;
	const a_slot = create_slot(a_slot_template, ctx, get_a_slot_context);
	const b_slot_template = ctx.$$slots.b;
	const b_slot = create_slot(b_slot_template, ctx, get_b_slot_context);
	const c_slot_template = ctx.$$slots.c;
	const c_slot = create_slot(c_slot_template, ctx, get_c_slot_context);
	let if_block0 = !ctx.fixed && create_if_block_1$1(ctx);
	let if_block1 = ctx.dragging && create_if_block$2();

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			if (a_slot) a_slot.c();
			t0 = space();
			div1 = element("div");
			if (b_slot) b_slot.c();
			t1 = space();
			div2 = element("div");
			if (c_slot) c_slot.c();
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(div0, "class", "pane svelte-1k0d9r4");
			attr(div0, "style", div0_style_value = "" + (ctx.dimension + ": " + ctx.pos + "%;"));
			attr(div1, "class", "pane svelte-1k0d9r4");
			attr(div1, "style", div1_style_value = "" + (ctx.dimension + ": " + (100 - ctx.pos) + "%;"));
			attr(div2, "class", "pane svelte-1k0d9r4");
			attr(div2, "style", div2_style_value = "" + (ctx.dimension + ": " + (100 - ctx.pos) + "%;"));
			attr(div3, "class", "container svelte-1k0d9r4");
			add_render_callback(() => ctx.div3_resize_handler.call(div3));
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);

			if (a_slot) {
				a_slot.m(div0, null);
			}

			append(div3, t0);
			append(div3, div1);

			if (b_slot) {
				b_slot.m(div1, null);
=======
	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

<<<<<<< HEAD
			append(div3, t2);
			if (if_block0) if_block0.m(div3, null);
			div3_resize_listener = add_resize_listener(div3, ctx.div3_resize_handler.bind(div3));
			ctx.div3_binding(div3);
			insert(target, t3, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			if (a_slot && a_slot.p && changed.$$scope) {
				a_slot.p(get_slot_changes(a_slot_template, ctx, changed, get_a_slot_changes), get_slot_context(a_slot_template, ctx, get_a_slot_context));
			}

			if (!current || (changed.dimension || changed.pos) && div0_style_value !== (div0_style_value = "" + (ctx.dimension + ": " + ctx.pos + "%;"))) {
				attr(div0, "style", div0_style_value);
			}

			if (b_slot && b_slot.p && changed.$$scope) {
				b_slot.p(get_slot_changes(b_slot_template, ctx, changed, get_b_slot_changes), get_slot_context(b_slot_template, ctx, get_b_slot_context));
			}

			if (!current || (changed.dimension || changed.pos) && div1_style_value !== (div1_style_value = "" + (ctx.dimension + ": " + (100 - ctx.pos) + "%;"))) {
				attr(div1, "style", div1_style_value);
			}

			if (c_slot && c_slot.p && changed.$$scope) {
				c_slot.p(get_slot_changes(c_slot_template, ctx, changed, get_c_slot_changes), get_slot_context(c_slot_template, ctx, get_c_slot_context));
			}

			if (!current || (changed.dimension || changed.pos) && div2_style_value !== (div2_style_value = "" + (ctx.dimension + ": " + (100 - ctx.pos) + "%;"))) {
				attr(div2, "style", div2_style_value);
			}

			if (!ctx.fixed) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div3, null);
=======
			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
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
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
				}

<<<<<<< HEAD
			if (ctx.dragging) {
				if (!if_block1) {
					if_block1 = create_if_block$2();
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
=======
				check_outros();
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
			}
		},
		i(local) {
			if (current) return;
<<<<<<< HEAD
			transition_in(a_slot, local);
			transition_in(b_slot, local);
			transition_in(c_slot, local);
			current = true;
		},
		o(local) {
			transition_out(a_slot, local);
			transition_out(b_slot, local);
			transition_out(c_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div3);
			if (a_slot) a_slot.d(detaching);
			if (b_slot) b_slot.d(detaching);
			if (c_slot) c_slot.d(detaching);
			if (if_block0) if_block0.d();
			div3_resize_listener.cancel();
			ctx.div3_binding(null);
			if (detaching) detach(t3);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { type } = $$props;
	let { pos = 50 } = $$props;
	let { fixed = false } = $$props;
	let { buffer = 42 } = $$props;
	let { min } = $$props;
	let { max } = $$props;
	let w;
	let h;
	const refs = {};
	let dragging = false;

	function setPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();

		const px = type === "vertical"
		? event.clientY - top
		: event.clientX - left;

		$$invalidate("pos", pos = 100 * px / size);
		dispatch("change");
	}

	function setTouchPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();

		const px = type === "vertical"
		? event.touches[0].clientY - top
		: event.touches[0].clientX - left;

		$$invalidate("pos", pos = 100 * px / size);
		dispatch("change");
	}

	function drag(node, callback) {
		const mousedown = event => {
			if (event.which !== 1) return;
			event.preventDefault();
			$$invalidate("dragging", dragging = true);

			const onmouseup = () => {
				$$invalidate("dragging", dragging = false);
				window.removeEventListener("mousemove", callback, false);
				window.removeEventListener("mouseup", onmouseup, false);
			};

			window.addEventListener("mousemove", callback, false);
			window.addEventListener("mouseup", onmouseup, false);
		};

		node.addEventListener("mousedown", mousedown, false);

		return {
			destroy() {
				node.removeEventListener("mousedown", mousedown, false);
			}
		};
	}

	function touchDrag(node, callback) {
		const touchdown = event => {
			if (event.targetTouches.length > 1) return;
			event.preventDefault();
			$$invalidate("dragging", dragging = true);

			const ontouchend = () => {
				$$invalidate("dragging", dragging = false);
				window.removeEventListener("touchmove", callback, false);
				window.removeEventListener("touchend", ontouchend, false);
			};

			window.addEventListener("touchmove", callback, false);
			window.addEventListener("touchend", ontouchend, false);
		};

		node.addEventListener("touchstart", touchdown, false);
=======

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}
<<<<<<< HEAD
		};
	}

	let { $$slots = {}, $$scope } = $$props;

	function div3_resize_handler() {
		w = this.clientWidth;
		h = this.clientHeight;
		$$invalidate("w", w);
		$$invalidate("h", h);
	}

	function div3_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			refs.container = $$value;
			$$invalidate("refs", refs);
		});
	}

	$$self.$set = $$props => {
		if ("type" in $$props) $$invalidate("type", type = $$props.type);
		if ("pos" in $$props) $$invalidate("pos", pos = $$props.pos);
		if ("fixed" in $$props) $$invalidate("fixed", fixed = $$props.fixed);
		if ("buffer" in $$props) $$invalidate("buffer", buffer = $$props.buffer);
		if ("min" in $$props) $$invalidate("min", min = $$props.min);
		if ("max" in $$props) $$invalidate("max", max = $$props.max);
		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
	};

	let size;
	let side;
	let dimension;

	$$self.$$.update = (changed = { type: 1, h: 1, w: 1, buffer: 1, size: 1, min: 1, pos: 1, max: 1 }) => {
		if (changed.type || changed.h || changed.w) {
			$$invalidate("size", size = type === "vertical" ? h : w);
		}

		if (changed.buffer || changed.size) {
			$$invalidate("min", min = 100 * (buffer / size));
		}

		if (changed.min) {
			$$invalidate("max", max = 100 - min);
		}

		if (changed.pos || changed.min || changed.max) {
			$$invalidate("pos", pos = clamp(pos, min, max));
		}

		if (changed.type) {
			$$invalidate("side", side = type === "horizontal" ? "left" : "top");
		}

		if (changed.type) {
			$$invalidate("dimension", dimension = type === "horizontal" ? "width" : "height");
		}
	};

	return {
		type,
		pos,
		fixed,
		buffer,
		min,
		max,
		w,
		h,
		refs,
		dragging,
		setPos,
		setTouchPos,
		drag,
		touchDrag,
		side,
		dimension,
		div3_resize_handler,
		div3_binding,
		$$slots,
		$$scope
	};
}

class SplitPlane extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			type: 0,
			pos: 0,
			fixed: 0,
			buffer: 0,
			min: 0,
			max: 0
		});
	}
}

/* src/Directory/FileTest.svelte generated by Svelte v3.14.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.path = list[i].path;
	child_ctx.name = list[i].name;
	child_ctx.items = list[i].items;
	return child_ctx;
}

// (17:4) {:else}
=======

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (20:4) {:else}
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
function create_else_block$1(ctx) {
	let li;
	let t_value = ctx.name + "";
	let t;
<<<<<<< HEAD
	let dispose;
=======
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	return {
		c() {
			li = element("li");
			t = text(t_value);
<<<<<<< HEAD
			attr(li, "class", "liFiles svelte-1f5zsql");
			dispose = listen(li, "click", ctx.toggleVisibility(ctx.path));
=======
			attr(li, "class", "liFiles svelte-1dybgjr");
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);
		},
<<<<<<< HEAD
		p(changed, new_ctx) {
			ctx = new_ctx;
			if (changed.fileTree && t_value !== (t_value = ctx.name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
			dispose();
=======
		p(ctx, dirty) {
			if (dirty & /*fileTree*/ 1 && t_value !== (t_value = /*name*/ ctx[4] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		}
	};
}

// (18:4) {#if items.length > 0}
function create_if_block_2(ctx) {
	let li;
	let t_value = ctx.name + "";
	let t;
	let li_class_value;
	let dispose;

	return {
		c() {
			li = element("li");
			t = text(t_value);

			attr(li, "class", li_class_value = "" + (null_to_empty(!ctx.fileState[ctx.path]
			? "liFolderClosed"
<<<<<<< HEAD
			: "liFolderOpen") + " svelte-1f5zsql"));

			dispose = listen(li, "click", ctx.toggleVisibility(ctx.path));
=======
			: "liFolderOpen") + " svelte-1dybgjr"));
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);
		},
		p(changed, new_ctx) {
			ctx = new_ctx;
			if (changed.fileTree && t_value !== (t_value = ctx.name + "")) set_data(t, t_value);

			if ((changed.fileState || changed.fileTree) && li_class_value !== (li_class_value = "" + (null_to_empty(!ctx.fileState[ctx.path]
			? "liFolderClosed"
			: "liFolderOpen") + " svelte-1dybgjr"))) {
				attr(li, "class", li_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(li);
			dispose();
		}
	};
}

<<<<<<< HEAD
// (20:4) {#if fileState[path] && items.length > 0}
function create_if_block$1(ctx) {
=======
// (23:4) {#if fileState[path] && items.length > 0}
function create_if_block_1(ctx) {
	let filetest;
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
	let current;

	const filetest = new FileTest({
			props: { fileTree: ctx.items.sort(func) }
		});

	return {
		c() {
			create_component(filetest.$$.fragment);
		},
		m(target, anchor) {
			mount_component(filetest, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const filetest_changes = {};
			if (changed.fileTree) filetest_changes.fileTree = ctx.items.sort(func);
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

// (16:0) {#each fileTree as {path,name, items}}
function create_each_block(ctx) {
	let ul;
	let t0;
	let t1;
	let current;

<<<<<<< HEAD
	function select_block_type(changed, ctx) {
		if (ctx.items.length > 0) return create_if_block_1;
=======
	function select_block_type(ctx, dirty) {
		if (/*items*/ ctx[5].length > 0) return create_if_block_2;
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		return create_else_block$1;
	}

	let current_block_type = select_block_type(null, ctx);
	let if_block0 = current_block_type(ctx);
<<<<<<< HEAD
	let if_block1 = ctx.fileState[ctx.path] && ctx.items.length > 0 && create_if_block$1(ctx);
=======
	let if_block1 = /*fileState*/ ctx[1][/*path*/ ctx[3]] && /*items*/ ctx[5].length > 0 && create_if_block_1(ctx);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

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
		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block0) {
				if_block0.p(changed, ctx);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(ul, t0);
				}
			}

			if (ctx.fileState[ctx.path] && ctx.items.length > 0) {
				if (if_block1) {
					if_block1.p(changed, ctx);
					transition_in(if_block1, 1);
				} else {
					if_block1 = create_if_block_1(ctx);
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
<<<<<<< HEAD
	let each_value = ctx.fileTree;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});
=======
	let if_block = /*fileTree*/ ctx[0] && create_if_block$1(ctx);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			attr(div, "class", "directory svelte-1dybgjr");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
<<<<<<< HEAD
		p(changed, ctx) {
			if (changed.fileState || changed.fileTree || changed.toggleVisibility) {
				each_value = ctx.fileTree;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
=======
		p(ctx, [dirty]) {
			if (/*fileTree*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*fileTree*/ 1) {
						transition_in(if_block, 1);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block) if_block.d();
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
<<<<<<< HEAD
		if (!fileState[path]) $$invalidate("fileState", fileState[path] = true, fileState); else $$invalidate("fileState", fileState[path] = false, fileState);
	};

	$$self.$set = $$props => {
		if ("fileTree" in $$props) $$invalidate("fileTree", fileTree = $$props.fileTree);
=======
		if (!fileState[path]) $$invalidate(1, fileState[path] = true, fileState); else $$invalidate(1, fileState[path] = false, fileState);
		console.log("fileState", fileState);
	};

	console.log(fileTree);

	$$self.$$set = $$props => {
		if ("fileTree" in $$props) $$invalidate(0, fileTree = $$props.fileTree);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
	};

	return { fileTree, fileState, toggleVisibility };
}

class FileTest extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { fileTree: 0 });
	}
}

<<<<<<< HEAD
/* src/Directory/FileDir.svelte generated by Svelte v3.14.1 */

function create_fragment$1(ctx) {
	let div;
	let button;
	let t1;
	let current;
	let dispose;
	const filetest = new FileTest({ props: { fileTree: ctx.savedTree } });
=======
const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const DirectoryData = writable({
    fileTree: [],
});

/* src/Directory/FileDir.svelte generated by Svelte v3.38.2 */

function create_fragment$1(ctx) {
	let div;
	let filetest;
	let current;

	filetest = new FileTest({
			props: { fileTree: /*savedTree*/ ctx[0] }
		});
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	return {
		c() {
			div = element("div");
			create_component(filetest.$$.fragment);
<<<<<<< HEAD
			attr(button, "class", "directoryButton svelte-1b6lq6o");
			attr(div, "class", "directoryContainer svelte-1b6lq6o");
			dispose = listen(button, "click", ctx.handleOpenFolder);
=======
			attr(div, "class", "directoryContainer svelte-jjeu0z");
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(filetest, div, null);
			current = true;
		},
		p(changed, ctx) {
			const filetest_changes = {};
			if (changed.savedTree) filetest_changes.fileTree = ctx.savedTree;
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
<<<<<<< HEAD
			dispose();
=======
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let savedTree = [];
	var remote = window.require("electron").remote;
	var electronFs = remote.require("fs");
	const { ipcRenderer } = require("electron");
	let directory;

<<<<<<< HEAD
	const handleOpenFolder = () => {
		let dialogOption = { properties: ["openDirectory"] };

		dialog.showOpenDialog(dialogOption).then(filenames => {
			var directory = filenames.filePaths;

			if (directory && directory[0]) {
				var fileTree = new FileTree(directory[0]);
				fileTree.build();
				$$invalidate("savedTree", savedTree = fileTree.items);
=======
	const unsub = DirectoryData.subscribe(data => {
		console.log("File Directory Store Subscription");
		console.log("data", data);
	});

	// store 
	onMount(() => {
		
	}); // console.log('Directory mounted')

	onDestroy(() => {
		unsub();
	}); // console.log('component destroyed');

	ipcRenderer.on("folder-opened", function (evt, file, content) {
		directory = content;
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

		if (directory && directory[0]) {
			var fileTree = new FileTree(directory[0]);
			fileTree.build();
			$$invalidate(0, savedTree = fileTree.items);

<<<<<<< HEAD
				console.log("fileTree", savedTree);
			}
		});
	};
=======
			savedTree.sort((a, b) => {
				return b.items.length - a.items.length;
			});

			DirectoryData.update(currentData => {
				return savedTree;
			});

			//console.log(Array.isArray(savedTree))
			console.log("fileTree", savedTree);
		}
	});
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

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
		}

		build() {
			this.items = FileTree.readDir(this.path, "", 0);
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

<<<<<<< HEAD
	return { savedTree, handleOpenFolder };
=======
	return [savedTree];
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
}

class FileDir extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
	}
}

/* src/App.svelte generated by Svelte v3.14.1 */

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

<<<<<<< HEAD
// (102:8) {#if monacoValue !== ''}
=======
// (77:12) {#if monacoValue !== ''}
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
function create_if_block(ctx) {
	let current;

	let monaco_1_props = {
<<<<<<< HEAD
		value: ctx.monacoValue,
		language: ctx.monacoLanguage
	};

	const monaco_1 = new Monaco_editor({ props: monaco_1_props });
	ctx.monaco_1_binding(monaco_1);
=======
		value: /*monacoValue*/ ctx[1],
		language: /*monacoLanguage*/ ctx[3]
	};

	monaco_1 = new Monaco_editor({ props: monaco_1_props });
	/*monaco_1_binding*/ ctx[7](monaco_1);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	return {
		c() {
			create_component(monaco_1.$$.fragment);
		},
		m(target, anchor) {
			mount_component(monaco_1, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const monaco_1_changes = {};
<<<<<<< HEAD
			if (changed.monacoValue) monaco_1_changes.value = ctx.monacoValue;
			if (changed.monacoLanguage) monaco_1_changes.language = ctx.monacoLanguage;
=======
			if (dirty & /*monacoValue*/ 2) monaco_1_changes.value = /*monacoValue*/ ctx[1];
			if (dirty & /*monacoLanguage*/ 8) monaco_1_changes.language = /*monacoLanguage*/ ctx[3];
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
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
<<<<<<< HEAD
			ctx.monaco_1_binding(null);
=======
			/*monaco_1_binding*/ ctx[7](null);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
			destroy_component(monaco_1, detaching);
		}
	};
}

<<<<<<< HEAD
// (101:4) <section slot=a>
function create_a_slot(ctx) {
	let section;
=======
function create_fragment(ctx) {
	let body;
	let main;
	let div0;
	let filedir;
	let t0;
	let div1;
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
	let current_block_type_index;
	let if_block;
	let t1;
	let div2;
	let t3;
	let div5;
	let div4;
	let div3;
	let h11;
	let t4;
	let t5;
	let t6;
	let t7;
	let div7;
	let current;
	filedir = new FileDir({});
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(changed, ctx) {
		if (ctx.monacoValue !== "") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(null, ctx);
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
<<<<<<< HEAD
			attr(section, "slot", "a");
			attr(section, "class", "svelte-1vf0yfa");
=======
			t1 = space();
			div2 = element("div");
			div2.innerHTML = `<h1>State Manager</h1>`;
			t3 = space();
			div5 = element("div");
			div4 = element("div");
			div3 = element("div");
			h11 = element("h1");
			t4 = text("Hello ");
			t5 = text(/*name*/ ctx[0]);
			t6 = text("!");
			t7 = space();
			div7 = element("div");
			div7.innerHTML = `<div><h1>Terminal</h1></div>`;
			attr(div0, "class", "box a svelte-wr2qwc");
			attr(div1, "class", "box b svelte-wr2qwc");
			attr(div2, "class", "box c svelte-wr2qwc");
			attr(div5, "class", "box d svelte-wr2qwc");
			attr(div7, "class", "box e svelte-wr2qwc");
			attr(main, "class", "wrapper svelte-wr2qwc");
			attr(body, "class", "svelte-wr2qwc");
			toggle_class(body, "orientation", /*orientation*/ ctx[2]);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
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
			append(div5, div4);
			append(div4, div3);
			append(div3, h11);
			append(h11, t4);
			append(h11, t5);
			append(h11, t6);
			append(main, t7);
			append(main, div7);
			current = true;
		},
<<<<<<< HEAD
		p(changed, ctx) {
=======
		p(ctx, [dirty]) {
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(changed, ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
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
				}

				transition_in(if_block, 1);
				if_block.m(div1, null);
			}
<<<<<<< HEAD
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			if_blocks[current_block_type_index].d();
		}
	};
}

// (108:4) <section  slot=b style='height: 100%;'>
function create_b_slot(ctx) {
	let section;
	let div1;
	let div0;
	let h1;
	let t0;
	let t1;
	let t2;

	return {
		c() {
			section = element("section");
			div1 = element("div");
			div0 = element("div");
			h1 = element("h1");
			t0 = text("Hello ");
			t1 = text(ctx.name);
			t2 = text("!");
			attr(h1, "class", "svelte-1vf0yfa");
			attr(section, "slot", "b");
			set_style(section, "height", "100%");
			attr(section, "class", "svelte-1vf0yfa");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div1);
			append(div1, div0);
			append(div0, h1);
			append(h1, t0);
			append(h1, t1);
			append(h1, t2);
		},
		p(changed, ctx) {
			if (changed.name) set_data(t1, ctx.name);
		},
		d(detaching) {
			if (detaching) detach(section);
		}
	};
}

// (115:4) <section slot=c style='height: 100%;'>
function create_c_slot(ctx) {
	let section;
	let div;
	let current;
	const filedir = new FileDir({});

	return {
		c() {
			section = element("section");
			div = element("div");
			create_component(filedir.$$.fragment);
			attr(div, "class", "directory svelte-1vf0yfa");
			attr(section, "slot", "c");
			set_style(section, "height", "100%");
			attr(section, "class", "svelte-1vf0yfa");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div);
			mount_component(filedir, div, null);
			current = true;
=======

			if (!current || dirty & /*name*/ 1) set_data(t5, /*name*/ ctx[0]);

			if (dirty & /*orientation*/ 4) {
				toggle_class(body, "orientation", /*orientation*/ ctx[2]);
			}
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		},
		i(local) {
			if (current) return;
			transition_in(filedir.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(filedir.$$.fragment, local);
<<<<<<< HEAD
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			destroy_component(filedir);
		}
	};
}

// (95:8) <SplitPane   type="{orientation === 'rows' ? 'vertical' : 'horizontal'}"   pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"   {fixed}  >
function create_default_slot(ctx) {
	let t0;
	let t1;

	return {
		c() {
			t0 = space();
			t1 = space();
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(t0);
			if (detaching) detach(t1);
		}
	};
}

function create_fragment(ctx) {
	let body;
	let main;
	let button;
	let t1;
	let current;
	let dispose;

	const splitpane = new SplitPlane({
			props: {
				type: ctx.orientation === "rows" ? "vertical" : "horizontal",
				pos: ctx.fixed
				? ctx.fixedPos
				: ctx.orientation === "rows" ? 50 : 60,
				fixed: ctx.fixed,
				$$slots: {
					default: [create_default_slot],
					c: [create_c_slot],
					b: [create_b_slot],
					a: [create_a_slot]
				},
				$$scope: { ctx }
			}
		});

	return {
		c() {
			body = element("body");
			main = element("main");
			button = element("button");
			button.textContent = "Get File";
			t1 = space();
			create_component(splitpane.$$.fragment);
			attr(main, "class", "svelte-1vf0yfa");
			attr(body, "class", "container svelte-1vf0yfa");
			toggle_class(body, "orientation", ctx.orientation);
			dispose = listen(button, "click", ctx.onClick);
		},
		m(target, anchor) {
			insert(target, body, anchor);
			append(body, main);
			append(main, button);
			append(main, t1);
			mount_component(splitpane, main, null);
			current = true;
		},
		p(changed, ctx) {
			const splitpane_changes = {};
			if (changed.orientation) splitpane_changes.type = ctx.orientation === "rows" ? "vertical" : "horizontal";

			if (changed.fixed || changed.fixedPos || changed.orientation) splitpane_changes.pos = ctx.fixed
			? ctx.fixedPos
			: ctx.orientation === "rows" ? 50 : 60;

			if (changed.fixed) splitpane_changes.fixed = ctx.fixed;

			if (changed.$$scope || changed.name || changed.monacoValue || changed.monacoLanguage || changed.monaco) {
				splitpane_changes.$$scope = { changed, ctx };
			}

			splitpane.$set(splitpane_changes);

			if (changed.orientation) {
				toggle_class(body, "orientation", ctx.orientation);
			}
		},
		i(local) {
			if (current) return;
			transition_in(splitpane.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(splitpane.$$.fragment, local);
=======
			transition_out(if_block);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
			current = false;
		},
		d(detaching) {
			if (detaching) detach(body);
<<<<<<< HEAD
			destroy_component(splitpane);
			dispose();
=======
			destroy_component(filedir);
			if_blocks[current_block_type_index].d();
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	const { ipcRenderer } = require("electron");
	let { name } = $$props;
	let { orientation = "columns" } = $$props;
	let { fixed = false } = $$props;
	let { fixedPos = 50 } = $$props;
	let { monacoValue = "" } = $$props;
	let { monacoLanguage = "" } = $$props;

<<<<<<< HEAD
	const onClick = () => {
		ipcRenderer.invoke("getFileFromUser").then(() => {
			ipcRenderer.on("file-opened", (event, file, content) => {
				$$invalidate("monacoLanguage", monacoLanguage = file.split(".").pop());
				$$invalidate("monacoValue", monacoValue = content.split(/\r?\n/));
				console.log(monacoValue);
			});
		});
	};
=======
	ipcRenderer.on("file-opened", function (evt, file, content) {
		$$invalidate(1, monacoValue = content.split(/\r?\n/));
	});
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864

	let monaco;
	window["monaco"] = monaco;
	$$invalidate("name", name = "World");

	function monaco_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
<<<<<<< HEAD
			$$invalidate("monaco", monaco = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("orientation" in $$props) $$invalidate("orientation", orientation = $$props.orientation);
		if ("fixed" in $$props) $$invalidate("fixed", fixed = $$props.fixed);
		if ("fixedPos" in $$props) $$invalidate("fixedPos", fixedPos = $$props.fixedPos);
		if ("monacoValue" in $$props) $$invalidate("monacoValue", monacoValue = $$props.monacoValue);
		if ("monacoLanguage" in $$props) $$invalidate("monacoLanguage", monacoLanguage = $$props.monacoLanguage);
=======
			monaco = $$value;
			$$invalidate(4, monaco);
		});
	}

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("orientation" in $$props) $$invalidate(2, orientation = $$props.orientation);
		if ("fixed" in $$props) $$invalidate(5, fixed = $$props.fixed);
		if ("fixedPos" in $$props) $$invalidate(6, fixedPos = $$props.fixedPos);
		if ("monacoValue" in $$props) $$invalidate(1, monacoValue = $$props.monacoValue);
		if ("monacoLanguage" in $$props) $$invalidate(3, monacoLanguage = $$props.monacoLanguage);
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
	};

	return {
		name,
<<<<<<< HEAD
=======
		monacoValue,
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		orientation,
		monacoLanguage,
		monaco,
		fixed,
		fixedPos,
<<<<<<< HEAD
		monacoValue,
		monacoLanguage,
		onClick,
		monaco,
=======
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		monaco_1_binding
	};
}

class App extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			name: 0,
<<<<<<< HEAD
			orientation: 0,
			fixed: 0,
			fixedPos: 0,
			monacoValue: 0,
			monacoLanguage: 0
=======
			orientation: 2,
			fixed: 5,
			fixedPos: 6,
			monacoValue: 1,
			monacoLanguage: 3
>>>>>>> ac1674d507a50180b392eb0a736f30e18d4a4864
		});
	}
}

const app = new App({
    target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
//# sourceMappingURL=svelte.js.map


(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
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
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
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

/* src/components/monaco/monaco-editor.svelte generated by Svelte v3.38.2 */

function create_fragment$4(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			attr(div, "class", "monaco-container");
			set_style(div, "height", "500px");
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
monaco_promise = import('./monaco-033b02c4.js').then(function (n) { return n.m; });

monaco_promise.then(mod => {
	_monaco = mod.default;
});

function instance$4($$self, $$props, $$invalidate) {
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
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 1, language: 2 });
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

/* src/SplitPlane.svelte generated by Svelte v3.38.2 */
const get_b_slot_changes = dirty => ({});
const get_b_slot_context = ctx => ({});
const get_a_slot_changes = dirty => ({});
const get_a_slot_context = ctx => ({});

// (206:1) {#if !fixed}
function create_if_block_1$1(ctx) {
	let div;
	let div_class_value;
	let div_style_value;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			attr(div, "class", div_class_value = "" + (/*type*/ ctx[1] + " divider" + " svelte-1k0d9r4"));
			attr(div, "style", div_style_value = "" + (/*side*/ ctx[7] + ": calc(" + /*pos*/ ctx[0] + "% - 8px)"));
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (!mounted) {
				dispose = [
					action_destroyer(/*drag*/ ctx[11].call(null, div, /*setPos*/ ctx[9])),
					action_destroyer(/*touchDrag*/ ctx[12].call(null, div, /*setTouchPos*/ ctx[10]))
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*type*/ 2 && div_class_value !== (div_class_value = "" + (/*type*/ ctx[1] + " divider" + " svelte-1k0d9r4"))) {
				attr(div, "class", div_class_value);
			}

			if (dirty & /*side, pos*/ 129 && div_style_value !== (div_style_value = "" + (/*side*/ ctx[7] + ": calc(" + /*pos*/ ctx[0] + "% - 8px)"))) {
				attr(div, "style", div_style_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (211:0) {#if dragging}
function create_if_block$2(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			attr(div, "class", "mousecatcher svelte-1k0d9r4");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$3(ctx) {
	let div2;
	let div0;
	let div0_style_value;
	let t0;
	let div1;
	let div1_style_value;
	let t1;
	let div2_resize_listener;
	let t2;
	let if_block1_anchor;
	let current;
	const a_slot_template = /*#slots*/ ctx[18].a;
	const a_slot = create_slot(a_slot_template, ctx, /*$$scope*/ ctx[17], get_a_slot_context);
	const b_slot_template = /*#slots*/ ctx[18].b;
	const b_slot = create_slot(b_slot_template, ctx, /*$$scope*/ ctx[17], get_b_slot_context);
	let if_block0 = !/*fixed*/ ctx[2] && create_if_block_1$1(ctx);
	let if_block1 = /*dragging*/ ctx[6] && create_if_block$2();

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			if (a_slot) a_slot.c();
			t0 = space();
			div1 = element("div");
			if (b_slot) b_slot.c();
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(div0, "class", "pane svelte-1k0d9r4");
			attr(div0, "style", div0_style_value = "" + (/*dimension*/ ctx[8] + ": " + /*pos*/ ctx[0] + "%;"));
			attr(div1, "class", "pane svelte-1k0d9r4");
			attr(div1, "style", div1_style_value = "" + (/*dimension*/ ctx[8] + ": " + (100 - /*pos*/ ctx[0]) + "%;"));
			attr(div2, "class", "container svelte-1k0d9r4");
			add_render_callback(() => /*div2_elementresize_handler*/ ctx[20].call(div2));
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);

			if (a_slot) {
				a_slot.m(div0, null);
			}

			append(div2, t0);
			append(div2, div1);

			if (b_slot) {
				b_slot.m(div1, null);
			}

			append(div2, t1);
			if (if_block0) if_block0.m(div2, null);
			/*div2_binding*/ ctx[19](div2);
			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[20].bind(div2));
			insert(target, t2, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (a_slot) {
				if (a_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
					update_slot(a_slot, a_slot_template, ctx, /*$$scope*/ ctx[17], dirty, get_a_slot_changes, get_a_slot_context);
				}
			}

			if (!current || dirty & /*dimension, pos*/ 257 && div0_style_value !== (div0_style_value = "" + (/*dimension*/ ctx[8] + ": " + /*pos*/ ctx[0] + "%;"))) {
				attr(div0, "style", div0_style_value);
			}

			if (b_slot) {
				if (b_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
					update_slot(b_slot, b_slot_template, ctx, /*$$scope*/ ctx[17], dirty, get_b_slot_changes, get_b_slot_context);
				}
			}

			if (!current || dirty & /*dimension, pos*/ 257 && div1_style_value !== (div1_style_value = "" + (/*dimension*/ ctx[8] + ": " + (100 - /*pos*/ ctx[0]) + "%;"))) {
				attr(div1, "style", div1_style_value);
			}

			if (!/*fixed*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div2, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*dragging*/ ctx[6]) {
				if (if_block1) ; else {
					if_block1 = create_if_block$2();
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(a_slot, local);
			transition_in(b_slot, local);
			current = true;
		},
		o(local) {
			transition_out(a_slot, local);
			transition_out(b_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			if (a_slot) a_slot.d(detaching);
			if (b_slot) b_slot.d(detaching);
			if (if_block0) if_block0.d();
			/*div2_binding*/ ctx[19](null);
			div2_resize_listener();
			if (detaching) detach(t2);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let size;
	let side;
	let dimension;
	let { $$slots: slots = {}, $$scope } = $$props;
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

		$$invalidate(0, pos = 100 * px / size);
		dispatch("change");
	}

	function setTouchPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();

		const px = type === "vertical"
		? event.touches[0].clientY - top
		: event.touches[0].clientX - left;

		$$invalidate(0, pos = 100 * px / size);
		dispatch("change");
	}

	function drag(node, callback) {
		const mousedown = event => {
			if (event.which !== 1) return;
			event.preventDefault();
			$$invalidate(6, dragging = true);

			const onmouseup = () => {
				$$invalidate(6, dragging = false);
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
			$$invalidate(6, dragging = true);

			const ontouchend = () => {
				$$invalidate(6, dragging = false);
				window.removeEventListener("touchmove", callback, false);
				window.removeEventListener("touchend", ontouchend, false);
			};

			window.addEventListener("touchmove", callback, false);
			window.addEventListener("touchend", ontouchend, false);
		};

		node.addEventListener("touchstart", touchdown, false);

		return {
			destroy() {
				node.removeEventListener("touchstart", touchdown, false);
			}
		};
	}

	function div2_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			refs.container = $$value;
			$$invalidate(5, refs);
		});
	}

	function div2_elementresize_handler() {
		w = this.clientWidth;
		h = this.clientHeight;
		$$invalidate(3, w);
		$$invalidate(4, h);
	}

	$$self.$$set = $$props => {
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("pos" in $$props) $$invalidate(0, pos = $$props.pos);
		if ("fixed" in $$props) $$invalidate(2, fixed = $$props.fixed);
		if ("buffer" in $$props) $$invalidate(15, buffer = $$props.buffer);
		if ("min" in $$props) $$invalidate(13, min = $$props.min);
		if ("max" in $$props) $$invalidate(14, max = $$props.max);
		if ("$$scope" in $$props) $$invalidate(17, $$scope = $$props.$$scope);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*type, h, w*/ 26) {
			$$invalidate(16, size = type === "vertical" ? h : w);
		}

		if ($$self.$$.dirty & /*buffer, size*/ 98304) {
			$$invalidate(13, min = 100 * (buffer / size));
		}

		if ($$self.$$.dirty & /*min*/ 8192) {
			$$invalidate(14, max = 100 - min);
		}

		if ($$self.$$.dirty & /*pos, min, max*/ 24577) {
			$$invalidate(0, pos = clamp(pos, min, max));
		}

		if ($$self.$$.dirty & /*type*/ 2) {
			$$invalidate(7, side = type === "horizontal" ? "left" : "top");
		}

		if ($$self.$$.dirty & /*type*/ 2) {
			$$invalidate(8, dimension = type === "horizontal" ? "width" : "height");
		}
	};

	return [
		pos,
		type,
		fixed,
		w,
		h,
		refs,
		dragging,
		side,
		dimension,
		setPos,
		setTouchPos,
		drag,
		touchDrag,
		min,
		max,
		buffer,
		size,
		$$scope,
		slots,
		div2_binding,
		div2_elementresize_handler
	];
}

class SplitPlane extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			type: 1,
			pos: 0,
			fixed: 2,
			buffer: 15,
			min: 13,
			max: 14
		});
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

// (15:4) {:else}
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
			attr(li, "class", "liFiles svelte-1ov1meg");
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

// (13:4) {#if items.length > 0}
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
			: "liFolderOpen") + " svelte-1ov1meg"));
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
			: "liFolderOpen") + " svelte-1ov1meg"))) {
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

// (18:4) {#if fileState[path] && items.length > 0}
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

// (11:0) {#each fileTree as {path,name, items}}
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
	let each_1_anchor;
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
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
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
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
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

/* src/Directory/FileDir.svelte generated by Svelte v3.38.2 */

function create_fragment$1(ctx) {
	let div;
	let button;
	let t1;
	let filetest;
	let current;
	let mounted;
	let dispose;

	filetest = new FileTest({
			props: { fileTree: /*savedTree*/ ctx[0] }
		});

	return {
		c() {
			div = element("div");
			button = element("button");
			button.textContent = "Get Files";
			t1 = space();
			create_component(filetest.$$.fragment);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			append(div, t1);
			mount_component(filetest, div, null);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*handleOpenFolder*/ ctx[1]);
				mounted = true;
			}
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
			mounted = false;
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	var remote = window.require("electron").remote;
	var electronFs = remote.require("fs");
	var { dialog } = remote;
	let savedTree = [];

	const handleOpenFolder = () => {
		//console.log('saved Tree', savedTree)
		let dialogOption = { properties: ["openDirectory"] };

		//console.log(dialog)
		dialog.showOpenDialog(dialogOption).then(filenames => {
			var directory = filenames.filePaths;

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
	};

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

	return [savedTree, handleOpenFolder];
}

class FileDir extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
	}
}

/* src/App.svelte generated by Svelte v3.38.2 */

function create_else_block(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "Get A File";
			attr(p, "class", "svelte-1uz57lu");
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

// (106:8) {#if monacoValue !== ''}
function create_if_block(ctx) {
	let monaco_1;
	let current;

	let monaco_1_props = {
		value: /*monacoValue*/ ctx[1],
		language: /*monacoLanguage*/ ctx[2]
	};

	monaco_1 = new Monaco_editor({ props: monaco_1_props });
	/*monaco_1_binding*/ ctx[8](monaco_1);

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
			if (dirty & /*monacoValue*/ 2) monaco_1_changes.value = /*monacoValue*/ ctx[1];
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
			/*monaco_1_binding*/ ctx[8](null);
			destroy_component(monaco_1, detaching);
		}
	};
}

// (105:4) 
function create_a_slot(ctx) {
	let section;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*monacoValue*/ ctx[1] !== "") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			section = element("section");
			if_block.c();
			attr(section, "slot", "a");
			attr(section, "class", "svelte-1uz57lu");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			if_blocks[current_block_type_index].m(section, null);
			current = true;
		},
		p(ctx, dirty) {
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
				if_block.m(section, null);
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
			if (detaching) detach(section);
			if_blocks[current_block_type_index].d();
		}
	};
}

// (112:4) 
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
			t1 = text(/*name*/ ctx[0]);
			t2 = text("!");
			attr(h1, "class", "svelte-1uz57lu");
			attr(div1, "class", "svelte-1uz57lu");
			attr(section, "slot", "b");
			set_style(section, "height", "100%");
			attr(section, "class", "svelte-1uz57lu");
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
		p(ctx, dirty) {
			if (dirty & /*name*/ 1) set_data(t1, /*name*/ ctx[0]);
		},
		d(detaching) {
			if (detaching) detach(section);
		}
	};
}

// (119:4) 
function create_c_slot(ctx) {
	let section;
	let div;
	let filedir;
	let current;
	filedir = new FileDir({});

	return {
		c() {
			section = element("section");
			div = element("div");
			create_component(filedir.$$.fragment);
			attr(div, "class", "directory svelte-1uz57lu");
			attr(section, "slot", "c");
			set_style(section, "height", "100%");
			attr(section, "class", "svelte-1uz57lu");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div);
			mount_component(filedir, div, null);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(filedir.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(filedir.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			destroy_component(filedir);
		}
	};
}

function create_fragment(ctx) {
	let body;
	let main;
	let button;
	let t1;
	let splitpane;
	let current;
	let mounted;
	let dispose;

	splitpane = new SplitPlane({
			props: {
				type: /*orientation*/ ctx[3] === "rows"
				? "vertical"
				: "horizontal",
				pos: /*fixed*/ ctx[4]
				? /*fixedPos*/ ctx[5]
				: /*orientation*/ ctx[3] === "rows" ? 50 : 60,
				fixed: /*fixed*/ ctx[4],
				$$slots: {
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
			attr(main, "class", "svelte-1uz57lu");
			attr(body, "class", "container svelte-1uz57lu");
			toggle_class(body, "orientation", /*orientation*/ ctx[3]);
		},
		m(target, anchor) {
			insert(target, body, anchor);
			append(body, main);
			append(main, button);
			append(main, t1);
			mount_component(splitpane, main, null);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*onClick*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const splitpane_changes = {};

			if (dirty & /*orientation*/ 8) splitpane_changes.type = /*orientation*/ ctx[3] === "rows"
			? "vertical"
			: "horizontal";

			if (dirty & /*fixed, fixedPos, orientation*/ 56) splitpane_changes.pos = /*fixed*/ ctx[4]
			? /*fixedPos*/ ctx[5]
			: /*orientation*/ ctx[3] === "rows" ? 50 : 60;

			if (dirty & /*fixed*/ 16) splitpane_changes.fixed = /*fixed*/ ctx[4];

			if (dirty & /*$$scope, name, monacoValue, monacoLanguage, monaco*/ 1095) {
				splitpane_changes.$$scope = { dirty, ctx };
			}

			splitpane.$set(splitpane_changes);

			if (dirty & /*orientation*/ 8) {
				toggle_class(body, "orientation", /*orientation*/ ctx[3]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(splitpane.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(splitpane.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(body);
			destroy_component(splitpane);
			mounted = false;
			dispose();
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

	const onClick = () => {
		ipcRenderer.invoke("getFileFromUser").then(() => {
			ipcRenderer.on("file-opened", (event, file, content) => {
				if (monacoValue.length > 1 && monacoLanguage.length > 1) {
					$$invalidate(2, monacoLanguage = "");
					$$invalidate(1, monacoValue = "");
				}

				$$invalidate(2, monacoLanguage = file.split(".").pop());
				$$invalidate(1, monacoValue = content.split(/\r?\n/));
				console.log(monacoValue);
			});
		});
	};

	let monaco;
	window["monaco"] = monaco;
	name = "World";

	function monaco_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			monaco = $$value;
			$$invalidate(6, monaco);
		});
	}

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("orientation" in $$props) $$invalidate(3, orientation = $$props.orientation);
		if ("fixed" in $$props) $$invalidate(4, fixed = $$props.fixed);
		if ("fixedPos" in $$props) $$invalidate(5, fixedPos = $$props.fixedPos);
		if ("monacoValue" in $$props) $$invalidate(1, monacoValue = $$props.monacoValue);
		if ("monacoLanguage" in $$props) $$invalidate(2, monacoLanguage = $$props.monacoLanguage);
	};

	return [
		name,
		monacoValue,
		monacoLanguage,
		orientation,
		fixed,
		fixedPos,
		monaco,
		onClick,
		monaco_1_binding
	];
}

class App extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			name: 0,
			orientation: 3,
			fixed: 4,
			fixedPos: 5,
			monacoValue: 1,
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

export default app;
//# sourceMappingURL=svelte.js.map

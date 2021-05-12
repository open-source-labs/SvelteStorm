
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

/**
 * Clamp `num` to the range `[min, max]`
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
function clamp(num, min, max) {
	return num < min ? min : num > max ? max : num;
}

/* src\SplitPlane.svelte generated by Svelte v3.38.2 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-1k0d9r4-style";
	style.textContent = ".container.svelte-1k0d9r4{position:relative;width:100%;height:100%}.pane.svelte-1k0d9r4{position:relative;float:left;width:100%;height:100%;overflow:auto}.mousecatcher.svelte-1k0d9r4{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(255,255,255,.01)}.divider.svelte-1k0d9r4{position:absolute;z-index:10;display:none}.divider.svelte-1k0d9r4::after{content:'';position:absolute;background-color:var(--second)}.horizontal.svelte-1k0d9r4{padding:0 8px;width:0;height:100%;cursor:ew-resize}.horizontal.svelte-1k0d9r4::after{left:8px;top:0;width:1px;height:100%}.vertical.svelte-1k0d9r4{padding:8px 0;width:100%;height:0;cursor:ns-resize}.vertical.svelte-1k0d9r4::after{top:8px;left:0;width:100%;height:1px}.left.svelte-1k0d9r4,.right.svelte-1k0d9r4,.divider.svelte-1k0d9r4{display:block}.left.svelte-1k0d9r4,.right.svelte-1k0d9r4{height:100%;float:left}.top.svelte-1k0d9r4,.bottom.svelte-1k0d9r4{position:absolute;width:100%}.top.svelte-1k0d9r4{top:0}.bottom.svelte-1k0d9r4{bottom:0}";
	append(document.head, style);
}

const get_b_slot_changes = dirty => ({});
const get_b_slot_context = ctx => ({});
const get_a_slot_changes = dirty => ({});
const get_a_slot_context = ctx => ({});

// (200:1) {#if !fixed}
function create_if_block_1(ctx) {
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

// (205:0) {#if dragging}
function create_if_block(ctx) {
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

function create_fragment$1(ctx) {
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
	let if_block0 = !/*fixed*/ ctx[2] && create_if_block_1(ctx);
	let if_block1 = /*dragging*/ ctx[6] && create_if_block();

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
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(div2, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*dragging*/ ctx[6]) {
				if (if_block1) ; else {
					if_block1 = create_if_block();
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

function instance$1($$self, $$props, $$invalidate) {
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
		if (!document.getElementById("svelte-1k0d9r4-style")) add_css$1();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			type: 1,
			pos: 0,
			fixed: 2,
			buffer: 15,
			min: 13,
			max: 14
		});
	}
}

/* src\App.svelte generated by Svelte v3.38.2 */

function add_css() {
	var style = element("style");
	style.id = "svelte-6n1k3d-style";
	style.textContent = "main.svelte-6n1k3d.svelte-6n1k3d.svelte-6n1k3d{text-align:center;padding:1em;max-width:240px;margin:0 auto}h1.svelte-6n1k3d.svelte-6n1k3d.svelte-6n1k3d{color:#ff3e00;text-transform:uppercase;font-size:4em;font-weight:100}@media(min-width: 640px){main.svelte-6n1k3d.svelte-6n1k3d.svelte-6n1k3d{max-width:none}}.container.svelte-6n1k3d.svelte-6n1k3d.svelte-6n1k3d{position:relative;width:100%;height:100%}.container.svelte-6n1k3d section.svelte-6n1k3d.svelte-6n1k3d{position:relative;padding:42px 0 0 0;height:100%;box-sizing:border-box}.container.svelte-6n1k3d section.svelte-6n1k3d>.svelte-6n1k3d*:first-child{position:absolute;top:0;left:0;width:100%;height:42px;box-sizing:border-box}.container.svelte-6n1k3d section.svelte-6n1k3d>.svelte-6n1k3d*:last-child{width:100%;height:100%}";
	append(document.head, style);
}

// (69:4) 
function create_a_slot(ctx) {
	let section;

	return {
		c() {
			section = element("section");
			section.innerHTML = `<h1 class="svelte-6n1k3d">Hello</h1>`;
			attr(section, "slot", "a");
			attr(section, "class", "svelte-6n1k3d");
		},
		m(target, anchor) {
			insert(target, section, anchor);
		},
		d(detaching) {
			if (detaching) detach(section);
		}
	};
}

// (75:4) 
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
			attr(h1, "class", "svelte-6n1k3d");
			attr(div1, "class", "svelte-6n1k3d");
			attr(section, "slot", "b");
			set_style(section, "height", "100%");
			attr(section, "class", "svelte-6n1k3d");
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

function create_fragment(ctx) {
	let main;
	let body;
	let splitpane;
	let current;

	splitpane = new SplitPlane({
			props: {
				type: /*orientation*/ ctx[1] === "rows"
				? "vertical"
				: "horizontal",
				pos: /*fixed*/ ctx[2]
				? /*fixedPos*/ ctx[3]
				: /*orientation*/ ctx[1] === "rows" ? 50 : 60,
				fixed: /*fixed*/ ctx[2],
				$$slots: { b: [create_b_slot], a: [create_a_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			main = element("main");
			body = element("body");
			create_component(splitpane.$$.fragment);
			attr(body, "class", "container svelte-6n1k3d");
			toggle_class(body, "orientation", /*orientation*/ ctx[1]);
			attr(main, "class", "svelte-6n1k3d");
		},
		m(target, anchor) {
			insert(target, main, anchor);
			append(main, body);
			mount_component(splitpane, body, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const splitpane_changes = {};

			if (dirty & /*orientation*/ 2) splitpane_changes.type = /*orientation*/ ctx[1] === "rows"
			? "vertical"
			: "horizontal";

			if (dirty & /*fixed, fixedPos, orientation*/ 14) splitpane_changes.pos = /*fixed*/ ctx[2]
			? /*fixedPos*/ ctx[3]
			: /*orientation*/ ctx[1] === "rows" ? 50 : 60;

			if (dirty & /*fixed*/ 4) splitpane_changes.fixed = /*fixed*/ ctx[2];

			if (dirty & /*$$scope, name*/ 33) {
				splitpane_changes.$$scope = { dirty, ctx };
			}

			splitpane.$set(splitpane_changes);

			if (dirty & /*orientation*/ 2) {
				toggle_class(body, "orientation", /*orientation*/ ctx[1]);
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
			if (detaching) detach(main);
			destroy_component(splitpane);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { name } = $$props;
	let { orientation = "columns" } = $$props;
	let { fixed = false } = $$props;
	let { fixedPos = 50 } = $$props;
	let monaco;
	window["monaco"] = monaco;
	name = "Butt";

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("orientation" in $$props) $$invalidate(1, orientation = $$props.orientation);
		if ("fixed" in $$props) $$invalidate(2, fixed = $$props.fixed);
		if ("fixedPos" in $$props) $$invalidate(3, fixedPos = $$props.fixedPos);
	};

	return [name, orientation, fixed, fixedPos];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-6n1k3d-style")) add_css();

		init(this, options, instance, create_fragment, safe_not_equal, {
			name: 0,
			orientation: 1,
			fixed: 2,
			fixedPos: 3
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


// @observablehq/runtime v4.23.0 Copyright 2022 Observable, Inc.
function e(e, t, n) {
	n = n || {};
	var r = e.ownerDocument,
		o = r.defaultView.CustomEvent;
	"function" == typeof o ? o = new o(t, {
			detail: n
		}) : ((o = r.createEvent("Event")).initEvent(t, !1, !1), o.detail = n),
		e.dispatchEvent(o)
}

function t(e) {
	return Array.isArray(e) || e instanceof Int8Array ||
		e instanceof Int16Array || e instanceof Int32Array ||
		e instanceof Uint8Array || e instanceof Uint8ClampedArray ||
		e instanceof Uint16Array || e instanceof Uint32Array ||
		e instanceof Float32Array || e instanceof Float64Array
}

function n(e) {
	return e === (0 | e) + ""
}

function r(e) {
	const t = document.createElement("span");
	return t.className = "observablehq--cellname", t.textContent = `${e} = `, t
}
const o = Symbol.prototype.toString;

function i(e) {
	return o.call(e)
}
const {
	getOwnPropertySymbols: a,
	prototype: {
		hasOwnProperty: s
	}
} = Object, {
	toStringTag: c
} = Symbol, l = {}, u = a;

function d(e, t) {
	return s.call(e, t)
}

function f(e) {
	return e[c] || e.constructor && e.constructor.name || "Object"
}

function h(e, t) {
	try {
		const n = e[t];
		return n && n.constructor, n
	} catch (e) {
		return l
	}
}
const p = [{
	symbol: "@@__IMMUTABLE_INDEXED__@@",
	name: "Indexed",
	modifier: !0
}, {
	symbol: "@@__IMMUTABLE_KEYED__@@",
	name: "Keyed",
	modifier: !0
}, {
	symbol: "@@__IMMUTABLE_LIST__@@",
	name: "List",
	arrayish: !0
}, {
	symbol: "@@__IMMUTABLE_MAP__@@",
	name: "Map"
}, {
	symbol: "@@__IMMUTABLE_ORDERED__@@",
	name: "Ordered",
	modifier: !0,
	prefix: !0
}, {
	symbol: "@@__IMMUTABLE_RECORD__@@",
	name: "Record"
}, {
	symbol: "@@__IMMUTABLE_SET__@@",
	name: "Set",
	arrayish: !0,
	setish: !0
}, {
	symbol: "@@__IMMUTABLE_STACK__@@",
	name: "Stack",
	arrayish: !0
}];

function m(e) {
	try {
		let t = p.filter((({
			symbol: t
		}) => !0 === e[t]));
		if (!t.length) return;
		const n = t.find((e => !e.modifier)),
			r = "Map" === n.name && t.find((e => e.modifier && e.prefix)),
			o = t.some((e => e.arrayish)),
			i = t.some((e => e.setish));
		return {
			name: `${r?r.name:""}${n.name}`,
			symbols: t,
			arrayish: o && !i,
			setish: i
		}
	} catch (e) {
		return null
	}
}
const {
	getPrototypeOf: b,
	getOwnPropertyDescriptors: v
} = Object, w = b({});

function y(n, o, i, a) {
	let s, c, l, u, d = t(n);
	n instanceof Map ? n instanceof n.constructor ? (s = `Map(${n.size})`, c =
			_) : (s = "Map()", c = j) : n instanceof Set ? n instanceof n
		.constructor ? (s = `Set(${n.size})`, c = g) : (s = "Set()", c = j) :
		d ? (s = `${n.constructor.name}(${n.length})`, c = C) : (u = m(n)) ? (
			s = `Immutable.${u.name}${"Record"===u.name?"":`(${n.size})`}`, d =
			u.arrayish, c = u.arrayish ? x : u.setish ? E : T) : a ? (s = f(n),
			c = N) : (s = f(n), c = j);
	const h = document.createElement("span");
	h.className = "observablehq--expanded", i && h.appendChild(r(i));
	const p = h.appendChild(document.createElement("a"));
	p.innerHTML =
		"<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M4 7L0 1h8z' fill='currentColor' />\n  </svg>",
		p.appendChild(document.createTextNode(`${s}${d?" [":" {"}`)), p
		.addEventListener("mouseup", (function(e) {
			e.stopPropagation(), ae(h, S(n, null, i, a))
		})), c = c(n);
	for (let e = 0; !(l = c.next()).done && e < 20; ++e) h.appendChild(l.value);
	if (!l.done) {
		const t = h.appendChild(document.createElement("a"));
		t.className = "observablehq--field", t.style.display = "block", t
			.appendChild(document.createTextNode("  … more")), t
			.addEventListener("mouseup", (function(t) {
				t.stopPropagation(), h.insertBefore(l.value, h.lastChild
					.previousSibling);
				for (let e = 0; !(l = c.next()).done && e < 19; ++e) h
					.insertBefore(l.value, h.lastChild.previousSibling);
				l.done && h.removeChild(h.lastChild.previousSibling), e(
					h, "load")
			}))
	}
	return h.appendChild(document.createTextNode(d ? "]" : "}")), h
}

function* _(e) {
	for (const [t, n] of e) yield A(t, n);
	yield* j(e)
}

function* g(e) {
	for (const t of e) yield L(t);
	yield* j(e)
}

function* E(e) {
	for (const t of e) yield L(t)
}

function* C(e) {
	for (let t = 0, n = e.length; t < n; ++t) t in e && (yield $(t, h(e, t),
		"observablehq--index"));
	for (const t in e) !n(t) && d(e, t) && (yield $(t, h(e, t),
		"observablehq--key"));
	for (const t of u(e)) yield $(i(t), h(e, t), "observablehq--symbol")
}

function* x(e) {
	let t = 0;
	for (const n = e.size; t < n; ++t) yield $(t, e.get(t), !0)
}

function* N(e) {
	for (const t in v(e)) yield $(t, h(e, t), "observablehq--key");
	for (const t of u(e)) yield $(i(t), h(e, t), "observablehq--symbol");
	const t = b(e);
	t && t !== w && (yield q(t))
}

function* j(e) {
	for (const t in e) d(e, t) && (yield $(t, h(e, t),
		"observablehq--key"));
	for (const t of u(e)) yield $(i(t), h(e, t), "observablehq--symbol");
	const t = b(e);
	t && t !== w && (yield q(t))
}

function* T(e) {
	for (const [t, n] of e) yield $(t, n, "observablehq--key")
}

function q(e) {
	const t = document.createElement("div"),
		n = t.appendChild(document.createElement("span"));
	return t.className = "observablehq--field", n.className =
		"observablehq--prototype-key", n.textContent = "  <prototype>", t
		.appendChild(document.createTextNode(": ")), t.appendChild(ie(e, void 0,
			void 0, void 0, !0)), t
}

function $(e, t, n) {
	const r = document.createElement("div"),
		o = r.appendChild(document.createElement("span"));
	return r.className = "observablehq--field", o.className = n, o.textContent =
		`  ${e}`, r.appendChild(document.createTextNode(": ")), r.appendChild(
			ie(t)), r
}

function A(e, t) {
	const n = document.createElement("div");
	return n.className = "observablehq--field", n.appendChild(document
		.createTextNode("  ")), n.appendChild(ie(e)), n.appendChild(document
		.createTextNode(" => ")), n.appendChild(ie(t)), n
}

function L(e) {
	const t = document.createElement("div");
	return t.className = "observablehq--field", t.appendChild(document
		.createTextNode("  ")), t.appendChild(ie(e)), t
}

function O(e) {
	const t = window.getSelection();
	return "Range" === t.type && (t.containsNode(e, !0) || t.anchorNode
		.isSelfOrDescendant(e) || t.focusNode.isSelfOrDescendant(e))
}

function S(e, n, o, i) {
	let a, s, c, l, u = t(e);
	if (e instanceof Map ? e instanceof e.constructor ? (a = `Map(${e.size})`,
			s = P) : (a = "Map()", s = U) : e instanceof Set ? e instanceof e
		.constructor ? (a = `Set(${e.size})`, s = M) : (a = "Set()", s = U) :
		u ? (a = `${e.constructor.name}(${e.length})`, s = I) : (l = m(e)) ? (
			a = `Immutable.${l.name}${"Record"===l.name?"":`(${e.size})`}`, u =
			l.arrayish, s = l.arrayish ? R : l.setish ? k : D) : (a = f(e), s =
			U), n) {
		const t = document.createElement("span");
		return t.className = "observablehq--shallow", o && t.appendChild(r(o)),
			t.appendChild(document.createTextNode(a)), t.addEventListener(
				"mouseup", (function(n) {
					O(t) || (n.stopPropagation(), ae(t, S(e)))
				})), t
	}
	const d = document.createElement("span");
	d.className = "observablehq--collapsed", o && d.appendChild(r(o));
	const h = d.appendChild(document.createElement("a"));
	h.innerHTML =
		"<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M7 4L1 8V0z' fill='currentColor' />\n  </svg>",
		h.appendChild(document.createTextNode(`${a}${u?" [":" {"}`)), d
		.addEventListener("mouseup", (function(t) {
			O(d) || (t.stopPropagation(), ae(d, y(e, 0, o, i)))
		}), !0), s = s(e);
	for (let e = 0; !(c = s.next()).done && e < 20; ++e) e > 0 && d.appendChild(
		document.createTextNode(", ")), d.appendChild(c.value);
	return c.done || d.appendChild(document.createTextNode(", …")), d
		.appendChild(document.createTextNode(u ? "]" : "}")), d
}

function* P(e) {
	for (const [t, n] of e) yield z(t, n);
	yield* U(e)
}

function* M(e) {
	for (const t of e) yield ie(t, !0);
	yield* U(e)
}

function* k(e) {
	for (const t of e) yield ie(t, !0)
}

function* R(e) {
	let t = -1,
		n = 0;
	for (const r = e.size; n < r; ++n) n > t + 1 && (yield F(n - t - 1)),
		yield ie(e.get(n), !0), t = n;
	n > t + 1 && (yield F(n - t - 1))
}

function* I(e) {
	let t = -1,
		r = 0;
	for (const n = e.length; r < n; ++r) r in e && (r > t + 1 && (yield F(
		r - t - 1)), yield ie(h(e, r), !0), t = r);
	r > t + 1 && (yield F(r - t - 1));
	for (const t in e) !n(t) && d(e, t) && (yield B(t, h(e, t),
		"observablehq--key"));
	for (const t of u(e)) yield B(i(t), h(e, t), "observablehq--symbol")
}

function* U(e) {
	for (const t in e) d(e, t) && (yield B(t, h(e, t),
		"observablehq--key"));
	for (const t of u(e)) yield B(i(t), h(e, t), "observablehq--symbol")
}

function* D(e) {
	for (const [t, n] of e) yield B(t, n, "observablehq--key")
}

function F(e) {
	const t = document.createElement("span");
	return t.className = "observablehq--empty", t.textContent = 1 === e ?
		"empty" : `empty × ${e}`, t
}

function B(e, t, n) {
	const r = document.createDocumentFragment(),
		o = r.appendChild(document.createElement("span"));
	return o.className = n, o.textContent = e, r.appendChild(document
		.createTextNode(": ")), r.appendChild(ie(t, !0)), r
}

function z(e, t) {
	const n = document.createDocumentFragment();
	return n.appendChild(ie(e, !0)), n.appendChild(document.createTextNode(
		" => ")), n.appendChild(ie(t, !0)), n
}

function H(e, t) {
	if (e instanceof Date || (e = new Date(+e)), isNaN(e)) return "function" ==
		typeof t ? t(e) : t;
	const n = e.getUTCHours(),
		r = e.getUTCMinutes(),
		o = e.getUTCSeconds(),
		i = e.getUTCMilliseconds();
	return `${a=e.getUTCFullYear(),a<0?`-${W(-a,6)}`:a>9999?`+${W(a,6)}`:W(a,4)}-${W(e.getUTCMonth()+1,2)}-${W(e.getUTCDate(),2)}${n||r||o||i?`T${W(n,2)}:${W(r,2)}${o||i?`:${W(o,2)}${i?`.${W(i,3)}`:""}`:""}Z`:""}`;
	var a
}

function W(e, t) {
	return `${e}`.padStart(t, "0")
}
var V = Error.prototype.toString;
var G = RegExp.prototype.toString;

function Y(e) {
	return e.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, Z)
}

function Z(e) {
	var t = e.charCodeAt(0);
	switch (t) {
		case 8:
			return "\\b";
		case 9:
			return "\\t";
		case 11:
			return "\\v";
		case 12:
			return "\\f";
		case 13:
			return "\\r"
	}
	return t < 16 ? "\\x0" + t.toString(16) : t < 32 ? "\\x" + t.toString(16) :
		"\\" + e
}

function K(e, t) {
	for (var n = 0; t.exec(e);) ++n;
	return n
}
var J = Function.prototype.toString,
	X = {
		prefix: "async ƒ"
	},
	Q = {
		prefix: "async ƒ*"
	},
	ee = {
		prefix: "class"
	},
	te = {
		prefix: "ƒ"
	},
	ne = {
		prefix: "ƒ*"
	};

function re(e, t, n) {
	var o = document.createElement("span");
	o.className = "observablehq--function", n && o.appendChild(r(n));
	var i = o.appendChild(document.createElement("span"));
	return i.className = "observablehq--keyword", i.textContent = e.prefix, o
		.appendChild(document.createTextNode(t)), o
}
const {
	prototype: {
		toString: oe
	}
} = Object;

function ie(e, t, n, o, a) {
	let s = typeof e;
	switch (s) {
		case "boolean":
		case "undefined":
			e += "";
			break;
		case "number":
			e = 0 === e && 1 / e < 0 ? "-0" : e + "";
			break;
		case "bigint":
			e += "n";
			break;
		case "symbol":
			e = i(e);
			break;
		case "function":
			return function(e, t) {
				var n, r, o = J.call(e);
				switch (e.constructor && e.constructor.name) {
					case "AsyncFunction":
						n = X;
						break;
					case "AsyncGeneratorFunction":
						n = Q;
						break;
					case "GeneratorFunction":
						n = ne;
						break;
					default:
						n = /^class\b/.test(o) ? ee : te
				}
				return n === ee ? re(n, "", t) : (r =
					/^(?:async\s*)?(\w+)\s*=>/.exec(o)) ? re(n, "(" + r[
					1] + ")", t) : (r =
					/^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/
					.exec(o)) || (r =
					/^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/
					.exec(o)) ? re(n, r[1] ? "(" + r[1].replace(
					/\s*,\s*/g, ", ") + ")" : "()", t) : re(n, "(…)", t)
			}(e, o);
		case "string":
			return function(e, t, n, o) {
				if (!1 === t) {
					if (K(e, /["\n]/g) <= K(e, /`|\${/g)) {
						const t = document.createElement("span");
						o && t.appendChild(r(o));
						const n = t.appendChild(document.createElement(
							"span"));
						return n.className = "observablehq--string", n
							.textContent = JSON.stringify(e), t
					}
					const i = e.split("\n");
					if (i.length > 20 && !n) {
						const n = document.createElement("div");
						o && n.appendChild(r(o));
						const a = n.appendChild(document.createElement(
							"span"));
						a.className = "observablehq--string", a
							.textContent = "`" + Y(i.slice(0, 20).join(
								"\n"));
						const s = n.appendChild(document.createElement(
								"span")),
							c = i.length - 20;
						return s.textContent =
							`Show ${c} truncated line${c>1?"s":""}`, s
							.className = "observablehq--string-expand", s
							.addEventListener("mouseup", (function(r) {
								r.stopPropagation(), ae(n, ie(e, t,
									!0, o))
							})), n
					}
					const a = document.createElement("span");
					o && a.appendChild(r(o));
					const s = a.appendChild(document.createElement("span"));
					return s.className = "observablehq--string" + (n ?
							" observablehq--expanded" : ""), s.textContent =
						"`" + Y(e) + "`", a
				}
				const i = document.createElement("span");
				o && i.appendChild(r(o));
				const a = i.appendChild(document.createElement("span"));
				return a.className = "observablehq--string", a.textContent =
					JSON.stringify(e.length > 100 ?
						`${e.slice(0,50)}…${e.slice(-49)}` : e), i
			}(e, t, n, o);
		default:
			if (null === e) {
				s = null, e = "null";
				break
			}
			if (e instanceof Date) {
				s = "date", e = H(e, "Invalid Date");
				break
			}
			if (e === l) {
				s = "forbidden", e = "[forbidden]";
				break
			}
			switch (oe.call(e)) {
				case "[object RegExp]":
					s = "regexp", e = function(e) {
						return G.call(e)
					}(e);
					break;
				case "[object Error]":
				case "[object DOMException]":
					s = "error", e = function(e) {
						return e.stack || V.call(e)
					}(e);
					break;
				default:
					return (n ? y : S)(e, t, o, a)
			}
	}
	const c = document.createElement("span");
	o && c.appendChild(r(o));
	const u = c.appendChild(document.createElement("span"));
	return u.className = `observablehq--${s}`, u.textContent = e, c
}

function ae(t, n) {
	t.classList.contains("observablehq--inspect") && n.classList.add(
		"observablehq--inspect"), t.parentNode.replaceChild(n, t), e(n,
		"load")
}
const se = /\s+\(\d+:\d+\)$/m;
class Inspector {
	constructor(e) {
		if (!e) throw new Error("invalid node");
		this._node = e, e.classList.add("observablehq")
	}
	pending() {
		const {
			_node: e
		} = this;
		e.classList.remove("observablehq--error"), e.classList.add(
			"observablehq--running")
	}
	fulfilled(t, n) {
		const {
			_node: r
		} = this;
		if ((! function(e) {
				return (e instanceof Element || e instanceof Text) &&
					e instanceof e.constructor
			}(t) || t.parentNode && t.parentNode !== r) && (t = ie(t, !1, r
				.firstChild && r.firstChild.classList && r.firstChild
				.classList.contains("observablehq--expanded"), n)).classList
			.add("observablehq--inspect"), r.classList.remove(
				"observablehq--running", "observablehq--error"), r
			.firstChild !== t)
			if (r.firstChild) {
				for (; r.lastChild !== r.firstChild;) r.removeChild(r
					.lastChild);
				r.replaceChild(t, r.firstChild)
			} else r.appendChild(t);
		e(r, "update")
	}
	rejected(t, n) {
		const {
			_node: o
		} = this;
		for (o.classList.remove("observablehq--running"), o.classList.add(
				"observablehq--error"); o.lastChild;) o.removeChild(o
			.lastChild);
		var i = document.createElement("div");
		i.className = "observablehq--inspect", n && i.appendChild(r(n)), i
			.appendChild(document.createTextNode((t + "").replace(se, ""))),
			o.appendChild(i), e(o, "error", {
				error: t
			})
	}
}
Inspector.into = function(e) {
	if ("string" == typeof e && null == (e = document.querySelector(e)))
		throw new Error("container not found");
	return function() {
		return new Inspector(e.appendChild(document.createElement(
			"div")))
	}
};
var ce = {},
	le = {};

function ue(e) {
	return new Function("d", "return {" + e.map((function(e, t) {
		return JSON.stringify(e) + ": d[" + t + '] || ""'
	})).join(",") + "}")
}

function de(e) {
	var t = Object.create(null),
		n = [];
	return e.forEach((function(e) {
		for (var r in e) r in t || n.push(t[r] = r)
	})), n
}

function fe(e, t) {
	var n = e + "",
		r = n.length;
	return r < t ? new Array(t - r + 1).join(0) + n : n
}

function he(e) {
	var t, n = e.getUTCHours(),
		r = e.getUTCMinutes(),
		o = e.getUTCSeconds(),
		i = e.getUTCMilliseconds();
	return isNaN(e) ? "Invalid Date" : ((t = e.getUTCFullYear()) < 0 ? "-" + fe(
		-t, 6) : t > 9999 ? "+" + fe(t, 6) : fe(t, 4)) + "-" + fe(e
		.getUTCMonth() + 1, 2) + "-" + fe(e.getUTCDate(), 2) + (i ? "T" +
		fe(n, 2) + ":" + fe(r, 2) + ":" + fe(o, 2) + "." + fe(i, 3) + "Z" :
		o ? "T" + fe(n, 2) + ":" + fe(r, 2) + ":" + fe(o, 2) + "Z" : r ||
		n ? "T" + fe(n, 2) + ":" + fe(r, 2) + "Z" : "")
}

function pe(e) {
	var t = new RegExp('["' + e + "\n\r]"),
		n = e.charCodeAt(0);

	function r(e, t) {
		var r, o = [],
			i = e.length,
			a = 0,
			s = 0,
			c = i <= 0,
			l = !1;

		function u() {
			if (c) return le;
			if (l) return l = !1, ce;
			var t, r, o = a;
			if (34 === e.charCodeAt(o)) {
				for (; a++ < i && 34 !== e.charCodeAt(a) || 34 === e.charCodeAt(
						++a););
				return (t = a) >= i ? c = !0 : 10 === (r = e.charCodeAt(a++)) ?
					l = !0 : 13 === r && (l = !0, 10 === e.charCodeAt(a) && ++
						a), e.slice(o + 1, t - 1).replace(/""/g, '"')
			}
			for (; a < i;) {
				if (10 === (r = e.charCodeAt(t = a++))) l = !0;
				else if (13 === r) l = !0, 10 === e.charCodeAt(a) && ++a;
				else if (r !== n) continue;
				return e.slice(o, t)
			}
			return c = !0, e.slice(o, i)
		}
		for (10 === e.charCodeAt(i - 1) && --i, 13 === e.charCodeAt(i - 1) && --
			i;
			(r = u()) !== le;) {
			for (var d = []; r !== ce && r !== le;) d.push(r), r = u();
			t && null == (d = t(d, s++)) || o.push(d)
		}
		return o
	}

	function o(t, n) {
		return t.map((function(t) {
			return n.map((function(e) {
				return a(t[e])
			})).join(e)
		}))
	}

	function i(t) {
		return t.map(a).join(e)
	}

	function a(e) {
		return null == e ? "" : e instanceof Date ? he(e) : t.test(e += "") ?
			'"' + e.replace(/"/g, '""') + '"' : e
	}
	return {
		parse: function(e, t) {
			var n, o, i = r(e, (function(e, r) {
				if (n) return n(e, r - 1);
				o = e, n = t ? function(e, t) {
					var n = ue(e);
					return function(r, o) {
						return t(n(r), o, e)
					}
				}(e, t) : ue(e)
			}));
			return i.columns = o || [], i
		},
		parseRows: r,
		format: function(t, n) {
			return null == n && (n = de(t)), [n.map(a).join(e)].concat(o(t,
				n)).join("\n")
		},
		formatBody: function(e, t) {
			return null == t && (t = de(e)), o(e, t).join("\n")
		},
		formatRows: function(e) {
			return e.map(i).join("\n")
		},
		formatRow: i,
		formatValue: a
	}
}
var me = pe(","),
	be = me.parse,
	ve = me.parseRows,
	we = pe("\t"),
	ye = we.parse,
	_e = we.parseRows;

function ge(e) {
	for (var t in e) {
		var n, r, o = e[t].trim();
		if (o)
			if ("true" === o) o = !0;
			else if ("false" === o) o = !1;
		else if ("NaN" === o) o = NaN;
		else if (isNaN(n = +o)) {
			if (!(r = o.match(
					/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
				))) continue;
			Ee && r[4] && !r[7] && (o = o.replace(/-/g, "/").replace(/T/, " ")),
				o = new Date(o)
		} else o = n;
		else o = null;
		e[t] = o
	}
	return e
}
const Ee = new Date("2019-01-01T00:00").getHours() || new Date(
	"2019-07-01T00:00").getHours();

function Ce(e, t, n) {
	return {
		resolve: (r = n) => `${e}@${t}/${r}`
	}
}
const xe = Ce("d3", "7.6.1", "dist/d3.min.js"),
	Ne = Ce("@observablehq/inputs", "0.10.4", "dist/inputs.min.js"),
	je = Ce("@observablehq/plot", "0.5.2", "dist/plot.umd.min.js"),
	Te = Ce("@observablehq/graphviz", "0.2.1", "dist/graphviz.min.js"),
	qe = Ce("@observablehq/highlight.js", "2.0.0", "highlight.min.js"),
	$e = Ce("@observablehq/katex", "0.11.1", "dist/katex.min.js"),
	Ae = Ce("lodash", "4.17.21", "lodash.min.js"),
	Le = Ce("htl", "0.3.1", "dist/htl.min.js"),
	Oe = Ce("jszip", "3.10.0", "dist/jszip.min.js"),
	Se = Ce("marked", "0.3.12", "marked.min.js"),
	Pe = Ce("sql.js", "1.7.0", "dist/sql-wasm.js"),
	Me = Ce("vega", "5.22.1", "build/vega.min.js"),
	ke = Ce("vega-lite", "5.2.0", "build/vega-lite.min.js"),
	Re = Ce("vega-lite-api", "5.0.0", "build/vega-lite-api.min.js"),
	Ie = Ce("apache-arrow", "4.0.1", "Arrow.es2015.min.js"),
	Ue = Ce("arquero", "4.8.8", "dist/arquero.min.js"),
	De = Ce("topojson-client", "3.1.0", "dist/topojson-client.min.js"),
	Fe = Ce("exceljs", "4.3.0", "dist/exceljs.min.js"),
	Be = Ce("mermaid", "9.1.1", "dist/mermaid.min.js"),
	ze = Ce("leaflet", "1.8.0", "dist/leaflet.js"),
	He = new Map,
	We = [],
	Ve = We.map,
	Ge = We.some,
	Ye = We.hasOwnProperty,
	Ze = /^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/,
	Ke = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/,
	Je = /(?:\.[^/]*|\/)$/;
class RequireError extends Error {
	constructor(e) {
		super(e)
	}
}

function Xe(e) {
	const t = Ze.exec(e);
	return t && {
		name: t[1],
		version: t[2],
		path: t[3]
	}
}

function Qe(e = "https://cdn.jsdelivr.net/npm/", t = ["unpkg", "jsdelivr",
	"browser", "main"
]) {
	if (!/\/$/.test(e)) throw new Error("origin lacks trailing slash");

	function n(t) {
		const n = `${e}${t.name}${t.version?`@${t.version}`:""}/package.json`;
		let r = He.get(n);
		return r || He.set(n, r = fetch(n).then((e => {
			if (!e.ok) throw new RequireError(
				"unable to load package.json");
			return e.redirected && !He.has(e.url) && He.set(e
				.url, r), e.json()
		}))), r
	}
	return async function(r, o) {
		if (r.startsWith(e) && (r = r.substring(e.length)),
			/^(\w+:)|\/\//i.test(r)) return r;
		if (/^[.]{0,2}\//i.test(r)) return new URL(r, null == o ?
			location : o).href;
		if (!r.length || /^[\s._]/.test(r) || /\s$/.test(r))
			throw new RequireError("illegal name");
		const i = Xe(r);
		if (!i) return `${e}${r}`;
		if (!i.version && null != o && o.startsWith(e)) {
			const t = await n(Xe(o.substring(e.length)));
			i.version = t.dependencies && t.dependencies[i.name] || t
				.peerDependencies && t.peerDependencies[i.name]
		}
		if (i.path && !Je.test(i.path) && (i.path += ".js"), i.path && i
			.version && Ke.test(i.version))
			return `${e}${i.name}@${i.version}/${i.path}`;
		const a = await n(i);
		return `${e}${a.name}@${a.version}/${i.path||function(e){for(const n of t){let t=e[n];if("string"==typeof t)return t.startsWith("./")&&(t=t.slice(2)),Je.test(t)?t:`${t}.js`}}(a)||"index.js"}`
	}
}
RequireError.prototype.name = RequireError.name;
var et = tt(Qe());

function tt(e) {
	const t = new Map,
		n = o(null);

	function r(e) {
		if ("string" != typeof e) return e;
		let n = t.get(e);
		return n || t.set(e, n = new Promise(((t, n) => {
			const r = document.createElement("script");
			r.onload = () => {
					try {
						t(We.pop()(o(e)))
					} catch (e) {
						n(new RequireError("invalid module"))
					}
					r.remove()
				}, r.onerror = () => {
					n(new RequireError(
						"unable to load module")), r
					.remove()
				}, r.async = !0, r.src = e, window.define = it,
				document.head.appendChild(r)
		}))), n
	}

	function o(t) {
		return n => Promise.resolve(e(n, t)).then(r)
	}

	function i(e) {
		return arguments.length > 1 ? Promise.all(Ve.call(arguments, n)).then(
			nt) : n(e)
	}
	return i.alias = function(t) {
		return tt(((n, r) => n in t && (r = null, "string" != typeof(n = t[
			n])) ? n : e(n, r)))
	}, i.resolve = e, i
}

function nt(e) {
	const t = {};
	for (const n of e)
		for (const e in n) Ye.call(n, e) && (null == n[e] ? Object
			.defineProperty(t, e, {
				get: rt(n, e)
			}) : t[e] = n[e]);
	return t
}

function rt(e, t) {
	return () => e[t]
}

function ot(e) {
	return "exports" === (e += "") || "module" === e
}

function it(e, t, n) {
	const r = arguments.length;
	r < 2 ? (n = e, t = []) : r < 3 && (n = t, t = "string" == typeof e ? [] :
		e), We.push(Ge.call(t, ot) ? e => {
		const r = {},
			o = {
				exports: r
			};
		return Promise.all(Ve.call(t, (t => "exports" === (t += "") ?
			r : "module" === t ? o : e(t)))).then((e => (n.apply(
			null, e), o.exports)))
	} : e => Promise.all(Ve.call(t, e)).then((e => "function" ==
		typeof n ? n.apply(null, e) : n)))
}
it.amd = {};
let at = et;
async function st(e) {
	const [t, n] = await Promise.all([e(Pe.resolve()), e.resolve(Pe.resolve(
		"dist/"))]);
	return t({
		locateFile: e => `${n}${e}`
	})
}
class SQLiteDatabaseClient {
	constructor(e) {
		Object.defineProperties(this, {
			_db: {
				value: e
			}
		})
	}
	static async open(e) {
		const [t, n] = await Promise.all([st(at), Promise.resolve(e).then(
			lt)]);
		return new SQLiteDatabaseClient(new t.Database(n))
	}
	async query(e, t) {
		return await async function(e, t, n) {
			const [r] = await e.exec(t, n);
			if (!r) return [];
			const {
				columns: o,
				values: i
			} = r, a = i.map((e => Object.fromEntries(e.map(((e,
				t) => [o[t], e])))));
			return a.columns = o, a
		}(this._db, e, t)
	}
	async queryRow(e, t) {
		return (await this.query(e, t))[0] || null
	}
	async explain(e, t) {
		return ut("pre", {
			className: "observablehq--inspect"
		}, [dt((await this.query(`EXPLAIN QUERY PLAN ${e}`, t)).map(
			(e => e.detail)).join("\n"))])
	}
	async describeTables({
		schema: e
	} = {}) {
		return this.query(
			`SELECT NULLIF(schema, 'main') AS schema, name FROM pragma_table_list() WHERE type = 'table'${null==e?"":" AND schema = ?"} AND name NOT LIKE 'sqlite_%'`,
			null == e ? [] : [e])
	}
	async describeColumns({
		schema: e,
		table: t
	} = {}) {
		if (null == t) throw new Error("missing table");
		const n = await this.query(
			`SELECT name, type, "notnull" FROM pragma_table_info(?${null==e?"":", ?"}) ORDER BY cid`,
			null == e ? [t] : [t, e]);
		if (!n.length) throw new Error(`table not found: ${t}`);
		return n.map((({
			name: e,
			type: t,
			notnull: n
		}) => ({
			name: e,
			type: ct(t),
			databaseType: t,
			nullable: !n
		})))
	}
	async describe(e) {
		const t = await (void 0 === e ? this.query(
				"SELECT name FROM sqlite_master WHERE type = 'table'") :
			this.query("SELECT * FROM pragma_table_info(?)", [e]));
		if (!t.length) throw new Error("Not found");
		const {
			columns: n
		} = t;
		return ut("table", {
			value: t
		}, [ut("thead", [ut("tr", n.map((e => ut("th", [dt(
			e)]))))]), ut("tbody", t.map((e => ut("tr", n.map((
			t =>
			ut("td", [dt(e[t])])))))))])
	}
	async sql() {
		return this.query(...this.queryTag.apply(this, arguments))
	}
	queryTag(e, ...t) {
		return [e.join("?"), t]
	}
}

function ct(e) {
	switch (e) {
		case "NULL":
			return "null";
		case "INT":
		case "INTEGER":
		case "TINYINT":
		case "SMALLINT":
		case "MEDIUMINT":
		case "BIGINT":
		case "UNSIGNED BIG INT":
		case "INT2":
		case "INT8":
			return "integer";
		case "TEXT":
		case "CLOB":
		case "DATE":
		case "DATETIME":
			return "string";
		case "REAL":
		case "DOUBLE":
		case "DOUBLE PRECISION":
		case "FLOAT":
		case "NUMERIC":
			return "number";
		case "BLOB":
			return "buffer";
		default:
			return /^(?:(?:(?:VARYING|NATIVE) )?CHARACTER|(?:N|VAR|NVAR)CHAR)\(/
				.test(e) ? "string" : /^(?:DECIMAL|NUMERIC)\(/.test(e) ?
				"number" : "other"
	}
}

function lt(e) {
	return "string" == typeof e ? fetch(e).then(lt) : e instanceof Response ||
		e instanceof Blob ? e.arrayBuffer().then(lt) :
		e instanceof ArrayBuffer ? new Uint8Array(e) : e
}

function ut(e, t, n) {
	2 === arguments.length && (n = t, t = void 0);
	const r = document.createElement(e);
	if (void 0 !== t)
		for (const e in t) r[e] = t[e];
	if (void 0 !== n)
		for (const e of n) r.appendChild(e);
	return r
}

function dt(e) {
	return document.createTextNode(e)
}
Object.defineProperty(SQLiteDatabaseClient.prototype, "dialect", {
	value: "sqlite"
});
class Workbook {
	constructor(e) {
		Object.defineProperties(this, {
			_: {
				value: e
			},
			sheetNames: {
				value: e.worksheets.map((e => e.name)),
				enumerable: !0
			}
		})
	}
	sheet(e, t) {
		const n = "number" == typeof e ? this.sheetNames[e] : this
			.sheetNames.includes(e += "") ? e : null;
		if (null == n) throw new Error(`Sheet not found: ${e}`);
		return function(e, {
			range: t,
			headers: n
		} = {}) {
			let [
				[r, o],
				[i, a]
			] = function(e = ":", {
				columnCount: t,
				rowCount: n
			}) {
				if (!(e += "").match(/^[A-Z]*\d*:[A-Z]*\d*$/))
					throw new Error("Malformed range specifier");
				const [
					[r = 0, o = 0],
					[i = t - 1, a = n - 1]
				] = e.split(":").map(mt);
				return [
					[r, o],
					[i, a]
				]
			}(t, e);
			const s = n ? e._rows[o++] : null;
			let c = new Set(["#"]);
			for (let e = r; e <= i; e++) {
				const t = s ? ft(s.findCell(e + 1)) : null;
				let n = t && t + "" || pt(e);
				for (; c.has(n);) n += "_";
				c.add(n)
			}
			c = new Array(r).concat(Array.from(c));
			const l = new Array(a - o + 1);
			for (let t = o; t <= a; t++) {
				const n = l[t - o] = Object.create(null, {
						"#": {
							value: t + 1
						}
					}),
					a = e.getRow(t + 1);
				if (a.hasValues)
					for (let e = r; e <= i; e++) {
						const t = ft(a.findCell(e + 1));
						null != t && (n[c[e + 1]] = t)
					}
			}
			return l.columns = c.filter((() => !0)), l
		}(this._.getWorksheet(n), t)
	}
}

function ft(e) {
	if (!e) return;
	const {
		value: t
	} = e;
	if (t && "object" == typeof t && !(t instanceof Date)) {
		if (t.formula || t.sharedFormula) return t.result && t.result.error ?
			NaN : t.result;
		if (t.richText) return ht(t);
		if (t.text) {
			let {
				text: e
			} = t;
			return e.richText && (e = ht(e)), t.hyperlink && t.hyperlink !== e ?
				`${t.hyperlink} ${e}` : e
		}
		return t
	}
	return t
}

function ht(e) {
	return e.richText.map((e => e.text)).join("")
}

function pt(e) {
	let t = "";
	e++;
	do {
		t = String.fromCharCode(64 + (e % 26 || 26)) + t
	} while (e = Math.floor((e - 1) / 26));
	return t
}

function mt(e) {
	const [, t, n] = e.match(/^([A-Z]*)(\d*)$/);
	let r = 0;
	if (t)
		for (let e = 0; e < t.length; e++) r += Math.pow(26, t.length - e - 1) *
			(t.charCodeAt(e) - 64);
	return [r ? r - 1 : void 0, n ? +n - 1 : void 0]
}
async function bt(e) {
	const t = await fetch(await e.url());
	if (!t.ok) throw new Error(`Unable to load file: ${e.name}`);
	return t
}
async function vt(e, t, {
	array: n = !1,
	typed: r = !1
} = {}) {
	const o = await e.text();
	return ("\t" === t ? n ? _e : ye : n ? ve : be)(o, r && ge)
}
class wt {
	constructor(e, t) {
		Object.defineProperty(this, "name", {
			value: e,
			enumerable: !0
		}), void 0 !== t && Object.defineProperty(this, "mimeType", {
			value: t + "",
			enumerable: !0
		})
	}
	async blob() {
		return (await bt(this)).blob()
	}
	async arrayBuffer() {
		return (await bt(this)).arrayBuffer()
	}
	async text() {
		return (await bt(this)).text()
	}
	async json() {
		return (await bt(this)).json()
	}
	async stream() {
		return (await bt(this)).body
	}
	async csv(e) {
		return vt(this, ",", e)
	}
	async tsv(e) {
		return vt(this, "\t", e)
	}
	async image(e) {
		const t = await this.url();
		return new Promise(((n, r) => {
			const o = new Image;
			new URL(t, document.baseURI).origin !== new URL(
					location).origin && (o.crossOrigin =
					"anonymous"), Object.assign(o, e), o
				.onload = () => n(o), o.onerror = () => r(
					new Error(
						`Unable to load file: ${this.name}`)), o
				.src = t
		}))
	}
	async arrow() {
		const [e, t] = await Promise.all([at(Ie.resolve()), bt(this)]);
		return e.Table.from(t)
	}
	async sqlite() {
		return SQLiteDatabaseClient.open(bt(this))
	}
	async zip() {
		const [e, t] = await Promise.all([at(Oe.resolve()), this
			.arrayBuffer()
		]);
		return new ZipArchive(await e.loadAsync(t))
	}
	async xml(e = "application/xml") {
		return (new DOMParser).parseFromString(await this.text(), e)
	}
	async html() {
		return this.xml("text/html")
	}
	async xlsx() {
		const [e, t] = await Promise.all([at(Fe.resolve()), this
			.arrayBuffer()
		]);
		return new Workbook(await (new e.Workbook).xlsx.load(t))
	}
}
class FileAttachment extends wt {
	constructor(e, t, n) {
		super(t, n), Object.defineProperty(this, "_url", {
			value: e
		})
	}
	async url() {
		return await this._url + ""
	}
}

function yt(e) {
	throw new Error(`File not found: ${e}`)
}
class ZipArchive {
	constructor(e) {
		Object.defineProperty(this, "_", {
			value: e
		}), this.filenames = Object.keys(e.files).filter((t => !e.files[
			t].dir))
	}
	file(e) {
		const t = this._.file(e += "");
		if (!t || t.dir) throw new Error(`file not found: ${e}`);
		return new ZipArchiveEntry(t)
	}
}
class ZipArchiveEntry extends wt {
	constructor(e) {
		super(e.name), Object.defineProperty(this, "_", {
			value: e
		}), Object.defineProperty(this, "_url", {
			writable: !0
		})
	}
	async url() {
		return this._url || (this._url = this.blob().then(URL
			.createObjectURL))
	}
	async blob() {
		return this._.async("blob")
	}
	async arrayBuffer() {
		return this._.async("arraybuffer")
	}
	async text() {
		return this._.async("text")
	}
	async json() {
		return JSON.parse(await this.text())
	}
}
var _t = {
	math: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
var gt = 0;

function Et(e) {
	return new Ct("O-" + (null == e ? "" : e + "-") + ++gt)
}

function Ct(e) {
	this.id = e, this.href = new URL(`#${e}`, location) + ""
}
Ct.prototype.toString = function() {
	return "url(" + this.href + ")"
};
var xt = {
	canvas: function(e, t) {
		var n = document.createElement("canvas");
		return n.width = e, n.height = t, n
	},
	context2d: function(e, t, n) {
		null == n && (n = devicePixelRatio);
		var r = document.createElement("canvas");
		r.width = e * n, r.height = t * n, r.style.width = e + "px";
		var o = r.getContext("2d");
		return o.scale(n, n), o
	},
	download: function(e, t = "untitled", n = "Save") {
		const r = document.createElement("a"),
			o = r.appendChild(document.createElement("button"));
		async function i() {
			await new Promise(requestAnimationFrame), URL
				.revokeObjectURL(r.href), r.removeAttribute("href"),
				o.textContent = n, o.disabled = !1
		}
		return o.textContent = n, r.download = t, r.onclick =
			async t => {
				if (o.disabled = !0, r.href) return i();
				o.textContent = "Saving…";
				try {
					const t = await ("function" == typeof e ? e() :
						e);
					o.textContent = "Download", r.href = URL
						.createObjectURL(t)
				} catch (e) {
					o.textContent = n
				}
				if (t.eventPhase) return i();
				o.disabled = !1
			}, r
	},
	element: function(e, t) {
		var n, r = e += "",
			o = r.indexOf(":");
		o >= 0 && "xmlns" !== (r = e.slice(0, o)) && (e = e.slice(o +
			1));
		var i = _t.hasOwnProperty(r) ? document.createElementNS(_t[r],
			e) : document.createElement(e);
		if (t)
			for (var a in t) o = (r = a).indexOf(":"), n = t[a], o >=
				0 && "xmlns" !== (r = a.slice(0, o)) && (a = a.slice(o +
					1)), _t.hasOwnProperty(r) ? i.setAttributeNS(_t[r],
					a, n) : i.setAttribute(a, n);
		return i
	},
	input: function(e) {
		var t = document.createElement("input");
		return null != e && (t.type = e), t
	},
	range: function(e, t, n) {
		1 === arguments.length && (t = e, e = null);
		var r = document.createElement("input");
		return r.min = e = null == e ? 0 : +e, r.max = t = null == t ?
			1 : +t, r.step = null == n ? "any" : n = +n, r.type =
			"range", r
	},
	select: function(e) {
		var t = document.createElement("select");
		return Array.prototype.forEach.call(e, (function(e) {
			var n = document.createElement("option");
			n.value = n.textContent = e, t.appendChild(n)
		})), t
	},
	svg: function(e, t) {
		var n = document.createElementNS("http://www.w3.org/2000/svg",
			"svg");
		return n.setAttribute("viewBox", [0, 0, e, t]), n.setAttribute(
			"width", e), n.setAttribute("height", t), n
	},
	text: function(e) {
		return document.createTextNode(e)
	},
	uid: Et
};
var Nt = {
	buffer: function(e) {
		return new Promise((function(t, n) {
			var r = new FileReader;
			r.onload = function() {
				t(r.result)
			}, r.onerror = n, r.readAsArrayBuffer(e)
		}))
	},
	text: function(e) {
		return new Promise((function(t, n) {
			var r = new FileReader;
			r.onload = function() {
				t(r.result)
			}, r.onerror = n, r.readAsText(e)
		}))
	},
	url: function(e) {
		return new Promise((function(t, n) {
			var r = new FileReader;
			r.onload = function() {
				t(r.result)
			}, r.onerror = n, r.readAsDataURL(e)
		}))
	}
};

function jt() {
	return this
}

function Tt(e, t) {
	let n = !1;
	if ("function" != typeof t) throw new Error("dispose is not a function");
	return {
		[Symbol.iterator]: jt,
		next: () => n ? {
			done: !0
		} : (n = !0, {
			done: !1,
			value: e
		}),
		return: () => (n = !0, t(e), {
			done: !0
		}),
		throw: () => ({
			done: n = !0
		})
	}
}

function qt(e) {
	let t, n, r = !1;
	const o = e((function(e) {
		n ? (n(e), n = null) : r = !0;
		return t = e
	}));
	if (null != o && "function" != typeof o) throw new Error("function" ==
		typeof o.then ? "async initializers are not supported" :
		"initializer returned something, but not a dispose function");
	return {
		[Symbol.iterator]: jt,
		throw: () => ({
			done: !0
		}),
		return: () => (null != o && o(), {
			done: !0
		}),
		next: function() {
			return {
				done: !1,
				value: r ? (r = !1, Promise.resolve(t)) : new Promise((e =>
					n = e))
			}
		}
	}
}

function $t(e) {
	switch (e.type) {
		case "range":
		case "number":
			return e.valueAsNumber;
		case "date":
			return e.valueAsDate;
		case "checkbox":
			return e.checked;
		case "file":
			return e.multiple ? e.files : e.files[0];
		case "select-multiple":
			return Array.from(e.selectedOptions, (e => e.value));
		default:
			return e.value
	}
}
var At = {
	disposable: Tt,
	filter: function*(e, t) {
		for (var n, r = -1; !(n = e.next()).done;) t(n.value, ++r) && (
			yield n.value)
	},
	input: function(e) {
		return qt((function(t) {
			var n = function(e) {
					switch (e.type) {
						case "button":
						case "submit":
						case "checkbox":
							return "click";
						case "file":
							return "change";
						default:
							return "input"
					}
				}(e),
				r = $t(e);

			function o() {
				t($t(e))
			}
			return e.addEventListener(n, o), void 0 !== r &&
				t(r),
				function() {
					e.removeEventListener(n, o)
				}
		}))
	},
	map: function*(e, t) {
		for (var n, r = -1; !(n = e.next()).done;) yield t(n.value, ++r)
	},
	observe: qt,
	queue: function(e) {
		let t;
		const n = [],
			r = e((function(e) {
				n.push(e), t && (t(n.shift()), t = null);
				return e
			}));
		if (null != r && "function" != typeof r) throw new Error(
			"function" == typeof r.then ?
			"async initializers are not supported" :
			"initializer returned something, but not a dispose function"
		);
		return {
			[Symbol.iterator]: jt,
			throw: () => ({
				done: !0
			}),
			return: () => (null != r && r(), {
				done: !0
			}),
			next: function() {
				return {
					done: !1,
					value: n.length ? Promise.resolve(n.shift()) :
						new Promise((e => t = e))
				}
			}
		}
	},
	range: function*(e, t, n) {
		e = +e, t = +t, n = (o = arguments.length) < 2 ? (t = e, e = 0,
			1) : o < 3 ? 1 : +n;
		for (var r = -1, o = 0 | Math.max(0, Math.ceil((t - e) / n)); ++
			r < o;) yield e + r * n
	},
	valueAt: function(e, t) {
		if (!(!isFinite(t = +t) || t < 0 || t != t | 0))
			for (var n, r = -1; !(n = e.next()).done;)
				if (++r === t) return n.value
	},
	worker: function(e) {
		const t = URL.createObjectURL(new Blob([e], {
				type: "text/javascript"
			})),
			n = new Worker(t);
		return Tt(n, (() => {
			n.terminate(), URL.revokeObjectURL(t)
		}))
	}
};

function Lt(e, t) {
	return function(n) {
		var r, o, i, a, s, c, l, u, d = n[0],
			f = [],
			h = null,
			p = -1;
		for (s = 1, c = arguments.length; s < c; ++s) {
			if ((r = arguments[s]) instanceof Node) f[++p] = r, d +=
				"\x3c!--o:" + p + "--\x3e";
			else if (Array.isArray(r)) {
				for (l = 0, u = r.length; l < u; ++l)(o = r[
					l]) instanceof Node ? (null === h && (f[++p] = h =
					document.createDocumentFragment(), d +=
					"\x3c!--o:" + p + "--\x3e"), h.appendChild(o)) : (
					h = null, d += o);
				h = null
			} else d += r;
			d += n[s]
		}
		if (h = e(d), ++p > 0) {
			for (i = new Array(p), a = document.createTreeWalker(h,
					NodeFilter.SHOW_COMMENT, null, !1); a.nextNode();) o = a
				.currentNode, /^o:/.test(o.nodeValue) && (i[+o.nodeValue
					.slice(2)] = o);
			for (s = 0; s < p; ++s)(o = i[s]) && o.parentNode.replaceChild(
				f[s], o)
		}
		return 1 === h.childNodes.length ? h.removeChild(h.firstChild) :
			11 === h.nodeType ? ((o = t()).appendChild(h), o) : h
	}
}
var Ot = Lt((function(e) {
	var t = document.createElement("template");
	return t.innerHTML = e.trim(), document.importNode(t.content, !
		0)
}), (function() {
	return document.createElement("span")
}));

function St(e) {
	let t;
	Object.defineProperties(this, {
		generator: {
			value: qt((e => {
				t = e
			}))
		},
		value: {
			get: () => e,
			set: n => t(e = n)
		}
	}), void 0 !== e && t(e)
}

function* Pt() {
	for (;;) yield Date.now()
}
var Mt = new Map;

function kt(e, t) {
	var n;
	return (n = Mt.get(e = +e)) ? n.then((() => t)) : (n = Date.now()) >= e ?
		Promise.resolve(t) : function(e, t) {
			var n = new Promise((function(n) {
				Mt.delete(t);
				var r = t - e;
				if (!(r > 0)) throw new Error("invalid time");
				if (r > 2147483647) throw new Error(
					"too long to wait");
				setTimeout(n, r)
			}));
			return Mt.set(t, n), n
		}(n, e).then((() => t))
}
var Rt = {
	delay: function(e, t) {
		return new Promise((function(n) {
			setTimeout((function() {
				n(t)
			}), e)
		}))
	},
	tick: function(e, t) {
		return kt(Math.ceil((Date.now() + 1) / e) * e, t)
	},
	when: kt
};

function It(e, t) {
	if (/^(\w+:)|\/\//i.test(e)) return e;
	if (/^[.]{0,2}\//i.test(e)) return new URL(e, null == t ? location : t)
		.href;
	if (!e.length || /^[\s._]/.test(e) || /\s$/.test(e)) throw new Error(
		"illegal name");
	return "https://unpkg.com/" + e
}
var Ut = Lt((function(e) {
		var t = document.createElementNS("http://www.w3.org/2000/svg",
			"g");
		return t.innerHTML = e.trim(), t
	}), (function() {
		return document.createElementNS("http://www.w3.org/2000/svg",
			"g")
	})),
	Dt = String.raw;

function Ft(e) {
	return new Promise((function(t, n) {
		var r = document.createElement("link");
		r.rel = "stylesheet", r.href = e, r.onerror = n, r.onload =
			t, document.head.appendChild(r)
	}))
}

function Bt() {
	return qt((function(e) {
		var t = e(document.body.clientWidth);

		function n() {
			var n = document.body.clientWidth;
			n !== t && e(t = n)
		}
		return window.addEventListener("resize", n),
			function() {
				window.removeEventListener("resize", n)
			}
	}))
}
const zt = Object.assign((async (e, t, n) => {
	const r = function(e, t) {
		const n = t && "function" == typeof t.escape ? t
			.escape : e => e,
			{
				select: r,
				from: o,
				filter: i,
				sort: a,
				slice: s
			} = e;
		if (null === o.table || null === r.columns || r
			.columns && 0 === r.columns.length) return;
		const c = [
			[
				`SELECT ${r.columns.map((e=>`t.${n(e)}`))} FROM ${Wt(o.table,n)} t`
			]
		];
		for (let e = 0; e < i.length; ++e) Vt(e ? "\nAND " :
			"\nWHERE ", c), Yt(i[e], c);
		for (let e = 0; e < a.length; ++e) Vt(e ? ", " :
			"\nORDER BY ", c), Gt(a[e], c);
		null === s.to && null === s.from || Vt("\nLIMIT " +
			(null !== s.to ? s.to - (s.from || 0) :
				1e9), c);
		null !== s.from && Vt(` OFFSET ${s.from}`, c);
		return c
	}(t, await e);
	return r ? Ht(await e, r, n) : null
}), {
	sql: (e, t) => async function() {
		return Ht(e, arguments, t)
	}
});
async function Ht(e, t, n) {
	if (e) {
		if ("function" == typeof e.queryTag) {
			const r = new AbortController,
				o = {
					signal: r.signal
				};
			if (n.then((() => r.abort("invalidated"))), "function" ==
				typeof e.queryStream) return async function*(e) {
				const t = await e,
					n = [];
				n.done = !1, n.error = null, n.schema = t
					.schema;
				try {
					const e = t.readRows();
					do {
						const t = await e.next();
						if (t.done) n.done = !0;
						else
							for (const e of t.value) n.push(e);
						yield n
					} while (!n.done)
				} catch (e) {
					n.error = e, yield n
				}
			}(e.queryStream(...e.queryTag.apply(e, t), o));
			if ("function" == typeof e.query) return e.query(...e.queryTag
				.apply(e, t), o)
		}
		if ("function" == typeof e.sql) return e.sql.apply(e, t);
		throw new Error(
			"source does not implement query, queryStream, or sql")
	}
}

function Wt(e, t) {
	if ("object" == typeof e) {
		let n = "";
		return null != e.database && (n += t(e.database) + "."), null != e
			.schema && (n += t(e.schema) + "."), n += t(e.table), n
	}
	return e
}

function Vt(e, t) {
	const n = t[0];
	n[n.length - 1] += e
}

function Gt({
	column: e,
	direction: t
}, n) {
	Vt(`t.${e} ${t.toUpperCase()}`, n)
}

function Yt({
	type: e,
	operands: t
}, n) {
	if (t.length < 1) throw new Error("Invalid operand length");
	if (1 === t.length) switch (Zt(t[0], n), e) {
		case "n":
			return void Vt(" IS NULL", n);
		case "nn":
			return void Vt(" IS NOT NULL", n);
		default:
			throw new Error("Invalid filter operation")
	}
	if (2 !== t.length || ["in", "nin"].includes(e)) {
		var r;
		switch (Zt(t[0], n), e) {
			case "in":
				Vt(" IN (", n);
				break;
			case "nin":
				Vt(" NOT IN (", n);
				break;
			default:
				throw new Error("Invalid filter operation")
		}! function(e, t) {
			let n = !0;
			for (const r of e) n ? n = !1 : Vt(",", t), t.push(r.value), t[0]
				.push("")
		}(t.slice(1), n), Vt(")", n)
	} else {
		if (["c", "nc"].includes(e)) {
			switch (Zt(t[0], n), e) {
				case "c":
					Vt(" LIKE ", n);
					break;
				case "nc":
					Vt(" NOT LIKE ", n)
			}
			return void Zt((r = t[1], {
				...r,
				value: `%${r.value}%`
			}), n)
		}
		switch (Zt(t[0], n), e) {
			case "eq":
				Vt(" = ", n);
				break;
			case "ne":
				Vt(" <> ", n);
				break;
			case "gt":
				Vt(" > ", n);
				break;
			case "lt":
				Vt(" < ", n);
				break;
			case "gte":
				Vt(" >= ", n);
				break;
			case "lte":
				Vt(" <= ", n);
				break;
			default:
				throw new Error("Invalid filter operation")
		}
		Zt(t[1], n)
	}
}

function Zt(e, t) {
	"column" === e.type ? Vt(`t.${e.value}`, t) : (t.push(e.value), t[0].push(
		""))
}
var Library = Object.assign(Object.defineProperties((function(e) {
	const t = function(e) {
		return null == e ? at : tt(e)
	}(e);
	var n;
	Object.defineProperties(this, (n = {
		FileAttachment: () => yt,
		Mutable: () => St,
		now: Pt,
		width: Bt,
		dot: () => t(Te.resolve()),
		htl: () => t(Le.resolve()),
		html: () => Ot,
		md: () => function(e) {
			return e(Se.resolve()).then((
				function(t) {
					return Lt((function(
						n) {
						var r =
							document
							.createElement(
								"div"
							);
						r.innerHTML =
							t(n, {
								langPrefix: ""
							})
							.trim();
						var o =
							r
							.querySelectorAll(
								"pre code[class]"
							);
						return o
							.length >
							0 &&
							e(qe
								.resolve()
								)
							.then(
								(function(
									t
								) {
									o.forEach(
										(function(
											n
										) {
											function r() {
												t.highlightBlock(
														n
													),
													n
													.parentNode
													.classList
													.add(
														"observablehq--md-pre"
													)
											}
											t.getLanguage(
													n
													.className
												) ?
												r() :
												e(qe.resolve(
													"async-languages/index.js"
												))
												.then(
													(r => {
														if (r
															.has(
																n
																.className
															)
														)
															return e(
																	qe
																	.resolve(
																		"async-languages/" +
																		r
																		.get(
																			n
																			.className
																		)
																	)
																)
																.then(
																	(e => {
																		t.registerLanguage(
																			n
																			.className,
																			e
																		)
																	})
																)
													})
												)
												.then(
													r,
													r
												)
										})
									)
								})
							),
							r
					}), (
						function() {
							return document
								.createElement(
									"div"
								)
						}))
				}))
		}(t),
		svg: () => Ut,
		tex: () => function(e) {
			return Promise.all([e($e.resolve()),
				e.resolve($e.resolve(
					"dist/katex.min.css"
				)).then(Ft)
			]).then((function(e) {
				var t = e[0],
					n = r();

				function r(e) {
					return function() {
						var n =
							document
							.createElement(
								"div"
							);
						return t
							.render(
								Dt
								.apply(
									String,
									arguments
								),
								n,
								e
							),
							n
							.removeChild(
								n
								.firstChild
							)
					}
				}
				return n.options =
					r, n.block = r({
						displayMode:
							!0
					}), n
			}))
		}(t),
		_: () => t(Ae.resolve()),
		aq: () => t.alias({
			"apache-arrow": Ie.resolve()
		})(Ue.resolve()),
		Arrow: () => t(Ie.resolve()),
		d3: () => t(xe.resolve()),
		Inputs: () => t(Ne.resolve()).then((e => ({
			...e,
			file: e.fileOf(wt)
		}))),
		L: () => async function(e) {
			const t = await e(ze.resolve());
			if (!t._style) {
				const n = document
					.createElement("link");
				n.rel = "stylesheet", n.href =
					await e.resolve(ze.resolve(
						"dist/leaflet.css")), t
					._style = document.head
					.appendChild(n)
			}
			return t
		}(t),
		mermaid: () => async function(e) {
			const t = await e(Be.resolve());
			return t.initialize({
					securityLevel: "loose",
					theme: "neutral"
				}),
				function() {
					const e = document
						.createElement("div");
					return e.innerHTML = t
						.render(Et().id, String
							.raw.apply(String,
								arguments)), e
						.removeChild(e
							.firstChild)
				}
		}(t),
		Plot: () => t(je.resolve()),
		__query: () => zt,
		require: () => t,
		resolve: () => It,
		SQLite: () => st(t),
		SQLiteDatabaseClient: () =>
			SQLiteDatabaseClient,
		topojson: () => t(De.resolve()),
		vl: () => async function(e) {
			const [t, n, r] = await Promise.all(
				[Me, ke, Re].map((t => e(t
					.resolve()))));
			return r.register(t, n)
		}(t),
		aapl: () => new FileAttachment(
			"https://static.observableusercontent.com/files/3ccff97fd2d93da734e76829b2b066eafdaac6a1fafdec0faf6ebc443271cfc109d29e80dd217468fcb2aff1e6bffdc73f356cc48feb657f35378e6abbbb63b9"
		).csv({
			typed: !0
		}),
		alphabet: () => new FileAttachment(
			"https://static.observableusercontent.com/files/75d52e6c3130b1cae83cda89305e17b50f33e7420ef205587a135e8562bcfd22e483cf4fa2fb5df6dff66f9c5d19740be1cfaf47406286e2eb6574b49ffc685d"
		).csv({
			typed: !0
		}),
		cars: () => new FileAttachment(
			"https://static.observableusercontent.com/files/048ec3dfd528110c0665dfa363dd28bc516ffb7247231f3ab25005036717f5c4c232a5efc7bb74bc03037155cb72b1abe85a33d86eb9f1a336196030443be4f6"
		).csv({
			typed: !0
		}),
		citywages: () => new FileAttachment(
			"https://static.observableusercontent.com/files/39837ec5121fcc163131dbc2fe8c1a2e0b3423a5d1e96b5ce371e2ac2e20a290d78b71a4fb08b9fa6a0107776e17fb78af313b8ea70f4cc6648fad68ddf06f7a"
		).csv({
			typed: !0
		}),
		diamonds: () => new FileAttachment(
			"https://static.observableusercontent.com/files/87942b1f5d061a21fa4bb8f2162db44e3ef0f7391301f867ab5ba718b225a63091af20675f0bfe7f922db097b217b377135203a7eab34651e21a8d09f4e37252"
		).csv({
			typed: !0
		}),
		flare: () => new FileAttachment(
			"https://static.observableusercontent.com/files/a6b0d94a7f5828fd133765a934f4c9746d2010e2f342d335923991f31b14120de96b5cb4f160d509d8dc627f0107d7f5b5070d2516f01e4c862b5b4867533000"
		).csv({
			typed: !0
		}),
		industries: () => new FileAttachment(
			"https://static.observableusercontent.com/files/76f13741128340cc88798c0a0b7fa5a2df8370f57554000774ab8ee9ae785ffa2903010cad670d4939af3e9c17e5e18e7e05ed2b38b848ac2fc1a0066aa0005f"
		).csv({
			typed: !0
		}),
		miserables: () => new FileAttachment(
			"https://static.observableusercontent.com/files/31d904f6e21d42d4963ece9c8cc4fbd75efcbdc404bf511bc79906f0a1be68b5a01e935f65123670ed04e35ca8cae3c2b943f82bf8db49c5a67c85cbb58db052"
		).json(),
		olympians: () => new FileAttachment(
			"https://static.observableusercontent.com/files/31ca24545a0603dce099d10ee89ee5ae72d29fa55e8fc7c9ffb5ded87ac83060d80f1d9e21f4ae8eb04c1e8940b7287d179fe8060d887fb1f055f430e210007c"
		).csv({
			typed: !0
		}),
		penguins: () => new FileAttachment(
			"https://static.observableusercontent.com/files/715db1223e067f00500780077febc6cebbdd90c151d3d78317c802732252052ab0e367039872ab9c77d6ef99e5f55a0724b35ddc898a1c99cb14c31a379af80a"
		).csv({
			typed: !0
		}),
		weather: () => new FileAttachment(
			"https://static.observableusercontent.com/files/693a46b22b33db0f042728700e0c73e836fa13d55446df89120682d55339c6db7cc9e574d3d73f24ecc9bc7eb9ac9a1e7e104a1ee52c00aab1e77eb102913c1f"
		).csv({
			typed: !0
		}),
		DOM: xt,
		Files: Nt,
		Generators: At,
		Promises: Rt
	}, Object.fromEntries(Object.entries(n).map(
		Kt))))
}), {
	resolve: {
		get: () => at.resolve,
		enumerable: !0,
		configurable: !0
	},
	require: {
		get: () => at,
		set: function(e) {
			at = e
		},
		enumerable: !0,
		configurable: !0
	}
}), {
	resolveFrom: Qe,
	requireFrom: tt
});

function Kt([e, t]) {
	return [e, {
		value: t,
		writable: !0,
		enumerable: !0
	}]
}

function RuntimeError(e, t) {
	this.message = e + "", this.input = t
}
RuntimeError.prototype = Object.create(Error.prototype), RuntimeError.prototype
	.name = "RuntimeError", RuntimeError.prototype.constructor = RuntimeError;
var Jt = Array.prototype,
	Xt = Jt.map,
	Qt = Jt.forEach;

function en(e) {
	return function() {
		return e
	}
}

function tn(e) {
	return e
}

function nn() {}
var rn = {};

function Variable(e, t, n) {
	var r;
	n || (n = rn), Object.defineProperties(this, {
		_observer: {
			value: n,
			writable: !0
		},
		_definition: {
			value: sn,
			writable: !0
		},
		_duplicate: {
			value: void 0,
			writable: !0
		},
		_duplicates: {
			value: void 0,
			writable: !0
		},
		_indegree: {
			value: NaN,
			writable: !0
		},
		_inputs: {
			value: [],
			writable: !0
		},
		_invalidate: {
			value: nn,
			writable: !0
		},
		_module: {
			value: t
		},
		_name: {
			value: null,
			writable: !0
		},
		_outputs: {
			value: new Set,
			writable: !0
		},
		_promise: {
			value: Promise.resolve(void 0),
			writable: !0
		},
		_reachable: {
			value: n !== rn,
			writable: !0
		},
		_rejector: {
			value: (r = this, function(e) {
				if (e === cn) throw e;
				if (e === sn) throw new RuntimeError(r._name +
					" is not defined", r._name);
				if (e instanceof Error && e.message)
					throw new RuntimeError(e.message, r._name);
				throw new RuntimeError(r._name +
					" could not be resolved", r._name)
			})
		},
		_type: {
			value: e
		},
		_value: {
			value: void 0,
			writable: !0
		},
		_version: {
			value: 0,
			writable: !0
		}
	})
}

function on(e) {
	e._module._runtime._dirty.add(e), e._outputs.add(this)
}

function an(e) {
	e._module._runtime._dirty.add(e), e._outputs.delete(this)
}

function sn() {
	throw sn
}

function cn() {
	throw cn
}

function ln(e) {
	return function() {
		throw new RuntimeError(e + " is defined more than once")
	}
}

function un(e, t, n) {
	var r = this._module._scope,
		o = this._module._runtime;
	if (this._inputs.forEach(an, this), t.forEach(on, this), this._inputs = t,
		this._definition = n, this._value = void 0, n === nn ? o._variables
		.delete(this) : o._variables.add(this), e !== this._name || r.get(e) !==
		this) {
		var i, a;
		if (this._name)
			if (this._outputs.size) r.delete(this._name), (a = this._module
					._resolve(this._name))._outputs = this._outputs, this
				._outputs = new Set, a._outputs.forEach((function(e) {
					e._inputs[e._inputs.indexOf(this)] = a
				}), this), a._outputs.forEach(o._updates.add, o._updates), o
				._dirty.add(a).add(this), r.set(this._name, a);
			else if ((a = r.get(this._name)) === this) r.delete(this._name);
		else {
			if (3 !== a._type) throw new Error;
			a._duplicates.delete(this), this._duplicate = void 0, 1 === a
				._duplicates.size && (a = a._duplicates.keys().next().value, i =
					r.get(this._name), a._outputs = i._outputs, i._outputs =
					new Set, a._outputs.forEach((function(e) {
						e._inputs[e._inputs.indexOf(i)] = a
					})), a._definition = a._duplicate, a._duplicate = void 0, o
					._dirty.add(i).add(a), o._updates.add(a), r.set(this._name,
						a))
		}
		if (this._outputs.size) throw new Error;
		e && ((a = r.get(e)) ? 3 === a._type ? (this._definition = ln(e), this
				._duplicate = n, a._duplicates.add(this)) : 2 === a._type ?
			(this._outputs = a._outputs, a._outputs = new Set, this._outputs
				.forEach((function(e) {
					e._inputs[e._inputs.indexOf(a)] = this
				}), this), o._dirty.add(a).add(this), r.set(e, this)) : (a
				._duplicate = a._definition, this._duplicate = n, (i =
					new Variable(3, this._module))._name = e, i
				._definition = this._definition = a._definition = ln(e), i
				._outputs = a._outputs, a._outputs = new Set, i._outputs
				.forEach((function(e) {
					e._inputs[e._inputs.indexOf(a)] = i
				})), i._duplicates = new Set([this, a]), o._dirty.add(a)
				.add(i), o._updates.add(a).add(i), r.set(e, i)) : r.set(e,
				this)), this._name = e
	}
	return this._version > 0 && ++this._version, o._updates.add(this), o
		._compute(), this
}

function Module(e, t = []) {
	Object.defineProperties(this, {
		_runtime: {
			value: e
		},
		_scope: {
			value: new Map
		},
		_builtins: {
			value: new Map([
				["invalidation", pn],
				["visibility", mn], ...t
			])
		},
		_source: {
			value: null,
			writable: !0
		}
	})
}
async function dn(e, t) {
	await e._compute();
	try {
		return await t._promise
	} catch (n) {
		if (n === cn) return dn(e, t);
		throw n
	}
}

function fn(e) {
	return e._name
}
Object.defineProperties(Variable.prototype, {
	_pending: {
		value: function() {
			this._observer.pending && this._observer.pending()
		},
		writable: !0,
		configurable: !0
	},
	_fulfilled: {
		value: function(e) {
			this._observer.fulfilled && this._observer.fulfilled(e,
				this._name)
		},
		writable: !0,
		configurable: !0
	},
	_rejected: {
		value: function(e) {
			this._observer.rejected && this._observer.rejected(e,
				this._name)
		},
		writable: !0,
		configurable: !0
	},
	define: {
		value: function(e, t, n) {
			switch (arguments.length) {
				case 1:
					n = e, e = t = null;
					break;
				case 2:
					n = t, "string" == typeof e ? t = null : (t = e,
						e = null)
			}
			return un.call(this, null == e ? null : e + "", null ==
				t ? [] : Xt.call(t, this._module._resolve, this
					._module), "function" == typeof n ? n : en(
					n))
		},
		writable: !0,
		configurable: !0
	},
	delete: {
		value: function() {
			return un.call(this, null, [], nn)
		},
		writable: !0,
		configurable: !0
	},
	import: {
		value: function(e, t, n) {
			arguments.length < 3 && (n = t, t = e);
			return un.call(this, t + "", [n._resolve(e + "")], tn)
		},
		writable: !0,
		configurable: !0
	}
}), Object.defineProperties(Module.prototype, {
	_copy: {
		value: function(e, t) {
			e._source = this, t.set(this, e);
			for (const [i, a] of this._scope) {
				var n = e._scope.get(i);
				if (!n || 1 !== n._type)
					if (a._definition === tn) {
						var r = a._inputs[0],
							o = r._module;
						e.import(r._name, i, t.get(o) || (o
							._source ? o._copy(new Module(e
									._runtime, e._builtins),
								t) : o))
					} else e.define(i, a._inputs.map(fn), a
						._definition)
			}
			return e
		},
		writable: !0,
		configurable: !0
	},
	_resolve: {
		value: function(e) {
			var t, n = this._scope.get(e);
			if (!n)
				if (n = new Variable(2, this), this._builtins.has(
						e)) n.define(e, en(this._builtins.get(e)));
				else if (this._runtime._builtin._scope.has(e)) n
				.import(e, this._runtime._builtin);
			else {
				try {
					t = this._runtime._global(e)
				} catch (t) {
					return n.define(e, (r = t, function() {
						throw r
					}))
				}
				void 0 === t ? this._scope.set(n._name = e, n) : n
					.define(e, en(t))
			}
			var r;
			return n
		},
		writable: !0,
		configurable: !0
	},
	redefine: {
		value: function(e) {
			var t = this._scope.get(e);
			if (!t) throw new RuntimeError(e + " is not defined");
			if (3 === t._type) throw new RuntimeError(e +
				" is defined more than once");
			return t.define.apply(t, arguments)
		},
		writable: !0,
		configurable: !0
	},
	define: {
		value: function() {
			var e = new Variable(1, this);
			return e.define.apply(e, arguments)
		},
		writable: !0,
		configurable: !0
	},
	derive: {
		value: function(e, t) {
			var n = new Module(this._runtime, this._builtins);
			return n._source = this, Qt.call(e, (function(e) {
				"object" != typeof e && (e = {
					name: e + ""
				}), null == e.alias && (e.alias = e
					.name), n.import(e.name, e
					.alias, t)
			})), Promise.resolve().then((() => {
				const e = new Set([this]);
				for (const t of e)
					for (const n of t._scope.values())
						if (n._definition === tn) {
							const t = n._inputs[0]
								._module,
								r = t._source || t;
							if (r === this)
								return void console
									.warn(
										"circular module definition; ignoring"
									);
							e.add(r)
						} this._copy(n, new Map)
			})), n
		},
		writable: !0,
		configurable: !0
	},
	import: {
		value: function() {
			var e = new Variable(1, this);
			return e.import.apply(e, arguments)
		},
		writable: !0,
		configurable: !0
	},
	value: {
		value: async function(e) {
			var t = this._scope.get(e);
			if (!t) throw new RuntimeError(e + " is not defined");
			if (t._observer !== rn) return dn(this._runtime, t);
			t = this.variable(!0).define([e], tn);
			try {
				return await dn(this._runtime, t)
			} finally {
				t.delete()
			}
		},
		writable: !0,
		configurable: !0
	},
	variable: {
		value: function(e) {
			return new Variable(1, this, e)
		},
		writable: !0,
		configurable: !0
	},
	builtin: {
		value: function(e, t) {
			this._builtins.set(e, t)
		},
		writable: !0,
		configurable: !0
	}
});
const hn = "function" == typeof requestAnimationFrame ? requestAnimationFrame :
	"function" == typeof setImmediate ? setImmediate : e => setTimeout(e, 0);
var pn = {},
	mn = {};

function Runtime(e = new Library, t = xn) {
	var n = this.module();
	if (Object.defineProperties(this, {
			_dirty: {
				value: new Set
			},
			_updates: {
				value: new Set
			},
			_precomputes: {
				value: [],
				writable: !0
			},
			_computing: {
				value: null,
				writable: !0
			},
			_init: {
				value: null,
				writable: !0
			},
			_modules: {
				value: new Map
			},
			_variables: {
				value: new Set
			},
			_disposed: {
				value: !1,
				writable: !0
			},
			_builtin: {
				value: n
			},
			_global: {
				value: t
			}
		}), e)
		for (var r in e) new Variable(2, n).define(r, [], e[r])
}

function bn(e) {
	const t = new Set(e._inputs);
	for (const n of t) {
		if (n === e) return !0;
		n._inputs.forEach(t.add, t)
	}
	return !1
}

function vn(e) {
	++e._indegree
}

function wn(e) {
	--e._indegree
}

function yn(e) {
	return e._promise.catch(e._rejector)
}

function _n(e) {
	return new Promise((function(t) {
		e._invalidate = t
	}))
}

function gn(e, t) {
	let n, r, o = "function" == typeof IntersectionObserver && t._observer && t
		._observer._node,
		i = !o,
		a = nn,
		s = nn;
	return o && (r = new IntersectionObserver((([e]) => (i = e
			.isIntersecting) && (n = null, a()))), r.observe(o), e.then((
			() => (r.disconnect(), r = null, s())))),
		function(e) {
			return i ? Promise.resolve(e) : r ? (n || (n = new Promise(((e,
					t) => (a = e, s = t)))), n.then((() => e))) : Promise
				.reject()
		}
}

function En(e) {
	e._invalidate(), e._invalidate = nn, e._pending();
	const t = e._value,
		n = ++e._version;
	let r = null;
	const o = e._promise = (e._inputs.length ? Promise.all(e._inputs.map(yn))
		.then((function(o) {
			if (e._version !== n) throw cn;
			for (var i = 0, a = o.length; i < a; ++i) switch (o[
					i]) {
				case pn:
					o[i] = r = _n(e);
					break;
				case mn:
					r || (r = _n(e)), o[i] = gn(r, e)
			}
			return e._definition.apply(t, o)
		})) : new Promise((n => n(e._definition.call(t))))).then((function(
		t) {
		if (e._version !== n) throw cn;
		if (function(e) {
				return e && "function" == typeof e.next &&
					"function" == typeof e.return
			}(t)) return (r || _n(e)).then((o = t, function() {
				o.return()
			})),
			function(e, t, n) {
				const r = e._module._runtime;
				let o;

				function i(e) {
					return new Promise((e => e(n.next(o))))
						.then((({
								done: t,
								value: n
							}) => t ? void 0 : Promise
							.resolve(n).then(e)))
				}

				function a() {
					const n = i((i => {
						if (e._version !== t)
							throw cn;
						return o = i, s(i, n).then((
								() => r
								._precompute(a)
							)), e
							._fulfilled(i), i
					}));
					n.catch((r => {
						if (r === cn) throw r;
						if (e._version !== t)
							throw cn;
						s(void 0, n), e._rejected(r)
					}))
				}

				function s(t, n) {
					return e._value = t, e._promise = n, e
						._outputs.forEach(r._updates.add, r
							._updates), r._compute()
				}
				return i((n => {
					if (e._version !== t) throw cn;
					return o = n, r._precompute(a),
						n
				}))
			}(e, n, t);
		var o;
		return t
	}));
	o.then((t => {
		e._value = t, e._fulfilled(t)
	}), (t => {
		t !== cn && (e._value = void 0, e._rejected(t))
	}))
}

function Cn(e, t) {
	e._invalidate(), e._invalidate = nn, e._pending(), ++e._version, e
		._indegree = NaN, (e._promise = Promise.reject(t)).catch(nn), e._value =
		void 0, e._rejected(t)
}

function xn(e) {
	return window[e]
}
Object.defineProperties(Runtime, {
	load: {
		value: function(e, t, n) {
			if ("function" == typeof t && (n = t, t = null),
				"function" != typeof n) throw new Error(
				"invalid observer");
			null == t && (t = new Library);
			const {
				modules: r,
				id: o
			} = e, i = new Map, a = new Runtime(t), s = c(o);

			function c(e) {
				let t = i.get(e);
				return t || i.set(e, t = a.module()), t
			}
			for (const e of r) {
				const t = c(e.id);
				let r = 0;
				for (const o of e.variables) o.from ? t.import(o
						.remote, o.name, c(o.from)) : t === s ? t
					.variable(n(o, r, e.variables)).define(o.name, o
						.inputs, o.value) : t.define(o.name, o
						.inputs, o.value), ++r
			}
			return a
		},
		writable: !0,
		configurable: !0
	}
}), Object.defineProperties(Runtime.prototype, {
	_precompute: {
		value: function(e) {
			this._precomputes.push(e), this._compute()
		},
		writable: !0,
		configurable: !0
	},
	_compute: {
		value: function() {
			return this._computing || (this._computing = this
				._computeSoon())
		},
		writable: !0,
		configurable: !0
	},
	_computeSoon: {
		value: function() {
			return new Promise(hn).then((() => this._disposed ?
				void 0 : this._computeNow()))
		},
		writable: !0,
		configurable: !0
	},
	_computeNow: {
		value: async function() {
			var e, t, n = [],
				r = this._precomputes;
			if (r.length) {
				this._precomputes = [];
				for (const e of r) e();
				await

				function(e = 0) {
					let t = Promise.resolve();
					for (let n = 0; n < e; ++n) t = t.then((
						() => {}));
					return t
				}(3)
			}(e = new Set(this._dirty)).forEach((function(t) {
					t._inputs.forEach(e.add, e);
					const n = function(e) {
						if (e._observer !== rn) return !
							0;
						var t = new Set(e._outputs);
						for (const e of t) {
							if (e._observer !== rn)
								return !0;
							e._outputs.forEach(t.add, t)
						}
						return !1
					}(t);
					n > t._reachable ? this._updates.add(
							t) : n < t._reachable && t
						._invalidate(), t._reachable = n
				}), this), (e = new Set(this._updates)).forEach((
					function(t) {
						t._reachable ? (t._indegree = 0, t
							._outputs.forEach(e.add, e)) : (
							t._indegree = NaN, e.delete(t))
					})), this._computing = null, this._updates
				.clear(), this._dirty.clear(), e.forEach((function(
					e) {
					e._outputs.forEach(vn)
				}));
			do {
				for (e.forEach((function(e) {
						0 === e._indegree && n.push(e)
					})); t = n.pop();) En(t), t._outputs.forEach(o),
					e.delete(t);
				e.forEach((function(t) {
					bn(t) && (Cn(t, new RuntimeError(
						"circular definition"
					)), t._outputs.forEach(
						wn), e.delete(t))
				}))
			} while (e.size);

			function o(e) {
				0 == --e._indegree && n.push(e)
			}
		},
		writable: !0,
		configurable: !0
	},
	dispose: {
		value: function() {
			this._computing = Promise.resolve(), this._disposed = !
				0, this._variables.forEach((e => {
					e._invalidate(), e._version = NaN
				}))
		},
		writable: !0,
		configurable: !0
	},
	module: {
		value: function(e, t = nn) {
			let n;
			if (void 0 === e) return (n = this._init) ? (this
				._init = null, n) : new Module(this);
			if (n = this._modules.get(e), n) return n;
			this._init = n = new Module(this), this._modules.set(e,
				n);
			try {
				e(this, t)
			} finally {
				this._init = null
			}
			return n
		},
		writable: !0,
		configurable: !0
	},
	fileAttachments: {
		value: function(e) {
			return Object.assign((t => {
				const n = e(t += "");
				if (null == n) throw new Error(
					`File not found: ${t}`);
				if ("object" == typeof n && "url" in
					n) {
					const {
						url: e,
						mimeType: r
					} = n;
					return new FileAttachment(e, t, r)
				}
				return new FileAttachment(n, t)
			}), {
				prototype: FileAttachment.prototype
			})
		},
		writable: !0,
		configurable: !0
	}
});
export {
	Inspector,
	Library,
	Runtime,
	RuntimeError
};
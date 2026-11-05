// The homepage canvas camera.
//
// The homepage is one big canvas (".world"): the projects gallery, home and the guest book along the top,
// and each project's page scattered below. The window is a fixed "viewport" looking at part of it.
// The camera is { x, y, s }: the world point at the top-left of the screen, and the zoom (1 = normal size).
//
// Ways to move: scroll / trackpad, hold the cursor at any edge, drag empty space (one finger on touch),
// arrow keys, links to #projects / #home / #book or to a project page, and the zoom buttons.
// Zoomed out, the content stops reacting to the mouse: clicking a page (a "group") fits it to the screen,
// and clicking empty space zooms in there.

type Cam = { x: number; y: number; s: number };
export type Group = { id: string; el: HTMLElement; label?: string };

const EDGE = 20; // px at each side of the screen where holding the cursor pans
const EDGE_SPEED = 1.5; // px per ms at full speed
const EDGE_RAMP = 350; // ms to reach full speed
const EASE_MS = 120; // how quickly the camera catches up with where it's heading
const MIN_S = 0.08;
const MAX_S = 1.5;
const INTERACTIVE_S = 0.9; // below this zoom the page is an overview, and clicks fit or zoom

let world: HTMLElement;
let root: HTMLElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let cam: Cam = { x: 0, y: 0, s: 1 };
let goal: Cam = { ...cam };
let raf = 0;
let last = 0;
const groups: Group[] = [];
const listeners: ((c: Cam) => void)[] = [];

const vw = () => root.clientWidth;
const vh = () => root.clientHeight;

// ---------- world geometry ----------

/** an element's box in world coordinates (unaffected by the camera) */
export function worldRect(el: HTMLElement) {
	let x = 0;
	let y = 0;
	const w = world ?? document.querySelector<HTMLElement>('.world');
	let node: HTMLElement | null = el;
	while (node && node !== w) {
		x += node.offsetLeft;
		y += node.offsetTop;
		node = node.offsetParent as HTMLElement | null;
	}
	return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function bounds() {
	let minX = 0, minY = 0, maxX = vw(), maxY = vh();
	for (const g of groups) {
		const r = worldRect(g.el);
		minX = Math.min(minX, r.x);
		minY = Math.min(minY, r.y);
		maxX = Math.max(maxX, r.x + r.w);
		maxY = Math.max(maxY, r.y + r.h);
	}
	return { minX, minY, maxX, maxY };
}

// keep the camera over the canvas; when the canvas is smaller than the screen, centre it
function clamp(c: Cam): Cam {
	const s = Math.min(MAX_S, Math.max(MIN_S, c.s));
	const b = bounds();
	const pad = 80 / s;
	const viewW = vw() / s;
	const viewH = vh() / s;
	const fit = (v: number, lo: number, hi: number, view: number) =>
		hi - lo + 2 * pad <= view ? (lo + hi) / 2 - view / 2 : Math.min(hi + pad - view, Math.max(lo - pad, v));
	return { s, x: fit(c.x, b.minX, b.maxX, viewW), y: fit(c.y, b.minY, b.maxY, viewH) };
}

// ---------- drawing ----------

function draw() {
	world.style.transform = `translate(${(-cam.x * cam.s).toFixed(2)}px, ${(-cam.y * cam.s).toFixed(2)}px) scale(${cam.s.toFixed(4)})`;
	root.classList.toggle('zoomed-out', cam.s < INTERACTIVE_S);
	listeners.forEach((fn) => fn(cam));
}

function tick(now: number) {
	const dt = last ? Math.min(now - last, 50) : 16;
	last = now;
	edgeStep(dt);
	const k = reduced ? 1 : 1 - Math.exp(-dt / EASE_MS);
	// zoom eases in log space so zooming in and out feel the same speed
	const ls = Math.log(cam.s) + (Math.log(goal.s) - Math.log(cam.s)) * k;
	cam = { x: cam.x + (goal.x - cam.x) * k, y: cam.y + (goal.y - cam.y) * k, s: Math.exp(ls) };
	const done = Math.abs(goal.x - cam.x) < 0.3 && Math.abs(goal.y - cam.y) < 0.3 && Math.abs(goal.s - cam.s) < 0.0005;
	if (done) cam = { ...goal };
	draw();
	if (done && !edge.x && !edge.y) {
		raf = 0;
		last = 0;
	} else {
		raf = requestAnimationFrame(tick);
	}
}

const kick = () => {
	if (!raf) raf = requestAnimationFrame(tick);
};

// ---------- moving ----------

export function getCamera() {
	return { ...cam };
}

export function onCamera(fn: (c: Cam) => void) {
	listeners.push(fn);
}

/** head somewhere (world coords); instant skips the glide */
export function moveTo(c: Partial<Cam>, instant = false) {
	goal = clamp({ ...goal, ...c });
	if (instant || reduced) {
		cam = { ...goal };
		draw();
	}
	kick();
}

/** pan by screen pixels */
export function panBy(dx: number, dy: number, instant = true) {
	goal = clamp({ ...goal, x: goal.x + dx / goal.s, y: goal.y + dy / goal.s });
	if (instant) {
		cam = { ...cam, x: goal.x, y: goal.y, s: cam.s };
		// keep any zoom glide going
		if (Math.abs(goal.s - cam.s) < 0.0005) cam = { ...goal };
		draw();
	}
	kick();
}

/** zoom by a factor, keeping the point under (sx, sy) on screen still */
export function zoomAt(factor: number, sx = vw() / 2, sy = vh() / 2) {
	const s = Math.min(MAX_S, Math.max(MIN_S, goal.s * factor));
	const wx = goal.x + sx / goal.s;
	const wy = goal.y + sy / goal.s;
	moveTo({ s, x: wx - sx / s, y: wy - sy / s });
}

/** fit a world rectangle to the screen (never zooming in past normal size) */
export function fitRect(r: { x: number; y: number; w: number; h: number }, margin = 0.92, maxS = 1) {
	const s = Math.min(maxS, (vw() * margin) / r.w, (vh() * margin) / r.h);
	moveTo({ s, x: r.x + r.w / 2 - vw() / s / 2, y: r.y + r.h / 2 - vh() / s / 2 });
}

/** zoom right out to see everything */
export function fitAll() {
	const b = bounds();
	fitRect({ x: b.minX, y: b.minY, w: b.maxX - b.minX, h: b.maxY - b.minY }, 0.9);
}

/** go to a group at normal size, its top-left in view (or centred if it's narrower than the screen) */
export function goToGroup(id: string, instant = false) {
	const g = groups.find((x) => x.id === id);
	if (!g) return;
	const r = worldRect(g.el);
	const x = r.w < vw() ? r.x + r.w / 2 - vw() / 2 : r.x;
	moveTo({ s: 1, x, y: r.y }, instant);
}

// named places to go (home, projects, book, each project page); goToView falls back to the group with that id
const views: Record<string, (instant: boolean) => void> = {};
export function registerView(id: string, fn: (instant: boolean) => void) {
	views[id] = fn;
}
export function goToView(id: string, instant = false) {
	if (views[id]) views[id](instant);
	else goToGroup(id, instant);
}

export function registerGroup(g: Group) {
	groups.push(g);
}

export function groupAt(wx: number, wy: number) {
	return groups.find((g) => {
		const r = worldRect(g.el);
		return wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h;
	});
}

export const allGroups = () => groups;

// ---------- holding the cursor at an edge ----------

// +1 / -1 on each axis while the cursor is held at that edge; it must arrive moving that way
const edge = { x: 0, y: 0, since: 0 };

function setEdge(x: number, y: number) {
	if (x === edge.x && y === edge.y) return;
	if (!edge.x && !edge.y) edge.since = performance.now();
	edge.x = x;
	edge.y = y;
	pointArrow();
	if (x || y) kick();
}

// the cursor becomes a pink arrow pointing the way the canvas is moving (styles in brand.css)
function pointArrow(moving = { x: edge.x, y: edge.y }) {
	root.classList.toggle('pan-right', moving.x > 0);
	root.classList.toggle('pan-left', moving.x < 0);
	root.classList.toggle('pan-down', !moving.x && moving.y > 0);
	root.classList.toggle('pan-up', !moving.x && moving.y < 0);
}

function edgeStep(dt: number) {
	if (!edge.x && !edge.y) return;
	const ramp = Math.min(1, (performance.now() - edge.since) / EDGE_RAMP);
	const before = { x: goal.x, y: goal.y };
	const d = EDGE_SPEED * ramp * dt;
	goal = clamp({ ...goal, x: goal.x + (edge.x * d) / goal.s, y: goal.y + (edge.y * d) / goal.s });
	cam = { ...cam, x: goal.x, y: goal.y };
	// at the end of the canvas: stop pointing an arrow that way
	pointArrow({ x: goal.x !== before.x ? edge.x : 0, y: goal.y !== before.y ? edge.y : 0 });
}

// ---------- set up ----------

export function initCamera(worldEl: HTMLElement) {
	world = worldEl;
	root = document.documentElement;
	draw();

	let lastX = -1;
	let lastY = -1;
	const wallOpen = () => root.classList.contains('wall-open');
	addEventListener('mousemove', (e) => {
		if (wallOpen()) return setEdge(0, 0);
		const dx = lastX < 0 ? 0 : e.clientX - lastX;
		const dy = lastY < 0 ? 0 : e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		const atR = e.clientX >= vw() - EDGE;
		const atL = e.clientX <= EDGE;
		const atB = e.clientY >= vh() - EDGE;
		const atT = e.clientY <= EDGE;
		let x = atR ? (edge.x === 1 || dx > 0 ? 1 : 0) : atL ? (edge.x === -1 || dx < 0 ? -1 : 0) : 0;
		let y = atB ? (edge.y === 1 || dy > 0 ? 1 : 0) : atT ? (edge.y === -1 || dy < 0 ? -1 : 0) : 0;
		setEdge(x, y);
	});
	// pushing off a side (onto the scrollbar or out of the window) counts as holding there; coming back lets go
	document.addEventListener('mouseout', (e) => {
		if (e.relatedTarget || wallOpen()) return;
		const x = e.clientX >= vw() - 4 ? 1 : e.clientX <= 4 ? -1 : 0;
		setEdge(x, 0);
	});
	document.addEventListener('mouseover', (e) => {
		if (!e.relatedTarget) setEdge(0, 0);
	});
	addEventListener('blur', () => setEdge(0, 0));

	// scroll wheel and trackpad pan the canvas; pinch (ctrl + wheel) zooms at the cursor
	addEventListener(
		'wheel',
		(e) => {
			e.preventDefault();
			if (wallOpen()) return;
			const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? vh() : 1;
			if (e.ctrlKey) {
				zoomAt(Math.exp(-e.deltaY * unit * 0.01), e.clientX, e.clientY);
			} else {
				const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
				const dy = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
				panBy(dx * unit, dy * unit);
			}
		},
		{ passive: false },
	);

	// drag empty space to pan (mouse), or anything but the carousel (touch); two fingers pinch to zoom
	const pointers = new Map<number, { x: number; y: number }>();
	let dragging = false;
	let moved = 0;
	let pinch = 0;
	const empty = (t: HTMLElement) =>
		root.classList.contains('zoomed-out') || !t.closest('a, button, input, textarea, select, label, .tdc, p, h1, h2, h3, li, img');
	addEventListener('pointerdown', (e) => {
		const t = e.target as HTMLElement;
		if (t.closest('.zoom-controls, .wall-overlay')) return;
		if (e.pointerType === 'mouse' && (e.button !== 0 || !empty(t))) return;
		if (e.pointerType !== 'mouse' && t.closest('.tdc')) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		dragging = true;
		moved = 0;
		if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			pinch = Math.hypot(a.x - b.x, a.y - b.y);
		}
	});
	addEventListener('pointermove', (e) => {
		const p = pointers.get(e.pointerId);
		if (!dragging || !p) return;
		const dx = e.clientX - p.x;
		const dy = e.clientY - p.y;
		p.x = e.clientX;
		p.y = e.clientY;
		if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			const d = Math.hypot(a.x - b.x, a.y - b.y);
			if (pinch) zoomAt(d / pinch, (a.x + b.x) / 2, (a.y + b.y) / 2);
			pinch = d;
			return;
		}
		moved += Math.abs(dx) + Math.abs(dy);
		if (moved > 4) {
			root.classList.add('is-dragging');
			panBy(-dx, -dy);
		}
	});
	const up = (e: PointerEvent) => {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinch = 0;
		if (!pointers.size) {
			dragging = false;
			root.classList.remove('is-dragging');
		}
	};
	addEventListener('pointerup', up);
	addEventListener('pointercancel', up);
	// a drag shouldn't also count as a click on whatever it ended over
	addEventListener(
		'click',
		(e) => {
			if (moved > 4) {
				e.preventDefault();
				e.stopPropagation();
				moved = 0;
			}
		},
		true,
	);

	// keyboard: arrows, page up/down and space move around (not while typing)
	addEventListener('keydown', (e) => {
		const t = e.target as HTMLElement;
		if (wallOpen() || t.closest('input, textarea, select, [contenteditable]')) return;
		const step = 90;
		const page = vh() * 0.85;
		const keys: Record<string, [number, number]> = {
			ArrowDown: [0, step], ArrowUp: [0, -step], ArrowRight: [step, 0], ArrowLeft: [-step, 0],
			PageDown: [0, page], PageUp: [0, -page], ' ': [0, e.shiftKey ? -page : page],
		};
		const k = keys[e.key];
		if (k) {
			e.preventDefault();
			panBy(k[0], k[1], false);
		} else if (e.key === '+' || e.key === '=') {
			zoomAt(1.25);
		} else if (e.key === '-' || e.key === '_') {
			zoomAt(0.8);
		}
	});

	// tabbing to something off screen brings it into view
	document.addEventListener('focusin', (e) => {
		const t = e.target as HTMLElement;
		if (!world.contains(t) || cam.s < INTERACTIVE_S) return;
		const r = worldRect(t);
		const viewW = vw() / cam.s;
		const viewH = vh() / cam.s;
		const inView = r.x >= goal.x && r.x + r.w <= goal.x + viewW && r.y >= goal.y && r.y + r.h <= goal.y + viewH;
		if (!inView) moveTo({ x: r.x + r.w / 2 - viewW / 2, y: r.y + r.h / 2 - viewH / 2 });
	});

	// keep within bounds when the window changes size
	addEventListener('resize', () => moveTo({}, true));
}

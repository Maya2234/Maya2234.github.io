import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import './3d-carousel.css';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Starts at defaultValue on both server and first client render (so hydration matches), then updates
export function useMediaQuery(query: string, defaultValue = false): boolean {
	const [matches, setMatches] = useState<boolean>(defaultValue);

	useIsomorphicLayoutEffect(() => {
		const media = window.matchMedia(query);
		const handleChange = () => setMatches(media.matches);
		handleChange();
		media.addEventListener('change', handleChange);
		return () => media.removeEventListener('change', handleChange);
	}, [query]);

	return matches;
}

export type CarouselProject = {
	title: string;
	href: string;
	image: string;
	alt: string;
	external?: boolean;
	// shown in the wide popup when a card is hovered
	blurb?: string;
	tags?: string[];
};

// A ring of 4 cards looks like a box, so short lists repeat until the ring is full
const MIN_FACES = 8;

type Labels = { prev: string; next: string };

const Ring = memo(({ projects, labels }: { projects: CarouselProject[]; labels: Labels }) => {
	const isSmall = useMediaQuery('(max-width: 640px)');
	const cards = useMemo(() => {
		if (projects.length === 0) return [];
		const repeats = Math.ceil(MIN_FACES / projects.length);
		return Array.from({ length: repeats }, () => projects).flat();
	}, [projects]);

	const faceCount = cards.length;
	const faceWidth = isSmall ? 220 : 320;
	const cylinderWidth = faceWidth * faceCount;
	const radius = cylinderWidth / (2 * Math.PI);
	const step = 360 / faceCount;

	const rotation = useMotionValue(0);

	// The hovered project fills the wide popup; `shown` keeps the last one so it can fade out with its text
	const [hovered, setHovered] = useState<CarouselProject | null>(null);
	const [shown, setShown] = useState<CarouselProject | null>(null);
	const show = (project: CarouselProject | null) => {
		setHovered(project);
		if (project) setShown(project);
	};

	// Set while a drag is in progress so the release doesn't also count as a click on a card
	const dragged = useRef(false);

	// Where the ring is heading, so quick repeated clicks each add a full step
	const target = useRef(0);

	const spin = (direction: number) => {
		target.current = Math.round(target.current / step) * step + direction * step;
		animate(rotation, target.current, { type: 'spring', stiffness: 120, damping: 24, mass: 0.6 });
	};

	// Hovering a card at the side turns the ring to bring it to the front.
	// A card faces you when ring angle + its own angle is a whole turn; pick the nearest such angle.
	// While the ring is turning, new hovers wait, so the card sliding in under the cursor doesn't set off another turn.
	const hoverTimer = useRef(0);
	const busyUntil = useRef(0);
	const frontIndex = () => ((Math.round(-target.current / step) % faceCount) + faceCount) % faceCount;
	const bringToFront = (i: number) => {
		if (i === frontIndex()) return;
		const want = -i * step;
		target.current = want + Math.round((target.current - want) / 360) * 360;
		busyUntil.current = performance.now() + 700;
		animate(rotation, target.current, { type: 'spring', stiffness: 110, damping: 24, mass: 0.6 });
	};
	const hoverCard = (i: number) => {
		clearTimeout(hoverTimer.current);
		if (dragged.current || performance.now() < busyUntil.current) return;
		hoverTimer.current = window.setTimeout(() => bringToFront(i), 120);
	};

	return (
		<div className="tdc">
			<button type="button" className="tdc-arrow tdc-arrow-prev" aria-label={labels.prev} onClick={() => spin(1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
			</button>

			<div className="tdc-stage">
				<motion.div
					className="tdc-ring"
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0}
					style={{ rotateY: rotation, width: cylinderWidth }}
					onDragStart={() => {
						dragged.current = true;
						rotation.stop();
					}}
					onDrag={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.15)}
					onDragEnd={(_, info) => {
						// Fling with the release speed, then settle on the nearest card
						target.current = Math.round((rotation.get() + info.velocity.x * 0.05) / step) * step;
						animate(rotation, target.current, { type: 'spring', stiffness: 100, damping: 30, mass: 0.4 });
						setTimeout(() => {
							dragged.current = false;
						}, 0);
					}}
				>
					{cards.map((project, i) => {
						const isCopy = i >= projects.length;
						return (
							<div
								key={`${project.href}-${i}`}
								className="tdc-face"
								style={{
									width: faceWidth,
									transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
								}}
							>
								<a
									href={project.href}
									className="tdc-card"
									draggable={false}
									tabIndex={isCopy ? -1 : undefined}
									aria-hidden={isCopy ? true : undefined}
									{...(project.external ? { target: '_blank', rel: 'noreferrer' } : {})}
									onMouseEnter={() => {
										show(project);
										hoverCard(i);
									}}
									onMouseLeave={() => {
										show(null);
										clearTimeout(hoverTimer.current);
									}}
									onFocus={() => show(project)}
									onBlur={() => show(null)}
									onClick={(event) => {
										if (dragged.current) event.preventDefault();
									}}
								>
									<img src={project.image} alt={project.alt} draggable={false} loading="lazy" />
									<span className="tdc-title">{project.title}</span>
								</a>
							</div>
						);
					})}
				</motion.div>
			</div>

			<div className={`tdc-pop${hovered && !dragged.current ? ' is-open' : ''}`} aria-hidden="true">
				{shown && (
					<div className="tdc-pop-body">
						<p className="tdc-pop-title">{shown.title}</p>
						{shown.blurb && <p className="tdc-pop-blurb">{shown.blurb}</p>}
						{shown.tags && shown.tags.length > 0 && (
							<ul className="tdc-pop-tags">
								{shown.tags.map((tag) => <li key={tag}>{tag}</li>)}
							</ul>
						)}
					</div>
				)}
			</div>

			<button type="button" className="tdc-arrow tdc-arrow-next" aria-label={labels.next} onClick={() => spin(-1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
			</button>
		</div>
	);
});

export function ThreeDPhotoCarousel({
	projects,
	labels = { prev: 'Previous project', next: 'Next project' },
}: {
	projects: CarouselProject[];
	labels?: Labels;
}) {
	return <Ring projects={projects} labels={labels} />;
}

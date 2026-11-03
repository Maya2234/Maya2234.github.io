import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import './3d-carousel.css';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string, defaultValue = false): boolean {
	const getMatches = () => (typeof window === 'undefined' ? defaultValue : window.matchMedia(query).matches);
	const [matches, setMatches] = useState<boolean>(getMatches);

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
};

// A ring of 4 cards looks like a box, so short lists repeat until the ring is full
const MIN_FACES = 8;

const Ring = memo(({ projects }: { projects: CarouselProject[] }) => {
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

	// Set while a drag is in progress so the release doesn't also count as a click on a card
	const dragged = useRef(false);

	// Where the ring is heading, so quick repeated clicks each add a full step
	const target = useRef(0);

	const spin = (direction: number) => {
		target.current = Math.round(target.current / step) * step + direction * step;
		animate(rotation, target.current, { type: 'spring', stiffness: 120, damping: 24, mass: 0.6 });
	};

	return (
		<div className="tdc">
			<button type="button" className="tdc-arrow tdc-arrow-prev" aria-label="Previous project" onClick={() => spin(1)}>
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

			<button type="button" className="tdc-arrow tdc-arrow-next" aria-label="Next project" onClick={() => spin(-1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
			</button>
		</div>
	);
});

export function ThreeDPhotoCarousel({ projects }: { projects: CarouselProject[] }) {
	return <Ring projects={projects} />;
}

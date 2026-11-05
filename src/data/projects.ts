import type { CarouselProject } from '../components/ui/3d-carousel';
import { localize, t, type Lang } from '../i18n';

const base = import.meta.env.BASE_URL;

// `course` is the id of the filter a project belongs to (see `getCourses` below): a class, personal work, or gig work
export type Project = CarouselProject & { blurb: string; tags: string[]; course?: string };

type Words = { alt: string; blurb: string; tags: string[] };

// Add a project here (and its screenshot in /public) to show it in the homepage carousel and on the projects panel.
// `page` is its page's path under /projects/; the words come in English, Spanish and Italian.
const list: { title: string; page: string; image: string; course?: string; en: Words; es: Words; it: Words }[] = [
	{
		title: 'My Fruit Worth',
		page: 'my-fruit-worth',
		image: 'myFruitWorth.png',
		course: 'cg',
		en: {
			alt: 'Title screen of My Fruit Worth, a garden fruit-picking game',
			blurb: 'A canvas game: pick all of the fruit growing in your garden before sundown.',
			tags: ['JavaScript', 'HTML Canvas', '3D graphics'],
		},
		es: {
			alt: 'Pantalla de inicio de My Fruit Worth, un juego de recoger fruta en el jardín',
			blurb: 'Un juego en canvas: recoge toda la fruta de tu jardín antes de que se ponga el sol.',
			tags: ['JavaScript', 'HTML Canvas', 'Gráficos 3D'],
		},
		it: {
			alt: 'Schermata iniziale di My Fruit Worth, un gioco in cui si raccoglie la frutta in giardino',
			blurb: 'Un gioco su canvas: raccogli tutta la frutta del tuo giardino prima del tramonto.',
			tags: ['JavaScript', 'HTML Canvas', 'Grafica 3D'],
		},
	},
	{
		title: 'myPoleMagazine',
		page: 'mypolemagazine',
		image: 'myPoleMagazine.png',
		course: 'personal',
		en: {
			alt: 'Log-in screen of myPoleMagazine, a pole dance progress tracker',
			blurb: 'A web app for pole dancers to log moves, track progress and browse inspo.',
			tags: ['JavaScript', 'Web app'],
		},
		es: {
			alt: 'Pantalla de acceso de myPoleMagazine, una app para seguir el progreso en pole dance',
			blurb: 'Una web app para quienes practican pole dance: registra figuras, sigue tu progreso y encuentra inspiración.',
			tags: ['JavaScript', 'Web app'],
		},
		it: {
			alt: 'Schermata di accesso di myPoleMagazine, un’app per seguire i progressi nella pole dance',
			blurb: 'Una web app per chi fa pole dance: registra le figure, segui i progressi e trova ispirazione.',
			tags: ['JavaScript', 'Web app'],
		},
	},
	{
		title: 'Cube World Aero',
		page: 'cube-world-aero',
		image: 'aeroCubeWorld.png',
		en: {
			alt: 'Cube World Aero, a WebGL cube landscape with a city and windmills',
			blurb: 'A cube landscape built from scratch in raw WebGL, no 3D library.',
			tags: ['WebGL', 'JavaScript', 'Shaders'],
		},
		es: {
			alt: 'Cube World Aero, un paisaje de cubos en WebGL con una ciudad y molinos de viento',
			blurb: 'Un paisaje de cubos hecho desde cero en WebGL puro, sin librerías 3D.',
			tags: ['WebGL', 'JavaScript', 'Shaders'],
		},
		it: {
			alt: 'Cube World Aero, un paesaggio di cubi in WebGL con una città e dei mulini a vento',
			blurb: 'Un paesaggio di cubi costruito da zero in WebGL puro, senza librerie 3D.',
			tags: ['WebGL', 'JavaScript', 'Shader'],
		},
	},
	{
		title: 'Anuva Cleaning',
		page: 'anuva-cleaning',
		image: 'anuvaCleaning.png',
		course: 'gig',
		en: {
			alt: 'Home page of Anuva, a Cincinnati commercial cleaning company',
			blurb: 'Client Site',
			tags: ['Website', 'Live site'],
		},
		es: {
			alt: 'Página de inicio de Anuva, una empresa de limpieza comercial de Cincinnati',
			blurb: 'Sitio para un cliente',
			tags: ['Sitio web', 'Sitio en línea'],
		},
		it: {
			alt: 'Home page di Anuva, un’impresa di pulizie commerciali di Cincinnati',
			blurb: 'Sito per un cliente',
			tags: ['Sito web', 'Sito online'],
		},
	},
];

export function getProjects(lang: Lang): Project[] {
	return list.map((p) => ({
		title: p.title,
		href: localize(lang, `projects/${p.page}`),
		image: `${base}${p.image}`,
		course: p.course,
		...p[lang],
	}));
}

// the filter buttons on the projects panel, in order (code is optional: shown small after the title)
export function getCourses(lang: Lang): { id: string; title: string; code?: string }[] {
	const w = t(lang);
	return [
		{ id: 'cg', title: 'CG', code: '5160' },
		{ id: 'ui', title: 'UI', code: '5167' },
		{ id: 'personal', title: w('course.personal') },
		{ id: 'gig', title: w('course.gig') },
	];
}

// English, for anything that doesn't know its language
export const projects = getProjects('en');
export const courses = getCourses('en');

import type { CarouselProject } from '../components/ui/3d-carousel';

const base = import.meta.env.BASE_URL;

// `course` is the id of the class a project was made for (see `courses` below); leave it off for personal work
export type Project = CarouselProject & { blurb: string; tags: string[]; course?: string };

// Add a project here (and its screenshot in /public) to show it in the homepage carousel and on /projects
export const projects: Project[] = [
	{
		title: 'My Fruit Worth',
		href: `${base}myFruitWorth`,
		image: `${base}myFruitWorth.png`,
		alt: 'Title screen of My Fruit Worth, a garden fruit-picking game',
		blurb: 'A canvas game: pick all of the fruit growing in your garden before sundown.',
		tags: ['JavaScript', 'HTML Canvas', '3D graphics'],
		course: 'cg',
	},
	{
		title: 'myPoleMagazine',
		href: `${base}myPoleMagazine`,
		image: `${base}myPoleMagazine.png`,
		alt: 'Log-in screen of myPoleMagazine, a pole dance progress tracker',
		blurb: 'A web app for pole dancers to log moves, track progress and browse inspo.',
		tags: ['JavaScript', 'Web app'],
	},
	{
		title: 'Cube World Aero',
		href: `${base}aeroCubeWorld`,
		image: `${base}aeroCubeWorld.png`,
		alt: 'Cube World Aero, a WebGL cube landscape with a city and windmills',
		blurb: 'A cube landscape built from scratch in raw WebGL, no 3D library.',
		tags: ['WebGL', 'JavaScript', 'Shaders'],
	},
	{
		title: 'Anuva Cleaning',
		href: `${base}anuvaCleaning`,
		image: `${base}anuvaCleaning.png`,
		alt: 'Home page of Anuva, a Cincinnati commercial cleaning company',
		blurb: 'Website for a Cincinnati commercial cleaning and facility services company.',
		tags: ['Website', 'Live site'],
	},
];

export const courses = [
	{ id: 'cg', title: 'CG', code: '5160' },
	{ id: 'ui', title: 'UI', code: '5167' },
];

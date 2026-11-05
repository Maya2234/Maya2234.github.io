// English, Spanish and Italian. English lives at the site root, the others under /es/ and /it/ (same pages, same components).
// Every bit of text on the site is in the `ui` word lists below; components look words up with t(lang)('key').
// To add a language: add it to `languages`, copy the `en` list and translate it, and add pages under src/pages/<code>/.

export const languages = { en: 'EN', es: 'ES', it: 'IT' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

const base = import.meta.env.BASE_URL; // always ends in "/"

/** which language a page is in, from its address */
export function getLang(url: URL): Lang {
	const rest = url.pathname.slice(base.length);
	const first = rest.split('/')[0];
	return first in languages && first !== defaultLang ? (first as Lang) : defaultLang;
}

/** a site path in a language: localize('it', 'projects/x') -> "/it/projects/x" */
export function localize(lang: Lang, path = '') {
	const clean = path.replace(/^\//, '');
	return lang === defaultLang ? `${base}${clean}` : `${base}${lang}/${clean}`;
}

/** the same page in another language */
export function switchLang(url: URL, to: Lang) {
	const from = getLang(url);
	let rest = url.pathname.slice(base.length);
	if (from !== defaultLang) rest = rest.slice(from.length + 1);
	return localize(to, rest);
}

export const ui = {
	en: {
		'site.title': 'Maya Tomarchio | Developer',
		'nav.home': 'Maya Tomarchio, home',
		'nav.language': 'Language',

		'home.headshot': 'Maya Tomarchio: go to the guest book',
		'home.tagline': 'Software Designer + Developer',
		'home.location': 'Cincinnati, Ohio.',
		'home.projects': 'Projects',
		'home.allProjects': 'All projects',
		'home.experience': 'Experience',

		'stack.aria': 'Tech stack',
		'stack.programming': 'Programming',
		'stack.frameworks': 'Frameworks & libraries',
		'stack.tooling': 'Data & tooling',

		'langs.title': 'Languages',
		'langs.english': 'English',
		'langs.spanish': 'Spanish',
		'langs.italian': 'Italian',

		'carousel.prev': 'Previous project',
		'carousel.next': 'Next project',

		'gallery.aria': 'All projects',
		'gallery.home': 'Home',
		'gallery.title': 'Projects',
		'gallery.filters': 'Filter projects',
		'gallery.all': 'All',
		'gallery.newTab': ' (opens in a new tab)',
		'course.personal': 'Personal',
		'course.gig': 'Gig work',

		'project.back': 'All projects',
		'project.builtWith': 'Built with',
		'project.about': 'About',
		'project.details': 'Project details',
		'project.open': 'Open',
		'project.newTab': '(new tab)',

		'footer.line': 'I want to realize your',
		'footer.vision': 'vision',
		'footer.resume': 'Resume',
		'footer.wall': 'Sign the message wall',

		'book.aria': 'Guest book',
		'book.title': 'Guest book',
		'book.open': 'Open the guest book and sign the message wall',
		'book.show': 'Show the guest book',
		'book.back': 'Back to the page',

		'canvas.zoom': 'Zoom',
		'canvas.zoomOut': 'Zoom out',
		'canvas.reset': 'Back to normal size',
		'canvas.zoomIn': 'Zoom in',
		'canvas.all': 'See everything',
		'canvas.home': 'Home',
		'canvas.projects': 'Projects',
		'canvas.field': 'Project pages',

		'wall.title': 'Message wall',
		'wall.back': 'Back to the guest book',
		'wall.backText': 'Back',
		'wall.paper': 'Message wall: click anywhere on the paper to write a note',
		'wall.mine': 'You wrote this. Click to edit.',
		'wall.edit': 'Edit your note',
		'wall.write': 'Write a note',
		'wall.locked': 'That note can’t be edited any more.',
		'wall.saved': 'Saved.',
		'wall.removed': 'Note removed.',
		'wall.wait': 'One sec, then press Enter again to save.',
		'wall.savedEdit': 'Saved. You can edit it until you close this tab.',
		'wall.failed': 'That didn’t save. Please try again in a moment.',
		'wall.loadFailed': 'The wall couldn’t load right now. Please try again later.',
	},
	it: {
		'site.title': 'Maya Tomarchio | Sviluppatrice',
		'nav.home': 'Maya Tomarchio, pagina iniziale',
		'nav.language': 'Lingua',

		'home.headshot': 'Maya Tomarchio: vai al libro degli ospiti',
		'home.tagline': 'Designer + Sviluppatrice Software',
		'home.location': 'Cincinnati, Ohio.',
		'home.projects': 'Progetti',
		'home.allProjects': 'Tutti i progetti',
		'home.experience': 'Esperienza',

		'stack.aria': 'Competenze tecniche',
		'stack.programming': 'Programmazione',
		'stack.frameworks': 'Framework e librerie',
		'stack.tooling': 'Dati e strumenti',

		'langs.title': 'Lingue',
		'langs.english': 'Inglese',
		'langs.spanish': 'Spagnolo',
		'langs.italian': 'Italiano',

		'carousel.prev': 'Progetto precedente',
		'carousel.next': 'Progetto successivo',

		'gallery.aria': 'Tutti i progetti',
		'gallery.home': 'Home',
		'gallery.title': 'Progetti',
		'gallery.filters': 'Filtra i progetti',
		'gallery.all': 'Tutti',
		'gallery.newTab': ' (si apre in una nuova scheda)',
		'course.personal': 'Personali',
		'course.gig': 'Freelance',

		'project.back': 'Tutti i progetti',
		'project.builtWith': 'Realizzato con',
		'project.about': 'Informazioni su',
		'project.details': 'Dettagli del progetto',
		'project.open': 'Apri',
		'project.newTab': '(nuova scheda)',

		'footer.line': 'Voglio realizzare la tua',
		'footer.vision': 'visione',
		'footer.resume': 'Curriculum',
		'footer.wall': 'Firma la bacheca',

		'book.aria': 'Libro degli ospiti',
		'book.title': 'Libro degli ospiti',
		'book.open': 'Apri il libro degli ospiti e firma la bacheca',
		'book.show': 'Mostra il libro degli ospiti',
		'book.back': 'Torna alla pagina',

		'canvas.zoom': 'Zoom',
		'canvas.zoomOut': 'Riduci',
		'canvas.reset': 'Torna alla dimensione normale',
		'canvas.zoomIn': 'Ingrandisci',
		'canvas.all': 'Vedi tutto',
		'canvas.home': 'Home',
		'canvas.projects': 'Progetti',
		'canvas.field': 'Pagine dei progetti',

		'wall.title': 'Bacheca',
		'wall.back': 'Torna al libro degli ospiti',
		'wall.backText': 'Indietro',
		'wall.paper': 'Bacheca: clicca in un punto qualsiasi del foglio per scrivere un messaggio',
		'wall.mine': 'L’hai scritto tu. Clicca per modificarlo.',
		'wall.edit': 'Modifica il tuo messaggio',
		'wall.write': 'Scrivi un messaggio',
		'wall.locked': 'Questo messaggio non si può più modificare.',
		'wall.saved': 'Salvato.',
		'wall.removed': 'Messaggio eliminato.',
		'wall.wait': 'Un attimo, poi premi di nuovo Invio per salvare.',
		'wall.savedEdit': 'Salvato. Puoi modificarlo finché non chiudi questa scheda.',
		'wall.failed': 'Non è stato salvato. Riprova tra un momento.',
		'wall.loadFailed': 'Al momento la bacheca non si carica. Riprova più tardi.',
	},
	es: {
		'site.title': 'Maya Tomarchio | Desarrolladora',
		'nav.home': 'Maya Tomarchio, página de inicio',
		'nav.language': 'Idioma',

		'home.headshot': 'Maya Tomarchio: ir al libro de visitas',
		'home.tagline': 'Diseñadora + Desarrolladora de Software',
		'home.location': 'Cincinnati, Ohio.',
		'home.projects': 'Proyectos',
		'home.allProjects': 'Todos los proyectos',
		'home.experience': 'Experiencia',

		'stack.aria': 'Habilidades técnicas',
		'stack.programming': 'Programación',
		'stack.frameworks': 'Frameworks y librerías',
		'stack.tooling': 'Datos y herramientas',

		'langs.title': 'Idiomas',
		'langs.english': 'Inglés',
		'langs.spanish': 'Español',
		'langs.italian': 'Italiano',

		'carousel.prev': 'Proyecto anterior',
		'carousel.next': 'Proyecto siguiente',

		'gallery.aria': 'Todos los proyectos',
		'gallery.home': 'Inicio',
		'gallery.title': 'Proyectos',
		'gallery.filters': 'Filtrar proyectos',
		'gallery.all': 'Todos',
		'gallery.newTab': ' (se abre en una pestaña nueva)',
		'course.personal': 'Personales',
		'course.gig': 'Freelance',

		'project.back': 'Todos los proyectos',
		'project.builtWith': 'Hecho con',
		'project.about': 'Sobre',
		'project.details': 'Detalles del proyecto',
		'project.open': 'Abrir',
		'project.newTab': '(pestaña nueva)',

		'footer.line': 'Quiero hacer realidad tu',
		'footer.vision': 'visión',
		'footer.resume': 'Currículum',
		'footer.wall': 'Firma el muro de mensajes',

		'book.aria': 'Libro de visitas',
		'book.title': 'Libro de visitas',
		'book.open': 'Abre el libro de visitas y firma el muro de mensajes',
		'book.show': 'Mostrar el libro de visitas',
		'book.back': 'Volver a la página',

		'canvas.zoom': 'Zoom',
		'canvas.zoomOut': 'Alejar',
		'canvas.reset': 'Volver al tamaño normal',
		'canvas.zoomIn': 'Acercar',
		'canvas.all': 'Ver todo',
		'canvas.home': 'Inicio',
		'canvas.projects': 'Proyectos',
		'canvas.field': 'Páginas de proyectos',

		'wall.title': 'Muro de mensajes',
		'wall.back': 'Volver al libro de visitas',
		'wall.backText': 'Volver',
		'wall.paper': 'Muro de mensajes: haz clic en cualquier parte de la hoja para escribir un mensaje',
		'wall.mine': 'Lo escribiste tú. Haz clic para editarlo.',
		'wall.edit': 'Edita tu mensaje',
		'wall.write': 'Escribe un mensaje',
		'wall.locked': 'Ese mensaje ya no se puede editar.',
		'wall.saved': 'Guardado.',
		'wall.removed': 'Mensaje eliminado.',
		'wall.wait': 'Un momento, luego pulsa Intro otra vez para guardar.',
		'wall.savedEdit': 'Guardado. Puedes editarlo hasta que cierres esta pestaña.',
		'wall.failed': 'No se guardó. Inténtalo de nuevo en un momento.',
		'wall.loadFailed': 'El muro no se puede cargar ahora. Inténtalo más tarde.',
	},
} as const;

export type Key = keyof (typeof ui)['en'];

/** look words up in a language, falling back to English */
export function t(lang: Lang) {
	return (key: Key): string => (ui[lang] as Record<string, string>)[key] ?? ui.en[key];
}

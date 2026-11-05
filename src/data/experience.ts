import type { Lang } from '../i18n';

type Job = { role: string; org: string; about: string; place: string; when: string; points: string[] };

// Work experience on the homepage, newest first, in English, Spanish and Italian.
const jobs: Record<Lang, Job[]> = {
	en: [
		{
			role: 'Software Development Intern',
			org: 'Siemens',
			about: 'Global technology company; I work on NX, its CAD/CAM software used by engineers worldwide.',
			place: 'Milford, Ohio',
			when: 'Jan 2025 – Present',
			points: [
				'Resolved 50+ customer-reported and internal issues in Siemens NX CAD, boosting stability and cutting the defect backlog by 10%.',
				'Designed and shipped 3 new internal launch methods for NX, reducing Teamcenter integration setup time by 15% for 100+ engineers.',
			],
		},
		{
			role: 'Research Co-Op',
			org: 'Feng Chia University',
			about: 'Research university; summer co-op in computer networking.',
			place: 'Taichung, Taiwan',
			when: 'May – Aug 2024',
			points: [
				'Configured network devices and protocols in Cisco Packet Tracer.',
				'Analysed, troubleshot and fixed protocol connectivity problems.',
			],
		},
		{
			role: 'Software Development Intern',
			org: 'Wolters Kluwer',
			about: 'Global provider of professional information, software and services.',
			place: 'Madison, Wisconsin',
			when: 'Jan – May 2024',
			points: [
				'Took part in daily stand-ups, sprint planning, reviews and retrospectives to keep sprints on track.',
				'Updated NuGet packages and project code to move the team application to a newer .NET framework.',
			],
		},
	],
	es: [
		{
			role: 'Becaria de desarrollo de software',
			org: 'Siemens',
			about: 'Empresa tecnológica global; trabajo en NX, su software CAD/CAM que usan ingenieros de todo el mundo.',
			place: 'Milford, Ohio',
			when: 'Ene 2025 – actualidad',
			points: [
				'Resolví más de 50 incidencias, reportadas por clientes e internas, en Siemens NX CAD, mejorando su estabilidad y reduciendo un 10 % los defectos pendientes.',
				'Diseñé y lancé 3 nuevos métodos internos de arranque para NX, reduciendo un 15 % el tiempo de configuración de la integración con Teamcenter para más de 100 ingenieros.',
			],
		},
		{
			role: 'Co-op de investigación',
			org: 'Feng Chia University',
			about: 'Universidad de investigación; co-op de verano en redes informáticas.',
			place: 'Taichung, Taiwán',
			when: 'May – Ago 2024',
			points: [
				'Configuré dispositivos y protocolos de red en Cisco Packet Tracer.',
				'Analicé, diagnostiqué y resolví problemas de conectividad de protocolos.',
			],
		},
		{
			role: 'Becaria de desarrollo de software',
			org: 'Wolters Kluwer',
			about: 'Proveedor global de información, software y servicios profesionales.',
			place: 'Madison, Wisconsin',
			when: 'Ene – May 2024',
			points: [
				'Participé en stand-ups diarios, planificación de sprints, revisiones y retrospectivas para mantener los sprints en marcha.',
				'Actualicé los paquetes NuGet y el código del proyecto para migrar la aplicación del equipo a una versión más reciente de .NET.',
			],
		},
	],
	it: [
		{
			role: 'Stagista in sviluppo software',
			org: 'Siemens',
			about: 'Azienda tecnologica globale; lavoro su NX, il suo software CAD/CAM usato da ingegneri in tutto il mondo.',
			place: 'Milford, Ohio',
			when: 'Gen 2025 – oggi',
			points: [
				'Ho risolto oltre 50 problemi, segnalati dai clienti e interni, in Siemens NX CAD, migliorandone la stabilità e riducendo del 10% l’arretrato dei difetti.',
				'Ho progettato e rilasciato 3 nuovi metodi di avvio interni per NX, riducendo del 15% i tempi di configurazione dell’integrazione con Teamcenter per oltre 100 ingegneri.',
			],
		},
		{
			role: 'Co-op di ricerca',
			org: 'Feng Chia University',
			about: 'Università di ricerca; co-op estivo sulle reti informatiche.',
			place: 'Taichung, Taiwan',
			when: 'Mag – Ago 2024',
			points: [
				'Ho configurato dispositivi e protocolli di rete in Cisco Packet Tracer.',
				'Ho analizzato, diagnosticato e risolto problemi di connettività dei protocolli.',
			],
		},
		{
			role: 'Stagista in sviluppo software',
			org: 'Wolters Kluwer',
			about: 'Fornitore globale di informazioni, software e servizi professionali.',
			place: 'Madison, Wisconsin',
			when: 'Gen – Mag 2024',
			points: [
				'Ho partecipato a stand-up quotidiani, sprint planning, review e retrospettive per mantenere gli sprint in linea con gli obiettivi.',
				'Ho aggiornato i pacchetti NuGet e il codice del progetto per portare l’applicazione del team a una versione più recente del framework .NET.',
			],
		},
	],
};

export const getExperience = (lang: Lang) => jobs[lang];

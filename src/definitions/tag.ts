export const SAGARSTUGAN = 'sagarstugan';
export const GASUQUE = 'gasque';
export const BEER = 'beer';
export const WINE = 'wine';
export const SNAPS = 'snaps';
export const PUNSCH = 'punsch';
export const FOREIGN = 'foreign';
export const NERDY = 'nerdy';
export const ESOTERIC = 'esoteric';
export const SOLEMN = 'solemn';

export const SWE = 'swe';
export const ENG = 'eng';

export const TAGS = <const>[
	SAGARSTUGAN,
	GASUQUE,
	BEER,
	WINE,
	SNAPS,
	PUNSCH,
	FOREIGN,
	NERDY,
	ESOTERIC,
	SOLEMN,
	SWE,
	ENG,
];

export type Tag = (typeof TAGS)[number];

export const TAG_NAMES = {
	[SAGARSTUGAN]: 'Sågarstugan',
	[GASUQUE]: 'Gasque',
	[BEER]: 'Beer',
	[WINE]: 'Wine',
	[SNAPS]: 'Nubbe',
	[PUNSCH]: 'Punsch',
	[FOREIGN]: 'Foreign',
	[NERDY]: 'Nerdy',
	[ESOTERIC]: 'Esoteric',
	[SOLEMN]: 'Solemn',
	[SWE]: 'Swedish',
	[ENG]: 'English',
};

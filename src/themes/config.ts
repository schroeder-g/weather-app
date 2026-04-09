import chroma from 'chroma-js';
import { generatePalette } from './generator';

export const staticColors = {
	black: 'hsl(0, 0%, 0%)',
	white: 'hsl(0, 0%, 100%)',
	slate: 'hsl(210, 40%, 96%)',
} as const;

// Equidistant trigonometric hues on the LCH color wheel
const L = 65;
const C = 75;

export const chromaticColors = {
	zinc: 'hsl(240, 5%, 65%)',
	red: chroma.lch(L, C, 20).css('hsl'),
	orange: chroma.lch(L, C, 50).css('hsl'),
	yellow: chroma.lch(L, C, 90).css('hsl'),
	green: chroma.lch(L, C, 140).css('hsl'),
	cyan: chroma.lch(L, C, 200).css('hsl'),
	blue: chroma.lch(L, C, 260).css('hsl'),
	magenta: chroma.lch(L, C, 320).css('hsl')
} as const;

export const palette = generatePalette(chromaticColors);

export const baseColors = {
	...staticColors,
	...chromaticColors,
} as const;

export type BaseColorName = keyof typeof baseColors;

export enum Themes {
	LIGHT = 'light'
}

export const themes = {
	[Themes.LIGHT]: {
		'--primary': 'var(--blue-600)',
		'--primary-foreground': 'var(--white)',
		'--secondary': 'var(--zinc-100)',
		'--secondary-foreground': 'var(--zinc-900)',
		'--foreground': 'var(--zinc-900)',
		'--background': 'var(--white)',
		'--background-start': 'var(--slate)',
		'--background-end': 'var(--white)',
	}
} as const;

export const commonVars = {
	'--radius': '0.5rem',
	'--border': '1px solid color-mix(in srgb, var(--zinc-300), transparent 20%)',
	'--input': '1px solid var(--zinc-300)',
	'--ring': '0 0 0 3px color-mix(in srgb, var(--blue-500), transparent 70%)',
	'--destructive': 'var(--red-600)',
	'--destructive-foreground': 'var(--white)',
	'--success': 'var(--green-600)',
	'--success-foreground': 'var(--white)',
	'--warning': 'var(--yellow-500)',
	'--warning-foreground': 'var(--zinc-900)',
	'--info': 'var(--cyan-600)',
	'--info-foreground': 'var(--white)',
	'--muted': 'var(--zinc-100)',
	'--muted-foreground': 'var(--zinc-500)',
	'--accent': 'var(--zinc-50)',
	'--accent-foreground': 'var(--zinc-900)',
	'--popover': 'var(--white)',
	'--popover-foreground': 'var(--zinc-900)',
	'--card': 'var(--white)',
	'--card-foreground': 'var(--zinc-900)',
};

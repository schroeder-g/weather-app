import colors from 'tailwindcss/colors';

export const staticColors = {
	black: '#000000',
	white: '#ffffff',
	slate: '#f1f5f9',
} as const;

export const chromaticColors = {
	zinc: colors.zinc[500],
	red: colors.rose[500],
	orange: colors.orange[500],
	yellow: colors.yellow[500],
	green: colors.green[500],
	cyan: colors.cyan[500],
	blue: colors.blue[500],
	magenta: colors.fuchsia[500],
} as const;

export const palette = {
	zinc: colors.zinc,
	red: colors.rose,
	orange: colors.orange,
	yellow: colors.yellow,
	green: colors.green,
	cyan: colors.cyan,
	blue: colors.blue,
	magenta: colors.fuchsia,
} as Record<string, Record<string | number, string>>;

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
	'--border': 'var(--zinc-100)',
	'--input': 'var(--zinc-200)',
	'--ring': 'var(--blue-500)',
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

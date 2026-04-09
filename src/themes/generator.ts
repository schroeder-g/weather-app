import chroma from 'chroma-js';

export function generateColorScale(hexOrHsl: string) {
	const base = chroma(hexOrHsl);
	const light = base.set('hsl.l', 0.98); // Closest to white
	const dark = base.set('hsl.l', 0.05); // Closest to black

	const scale = chroma
		.scale([light, base, dark])
		.domain([0, 0.5, 1])
		.mode('lch');

	const entries: Record<number, string> = {};
	const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

	steps.forEach((step) => {
		const t = step / 1000;
		entries[step] = scale(t).css('hsl');
	});

	return entries;
}

export function generatePalette(colors: Record<string, string>) {
	const palette: Record<string, Record<number, string>> = {};
	for (const [name, value] of Object.entries(colors)) {
		palette[name] = generateColorScale(value);
	}
	return palette;
}

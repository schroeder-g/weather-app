import plugin from "tailwindcss/plugin";
import {
	chromaticColors,
	commonVars,
	palette,
	staticColors,
	themes,
} from "./config";

const themesPlugin = plugin(
	({ addBase }) => {
		const rootVars: Record<string, string> = { ...commonVars };

		Object.entries(staticColors).forEach(([name, value]) => {
			rootVars[`--${name}`] = value;
		});

		Object.entries(palette).forEach(([colorName, scale]) => {
			Object.entries(scale).forEach(([shade, value]) => {
				rootVars[`--${colorName}-${shade}`] = value;
			});
			if (scale[500]) {
				rootVars[`--${colorName}`] = scale[500];
			}
		});

		const addThemeVars = (
			themeConfig: Record<string, string>,
			target: Record<string, string>,
		) => {
			Object.entries(themeConfig).forEach(([key, value]) => {
				target[key] = value;
			});
		};

		// Light mode only applied directly to :root
		addThemeVars(themes.light, rootVars);

		addBase({
			":root": rootVars,
		});
	},
	{
		theme: {
			extend: {
				colors: {
					primary: {
						DEFAULT: "var(--primary)",
						foreground: "var(--primary-foreground)",
					},
					secondary: {
						DEFAULT: "var(--secondary)",
						foreground: "var(--secondary-foreground)",
					},
					foreground: "var(--foreground)",
					background: "var(--background)",
					destructive: {
						DEFAULT: "var(--destructive)",
						foreground: "var(--destructive-foreground)",
					},
					success: {
						DEFAULT: "var(--success)",
						foreground: "var(--success-foreground)",
					},
					warning: {
						DEFAULT: "var(--warning)",
						foreground: "var(--warning-foreground)",
					},
					info: {
						DEFAULT: "var(--info)",
						foreground: "var(--info-foreground)",
					},
					muted: {
						DEFAULT: "var(--muted)",
						foreground: "var(--muted-foreground)",
					},
					accent: {
						DEFAULT: "var(--accent)",
						foreground: "var(--accent-foreground)",
					},
					popover: {
						DEFAULT: "var(--popover)",
						foreground: "var(--popover-foreground)",
					},
					card: {
						DEFAULT: "var(--card)",
						foreground: "var(--card-foreground)",
					},
					border: "var(--border)",
					input: "var(--input)",
					ring: "var(--ring)",
					...(() => {
						const colors: Record<string, any> = {};
						Object.keys(staticColors).forEach((name) => {
							colors[name] = `var(--${name})`;
						});
						Object.keys(chromaticColors).forEach((name) => {
							colors[name] = {
								DEFAULT: `var(--${name})`,
							};
							[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].forEach(
								(shade) => {
									colors[name][shade] = `var(--${name}-${shade})`;
								},
							);
						});
						return colors;
					})(),
				},
			},
		},
	},
);

module.exports = themesPlugin;

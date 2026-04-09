const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {},
			fontFamily: {
				sans: ["Inter_400Regular"],
				display: ["Outfit_700Bold"],
			},
			borderWidth: {
				hairline: hairlineWidth(),
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("./src/themes/plugin.ts")],
};

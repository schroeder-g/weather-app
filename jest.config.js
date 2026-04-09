const expoPreset = require("jest-expo/jest-preset");

module.exports = {
	...expoPreset,
	moduleNameMapper: {
		...expoPreset.moduleNameMapper,
		"^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
		"^rn-primitives/(.*)$":
			"<rootDir>/node_modules/@rn-primitives/$1/dist/index.js",
		"^@rn-primitives/(.*)$":
			"<rootDir>/node_modules/@rn-primitives/$1/dist/index.js",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		...expoPreset.transform,
		"\\.mjs$": "babel-jest",
	},

	transformIgnorePatterns: [
		`node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|rettime|lucide-react-native|msw|@ax-llm/ax|@rn-primitives/.*|nativewind|react-redux|d3|d3-.*|internmap|delaunator|robust-predicates|immer|redux|until-async|outvariant|is-node-process|@open-draft|strict-event-emitter|headers-polyfill|@mswjs/.*))`,
	],
	setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};

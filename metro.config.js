const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
	...config.resolver.extraNodeModules,
	crypto: path.resolve(__dirname, 'src/mocks/crypto-mock.js'),
	'node:crypto': path.resolve(__dirname, 'src/mocks/crypto-mock.js'),
	'node:worker_threads': path.resolve(__dirname, 'src/mocks/empty-mock.js'),
	'node:os': path.resolve(__dirname, 'src/mocks/empty-mock.js'),
	'worker_threads': path.resolve(__dirname, 'src/mocks/empty-mock.js'),
	'os': path.resolve(__dirname, 'src/mocks/empty-mock.js'),
};

module.exports = withNativeWind(config, {
	input: "./src/global.css",
	inlineRem: 16,
});

// A lightweight polyfill to satisfy `@ax-llm/ax`'s reliance on the Web Crypto API
// for `randomUUID` when running natively in React Native Hermes engine.
if (typeof global.crypto === 'undefined') {
	// @ts-ignore
	global.crypto = {};
}

if (!global.crypto.randomUUID) {
	global.crypto.randomUUID = () => {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	};
}

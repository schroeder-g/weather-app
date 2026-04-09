import 'react-native-url-polyfill/auto';
import 'url-search-params-polyfill';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { EventTarget, Event } from 'event-target-shim';
import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill';

// @ts-ignore
if (typeof global.TextEncoder === 'undefined') {
	// @ts-ignore
	global.TextEncoder = TextEncoder;
	// @ts-ignore
	global.TextDecoder = TextDecoder;
}

if (typeof global.MessageEvent === 'undefined') {
	// @ts-ignore
	global.MessageEvent = class MessageEvent {
		type: string;
		data: any;
		constructor(type: string, eventInitDict?: any) {
			this.type = type;
			this.data = eventInitDict?.data;
		}
	};
}

if (typeof global.EventTarget === 'undefined') {
	// @ts-ignore
	global.EventTarget = EventTarget;
	// @ts-ignore
	global.Event = Event;
}

if (typeof global.ReadableStream === 'undefined') {
	// @ts-ignore
	global.ReadableStream = ReadableStream;
	// @ts-ignore
	global.WritableStream = WritableStream;
	// @ts-ignore
	global.TransformStream = TransformStream;
}

if (typeof global.BroadcastChannel === 'undefined') {
	// @ts-ignore
	global.BroadcastChannel = class BroadcastChannel {
		name: string;
		constructor(name: string) { this.name = name; }
		postMessage() {}
		close() {}
		addEventListener() {}
		removeEventListener() {}
		dispatchEvent() { return true; }
	};
}

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

import { delay, HttpResponse, http } from "msw";

export const handlers = [
	http.post("https://api.whether.io/auth/login", async ({ request }) => {
		await delay(1000);

		return HttpResponse.json({
			user: {
				id: "usr_1",
				name: "Jane Doe",
				email: "jane@whether.io",
			},
			token: "fake-jwt-token-123",
		});
	}),

	http.post("https://api.whether.io/auth/logout", async () => {
		await delay(500);
		return HttpResponse.json({ success: true });
	}),
];

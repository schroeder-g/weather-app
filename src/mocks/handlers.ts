import { delay, HttpResponse, http } from "msw";
import { getBaseApiUrl } from "@/lib/apiUtils";

const MOCK_USER = {
	id: "usr_1",
	name: "Jane Doe",
	email: "jane@whether.io",
};

export const handlers = [
	http.post(getBaseApiUrl() + "/auth/login", async ({ request }) => {
		await delay(1000);

		return HttpResponse.json(
			{
				user: MOCK_USER,
				token: "fake-jwt-token-123",
			},
			{
				headers: {
					"Set-Cookie": "auth_token=fake-jwt-token-123; HttpOnly; Path=/; SameSite=Lax",
				},
			}
		);
	}),

	http.get(getBaseApiUrl() + "/auth/me", async ({ request, cookies }) => {
		await delay(500);
		const cookieToken = cookies.auth_token;
		const authHeader = request.headers.get("Authorization");
		
		if (cookieToken === "fake-jwt-token-123" || authHeader === "Bearer fake-jwt-token-123") {
			return HttpResponse.json({ user: MOCK_USER });
		}
		
		return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
	}),

	http.post(getBaseApiUrl() + "/auth/logout", async () => {
		await delay(500);
		return HttpResponse.json(
			{ success: true },
			{
				headers: {
					"Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0",
				},
			}
		);
	}),
];

const originalFetch = global.fetch;

export const nativeServer = {
	listen: () => {
		// @ts-expect-error
		global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
			const url =
				typeof input === "string"
					? input
					: input instanceof URL
						? input.toString()
						: input.url;

			if (url.includes("/auth/login")) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						try {
							const body = init?.body ? JSON.parse(init.body as string) : {};
							if (body.password === "bad-password") {
								resolve(
									new Response(
										JSON.stringify({ message: "Invalid credentials" }),
										{
											status: 401,
											headers: { "Content-Type": "application/json" },
										},
									),
								);
							} else {
								resolve(
									new Response(
										JSON.stringify({
											user: {
												id: "usr_1",
												name: "Jane Doe",
												email: body.email || "demo@whether.io",
											},
											token: "fake-jwt-token-123",
										}),
										{
											status: 200,
											headers: { "Content-Type": "application/json" },
										},
									),
								);
							}
						} catch (err) {
							reject(err);
						}
					}, 1000);
				});
			}

			if (url.includes("/auth/logout")) {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(
							new Response(JSON.stringify({ success: true }), {
								status: 200,
								headers: { "Content-Type": "application/json" },
							}),
						);
					}, 500);
				});
			}

			// Pass all other requests to default engine
			return originalFetch(input, init);
		};
	},
};

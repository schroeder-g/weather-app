const MOCK_USER = {
	id: "usr_1",
	name: "Jane Doe",
	email: "jane@whether.io",
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (body?.password === "bad-password") {
            return Response.json({ message: "Invalid credentials" }, { status: 401 });
        }

        return Response.json(
            {
                user: { ...MOCK_USER, email: body?.email || MOCK_USER.email },
                token: "fake-jwt-token-123",
            },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "auth_token=fake-jwt-token-123; HttpOnly; Path=/; SameSite=Lax",
                },
            }
        );
    } catch (error) {
        return Response.json({ message: "Bad Request" }, { status: 400 });
    }
}

const MOCK_USER = {
	id: "usr_1",
	name: "Jane Doe",
	email: "jane@whether.io",
};

export async function GET(request: Request) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = Object.fromEntries(
        // Quick extraction mapping "auth_token=XYZ" to { auth_token: "XYZ" }
        cookieHeader.split(";").map(v => v.trim()).filter(Boolean).map(v => {
            const split = v.split("=");
            return [split[0], split.slice(1).join("=")];
        })
    );
    
    const cookieToken = cookies["auth_token"];
    const authHeader = request.headers.get("Authorization");
    
    const validTokens = ["Bearer fake-jwt-token-123", "Bearer persisted-token", "Bearer valid-token"];
    const hasValidSession = cookieToken === "fake-jwt-token-123" || (authHeader && validTokens.includes(authHeader));

    if (hasValidSession) {
        return Response.json({ user: MOCK_USER });
    }
    
    return Response.json({ message: "Unauthorized" }, { status: 401 });
}

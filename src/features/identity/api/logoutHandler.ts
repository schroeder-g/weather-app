export async function POST(request: Request) {
    return Response.json(
        { success: true },
        {
            status: 200,
            headers: {
                "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0",
            },
        }
    );
}

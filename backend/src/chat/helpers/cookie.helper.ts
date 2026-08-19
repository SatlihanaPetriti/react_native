export function getTokenFromCookie(
    cookieHeader: string,
): string | undefined {
    const cookies = cookieHeader.split(';');

    const jwtCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('jwt='),
    );

    return jwtCookie?.trim().split('=')[1];
}
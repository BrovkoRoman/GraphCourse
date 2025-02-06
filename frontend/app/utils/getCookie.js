export function getCookieValue(cookieName) {
    return document.cookie
             .split("; ")
             .find((row) => row.startsWith(cookieName + "="))
             ?.split("=")[1];
}
function getCookie(name: string): string | undefined {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  if (cookieValue) {
    return decodeURIComponent(cookieValue);
  }
}

export default getCookie;

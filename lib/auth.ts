export function checkToken(router: any): string | false {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    router.push("/login");
    sessionStorage.setItem("loginMessage", "Your login session has expired. Please log in again.");
    return false;
  }
  return token;
}

export function useAuthExpiry(router: any) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_gender");
    localStorage.removeItem("user_number");
    localStorage.removeItem("user_whatsapp");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    sessionStorage.setItem("loginMessage", "Your login session has expired. Please log in again.");
    router.push("/login");
  }
}

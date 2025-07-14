import { useEffect } from "react";

export function useAuthExpiry() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const expiry = localStorage.getItem("login_expiry");
      if (expiry && Date.now() > Number(expiry)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_gender");
        localStorage.removeItem("user_number");
        localStorage.removeItem("user_whatsapp");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user");
        localStorage.removeItem("login_expiry");
      }
    }
  }, []);
}

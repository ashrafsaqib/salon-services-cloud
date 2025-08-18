"use client";

import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Material Icons for eye/eye-off
import { useRouter } from "next/navigation";
import { useAuthExpiry } from "@/hooks/use-auth-expiry";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      if (res.status === 401 || res.status === 403) {
        useAuthExpiry(router);
        setLoading(false);
        return;
      }
      let data;
      try {
        data = await res.json();
      } catch {
        setMessage("Unexpected server response.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        // Specific error messages from backend
        setMessage(data.message || "Error changing password.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      setMessage(data.message || "Password changed.");
      setMessageType("success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Something went wrong.");
      setMessageType("error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Change Password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Old Password</label>
                  <div className="relative">
                    <Input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1"
                      onClick={() => setShowOld(v => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-icons" style={{ fontSize: 20 }}>
                        {showOld ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
                <hr className="my-4" />
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1"
                      onClick={() => setShowNew(v => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-icons" style={{ fontSize: 20 }}>
                        {showNew ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-icons" style={{ fontSize: 20 }}>
                        {showConfirm ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
                {message && (
                  <div
                    className={`text-sm font-medium text-center ${
                      messageType === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    } animate-fade-in`}
                  >
                    {message}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </Layout>
    </div>
  );
}

"use client"

import React, { useState } from "react";
import Layout from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 h-12 text-lg" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </Layout>
    </div>
  );
}

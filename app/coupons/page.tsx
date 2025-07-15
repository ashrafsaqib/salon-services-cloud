"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";

interface Coupon {
  id: number;
  code: string;
  discount: string;
  type: string;
  date_start: string;
  date_end: string;
  status: number;
}

const getUserId = () => {
  return typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
};

const CouponListPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError("User not found. Please login.");
      setLoading(false);
      return;
    }
    let zoneId = "";
    if (typeof window !== "undefined") {
      zoneId = localStorage.getItem("selected_zone_id") || "";
    }
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-coupons?user_id=${userId}&zone_id=${zoneId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCoupons(data.coupons || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch coupons.");
        setLoading(false);
      });
  }, []);

  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApply = async (code: string) => {
    setApplyError(null);
    setAppliedCoupon(null);
    const userId = getUserId();
    if (!userId) {
      setApplyError("User not found. Please login.");
      setTimeout(() => setApplyError(null), 3000);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apply-coupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coupon: code, user_id: userId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.error || "Failed to apply coupon.");
        setTimeout(() => setApplyError(null), 3000);
        return;
      }
      setAppliedCoupon(code);
      localStorage.setItem("applied_coupon", code);
      setTimeout(() => setAppliedCoupon(null), 3000);
    } catch (err) {
      setApplyError("Failed to apply coupon.");
      setTimeout(() => setApplyError(null), 3000);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">🎁 My Coupons</h1>

          {loading && (
            <p className="text-gray-500 text-center">Loading coupons...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && !error && coupons.length === 0 && (
            <p className="text-gray-500 text-center">No coupons available.</p>
          )}
          {applyError && (
            <div className="mt-6 text-center text-red-600 font-medium">
              ❌ {applyError}
            </div>
          )}
          {appliedCoupon && (
            <div className="mt-6 text-center text-green-600 font-medium">
              ✅ Coupon <b>{appliedCoupon}</b> applied!
            </div>
          )}
          <div className="space-y-5">
            {coupons.map((coupon) => {
              const isSelected =
                appliedCoupon === coupon.code ||
                localStorage.getItem("applied_coupon") === coupon.code;
              return (
                <Card
                  key={coupon.id}
                  className={`shadow border transition-all border-gray-200 ${
                    isSelected ? "border-rose-600 ring-2 ring-rose-400" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <div
                          className={`text-lg font-semibold ${
                            isSelected ? "text-rose-600" : "text-blue-600"
                          }`}
                        >
                          {coupon.code}
                        </div>
                        <div className="text-sm text-gray-600">
                          Type: <b>{coupon.type}</b> | Status:{" "}
                          <b
                            className={
                              coupon.status === 1
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          >
                            {coupon.status === 1 ? "Active" : "Inactive"}
                          </b>
                        </div>
                        <div className="text-sm text-gray-500">
                          Valid: {coupon.date_start} - {coupon.date_end}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xl font-bold text-green-600">
                          {coupon.type === "Percentage"
                            ? `${coupon.discount}%`
                            : `${coupon.discount}`}
                        </div>
                        <button
                          className={`px-4 py-2 rounded transition bg-rose-600 hover:bg-rose-700 text-white`}
                          onClick={() => handleApply(coupon.code)}
                        >
                          {isSelected ? "Applied" : "Apply"}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CouponListPage;

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout/layout"
import { RefreshCw } from "lucide-react";
import { BidChatModal } from "@/components/bid-chat-modal";
import { checkToken } from "@/lib/auth";
import Loading from "@/app/loading";

interface Bid {
  id: number;
  staff: string;
  bid_amount: string;
  comment: string;
  show_confirm_button: boolean;
  show_chat_button: boolean;
  is_selected: boolean;
}

export default function QuoteBidsPage() {
  const params = useParams();
  const id = params?.id;
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<number | null>(null);
  const [chatBidId, setChatBidId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const token = checkToken(router)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote/${id}/bids`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bids");
        return res.json();
      })
      .then((data) => {
        setBids(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleConfirm = async (bidId: number) => {
    if (!id) return;
    const token = checkToken(router)
    setConfirming(bidId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote/${id}/confirm-bid/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bid_id: bidId }),
        }
      );
      if (!res.ok) throw new Error("Failed to confirm bid");
      // Refresh bids after confirmation
      const data = await res.json();
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote/${id}/bids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setBids(Array.isArray(data.data) ? data.data : []));
    } catch (err: any) {
      alert(err.message || "Failed to confirm bid");
    } finally {
      setConfirming(null);
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-rose-600">
              Quote Bids
            </h1>
            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">
              {bids.length} {bids.length === 1 ? "bid" : "bids"}
            </span>
          </div>
          {error ? (
            <div className="p-8 text-center text-rose-500">
              <p>⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200 transition"
              >
                Try Again
              </button>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">✨</div>
              <p className="text-gray-500">No bids found</p>
              <p className="text-gray-400 text-sm mt-1">
                Check back later or share this quote to get more bids
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border ${
                    bid.is_selected ? "border-green-500" : "border-gray-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Amount on the left */}
                    <div className="flex items-center min-w-[100px] justify-center mr-4">
                      <span className="text-rose-600 font-bold text-lg">
                        AED {bid.bid_amount}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {bid.staff}
                          </h3>
                          {bid.comment && (
                            <p className="text-gray-600 text-sm mt-1">
                              {bid.comment}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              bid.is_selected && "bg-green-100 text-green-800"
                            }`}
                          >
                            {bid.is_selected && "Selected"}
                          </span>
                          <div className="flex gap-2 mt-2">
                            {bid.show_confirm_button && (
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition disabled:opacity-60"
                                onClick={() => handleConfirm(bid.id)}
                                disabled={confirming === bid.id}
                              >
                                {confirming === bid.id
                                  ? "Confirming..."
                                  : "Confirm"}
                              </button>
                            )}
                            {bid.show_chat_button && (
                              <button
                                className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition"
                                onClick={() => setChatBidId(bid.id)}
                              >
                                Chat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </Layout>
      <BidChatModal
        bidId={chatBidId}
        open={!!chatBidId}
        onClose={() => setChatBidId(null)}
      />
    </div>
  );
}

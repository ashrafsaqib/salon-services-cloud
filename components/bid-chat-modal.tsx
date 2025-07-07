"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapPin, Paperclip } from "lucide-react";

interface BidChatModalProps {
  bidId: number | null;
  open: boolean;
  onClose: () => void;
}

export function BidChatModal({ bidId, open, onClose }: BidChatModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchChat = () => {
    if (!bidId) return;
    setLoading(true);
    setError("");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bid/${bidId}/chat`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
        setTimeout(() => {
          if (chatBoxRef.current)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }, 100);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!open || !bidId) return;
    fetchChat();
  }, [open, bidId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !bidId) return;
    setSending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bid/${bidId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message }),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");
      setMessage("");
      fetchChat();
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSendLocation = () => {
    if (!bidId || sending) return;
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setSending(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bid/${bidId}/chat`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ message: coords, location: 1 }),
            }
          );
          if (!res.ok) throw new Error("Failed to send location");
          fetchChat();
        } catch (err: any) {
          alert(err.message || "Failed to send location");
        } finally {
          setSending(false);
        }
      },
      (err) => {
        alert("Unable to retrieve your location");
        setSending(false);
      }
    );
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bidId || sending) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("file", "1");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bid/${bidId}/chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to send image");
      fetchChat();
    } catch (err: any) {
      alert(err.message || "Failed to send image");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
        >
          ✕
        </button>
        <div className="p-6 pb-0 border-b rounded-t-2xl bg-gradient-to-r from-rose-50 to-blue-50">
          <h2 className="text-xl font-bold mb-1 text-rose-600">Bid Chat</h2>
          {data && (
            <>
              <div className="mb-1 text-gray-700">
                <span className="font-medium">Bid Amount:</span> AED{" "}
                {data.bid.bid_amount}
              </div>
              {data.bid.comment && (
                <div className="mb-1 text-gray-500 text-sm">
                  {data.bid.comment}
                </div>
              )}
              {data.bid.images && data.bid.images.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {data.bid.images.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt="bid-img"
                      className="w-14 h-14 object-cover rounded border shadow"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div
          className="flex-1 overflow-y-auto p-6 pt-4 bg-white rounded-b-2xl"
          style={{ minHeight: "300px" }}
        >
          {loading ? (
            <div className="text-center py-8">Loading chat...</div>
          ) : error ? (
            <div className="text-center text-rose-500 py-8">{error}</div>
          ) : data ? (
            <div
              ref={chatBoxRef}
              className="max-h-[45vh] overflow-y-auto custom-scrollbar pr-2"
            >
              {data.chats && data.chats.length > 0 ? (
                data.chats.map((chat: any) => {
                  if (chat.type === "file") {
                    return (
                      <div
                        key={chat.id}
                        className={`mb-3 flex ${
                          chat.sender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[70%] break-words shadow flex items-center gap-2 ${
                            chat.sender
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <Paperclip className="w-4 h-4 mr-1 inline-block text-green-600" />
                          <a
                            href={chat.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                          >
                            View file
                          </a>
                          <div className="text-xs text-gray-400 mt-1 text-right w-full">
                            {new Date(chat.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (chat.type === "location") {
                    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
                      chat.value
                    )}`;
                    return (
                      <div
                        key={chat.id}
                        className={`mb-3 flex ${
                          chat.sender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[70%] break-words shadow flex items-center gap-2 ${
                            chat.sender
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <MapPin className="w-4 h-4 mr-1 inline-block text-rose-600" />
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-rose-600"
                          >
                            View location
                          </a>
                          <div className="text-xs text-gray-400 mt-1 text-right w-full">
                            {new Date(chat.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={chat.id}
                        className={`mb-3 flex ${
                          chat.sender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[70%] break-words shadow ${
                            chat.sender
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {chat.value}
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {new Date(chat.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-gray-400 text-center">
                  No chat messages
                </div>
              )}
            </div>
          ) : null}
        </div>
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t p-4 bg-white rounded-b-2xl"
        >
          <button
            type="button"
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full font-medium hover:bg-blue-200 transition flex items-center justify-center"
            onClick={handleSendLocation}
            disabled={sending}
            title="Send Location"
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="bg-green-100 text-green-700 px-3 py-2 rounded-full font-medium hover:bg-green-200 transition flex items-center justify-center"
            onClick={handleAttachmentClick}
            disabled={sending}
            title="Send Attachment"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
            maxLength={500}
            autoFocus
          />
          <button
            type="submit"
            className="bg-rose-600 text-white px-5 py-2 rounded-full font-medium hover:bg-rose-700 transition disabled:opacity-60"
            disabled={sending || !message.trim()}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

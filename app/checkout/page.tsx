"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/layout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Loading from "../loading";

// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function StripeCardForm({
  bookingId,
  amount,
  currencySymbol,
  currency,
  onPaymentSuccess,
}: {
  bookingId: string;
  amount: number;
  currencySymbol: string;
  currency: string;
  onPaymentSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  React.useEffect(() => {
    // Create PaymentIntent on mount
    const createPaymentIntent = async () => {
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: amount,
              currency: currency,
              description: `Order payment for #${bookingId}`,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to initialize payment");
        }
      }
    };
    if (bookingId && amount) createPaymentIntent();
  }, [bookingId, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }
    // Create PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {},
    });
    if (pmError || !paymentMethod) {
      setError(pmError?.message || "Payment error");
      setLoading(false);
      return;
    }
    // Call backend to process payment
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          currency: currency,
          description: `Order payment for #${bookingId}`,
          order_ids: bookingId.split(",").map((id) => Number(id)),
        }),
      }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Payment failed");
      setLoading(false);
      return;
    }
    onPaymentSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Card Information</Label>
        <div className="border rounded p-3">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
        disabled={loading || !clientSecret}
      >
        {loading ? "Processing..." : `Pay Now (${currencySymbol} ${amount})`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ordersParam = searchParams.get("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [allOrdersTotal, setAllOrdersTotal] = useState<string | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  React.useEffect(() => {
    if (!ordersParam) return;
    setLoading(true);
    setError(null);
    let zoneId = "";
    if (typeof window !== "undefined") {
      zoneId = localStorage.getItem("selected_zone_id") || "";
    }
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/api/getorders?orders=${ordersParam}${
        zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ""
      }`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order details");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        if (
          data.Total &&
          typeof data.Total === "object"
        ) {
          setAllOrdersTotal(data.Total.amount);
          setCurrencySymbol(data.Total.currencySymbol);
          setCurrency(data.Total.currency);
        } else {
          setAllOrdersTotal(null);
        }
      })
      .catch((err) => setError(err.message || "Failed to load order details"))
      .finally(() => setLoading(false));
  }, [ordersParam]);

  if (!ordersParam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Booking
            </h1>
            <p className="text-gray-600 mb-6">
              The order ID(s) are missing or invalid.
            </p>
            <Button
              onClick={() => router.push("/book")}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Start New Booking
            </Button>
          </div>
        </Layout>
      </div>
    );
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-red-500 text-lg">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking
            </Button>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600">
              Complete your payment to confirm your booking
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border-b pb-6 last:border-b-0">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Order #{order.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 mb-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          Staff: {order.staff_name}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          Time: {order.time_slot}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          Booking Date: {order.booking_date}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {order.order_services.map((service: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                service.image?.startsWith("http")
                                  ? service.image
                                  : `/service-images/${service.image}`
                              }
                              alt={service.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {service.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {service.duration}
                            </div>
                            <div className="text-rose-600 font-semibold">
                              {service.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Customer Information
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.customer.name}</p>
                        <p>{order.customer.email}</p>
                        <p>{order.customer.phone}</p>
                        <p>{order.customer.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method */}
                <div>
                  <Label className="text-base font-medium">
                    Payment Method
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "card" &&
                  (process.env.NEXT_PUBLIC_STRIPE_KEY ? (
                    <Elements stripe={stripePromise}>
                      <StripeCardForm
                        bookingId={ordersParam || ""}
                        amount={allOrdersTotal ? Number(allOrdersTotal) : 0}
                        currencySymbol={currencySymbol}
                        currency={currency}
                        onPaymentSuccess={() =>
                          router.push(
                            `/booking-confirmation?orders=${ordersParam}`
                          )
                        }
                      />
                    </Elements>
                  ) : (
                    <div className="text-red-600">
                      Stripe key not configured
                    </div>
                  ))}

                {paymentMethod === "cod" && (
                  <div className="pt-4">
                    <Button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const updateRes = await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orderupdate`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                order_ids: ordersParam
                                  ? ordersParam
                                      .split(",")
                                      .map((id) => Number(id))
                                  : [],
                                payment_method: "cod",
                              }),
                            }
                          );
                          if (!updateRes.ok) {
                            throw new Error(
                              "Failed to update order with payment method"
                            );
                          }
                          router.push(
                            `/booking-confirmation?orders=${ordersParam}`
                          );
                        } catch (err) {
                          setError(err.message || "Failed to process payment");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Order...
                        </div>
                      ) : (
                        `Confirm Cash on Delivery`
                      )}
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center space-y-2">
                  <p>🔒 Your payment information is secure and encrypted</p>
                  <p>
                    By completing this purchase, you agree to our Terms of
                    Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </div>
  );
}

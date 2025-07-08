"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Youtube, Facebook, Instagram, Star } from "lucide-react";
import { CategoryCard } from "@/components/ui/category-card";
import { ServiceCard } from "@/components/common/service-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface StaffReview {
  id: number;
  user_name: string;
  content: string;
  rating: number;
  created_at: string;
}

interface StaffDetail {
  id: number;
  name: string;
  image: string;
  sub_title?: string;
  about?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  snapchat?: string;
  tiktok?: string;
  location?: string;
  charges?: string;
  commission?: string;
  fix_salary?: string;
  online?: number;
  get_quote?: number;
  quote_amount?: string | null;
  show_quote_detail?: number;
  services: any[];
  categories: any[];
  reviews: StaffReview[];
}

export default function StaffDetailPage() {
  const searchParams = useSearchParams();
  const staffId = searchParams.get("staff");
  const [staff, setStaff] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shownServices, setShownServices] = useState(20);
  const [shownReviews, setShownReviews] = useState(5);

  useEffect(() => {
    if (!staffId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff?staff=${staffId}`)
      .then((res) => res.json())
      .then((data) => {
        setStaff(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [staffId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || !staff)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load staff details.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-gradient-to-r from-rose-50 to-blue-50 p-8 border-b">
            <Image
              src={staff.image}
              alt={staff.name || `Staff #${staff.id}`}
              width={180}
              height={180}
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-gray-900">
                {staff.name || `Staff #${staff.id}`}
              </h1>
              {staff.sub_title && (
                <div className="text-lg text-rose-600 font-medium mb-2">
                  {staff.sub_title}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {staff.online === 1 && (
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Online
                  </span>
                )}
                {staff.location && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {staff.location}
                  </span>
                )}
                {staff.charges && (
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    AED {staff.charges} / service
                  </span>
                )}
                {typeof staff.order_count !== "undefined" && (
                  <span className="inline-block bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs">
                    Delivered Orders: {staff.order_count}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 mb-2">
                {staff.phone && (
                  <span>
                    📞{" "}
                    <a
                      href={`tel:${staff.phone}`}
                      className="underline hover:text-blue-600"
                    >
                      {staff.phone}
                    </a>
                  </span>
                )}
                {staff.whatsapp && (
                  <span className="flex items-center gap-1">
                    <img
                      src="/whatsapp.svg"
                      alt="WhatsApp"
                      className="h-4 w-4 inline"
                    />
                    <a
                      href={`https://wa.me/${staff.whatsapp.replace(
                        /[^\d]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-600"
                    >
                      WhatsApp
                    </a>
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                {staff.facebook && (
                  <a
                    href={staff.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform flex items-center gap-1 text-blue-600"
                  >
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </a>
                )}
                {staff.instagram && (
                  <a
                    href={staff.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform flex items-center gap-1 text-pink-500"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>Instagram</span>
                  </a>
                )}
                {staff.youtube && (
                  <a
                    href={staff.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform flex items-center gap-1 text-red-600"
                  >
                    <Youtube className="h-5 w-5" />
                    <span>YouTube</span>
                  </a>
                )}
                {staff.snapchat && (
                  <a
                    href={staff.snapchat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform flex items-center gap-1 text-yellow-400"
                  >
                    <img
                      src="/snapchat.png"
                      alt="Snapchat"
                      className="h-5 w-5"
                    />
                    <span>Snapchat</span>
                  </a>
                )}
                {staff.tiktok && (
                  <a
                    href={staff.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform flex items-center gap-1 text-black"
                  >
                    <img src="/tiktok.png" alt="TikTok" className="h-5 w-5" />
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {staff.about && (
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                About
              </h2>
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: staff.about }}
              />
            </section>
          )}
          {/* Quote Section */}
          {staff.get_quote === 1 && (
            <section className="px-8 py-6 border-b">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Get a Quote
              </h2>
              <div className="text-gray-700 mb-1">
                This staff member accepts quote requests.
              </div>
            </section>
          )}
          {/* Categories Carousel */}
          {staff.categories?.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Categories
                </h2>
              </div>

              <div className="relative px-2 py-6 md:px-6 md:py-8">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {staff.categories.map((cat: any, idx: number) => (
                      <CarouselItem
                        key={cat.id || idx}
                        className="transition-transform duration-200 md:basis-1/2 lg:basis-1/3 hover:scale-[1.03]"
                      >
                        <CategoryCard cat={cat} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation Buttons */}
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition rounded-full w-10 h-10 items-center justify-center z-10" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition rounded-full w-10 h-10 items-center justify-center z-10" />
                </Carousel>
              </div>
            </section>
          )}

          {/* Services Section */}
          {staff.services?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.services
                  .slice(0, shownServices)
                  .map((service: any, idx: number) => (
                    <ServiceCard key={service.slug || idx} service={service} />
                  ))}
              </div>
              {shownServices < staff.services.length && (
                <div className="flex justify-center mt-6">
                  <button
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => setShownServices(shownServices + 20)}
                  >
                    <span>Load More</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Reviews Section */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            {staff.reviews && staff.reviews.length > 0 ? (
              <>
                <div className="space-y-4">
                  {staff.reviews.slice(0, shownReviews).map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                          {review.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {review.user_name}
                            </h4>
                            <span className="ml-2 text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-gray-600 text-sm">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {shownReviews < staff.reviews.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="group inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => setShownReviews(shownReviews + 5)}
                    >
                      <span>Load More</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                No reviews yet. Be the first to review!
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

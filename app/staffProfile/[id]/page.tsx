"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
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
import Layout from "@/components/layout/layout";
import Loading from "@/app/loading";
import ReviewAddModal from "@/components/review-add-modal";

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
  facebook?: string;
  instagram?: string;
  youtube?: string;
  snapchat?: string;
  tiktok?: string;
  location?: string;
  charges?: string;
  online?: number;
  get_quote?: number;
  services: any[];
  categories: any[];
  reviews: StaffReview[];
  images?: string[];
  youtube_videos?: string[];
  order_count?: number;
  min_order_value?: number; // <-- add this
  nationality?: string;     // <-- add this
  available_time_slots?: {
    id: number;
    name: string;
    time_start: string;
    time_end: string;
    type: string;
    date: string | null;
    status: number;
    seat: number;
    end_time_to_sec: number;
    start_time_to_sec: number;
  }[];
}

export default function StaffDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  // Get id from query string
  const staffId = searchParams.get("id");
  const [staff, setStaff] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shownServices, setShownServices] = useState(20);
  const [shownReviews, setShownReviews] = useState(5);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  const handleReviewSubmit = async (formData: FormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 200) {
        sessionStorage.setItem("flashMessage", data?.message || "Your review was submitted successfully.");
        setShowReviewModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        alert(data?.message || "Failed to submit review.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    }
  };

  useEffect(() => {
    if (!staffId) return;
    setLoading(true);
    let zoneId = '';
        if (typeof window !== 'undefined') {
          zoneId = localStorage.getItem('selected_zone_id') || '';
        }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff?staff=${staffId}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`)
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

  if (loading) {
    return <Loading />
  }
  if (error || !staff)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load staff details.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Layout>
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
                {typeof staff.min_order_value !== "undefined" && (
                  <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                    Min Order: AED {staff.min_order_value}
                  </span>
                )}
                {staff.nationality && (
                  <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                    Nationality: {staff.nationality}
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

          {/* Available Time Slots Section */}
          <div className="mt-4 mb-4">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">Today Available Slots</h2>
            {staff.available_time_slots && staff.available_time_slots.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center py-2">
                {staff.available_time_slots.map(slot => (
                  <div
                    key={slot.id}
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-blue-50 via-white to-rose-50 border border-blue-200 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[90px] text-xs font-semibold text-blue-700 cursor-pointer"
                  >
                    <span className="text-base font-bold text-gray-900 mb-1">{slot.time_start}</span>
                    <span className="text-[10px] text-gray-500 mb-1">{slot.name}</span>
                    {slot.type === "Specific" && slot.date ? (
                      <span className="text-[10px] text-rose-600">{slot.date}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-base py-6">No available timeslot today</div>
            )}
          </div>

          {/* About Section */}
          {staff.about && (
            <section className="px-8 py-6 border-b">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
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
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                Get a Quote
              </h2>
              <div className="text-gray-700 mb-1">
                This staff member accepts quote requests.
              </div>
            </section>
          )}

          {/* Media Images Section */}
          {Array.isArray(staff.images) && staff.images.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                Gallery
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 px-2 custom-scrollbar">
                {staff.images.map((img, idx) => (
                  <button
                    key={idx}
                    className="flex-shrink-0 relative group overflow-hidden rounded-xl border border-gray-200 shadow-md w-40 h-32"
                    onClick={() => {
                      setGalleryIndex(idx);
                      setGalleryModalOpen(true);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Staff Image ${idx + 1}`}
                      fill
                      className="object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    {/* Glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>

              {/* Modal for full image gallery */}
              {galleryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col items-center p-6 animate-fadeIn">
                    <button
                      className="absolute top-3 right-3 text-gray-300 hover:text-black text-3xl transition"
                      onClick={() => setGalleryModalOpen(false)}
                    >
                      &times;
                    </button>

                    {/* Navigation */}
                    <div className="flex items-center justify-between w-full mb-4">
                      <button
                        className="p-3 rounded-full transition disabled:opacity-40"
                        onClick={() => setGalleryIndex((galleryIndex - 1 + staff.images.length) % staff.images.length)}
                        disabled={galleryIndex === 0}
                      >
                        &#8592;
                      </button>
                      <span className="text-white text-sm font-semibold">
                        {galleryIndex + 1} / {staff.images.length}
                      </span>
                      <button
                        className="p-3 rounded-full transition disabled:opacity-40"
                        onClick={() => setGalleryIndex((galleryIndex + 1) % staff.images.length)}
                        disabled={galleryIndex === staff.images.length - 1}
                      >
                        &#8594;
                      </button>
                    </div>

                    <Image
                      src={staff.images[galleryIndex]}
                      alt={`Staff Image ${galleryIndex + 1}`}
                      width={800}
                      height={500}
                      className="rounded-lg object-contain max-h-[70vh] w-full shadow-lg transition-all duration-300"
                    />

                    {/* Thumbnails */}
                    <div
                      className="mt-6 w-full flex justify-center"
                    >
                      <div
                        className="flex gap-2 overflow-x-auto max-w-[600px] px-2 py-1 custom-scrollbar"
                        style={{ minHeight: 60 }}
                      >
                        {staff.images.map((img, idx) => (
                          <button
                            key={idx}
                            className={`focus:outline-none border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 w-[70px] h-[50px] ${
                              idx === galleryIndex
                                ? "border-pink-500 shadow-lg"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            onClick={() => setGalleryIndex(idx)}
                            style={{ width: 70, height: 50 }}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              width={70}
                              height={50}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}


          {/* Media Videos Section */}
          {Array.isArray(staff.youtube_videos) &&
            staff.youtube_videos.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                  Videos
                </h2>
                <Carousel className="w-full max-w-5xl mx-auto">
                  <CarouselContent>
                    {staff.youtube_videos.map((id, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex items-center justify-center lg:basis-1/3 md:basis-1/2 basis-full p-2"
                      >
                        <iframe
                          width="100%"
                          height="240"
                          src={`https://www.youtube.com/embed/${id}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="rounded-lg w-full max-w-xl aspect-video"
                        ></iframe>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition rounded-full w-10 h-10 items-center justify-center z-10" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition rounded-full w-10 h-10 items-center justify-center z-10" />
                </Carousel>
              </section>
            )}

          {/* Categories Carousel */}
          {staff.categories?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                Categories
              </h2>
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
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                Services
              </h2>
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
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
              Customer Reviews
            </h2>
            {isLoggedIn && (
              <div className="mb-6 flex justify-center">
                <button
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                  onClick={() => setShowReviewModal(true)}
                >
                  Add Your Review
                </button>
                <ReviewAddModal
                  isOpen={showReviewModal}
                  onClose={() => setShowReviewModal(false)}
                  onSubmit={handleReviewSubmit}
                  staff_id={staff.id}
                />
              </div>
            )}
            {staff.reviews && staff.reviews.length > 0 ? (
              <>
                <div className="space-y-4">
                  {staff.reviews.slice(0, shownReviews).map((review, idx) => (
                    <div
                      key={review.id ? `review-${review.id}` : `review-fallback-${idx}`}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                          {typeof review.user_name === 'string' && review.user_name.length > 0
                            ? review.user_name.charAt(0).toUpperCase()
                            : '?'}
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
      </Layout>
    </div>
  );
}

/*
.text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6 {
  @apply text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-6;
}
*/

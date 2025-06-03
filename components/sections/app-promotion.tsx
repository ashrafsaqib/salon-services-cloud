import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AppPromotion() {
  return (
    <section className="py-16 bg-rose-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
            <p className="text-lg mb-6">
              Get the best experience with our mobile app. Book services, track your appointments, and get exclusive
              offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-rose-600 hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-apple mr-2"
                >
                  <path d="M12 20.94c1.5 0 2.75-.48 3.76-1.42 1-1 1.65-2.2 1.65-3.54 0-1.28-.5-2.34-1.5-3.2" />
                  <path d="M12 20.94c-1.5 0-2.75-.48-3.76-1.42-1-1-1.65-2.2-1.65-3.54 0-1.28.5-2.34 1.5-3.2" />
                  <path d="M9 12.24c-.5-.56-.9-1.22-1.2-2-1.5-4 2-8 2-8s.5 2 2 3c1.5 1 4 1 4 1s.5 3-1.5 4c-1.5.8-3.8.2-3.8.2" />
                  <path d="M12 20.94c1.5 0 2.5-.8 2.5-2.3 0-1.4-1-2.7-2.5-2.7-1.5 0-2.5 1.3-2.5 2.7 0 1.5 1 2.3 2.5 2.3Z" />
                </svg>
                App Store
              </Button>
              <Button className="bg-white text-rose-600 hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play mr-2"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Google Play
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative h-80">
            <Image
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop"
              alt="Lipslay Mobile App"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Stay updated with our latest services and exclusive offers</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button className="bg-rose-600 hover:bg-rose-700">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

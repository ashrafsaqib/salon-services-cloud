export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Book your service in just a few simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: "Choose Service",
              description: "Browse and select from our wide range of services",
            },
            {
              step: 2,
              title: "Set Location",
              description: "Enter your address or select your location on the map",
            },
            {
              step: 3,
              title: "Select Time",
              description: "Choose a convenient date and time for your service",
            },
            {
              step: 4,
              title: "Enjoy Service",
              description: "Our professional will arrive at your doorstep",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-rose-600">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

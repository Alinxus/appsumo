'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Top Affiliate",
    earnings: "$12,500",
    period: "Last 3 months",
    testimonial: "ShipFree's affiliate program has been a game-changer for my business. The commission structure is generous and the tools make it easy to track my earnings.",
    rating: 5,
    avatar: "/api/placeholder/60/60"
  },
  {
    name: "Michael Chen",
    role: "Marketing Professional",
    earnings: "$8,750",
    period: "Last 2 months",
    testimonial: "I love how transparent and reliable the affiliate system is. Payments are always on time and the dashboard provides all the insights I need.",
    rating: 5,
    avatar: "/api/placeholder/60/60"
  },
  {
    name: "Emma Rodriguez",
    role: "Content Creator",
    earnings: "$15,200",
    period: "Last 4 months",
    testimonial: "The conversion rates are amazing! My audience loves the shipping solutions, and I'm earning great commissions. Highly recommend joining!",
    rating: 5,
    avatar: "/api/placeholder/60/60"
  },
  {
    name: "David Park",
    role: "E-commerce Consultant",
    earnings: "$9,350",
    period: "Last 3 months",
    testimonial: "ShipFree's affiliate program is professional and well-structured. The support team is responsive and the earning potential is excellent.",
    rating: 5,
    avatar: "/api/placeholder/60/60"
  }
];

export default function AffiliateTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Affiliates Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful affiliates who are earning substantial commissions
            by promoting ShipFree's shipping solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 bg-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-green-600 font-bold text-lg">
                      {testimonial.earnings}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {testimonial.period}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{testimonial.testimonial}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-black text-white p-8 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join These Success Stories?
            </h3>
            <p className="text-gray-300 mb-6">
              Start earning commissions today with our proven affiliate program
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">30%</div>
                <div className="text-gray-400">Commission Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$0</div>
                <div className="text-gray-400">Setup Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

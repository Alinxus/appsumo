import { 
  DollarSign, 
  Users, 
  BarChart3, 
  Clock, 
  Shield, 
  Trophy,
  Zap,
  HeartHandshake
} from "lucide-react";

export function AffiliateBenefitsSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "High Commission Rates",
      description: "Earn up to 20% commission on all qualified sales with no caps on earnings."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Get personal support from our affiliate success team to maximize your earnings."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your performance with detailed analytics and reporting tools."
    },
    {
      icon: Clock,
      title: "Fast Payouts",
      description: "Receive your commissions monthly via PayPal, bank transfer, or check."
    },
    {
      icon: Shield,
      title: "Reliable Tracking",
      description: "Advanced tracking system ensures you get credit for every sale you generate."
    },
    {
      icon: Trophy,
      title: "Performance Bonuses",
      description: "Earn additional bonuses for hitting monthly and quarterly targets."
    },
    {
      icon: Zap,
      title: "Marketing Materials",
      description: "Access to high-converting banners, emails, and promotional content."
    },
    {
      icon: HeartHandshake,
      title: "Long Cookie Life",
      description: "90-day cookie tracking ensures you get credit for delayed conversions."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Affiliate Program?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide everything you need to succeed as an affiliate partner, from competitive rates to dedicated support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-4">Start Earning Today</h3>
            <p className="text-lg mb-6">
              Join our affiliate program and start earning commissions on every sale you generate.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

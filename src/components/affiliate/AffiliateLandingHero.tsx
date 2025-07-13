interface AffiliateLandingHeroProps {
  onSignupClick: () => void
}

export function AffiliateLandingHero({ onSignupClick }: AffiliateLandingHeroProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white">
              💰 Earn up to $500 per referral
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Turn Your Audience Into 
            <span className="block text-gray-600">Passive Income</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the most profitable affiliate program for AI tools. Promote cutting-edge software 
            your audience already wants and earn <strong>up to 30% commission</strong> on every sale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onSignupClick}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Start Earning Today →
            </button>
            <button className="text-gray-600 hover:text-black font-medium">
              Watch How It Works
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">2,500+</div>
              <div className="text-sm text-gray-600">Active Affiliates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">$2.5M+</div>
              <div className="text-sm text-gray-600">Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">30%</div>
              <div className="text-sm text-gray-600">Commission Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">24hr</div>
              <div className="text-sm text-gray-600">Approval Time</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
      </div>
    </section>
  )
}

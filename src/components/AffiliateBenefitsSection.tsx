import React from 'react';

const AffiliateBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: '💰',
      title: 'High Commission Rates',
      description: 'Earn up to 50% commission on every sale you refer to our platform.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track your performance with detailed analytics and reporting tools.'
    },
    {
      icon: '🎯',
      title: 'Marketing Materials',
      description: 'Access professionally designed banners, links, and promotional content.'
    },
    {
      icon: '💳',
      title: 'Fast Payouts',
      description: 'Get paid quickly with our reliable payment system and low minimum thresholds.'
    },
    {
      icon: '🤝',
      title: 'Dedicated Support',
      description: 'Our affiliate managers are here to help you succeed every step of the way.'
    },
    {
      icon: '📈',
      title: 'Performance Bonuses',
      description: 'Unlock additional rewards and bonuses as you hit performance milestones.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful affiliates who are earning substantial income 
            by promoting the best AI tools in the market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliateBenefitsSection;

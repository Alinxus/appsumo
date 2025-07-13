'use client'

export function AffiliateStatsSection() {
  const stats = [
    {
      value: '50,000+',
      label: 'Average Monthly Earnings',
      description: 'Top affiliates earning consistently'
    },
    {
      value: '25%',
      label: 'Commission Rate',
      description: 'Industry-leading payouts'
    },
    {
      value: '10K+',
      label: 'Active Affiliates',
      description: 'Growing community'
    },
    {
      value: '48hrs',
      label: 'Approval Time',
      description: 'Quick application process'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Thousands of Successful Affiliates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our affiliate program offers competitive commissions and proven marketing materials to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

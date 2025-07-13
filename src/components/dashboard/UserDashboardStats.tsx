interface UserDashboardStatsProps {
  stats: {
    totalPurchases: number
    totalSpent: number
    totalWishlisted: number
    totalSaved: number
  }
}

export function UserDashboardStats({ stats }: UserDashboardStatsProps) {
  const statCards = [
    {
      name: 'Tools Purchased',
      value: stats.totalPurchases,
      icon: '🛠️'
    },
    {
      name: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: '💰'
    },
    {
      name: 'Total Saved',
      value: `$${stats.totalSaved.toLocaleString()}`,
      icon: '💵'
    },
    {
      name: 'Wishlisted',
      value: stats.totalWishlisted,
      icon: '❤️'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.name}
              </p>
              <p className="text-3xl font-bold text-black mt-2">
                {stat.value}
              </p>
            </div>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-2xl">
              <span className="filter grayscale">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
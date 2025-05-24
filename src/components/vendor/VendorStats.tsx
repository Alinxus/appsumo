interface VendorStatsProps {
  stats: {
    totalTools: number
    activeTools: number
    totalSales: number
    totalRevenue: number
    averageRating: number
  }
}

export function VendorStats({ stats }: VendorStatsProps) {
  const statCards = [
    {
      name: 'Total Tools',
      value: stats.totalTools,
      icon: '🛠️',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Active Tools',
      value: stats.activeTools,
      icon: '✅',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Total Sales',
      value: stats.totalSales,
      icon: '💰',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      name: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💵',
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Avg. Reviews',
      value: stats.averageRating.toFixed(1),
      icon: '⭐',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stat.textColor}`}>
                {stat.name}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
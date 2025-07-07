"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  sales: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  views: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  conversionRate: {
    current: number
    previous: number
    growth: number
  }
  topPerformingTools: Array<{
    name: string
    revenue: number
    sales: number
    views: number
    conversionRate: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    sales: number
  }>
  salesByTool: Array<{
    toolName: string
    sales: number
    revenue: number
  }>
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData
  timeRange: '7d' | '30d' | '90d' | '1y'
}

export function AdvancedAnalytics({ data, timeRange }: AdvancedAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(timeRange)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Track your AppSumo marketplace performance</p>
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(data.revenue.growth)}
              <span className={`ml-1 ${getGrowthColor(data.revenue.growth)}`}>
                {formatPercentage(data.revenue.growth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sales.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(data.sales.growth)}
              <span className={`ml-1 ${getGrowthColor(data.sales.growth)}`}>
                {formatPercentage(data.sales.growth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.views.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(data.views.growth)}
              <span className={`ml-1 ${getGrowthColor(data.views.growth)}`}>
                {formatPercentage(data.views.growth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversionRate.current.toFixed(2)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(data.conversionRate.growth)}
              <span className={`ml-1 ${getGrowthColor(data.conversionRate.growth)}`}>
                {formatPercentage(data.conversionRate.growth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Tool Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {data.revenueByMonth.slice(-6).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(item.revenue / Math.max(...data.revenueByMonth.map(r => r.revenue))) * 200}px` }}
                      />
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Sales Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.salesByTool.slice(0, 5).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">{tool.toolName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{tool.sales}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(tool.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Tool</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Sales</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Views</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPerformingTools.map((tool, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{tool.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-green-600">
                          {formatCurrency(tool.revenue)}
                        </td>
                        <td className="text-right py-3 px-4">{tool.sales}</td>
                        <td className="text-right py-3 px-4">{tool.views.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant={tool.conversionRate > 5 ? 'default' : 'secondary'}>
                            {tool.conversionRate.toFixed(2)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {data.revenueByMonth.slice(-6).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(item.sales / Math.max(...data.revenueByMonth.map(r => r.sales))) * 200}px` }}
                      />
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenueByMonth.slice(-6).reverse().map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.month}</div>
                        <div className="text-sm text-gray-600">{item.sales} sales</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(item.revenue)}</div>
                        <div className="text-sm text-gray-600">
                          Avg: {formatCurrency(item.revenue / item.sales)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Revenue Growth</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Your revenue has grown by {formatPercentage(data.revenue.growth)} this month. 
                    Consider increasing marketing efforts to maintain this momentum.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Conversion Rate</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Your conversion rate is {data.conversionRate.current.toFixed(2)}%. 
                    Focus on improving product descriptions and adding social proof.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Traffic Insights</span>
                  </div>
                  <p className="text-purple-700 text-sm">
                    You've received {data.views.total.toLocaleString()} total views. 
                    Consider SEO optimization to increase organic traffic.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">Optimize Product Pages</h4>
                      <p className="text-sm text-gray-600">Add more detailed descriptions and demo videos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">Increase Social Proof</h4>
                      <p className="text-sm text-gray-600">Add customer testimonials and case studies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">Launch New Deals</h4>
                      <p className="text-sm text-gray-600">Consider creating limited-time offers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">Improve Customer Support</h4>
                      <p className="text-sm text-gray-600">Faster response times can boost conversions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
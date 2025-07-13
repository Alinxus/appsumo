'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Zap, TrendingUp, ArrowRight, Play } from 'lucide-react'

interface HeroSectionProps {
  title: string
  subtitle: string
  stats: {
    totalTools: number
    totalUsers: number
    totalSales: number
    totalSavings: number
  }
}

export function HeroSection({ title, subtitle, stats }: HeroSectionProps) {
  const [currentStat, setCurrentStat] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const statItems = [
    { icon: Zap, value: stats.totalTools, label: 'AI Tools' },
    { icon: Users, value: stats.totalUsers, label: 'Happy Users' },
    { icon: TrendingUp, value: stats.totalSales, label: 'Sales Made' },
    { icon: Star, value: stats.totalSavings, label: 'Total Savings', prefix: '$' }
  ]

  return (
    <section className="relative bg-white section-padding overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.1)_1px,_transparent_0)] bg-[size:40px_40px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto container-padding">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-8 bg-black text-white border-black hover:bg-gray-800 px-6 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2 fill-white" />
            Trusted by 10,000+ entrepreneurs worldwide
          </Badge>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-8 leading-tight text-balance animate-fade-in">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            {subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-scale-in">
            <Button asChild size="lg" className="btn-primary text-xl px-12 py-6 shadow-2xl hover:shadow-3xl group">
              <Link href="/browse" className="flex items-center">
                Browse All Deals
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-secondary text-xl px-12 py-6 group">
              <Link href="/tools" className="flex items-center">
                <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                See How It Works
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {statItems.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index}
                  className={`text-center p-8 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 card-hover ${
                    currentStat === index ? 'border-black scale-105' : ''
                  }`}
                >
                  <Icon className="w-10 h-10 mx-auto mb-4 text-black" />
                  <div className="text-3xl md:text-4xl font-black text-black mb-2">
                    {stat.prefix && stat.prefix}{stat.value.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

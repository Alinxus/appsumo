'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Clock, Star, Users, TrendingUp,  Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface DealCardProps {
  tool: any
  showCountdown?: boolean
}

export function DealCard({ tool, showCountdown = true }: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const [isEndingSoon, setIsEndingSoon] = useState(false)

  useEffect(() => {
    if (!tool.dealEndsAt || !showCountdown) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(tool.dealEndsAt).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsEndingSoon(days === 0 && hours < 24)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsEndingSoon(false)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [tool.dealEndsAt, showCountdown])

  const getBadges = () => {
    const badges = []

    if (tool.isFeatured) badges.push({ label: 'Featured', icon: Crown, color: 'bg-purple-100 text-purple-800' })
    if (tool.isStaffPick) badges.push({ label: 'Staff Pick', icon: Sparkles, color: 'bg-blue-100 text-blue-800' })
    if (tool.isBestSeller) badges.push({ label: 'Best Seller', icon: TrendingUp, color: 'bg-green-100 text-green-800' })
    if (tool.isNew) badges.push({ label: 'New', icon: Sparkles, color: 'bg-yellow-100 text-yellow-800' })
    if (isEndingSoon) badges.push({ label: 'Ending Soon', icon: '🔥 ', color: 'bg-red-100 text-red-800' })
    if (tool.isFlashDeal) badges.push({ label: 'Flash Deal', icon: '🔥', color: 'bg-orange-100 text-orange-800' })

    return badges
  }

  const getSocialProof = () => {
    if (tool.socialProof) {
      try {
        const proof = typeof tool.socialProof === 'string' ? JSON.parse(tool.socialProof) : tool.socialProof
        return proof
      } catch {
        return null
      }
    }
    return null
  }

  const socialProof = getSocialProof()
  const badges = getBadges()
  const discountPercentage = tool.discountPercentage || 
    (tool.regularPrice && tool.dealPrice ? 
      Math.round(((Number(tool.regularPrice) - Number(tool.dealPrice)) / Number(tool.regularPrice)) * 100) : 0)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-sm bg-white rounded-xl">
      <CardHeader className="relative p-0">
        <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center">
          {tool.images && tool.images.length > 0 ? (
            <img 
              src={tool.images[0]} 
              alt={tool.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🛠️</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <Badge key={index} className={`bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded`}>{Icon && <Icon className="w-3 h-3 mr-1" />}{badge.label}</Badge>
            )
          })}
        </div>
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded">-{discountPercentage}%</Badge>
          </div>
        )}
        {showCountdown && tool.dealEndsAt && timeLeft.days >= 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-gray-900 text-center border border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium">
                  {isEndingSoon ? 'Ending Soon!' : 'Deal Ends In'}
                </span>
              </div>
              <div className="flex justify-center gap-1 text-xs">
                {timeLeft.days > 0 && (
                  <div className="bg-gray-200 rounded px-1">{timeLeft.days}d</div>
                )}
                <div className="bg-gray-200 rounded px-1">{timeLeft.hours.toString().padStart(2, '0')}h</div>
                <div className="bg-gray-200 rounded px-1">{timeLeft.minutes.toString().padStart(2, '0')}m</div>
                <div className="bg-gray-200 rounded px-1">{timeLeft.seconds.toString().padStart(2, '0')}s</div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">{tool.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{tool.shortDescription}</p>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= (tool._count?.reviews || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-sm text-gray-500">({tool._count?.reviews || 0} reviews)</span>
        </div>
        {socialProof && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">{socialProof.recentBuyers || 0} bought in 24h</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {tool.dealPrice ? (
              <>
                <span className="text-2xl font-bold text-gray-900">${Number(tool.dealPrice).toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">${Number(tool.regularPrice).toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${Number(tool.regularPrice).toFixed(2)}</span>
            )}
          </div>
          <Button asChild size="sm" className="rounded px-4 py-2">
            <Link href={`/tools/${tool.slug}`}>View Deal</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
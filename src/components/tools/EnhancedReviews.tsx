"use client"

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Review {
  id: string
  rating: number
  title?: string
  content?: string
  isVerified: boolean
  isApproved: boolean
  createdAt: string
  user: {
    fullName?: string
    email: string
  }
  helpfulVotes: number
  unhelpfulVotes: number
}

interface EnhancedReviewsProps {
  toolId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingBreakdown: {
    [key: number]: number
  }
}

export function EnhancedReviews({ toolId, reviews, averageRating, totalReviews, ratingBreakdown }: EnhancedReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')
  const [userVotes, setUserVotes] = useState<Record<string, 'helpful' | 'unhelpful' | null>>({})

  const filteredReviews = reviews.filter(review => 
    selectedRating === null || review.rating === selectedRating
  )

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'helpful':
        return (b.helpfulVotes - b.unhelpfulVotes) - (a.helpfulVotes - a.unhelpfulVotes)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleVote = (reviewId: string, voteType: 'helpful' | 'unhelpful') => {
    setUserVotes(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === voteType ? null : voteType
    }))
  }

  const getRatingPercentage = (rating: number) => {
    const count = ratingBreakdown[rating] || 0
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-600">({totalReviews} reviews)</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('helpful')}
            >
              Most Helpful
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              Highest Rated
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Rating Breakdown</h3>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[40px]">
                      {ratingBreakdown[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant={selectedRating === null ? 'default' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedRating(null)}
                >
                  Show All Reviews
                </Button>
                
                <div className="mt-2 space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedRating(rating)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{rating}★</span>
                        <span className="text-gray-600">({ratingBreakdown[rating] || 0})</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sortedReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to review this tool!</p>
                </div>
              ) : (
                sortedReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {getInitials(review.user.fullName, review.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {review.user.fullName || review.user.email.split('@')[0]}
                            </span>
                            {review.isVerified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Buyer
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    )}

                    {review.content && (
                      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant={userVotes[review.id] === 'helpful' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(review.id, 'helpful')}
                          className="flex items-center gap-1"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpfulVotes})
                        </Button>
                        <Button
                          variant={userVotes[review.id] === 'unhelpful' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(review.id, 'unhelpful')}
                          className="flex items-center gap-1"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Unhelpful ({review.unhelpfulVotes})
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
} 
import { useState, useEffect, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  initialData: any[]
  hasMore: boolean
  endpoint: string
  params?: Record<string, string>
}

export function useInfiniteScroll({ 
  initialData, 
  hasMore: initialHasMore, 
  endpoint, 
  params = {} 
}: UseInfiniteScrollOptions) {
  const [data, setData] = useState(initialData)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(2)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...params
      })
      
      const response = await fetch(`${endpoint}?${queryParams}`)
      const result = await response.json()
      
      if (response.ok) {
        setData(prevData => [...prevData, ...result.tools])
        setHasMore(result.hasMore)
        setPage(prevPage => prevPage + 1)
      }
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, endpoint, params])

  useEffect(() => {
    setData(initialData)
    setHasMore(initialHasMore)
    setPage(2)
  }, [initialData, initialHasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  const reset = useCallback((newData: any[], newHasMore: boolean) => {
    setData(newData)
    setHasMore(newHasMore)
    setPage(2)
    setLoading(false)
  }, [])

  return {
    data,
    hasMore,
    loading,
    loadMore,
    reset
  }
} 
'use client'

import Link from 'next/link'

interface HeroSectionProps {
  title: string;
  subtitle: string;
  stats?: {
    totalTools: number;
    totalUsers: number;
    totalSales: number;
    totalSavings: number;
  };
}

export function HeroSection({ title, subtitle, stats }: HeroSectionProps) {
  return (
    <div className="bg-[#122438] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 sm:text-5xl">
            Pay once, <span className="text-[#00b289]">not monthly.</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            The best software deals on the internet—guaranteed.
          </p>
          <div className="mb-8">
            <Link
              href="/browse"
              className="inline-block bg-[#00b289] text-white px-6 py-3 rounded font-medium hover:bg-[#00a07a] transition-colors"
            >
              Shop now
            </Link>
          </div>
          
          {stats && (
            <div className="grid grid-cols-4 gap-8 mt-12 text-center border-t border-gray-700 pt-12">
              <div>
                <div className="text-3xl font-bold text-[#00b289]">{stats.totalTools}+</div>
                <div className="text-sm text-gray-300">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00b289]">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00b289]">{stats.totalSales.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Deals sold</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00b289]">${stats.totalSavings.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Total savings</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
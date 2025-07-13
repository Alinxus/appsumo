import Link from 'next/link'

interface CategoriesSectionProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    iconUrl: string | null
  }>
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore AI Tool Categories
          </h2>
          <p className="text-xl text-gray-600">
            Find the perfect AI tools for your specific needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-white border border-gray-200 rounded-2xl text-center hover:bg-black/5 hover:shadow-lg hover:border-black/20 transition-all duration-300"
            >
              <div className="mb-4">
                {category.iconUrl ? (
                  <img src={category.iconUrl} alt={category.name} className="w-12 h-12 mx-auto" />
                ) : (
                  <div className="w-12 h-12 mx-auto bg-black/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors mb-2">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 
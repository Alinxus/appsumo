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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-gray-50 rounded-lg text-center hover:bg-green-50 hover:shadow-md transition-all duration-200"
            >
              <div className="text-4xl mb-3">
                {category.iconUrl || '📁'}
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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
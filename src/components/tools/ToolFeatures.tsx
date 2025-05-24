interface ToolFeaturesProps {
  tool: {
    id: string
    name: string
    description: string | null
    specifications: any
    requirements: string | null
    features: string[]
    demoUrl: string | null
    websiteUrl: string | null
    licenseType: string | null
  }
}

export function ToolFeatures({ tool }: ToolFeaturesProps) {
  const specifications = tool.specifications ? 
    (typeof tool.specifications === 'string' ? JSON.parse(tool.specifications) : tool.specifications) 
    : null

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {tool.name}</h2>
              <div className="prose prose-lg max-w-none">
                {tool.description ? (
                  <div dangerouslySetInnerHTML={{ __html: tool.description.replace(/\n/g, '<br>') }} />
                ) : (
                  <p className="text-gray-600">
                    {tool.name} is a powerful AI tool designed to boost your productivity and streamline your workflow. 
                    Get lifetime access to all features with our exclusive deal.
                  </p>
                )}
              </div>
            </div>

            {tool.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tool.demoUrl && (
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">See it in action</h3>
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <a 
                    href={tool.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {specifications && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deal Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lifetime access to {tool.name}
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {tool.licenseType || 'Commercial'} license included
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No monthly fees ever
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  60-day money-back guarantee
                </li>
              </ul>
            </div>

            {tool.requirements && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <p className="text-sm text-gray-700">{tool.requirements}</p>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-2">🔥 Limited Time Offer</h3>
              <p className="text-sm text-orange-800">
                This exclusive deal won't last forever. Get lifetime access now before the price goes back to regular.
              </p>
            </div>

            {tool.websiteUrl && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Learn More</h3>
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Visit Official Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
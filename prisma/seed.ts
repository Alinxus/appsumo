import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminEmail = 'admin@aisumo.com'
  
  const existingAdmin = await prisma.profile.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const admin = await prisma.profile.create({
      data: {
        email: adminEmail,
        fullName: 'Admin User',
        role: 'ADMIN',
      },
    })
    console.log('✅ Created admin user:', admin.email)
  } else {
    console.log('ℹ️  Admin user already exists')
  }

  const categories = [
    {
      name: 'AI Writing',
      slug: 'ai-writing',
      description: 'AI-powered writing and content creation tools',
      iconUrl: '✍️'
    },
    {
      name: 'Image Generation',
      slug: 'image-generation', 
      description: 'AI tools for creating and editing images',
      iconUrl: '🎨'
    },
    {
      name: 'Analytics',
      slug: 'analytics',
      description: 'AI-driven analytics and data insights',
      iconUrl: '📊'
    },
    {
      name: 'Automation',
      slug: 'automation',
      description: 'AI workflow automation tools',
      iconUrl: '🤖'
    },
    {
      name: 'Video & Audio',
      slug: 'video-audio',
      description: 'AI tools for video and audio creation',
      iconUrl: '🎬'
    },
    {
      name: 'Development',
      slug: 'development',
      description: 'AI coding and development assistance',
      iconUrl: '💻'
    }
  ]

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existing) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Created category: ${category.name}`)
    } else {
      console.log(`ℹ️  Category ${category.name} already exists`)
    }
  }

  const settings = await prisma.adminSettings.findFirst()
  if (!settings) {
    await prisma.adminSettings.create({
      data: {
        siteName: 'AIsumo',
        siteDescription: 'Discover the best AI tools for your business at unbeatable prices.',
        heroTitle: 'Discover AI Tools. Stay Innovative.',
        heroSubtitle: 'Top AI software deals for entrepreneurs at incredible prices. Lifetime access to premium tools with no monthly fees.',
        primaryColor: '#00bf63',
        accentColor: '#ff6b35',
      }
    })
    console.log('✅ Created admin settings')
  } else {
    console.log('ℹ️  Admin settings already exist')
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
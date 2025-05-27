import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '@/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        
        const userProfile = await db.profile.findUnique({
          where: { email: user.email! }
        })
        
        if (userProfile) {
          token.role = userProfile.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existingProfile = await db.profile.findUnique({
            where: { email: user.email! }
          })

          if (!existingProfile) {
            await db.profile.create({
              data: {
                email: user.email!,
                fullName: user.name,
                role: 'USER'
              }
            })
          }
        } catch (error) {
          console.error('Error creating profile:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
} 
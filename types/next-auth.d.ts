
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      phone?: string | null
      document?: string | null
      countryId?: string | null
      createdAt?: Date
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
    phone?: string | null
    document?: string | null
    countryId?: string | null
    createdAt?: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    phone?: string | null
    document?: string | null
    countryId?: string | null
    createdAt?: Date
  }
}

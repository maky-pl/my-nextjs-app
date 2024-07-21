import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';

interface User {
  id: string;
  name: string;
}

// Initialize the Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

declare module 'next-auth' {
  interface Session {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials?.username === 'admin' && credentials?.password === 'password') {
          const user: User = { id: '1', name: 'Admin' };
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(options);

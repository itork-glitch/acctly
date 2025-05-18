// app/api/auth/[...nextauth]/route.ts
import { NextRequest } from 'next/server';
import NextAuth, { AuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { verifyPassword } from '@/lib/auth';

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_KEY,
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database', // 'database' jest akceptowany przez AuthOptions
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('id, email, passwordHash')
          .eq('email', credentials.email)
          .single();

        if (error || !user) return null;

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login?error',
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      session.user.id = user.id;
      return session;
    },
  },
};

// NextAuth zwraca funkcję typu (req) => NextResponse
const handler = NextAuth(authOptions);

// Eksportujemy ją bez default, jako named exports dla GET i POST
export { handler as GET, handler as POST };

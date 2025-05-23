import { AuthOptions, Session, User } from 'next-auth';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { verifyPassword } from '@/lib/pass';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_KEY!,
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
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

        try {
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, email, passwordHash')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            console.error('User not found: ', error?.message);
            return null;
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.passwordHash
          );

          if (!isValid) {
            console.error('Invalid password for user:', credentials.email);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error('Authorization error: ', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login?error',
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user id to token for JWT strategy
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};

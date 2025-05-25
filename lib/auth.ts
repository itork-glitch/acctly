import { AuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { verifyPassword } from '@/lib/encrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          if (authError || !authData.user) return null;

          const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, username, email, avatar_url, created_at')
            .eq('id', authData.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data: ', userError);
            return null;
          }

          if (!userData) return null;

          return {
            id: userData.id,
            email: userData.email,
            name: userData.username,
            image: userData.avatar_url,
          };
        } catch (error) {
          console.error('Auth error: ', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      if (trigger === 'update' && session) {
        token.name = session.name || token.name;
        token.picture = session.image || token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    //signUp: '/auth/signup',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
};

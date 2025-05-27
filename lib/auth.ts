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
          // First, authenticate with Supabase Auth
          const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          if (authError || !authData.user) {
            console.error('Supabase auth error:', authError);
            return null;
          }

          // Then fetch user data from your custom table
          const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, username, email, avatar_url, created_at')
            .eq('id', authData.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);

            // If user doesn't exist in custom table, create them
            if (userError.code === 'PGRST116') {
              console.log('User not found in custom table, creating...');

              // This should not happen if signup worked correctly
              // But we'll create a fallback entry
              const fallbackUsername =
                authData.user.email?.split('@')[0] || 'user';
              const { data: newUserData, error: insertError } =
                await supabaseAdmin
                  .from('users')
                  .insert({
                    id: authData.user.id,
                    username: fallbackUsername,
                    email: authData.user.email,
                    avatar_url: `/api/avatar?username=${encodeURIComponent(
                      fallbackUsername
                    )}`,
                    created_at: new Date().toISOString(),
                  })
                  .select('id, username, email, avatar_url, created_at')
                  .single();

              if (insertError) {
                console.error(
                  'Error creating user in custom table:',
                  insertError
                );
                return null;
              }

              return {
                id: newUserData.id,
                email: newUserData.email,
                name: newUserData.username,
                image: newUserData.avatar_url,
              };
            }

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
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT!,
      clientSecret: process.env.GOOGLE_SECRET!,
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
    signIn: '/login', // Changed from '/auth/login' to match your actual login page
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
};

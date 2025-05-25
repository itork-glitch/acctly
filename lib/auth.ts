import { AuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { supabaseAdmin } from '@/utils/supabase/admin';
import bcrypt from 'bcrypt';

// Hash password function
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password function
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_KEY!,
  }),
  secret: process.env.NEXTAUTH_SECRET!,
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
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, email, password, username')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            console.error('User not found:', error?.message);
            return null;
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.error('Invalid password for user:', credentials.email);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username, // using username from database
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
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
    async redirect({ url, baseUrl }) {
      // Redirect to /account after successful login
      if (url === baseUrl || url === `${baseUrl}/login`) {
        return `${baseUrl}/account`;
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/account`;
    },
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch username from database and add to session
        try {
          const { data: userData, error } = await supabaseAdmin
            .from('users')
            .select('username')
            .eq('id', user.id)
            .single();

          if (!error && userData?.username) {
            session.user.name = userData.username;
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};

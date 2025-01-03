import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from './lib/client';

interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// User interface represents the user data returned by Supabase
interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// Token interface represents the JWT token, which is used to store the user data
interface JWT {
  id: string;
  email: string;
  name?: string;
  image?: string;
  iat?: number;  // Issued at time
  exp?: number;  // Expiration time
}

const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        console.log('\n\n\n\n authorize called....')
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if credentials are missing
        }

        try {
          // Authenticate with Supabase using email/password
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.toString(),
            password: credentials.password.toString(),
          });

          if (error) {
            console.error('Authentication error:', error.message);
            return null; // If there's an error, return null
          }

          // Return user data if authentication is successful
          if (data?.user) {
            const supabaseUser: SupabaseUser = {
              id: data.user.id,
              email: data.user.email ?? '',
              name: data.user.user_metadata?.full_name,
              image: data.user.user_metadata?.avatar_url,
            };
            return supabaseUser;
          }

          return null; // Return null if no user found
        } catch (err) {
          console.error('Error during authorization:', err);
          return null; // Return null on error
        }
      },
    }),
  ],

  pages: {
    signIn: '/', // Custom sign-in page (optional)
  },

  callbacks: {
    // Callback to add custom data to the JWT token
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    // Callback to attach user data from JWT to session
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },

  // Session configuration
  session: {
    jwt: true, // Use JWT for session (recommended for scalability)
    maxAge: 30 * 24 * 60 * 60, // Session maxAge in seconds (30 days)
  },
};

export default authConfig;

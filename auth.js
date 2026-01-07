import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { User } from "./model/user-model";

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await User.findOne({ email: credentials.email }).lean();

          if (!user) {
            console.error("User not found");
            throw new Error("User not found");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isMatch) {
            console.error("Password mismatch");
            throw new Error("Incorrect password");
          }

          // Return a plain JS object (no Mongoose document)
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          };
        } catch (err) {
          console.error("Credentials authorize error:", err);
          throw new Error(err?.message || "Login failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // 1. First time JWT is created (login: Google or Credentials)
      if (user) {
        token.user = {
          id: user.id || user._id || token.user?.id,
          email: user.email,
          firstName: user.firstName || token.user?.firstName,
          lastName: user.lastName || token.user?.lastName,
        };
      }

      // 2. Provider-specific handling (Google)
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || token.refreshToken;
        token.accessTokenExpires =
          Date.now() +
          (account.expires_in ? account.expires_in * 1000 : 3600 * 1000);
      }

      // 3. If Google access token expired, try refresh
      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() >= token.accessTokenExpires &&
        token.refreshToken
      ) {
        return refreshAccessToken(token);
      }

      // For credentials login, just keep token as is
      return token;
    },

    async session({ session, token }) {
      session.user = token.user || null;
      session.accessToken = token.accessToken || null;
      session.error = token.error || null;
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none", // important for cross-site redirect (e.g. Stripe)
        secure: true, // must be HTTPS in production
        path: "/",
      },
    },
  },
});

// import CredentialProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialProvider({
//       name: "Credentials",
//       type: "credentials",
//       credentials: {},
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         try {
//           const res = await fetch(`${process.env.API_URL}/admin/auth/signin`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//           });

//           if (!res.ok) {
//             const errorText = await res.text();
//             throw new Error(errorText);
//           }

//           const data = await res.json();

//           if (data.ResponseStatus === "failure") {
//             throw new Error(data.Message || "Login failed");
//           }

//           if (data.ResponseStatus === "success") {
//             const user = {
//               id: data.ResponseData.UserId,
//               name: data.ResponseData.Username,
//               email,
//               token: data.ResponseData.Token,
//               refresh_token: data.ResponseData.RefreshToken,
//               tokenExpiry: data.ResponseData.TokenExpiry,
//               refreshTokenExpiry: data.ResponseData.RefreshTokenExpiry,
//             };
//             return user;
//           }

//           throw new Error("Unexpected response status");
//         } catch (e: any) {
//           throw new Error(e.message);
//         }
//       },
//     }),
//   ],
//   secret: process.env.AUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.id = user.userId;
//         token.name = user.userName;
//         token.email = user.email;
//         token.token = user.token;
//         token.refresh_token = user.refresh_token;
//         token.tokenExpiry = user.tokenExpiry;
//         token.refreshTokenExpiry = user.refreshTokenExpiry || 0;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (token) {
//         session.user.id = token.id || token.sub;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.token = token.token;
//         session.user.refresh_token = token.refresh_token;
//         session.user.tokenExpiry = token.tokenExpiry;
//         session.user.refreshTokenExpiry = token.refreshTokenExpiry;
//       }
//       return session;
//     },
//   },
// };

import CredentialProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { promises as fs } from "fs";
import path from "path";

const loadMockData = async () => {
  const filePath = path.join(process.cwd(), "mockData.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data).users;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password, otp } = credentials as {
          email: string;
          password?: string;
          otp?: string;
        };

        const users = await loadMockData();
        const user = users.find((u: any) => u.email === email);

        if (!user) {
          throw new Error("Invalid email");
        }

        if (password) {
          // This is the initial login attempt
          if (user.password === password) {
            console.log(`Sending OTP to: ${email}`); // Mock sending OTP
            return { ...user, requiresOtp: true };
          } else {
            throw new Error("Invalid password");
          }
        } else if (otp) {
          // This is the OTP verification step
          if (user.otp === otp) {
            return {
              id: 1,
              email: user.email,
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTl9.8UI478RcHqWdmwE4oaBRIg3l5spIKT1SJZ9uQygYwa0",
              refresh_token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTksImV4cCI6MTcyODg5MDc5OX0.OFFeJx0BO8WLVhS6NLnRcfPcxqHCPxRAyg4fbMusq6o",
              tokenExpiry: "2024-10-08T07:26:39.000Z",
              refreshTokenExpiry: "2024-10-14T07:26:39.000Z",
            };
          } else {
            throw new Error("Invalid OTP");
          }
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};

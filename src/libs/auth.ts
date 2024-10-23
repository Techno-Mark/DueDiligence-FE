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
        const { email, password, phoneNumber, otp } = credentials as {
          email?: string;
          password?: string;
          phoneNumber?: string;
          otp?: string;
        };

        const users = await loadMockData();
        let user;

        // Handle email login
        if (email) {
          user = users.find((u: any) => u.email === email);
          if (!user) {
            throw new Error("Invalid email");
          }

          if (password && user.password === password) {

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTl9.8UI478RcHqWdmwE4oaBRIg3l5spIKT1SJZ9uQygYwa0",
              refresh_token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTksImV4cCI6MTcyODg5MDc5OX0.OFFeJx0BO8WLVhS6NLnRcfPcxqHCPxRAyg4fbMusq6o",
              tokenExpiry: "2024-10-08T07:26:39.000Z",
              refreshTokenExpiry: "2024-10-14T07:26:39.000Z",
              role: user.role,
            };
          } else {
            throw new Error("Invalid password");
          }
        }

        // Handle phone number login
        else if (phoneNumber) {
          user = users.find((u: any) => u.phoneNumber === phoneNumber);
          if (!user) {
            throw new Error("Invalid phone number");
          }

          // Check password first
          if (password && user.password === password) {
            if (user.otp === otp) {
              if (user.otp === otp) {
                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTl9.8UI478RcHqWdmwE4oaBRIg3l5spIKT1SJZ9uQygYwa0",
                  refresh_token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTksImV4cCI6MTcyODg5MDc5OX0.OFFeJx0BO8WLVhS6NLnRcfPcxqHCPxRAyg4fbMusq6o",
                  tokenExpiry: "2024-10-08T07:26:39.000Z",
                  refreshTokenExpiry: "2024-10-14T07:26:39.000Z",
                  role: user.role,
                };
              } else {
                throw new Error("Invalid OTP");
              }
            } else {
              console.log(`Sending OTP to: ${phoneNumber}`);
              return { ...user, requiresOtp: true }; 
            }
          } else if (otp) {
           
            if (user.otp === otp) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTl9.8UI478RcHqWdmwE4oaBRIg3l5spIKT1SJZ9uQygYwa0",
                refresh_token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImZ3X3N1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJpYXQiOjE3MjgyODU5OTksImV4cCI6MTcyODg5MDc5OX0.OFFeJx0BO8WLVhS6NLnRcfPcxqHCPxRAyg4fbMusq6o",
                tokenExpiry: "2024-10-08T07:26:39.000Z",
                refreshTokenExpiry: "2024-10-14T07:26:39.000Z",
                role: user.role,
              };
            } else {
              throw new Error("Invalid OTP");
            }
          } else {
            throw new Error("Invalid password"); 
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

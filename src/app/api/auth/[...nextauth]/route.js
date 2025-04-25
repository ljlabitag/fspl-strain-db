import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Check if the user's email exists in the database
            const email = user.email;
            const personnel = await prisma.personnel.findUnique({
                where: { email_address: email },
            });

            if (!personnel) {
                console.warn(`Unauthorized login attempt by ${email}`);
                return false; // Reject sign-in
            }

            // Attach personnel data to the user object for later use
            user.personnel = personnel;
            return true; // Allow sign-in
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.personnel?.role || 'research_assistant';
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.role = token.role || 'research_assistant';
            }
            return session;
        }
    },
    secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
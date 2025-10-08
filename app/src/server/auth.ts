import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as mySchema from "../db/auth-schema"
import "dotenv/config"

export const server_auth = betterAuth({

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: mySchema,
    }),

    trustedOrigins: [
        "http://localhost:3000"
    ],

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'],
            // this gets the refresh token
            accessType: "offline",
            prompt: "select_account consent",
        },
    },


});

export default server_auth;
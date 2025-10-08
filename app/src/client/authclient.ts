import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
    socialProviders: {
        google: {
            scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'],
            accessType: "offline",
            prompt: "select_account consent",
        },
    },
})

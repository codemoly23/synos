import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// helper exports
export const { signIn, signUp, signOut, getSession, useSession } = authClient;

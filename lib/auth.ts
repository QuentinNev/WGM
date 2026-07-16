import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "./db";
import { resend, FROM_EMAIL } from "./resend";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Votre code de connexion - Wargame Matchmaker",
          text: `Votre code de connexion est : ${otp}\n\nCe code expire dans 5 minutes.`,
        });
        if (error) throw new Error(`Resend error: ${error.message}`);
      },
    }),
  ],
});

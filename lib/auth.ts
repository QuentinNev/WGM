import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "./db";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ?? "no-reply@wargame-matchmaker.com",
          to: email,
          subject: "Votre code de connexion - Wargame Matchmaker",
          text: `Votre code de connexion est : ${otp}\n\nCe code expire dans 5 minutes.`,
        });
      },
    }),
  ],
});

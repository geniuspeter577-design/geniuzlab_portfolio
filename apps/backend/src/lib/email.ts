import nodemailer from "nodemailer";
import { env } from "./env";

export function hasSmtpConfiguration(): boolean {
  return Boolean(
    env.SMTP_HOST &&
      env.SMTP_FROM &&
      (Boolean(env.SMTP_USER) === Boolean(env.SMTP_PASSWORD))
  );
}

export async function sendAdminPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!hasSmtpConfiguration()) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_USER
      ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }
      : {}),
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Reset your GENIUZLAB admin password",
    text: `Use this link to reset your admin password. It expires in 30 minutes.\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use the link below to reset your admin password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset admin password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}
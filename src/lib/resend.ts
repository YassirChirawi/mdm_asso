import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Extremely defensive initialization to prevent build-time crashes on Vercel
export const resend = (resendApiKey && resendApiKey.trim() !== "") 
  ? new Resend(resendApiKey) 
  : null as any;

if (!resend && process.env.NODE_ENV === "production") {
  console.warn("⚠️ Resend API Key is missing. Email functionality will be disabled.");
}

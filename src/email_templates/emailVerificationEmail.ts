import { createMasterEmailLayout } from './masterLayout';

export const createVerificationEmailHtml = ({ customerName, otp }: { customerName: string, otp: string }): string => {
  const bodyHtml = `
    <p>Hi ${customerName},</p>
    <p>Thanks for signing up! Please use the following One-Time Password (OTP) to verify your email address and complete your registration.</p>
    <div style="text-align:center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #f3f4f6; color: #111827; padding: 15px 30px; font-size: 36px; font-weight: bold; letter-spacing: 10px; border-radius: 8px; border: 1px solid #d1d5db;" class="dark-card dark-border dark-text">${otp}</span>
    </div>
    <p style="font-size: 14px; color: #6b7280;" class="dark-subtext">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
  `;
  return createMasterEmailLayout({ 
    preheaderText: `Your verification code is ${otp}`,
    headerText: "Verify Your Email", 
    bodyHtml 
  });
};
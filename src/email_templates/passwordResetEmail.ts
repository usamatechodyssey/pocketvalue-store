import { createMasterEmailLayout } from './masterLayout';

export function createPasswordResetHtml(data: { customerName: string, resetLink: string }): string {
    const bodyHtml = `
      <p>Hi ${data.customerName},</p>
      <p>We received a request to reset your password for your PocketValue account. If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please click the button below. This link is valid for 10 minutes.</p>
      <p style="text-align:center; margin: 30px 0;">
        <a href="${data.resetLink}" style="display: inline-block; background-color: #F97316; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Your Password</a>
      </p>
    `;
    return createMasterEmailLayout({ 
        preheaderText: 'Reset your password for your PocketValue account.',
        headerText: "Password Reset Request", 
        bodyHtml 
    });
}
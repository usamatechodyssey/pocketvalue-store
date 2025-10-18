import { createMasterEmailLayout } from './masterLayout';

export const createWelcomeEmailHtml = ({ customerName }: { customerName: string }): string => {
  const bodyHtml = `
    <p>Hi ${customerName},</p>
    <p>Thank you for joining the PocketValue family! We're thrilled to have you on board.</p>
    <p>You can now explore thousands of products, enjoy exclusive deals, and experience seamless shopping right at your fingertips.</p>
    <p style="text-align:center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display: inline-block; background-color: #F97316; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping Now</a>
    </p>
  `;
  return createMasterEmailLayout({
    preheaderText: "We're thrilled to have you on board!",
    headerText: "Welcome to PocketValue!",
    bodyHtml 
  });
};
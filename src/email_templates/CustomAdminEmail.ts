import { createMasterEmailLayout } from './masterLayout';

export const createCustomAdminEmailHtml = (data: { customerName: string; message: string; }) => {
  const formattedMessage = data.message.replace(/\n/g, "<br />");
  const bodyHtml = `
    <p>Hi ${data.customerName},</p>
    <p>${formattedMessage}</p>
    <br/>
    <p>Warm regards,<br/>The PocketValue Team</p>
  `;
  return createMasterEmailLayout({ 
    preheaderText: 'A special message regarding your account.',
    headerText: "A Message from PocketValue", 
    bodyHtml 
  });
};
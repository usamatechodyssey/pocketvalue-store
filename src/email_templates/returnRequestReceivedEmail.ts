// /src/email_templates/returnRequestReceivedEmail.ts

import { createMasterEmailLayout } from './masterLayout';

interface RequestData {
  customerName: string;
  orderNumber: string;
  requestId: string; // Return request ki ID
}

export function createReturnRequestReceivedEmail({ customerName, orderNumber, requestId }: RequestData): string {
  
  const bodyHtml = `
    <p>Hi ${customerName},</p>
    <p>We've successfully received your return request for items from order <strong>${orderNumber}</strong>. Our team will review your request shortly.</p>
    <p>Your request ID is <strong>#${requestId.slice(-6).toUpperCase()}</strong>. You will receive another email as soon as there is an update on your request status.</p>
    <p>Thank you for your patience.</p>
  `;
  
  return createMasterEmailLayout({
    preheaderText: `We have received your return request for order ${orderNumber}.`,
    headerText: "Return Request Received",
    bodyHtml,
  });
}
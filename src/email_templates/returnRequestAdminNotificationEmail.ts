// /src/email_templates/returnRequestAdminNotificationEmail.ts

import { createMasterEmailLayout } from './masterLayout';

interface AdminNotificationData {
  orderNumber: string;
  requestId: string;
  customerName: string;
  itemCount: number;
}

export function createReturnRequestAdminNotificationEmail({ orderNumber, requestId, customerName, itemCount }: AdminNotificationData): string {
  
  // Admin panel mein request detail page ka direct link
  const reviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/Bismillah786/returns/${requestId}`;

  const bodyHtml = `
    <p>A new return request has been submitted by a customer.</p>
    
    <h3 style="color: #1F2937; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;" class="dark-text dark-border">Request Details:</h3>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
      <tr>
        <td style="padding: 5px 0; color: #6B7280;" class="dark-subtext">Customer:</td>
        <td style="padding: 5px 0; font-weight: bold; color: #1F2937;" class="dark-text">${customerName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6B7280;" class="dark-subtext">Original Order #:</td>
        <td style="padding: 5px 0; font-weight: bold; color: #1F2937;" class="dark-text">${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6B7280;" class="dark-subtext">Items to Return:</td>
        <td style="padding: 5px 0; font-weight: bold; color: #1F2937;" class="dark-text">${itemCount}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6B7280;" class="dark-subtext">Request ID:</td>
        <td style="padding: 5px 0; font-weight: bold; color: #1F2937;" class="dark-text">#${requestId.slice(-6).toUpperCase()}</td>
      </tr>
    </table>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
      <tr>
        <td align="center">
          <a href="${reviewLink}" target="_blank" style="background-color: #F97316; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Review Request Now
          </a>
        </td>
      </tr>
    </table>
  `;
  
  return createMasterEmailLayout({
    preheaderText: `New return request from ${customerName} for order ${orderNumber}.`,
    headerText: "New Return Request",
    bodyHtml,
  });
}
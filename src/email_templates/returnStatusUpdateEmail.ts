// /src/email_templates/returnStatusUpdateEmail.ts

import { createMasterEmailLayout } from './masterLayout';

interface StatusUpdateData {
  customerName: string;
  orderNumber: string;
  requestId: string;
  // --- YAHAN BEHTARI KI GAYI HAI ---
  newStatus: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected'; // 'Pending' shamil kiya gaya
  resolution?: string | null;
  adminComments?: string | null;
}

export function createReturnStatusUpdateEmail({ customerName, orderNumber, requestId, newStatus, resolution, adminComments }: StatusUpdateData): string {
  
  let headerText = `Request #${requestId.slice(-6).toUpperCase()} Updated`;
  let mainMessage = '';
  let detailsHtml = '';

  // Status ke mutabiq message aur details banayein
  switch (newStatus) {
    case 'Approved':
      headerText = 'Your Return Request has been Approved!';
      mainMessage = `<p>Good news! Your return request for order <strong>${orderNumber}</strong> has been approved.</p>`;
      if (resolution) {
        let resolutionText = '';
        if (resolution === 'Refund') resolutionText = 'A refund will be processed to your original payment method within 5-7 business days.';
        else if (resolution === 'StoreCredit') resolutionText = 'Store credit has been added to your account. You can use it on your next purchase.';
        else if (resolution === 'Replacement') resolutionText = 'A replacement item will be shipped to your original address shortly. You will receive a separate shipping confirmation email.';
        
        detailsHtml = `<h3 style="color: #1F2937; margin-top: 20px;" class="dark-text">Resolution:</h3><p>${resolutionText}</p>`;
      }
      break;
    
    case 'Processing':
      headerText = 'Your Return is Being Processed';
      mainMessage = `<p>Your approved return for order <strong>${orderNumber}</strong> is now being processed by our team.</p><p>We will notify you again once the process is complete.</p>`;
      break;
      
    case 'Completed':
      headerText = 'Your Return is Complete';
      mainMessage = `<p>The return process for your items from order <strong>${orderNumber}</strong> is now complete.</p><p>If you have any further questions, please feel free to contact our support team.</p>`;
      break;
      
    case 'Rejected':
      headerText = 'Update on Your Return Request';
      mainMessage = `<p>We're writing to provide an update on your return request for order <strong>${orderNumber}</strong>. After careful review, we were unable to approve your request at this time.</p>`;
      if (adminComments) {
        detailsHtml = `
          <h3 style="color: #1F2937; margin-top: 20px;" class="dark-text">Reason:</h3>
          <div style="background-color: #F9FAFB; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-style: italic;" class="dark-card dark-border">
            <p style="margin: 0;">${adminComments}</p>
          </div>
        `;
      }
      mainMessage += `<p>If you believe this is an error or have further questions, please reply to this email.</p>`;
      break;

    // 'Pending' ke liye case zaroori nahi, kyunke aam taur par hum user ko 'Pending' ka email nahi bhejte.
    // Lekin type mein iska hona zaroori hai taake compatibility बनी rahe.
  }

  const bodyHtml = `
    <p>Hi ${customerName},</p>
    ${mainMessage}
    ${detailsHtml}
  `;
  
  return createMasterEmailLayout({
    preheaderText: `An update on your return request #${requestId.slice(-6).toUpperCase()}: ${newStatus}.`,
    headerText: headerText,
    bodyHtml,
  });
}
import { createMasterEmailLayout } from './masterLayout';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const createContactFormAdminEmail = (data: ContactFormData) => {
  const { name, email, subject, message } = data;

  const bodyHtml = `
    <p style="margin: 0 0 20px;" class="dark-text">You have a new message from the website contact form. Please respond as soon as possible.</p>
    
    <h3 style="color: #1F2937; margin-top: 30px; margin-bottom: 10px;" class="dark-text">Submission Details</h3>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff; padding: 20px;" class="dark-card dark-border">
      <tr>
        <td style="padding: 8px; font-weight: bold; width: 100px; color: #4B5563;" class="dark-text">Name:</td>
        <td style="padding: 8px; color: #1F2937;" class="dark-text">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; width: 100px; color: #4B5563;" class="dark-text">Email:</td>
        <td style="padding: 8px;"><a href="mailto:${email}" style="color: #F97316; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; width: 100px; color: #4B5563;" class="dark-text">Subject:</td>
        <td style="padding: 8px; color: #1F2937;" class="dark-text">${subject}</td>
      </tr>
    </table>

    <h3 style="color: #1F2937; margin-top: 30px; margin-bottom: 10px;" class="dark-text">Message Content</h3>
    <div style="background-color: #F9FAFB; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; color: #4B5563;" class="dark-card dark-border dark-text">
        <p style="margin: 0;">${message.replace(/\n/g, "<br>")}</p>
    </div>
  `;

  return createMasterEmailLayout({
    preheaderText: `New message from ${name} about "${subject}"`,
    headerText: 'New Contact Form Message',
    bodyHtml,
  });
};
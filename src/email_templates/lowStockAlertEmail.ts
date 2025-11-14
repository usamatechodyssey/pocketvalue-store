// /src/email_templates/lowStockAlertEmail.ts

import { createMasterEmailLayout } from './masterLayout'; // Import your master layout

interface LowStockItem {
    _id: string;
    title: string;
    slug: string;
    variant: {
        name: string;
        sku?: string;
        stock: number;
    };
}

interface LowStockAlertProps {
    lowStockItems: LowStockItem[];
}

export const createLowStockAlertHtml = ({ lowStockItems }: LowStockAlertProps): string => {
    const adminBaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/Bismillah786/products`;

    // --- Step 1: Build only the BODY of the email ---
    const bodyHtml = `
        <p style="margin-bottom: 20px;">The following items in your inventory have reached the low stock threshold and require your attention.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
            <thead>
                <tr style="background-color: #f9fafb;" class="dark-card">
                    <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;" class="dark-border dark-text">Product</th>
                    <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;" class="dark-border dark-text">Stock Left</th>
                    <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;" class="dark-border dark-text">Action</th>
                </tr>
            </thead>
            <tbody>
                ${lowStockItems.map(item => `
                    <tr style="border-bottom: 1px solid #e5e7eb;" class="dark-border">
                        <td style="padding: 12px 10px;">
                            <p style="margin: 0; font-weight: bold; color: #1f2937;" class="dark-text">${item.title}</p>
                            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;" class="dark-subtext">${item.variant.name}</p>
                            <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;" class="dark-subtext">SKU: ${item.variant.sku || 'N/A'}</p>
                        </td>
                        <td style="padding: 12px 10px; text-align: center; font-weight: bold; font-size: 16px; color: #ef4444;">
                            ${item.variant.stock}
                        </td>
                        <td style="padding: 12px 10px; text-align: center;">
                            <a href="${adminBaseUrl}/${item.slug}/edit" target="_blank" style="background-color: #f97316; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">
                                Manage
                            </a>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // --- Step 2: Pass the body and other details to the master layout ---
    return createMasterEmailLayout({
        preheaderText: `${lowStockItems.length} items are running low on stock.`,
        headerText: "Low Stock Alert",
        bodyHtml: bodyHtml
    });
};
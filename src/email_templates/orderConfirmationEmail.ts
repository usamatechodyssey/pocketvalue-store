import { CleanCartItem } from "@/sanity/types/product_types";
import { createMasterEmailLayout } from './masterLayout';

interface ShippingAddress { fullName: string; address: string; area: string; city: string; province: string; phone: string; }
interface OrderData { orderId: string; customerName: string; products: CleanCartItem[]; totalPrice: number; shippingAddress: ShippingAddress; }

export function createOrderConfirmationHtml(orderData: OrderData): string {
  
  const productsHtml = orderData.products.map(p => `
    <tr>
      <td style="padding: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #1F2937;" class="dark-text">${p.name}</p>
        ${p.variant?.name ? `<p style="margin: 4px 0 0; font-size: 12px; color: #6B7280;" class="dark-subtext">Variant: ${p.variant.name}</p>` : ''}
        <p style="margin: 4px 0 0; font-size: 12px; color: #6B7280;" class="dark-subtext">Qty: ${p.quantity}</p>
      </td>
      <td style="text-align: right; font-weight: bold; color: #1F2937;" class="dark-text">Rs. ${(p.price * p.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const bodyHtml = `
    <p>Hi ${orderData.customerName},</p>
    <p>We've received your order and are getting it ready for shipment. You'll receive another email once your order has shipped.</p>
    
    <h3 style="color: #1F2937; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;" class="dark-text dark-border">Order Summary</h3>
    <p style="font-size: 14px; color: #6B7280;" class="dark-subtext">Order ID: <strong style="color: #1F2937; font-family: monospace;" class="dark-text">#${orderData.orderId.slice(-8).toUpperCase()}</strong></p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      ${productsHtml}
    </table>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; border-top: 2px solid #e5e7eb;" class="dark-border">
      <tr><td style="padding: 8px 0;">Subtotal:</td><td style="text-align: right;">Rs. ${orderData.totalPrice.toLocaleString()}</td></tr>
      <tr><td style="padding: 8px 0;">Shipping:</td><td style="text-align: right; color: #16A34A;" class="dark-text">FREE</td></tr>
      <tr style="font-weight: bold; font-size: 18px; color: #1F2937;" class="dark-text">
          <td style="padding: 15px 0 0;">Grand Total:</td>
          <td style="text-align: right; padding: 15px 0 0;">Rs. ${orderData.totalPrice.toLocaleString()}</td>
      </tr>
    </table>

    <h3 style="color: #1F2937; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;" class="dark-text dark-border">Shipping to:</h3>
    <div style="background-color: #F9FAFB; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-size: 14px;" class="dark-card dark-border">
      <p style="margin: 0; font-weight: bold; color: #1F2937;" class="dark-text">${orderData.shippingAddress.fullName}</p>
      <p style="margin: 4px 0 0;">${orderData.shippingAddress.address}, ${orderData.shippingAddress.area}<br>${orderData.shippingAddress.city}, ${orderData.shippingAddress.province}</p>
      <p style="margin: 4px 0 0;">Phone: ${orderData.shippingAddress.phone}</p>
    </div>
  `;
  
  return createMasterEmailLayout({
    preheaderText: `Your order #${orderData.orderId.slice(-8).toUpperCase()} has been confirmed!`,
    headerText: "Thank You For Your Order!",
    bodyHtml,
  });
}
import { createMasterEmailLayout } from './masterLayout';

export function createOrderProcessingHtml(data: { customerName: string; orderId: string; }) {
    const bodyHtml = `<p>Hi ${data.customerName},</p><p>Good news! We have started processing your order <strong>#${data.orderId.slice(-6).toUpperCase()}</strong>. We're carefully preparing your items for shipment and will notify you once it's on its way.</p>`;
    return createMasterEmailLayout({ preheaderText: `Your order #${data.orderId.slice(-6).toUpperCase()} is being processed.`, headerText: "Order is Being Processed!", bodyHtml });
}

export function createOrderShippedHtml(data: { customerName: string; orderId: string; }) {
    const bodyHtml = `<p>Hi ${data.customerName},</p><p>Great news! Your PocketValue order <strong>#${data.orderId.slice(-6).toUpperCase()}</strong> has been shipped and is heading your way.</p><p style="text-align:center; margin: 30px 0;"><a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${data.orderId}" style="display: inline-block; background-color: #F97316; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Your Order</a></p>`;
    return createMasterEmailLayout({ preheaderText: `Good news! Your order #${data.orderId.slice(-6).toUpperCase()} has shipped.`, headerText: "Your Order is on its Way!", bodyHtml });
}

export function createOrderDeliveredHtml(data: { customerName: string; orderId: string; }) {
    const bodyHtml = `<p>Hi ${data.customerName},</p><p>Our records show that your PocketValue order <strong>#${data.orderId.slice(-6).toUpperCase()}</strong> has been successfully delivered. We hope you enjoy your items! We'd love to hear your feedback.</p>`;
    return createMasterEmailLayout({ preheaderText: `Your order #${data.orderId.slice(-6).toUpperCase()} has been delivered.`, headerText: "Your Order Has Been Delivered!", bodyHtml });
}

export function createOrderCancelledHtml(data: { customerName: string; orderId: string; }) {
    const bodyHtml = `<p>Hi ${data.customerName},</p><p>This email is to confirm that your order <strong>#${data.orderId.slice(-6).toUpperCase()}</strong> has been cancelled. If you have any questions, please don't hesitate to contact our support team.</p>`;
    return createMasterEmailLayout({ preheaderText: `Confirmation of order #${data.orderId.slice(-6).toUpperCase()} cancellation.`, headerText: "Order Cancellation Notice", bodyHtml });
}
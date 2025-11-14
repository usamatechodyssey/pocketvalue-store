// /src/app/account/orders/[orderId]/_components/InvoiceTemplate.tsx

import { Page, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { IOrder } from "@/models/Order";

// Naye, chotay components ko import karein (usi folder se)
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceAddress } from "./InvoiceAddress";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { InvoiceSummary } from "./InvoiceSummary";
import { InvoiceFooter } from "./InvoiceFooter";

// Fonts aur styles yahin define honge
Font.register({
  family: "Inter",
  fonts: [
    { src: `${process.cwd()}/public/fonts/Inter-Regular.otf` },
    { src: `${process.cwd()}/public/fonts/Inter-Bold.otf`, fontWeight: "bold" },
  ],
});

const BRAND_COLOR = "#f97316";

// Styles ko ek hi jagah rakhein taake tamam child components mein pass kiya ja sake
const styles = StyleSheet.create({
  page: { fontFamily: "Inter", fontSize: 10, padding: 40, color: "#1f2937" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  companyDetails: { maxWidth: "50%" },
  logo: { width: 80, height: 80, objectFit: "contain" },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 6,
  },
  companyAddress: { fontSize: 9, color: "#4b5563", lineHeight: 1.4 },
  invoiceHeader: { textAlign: "right" },
  invoiceTitle: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  invoiceDetail: { fontSize: 10, color: "#4b5563", marginTop: 2 },
  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#f3f4f6",
    borderBottomWidth: 2,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 15,
    marginVertical: 20,
  },
  addressBox: { width: "45%" },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 6,
  },
  addressText: { fontSize: 10, color: "#374151", lineHeight: 1.4 },
  table: { width: "auto" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderCol: {
    padding: 8,
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableCol: { padding: 8 },
  tableCell: { fontSize: 10, color: "#1f2937" },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  summaryBox: { width: "45%" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: { fontSize: 10, color: "#4b5563" },
  summaryValue: { fontSize: 10, fontWeight: "bold" },
  grandTotalSection: {
    borderTopWidth: 2,
    borderTopColor: "#1f2937",
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: BRAND_COLOR },
  totalValue: { fontSize: 14, fontWeight: "bold", color: BRAND_COLOR },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
  },
});

// Ab IOrder type istemal karein
export const InvoiceTemplate = ({ order }: { order: IOrder }) => {
  return (
    <Document author="PocketValue" title={`Invoice ${order.orderId}`}>
      <Page size="A4" style={styles.page}>
        <InvoiceHeader order={order} styles={styles} />
        <InvoiceAddress order={order} styles={styles} />
        <InvoiceItemsTable order={order} styles={styles} />
        <InvoiceSummary
          subtotal={order.subtotal}
          shippingCost={order.shippingCost}
          grandTotal={order.totalPrice}
          styles={styles}
        />
        <InvoiceFooter styles={styles} />
      </Page>
    </Document>
  );
};

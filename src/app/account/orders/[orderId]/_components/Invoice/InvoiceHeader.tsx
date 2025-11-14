// /src/app/account/orders/[orderId]/_components/InvoiceHeader.tsx

import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { IOrder } from "@/models/Order"; // Mongoose IOrder type istemal karein

// Props ki type define karein
interface InvoiceHeaderProps {
  order: IOrder;
  styles: ReturnType<typeof StyleSheet.create>;
}

export const InvoiceHeader = ({ order, styles }: InvoiceHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.companyDetails}>
        <Image
          style={styles.logo}
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/Logo1.png`}
        />
        <Text style={styles.companyName}>PocketValue</Text>
        <Text style={styles.companyAddress}>
          123 Street Name, Karachi, Sindh
        </Text>
        <Text style={styles.companyAddress}>support@pocketvalue.pk</Text>
      </View>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        {/* Naye orderId aur createdAt ko istemal karein */}
        <Text style={styles.invoiceDetail}>Order ID: {order.orderId}</Text>
        <Text style={styles.invoiceDetail}>
          Date Issued: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

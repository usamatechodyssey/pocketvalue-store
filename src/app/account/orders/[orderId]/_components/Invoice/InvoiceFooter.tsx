// /src/app/account/orders/[orderId]/_components/InvoiceFooter.tsx
import { Text, StyleSheet } from "@react-pdf/renderer";

interface InvoiceFooterProps {
  styles: ReturnType<typeof StyleSheet.create>;
}

export const InvoiceFooter = ({ styles }: InvoiceFooterProps) => {
  return (
    <Text style={styles.footer}>
      Thank you for your purchase! For any support, please contact
      support@pocketvalue.pk.
    </Text>
  );
};

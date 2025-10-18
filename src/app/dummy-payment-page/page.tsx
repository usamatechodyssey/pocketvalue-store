"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DummyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount");

  const handleSuccess = () => {
    // Asliyat me, hum yahan Bank Alfalah se wapas aate aur
    // order ko database me save karte.
    // Abhi ke liye, hum bas ek success message dikha kar homepage par bhej denge.
    alert(
      "Dummy Payment Successful! In a real scenario, your order would be saved now."
    );
    router.push("/");
  };

  return (
    <div className="container mx-auto text-center py-12">
      <h1 className="text-3xl font-bold">Dummy Payment Gateway</h1>
      <p className="text-lg mt-2">
        This is a placeholder for the real Bank Alfalah payment page.
      </p>

      <div className="mt-8 p-8 border rounded-lg max-w-md mx-auto">
        <p className="text-xl">You are about to pay:</p>
        <p className="text-4xl font-bold my-4">Rs. {amount}</p>
        <div className="space-y-4 mt-6">
          <button
            onClick={handleSuccess}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg"
          >
            Simulate Successful Payment
          </button>
          <Link
            href="/checkout/payment"
            className="block w-full py-3 bg-red-600 text-white font-semibold rounded-lg"
          >
            Simulate Failed/Cancelled Payment
          </Link>
        </div>
      </div>
    </div>
  );
}

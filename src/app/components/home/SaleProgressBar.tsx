// app/components/home/SaleProgressBar.tsx (NEW COMPONENT)

"use client";

export default function SaleProgressBar({ stock }: { stock: number | undefined }) {
  // Agar stock undefined hai ya 0 se zyada hai, to progress bar dikhayein
  // Hum abhi ke liye total stock 50 farz kar rahe hain. Baad mein isay Sanity se layenge.
  const totalStock = 50; 
  const itemsSold = stock !== undefined ? Math.max(0, totalStock - stock) : 20;
  const percentageSold = (itemsSold / totalStock) * 100;

  return (
    <div className="w-full mt-2">
      <div className="relative w-full h-2.5 bg-red-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
          style={{ width: `${percentageSold}%` }}
        />
      </div>
      <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
        {stock !== undefined && stock <= 10 ? `🔥 Only ${stock} left!` : `⚡ ${itemsSold} sold`}
      </p>
    </div>
  );
}
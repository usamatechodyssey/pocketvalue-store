export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-pulse overflow-hidden">
      {/* 
        IMAGE AREA 
        Matches aspect-4/5 exactly like ProductCard
      */}
      <div className="relative w-full aspect-4/5 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {/* Shimmer/Glossy Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* 
        CONTENT AREA 
        Matches 'flex flex-col grow p-4' structure
      */}
      <div className="flex flex-col grow p-4 gap-2">
        {/* Rating / Review Count (Top small line) */}
        <div className="h-3 bg-gray-200 dark:bg-gray-800 w-1/3 rounded mb-1"></div>

        {/* Title Lines (Simulating 2 lines of text) */}
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4 rounded"></div>

        {/* 
           PRICE AREA 
           Matches 'mt-auto' to push price to bottom 
        */}
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          {/* Main Price (Bigger, Bold) */}
          <div className="h-6 bg-gray-200 dark:bg-gray-800 w-24 rounded"></div>

          {/* Old Price (Smaller) */}
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-16 rounded opacity-60"></div>
        </div>
      </div>
    </div>
  );
}

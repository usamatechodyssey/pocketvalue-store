"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SanityProduct from "@/sanity/types/product_types";
import { getProductsBySlugs } from "@/sanity/lib/queries";
import { X, UploadCloud, Search, ArrowLeft, ArrowRight, Image as ImageIcon, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";

interface VisualSearchPanelProps {
  onClose: () => void;
}

const PLACEHOLDER_IMAGE_URL = "/placeholder.png";
const VISUAL_SEARCH_API_KEY = "sk_20ed2d16a97592584923393f17ed297e";

export default function VisualSearchPanel({ onClose }: VisualSearchPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SanityProduct[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: "auto", spacing: 16 },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    created: () => setLoaded(true),
  });

  // Paste and outside click hooks are perfect. No changes.
  useEffect(() => { /* ... paste logic ... */ }, []);
  useEffect(() => { /* ... click outside logic ... */ }, [onClose]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
      setSelectedFile(file);
    } else if (file) {
      setError("Image size should be less than 5MB.");
    }
  };

  const handleSearch = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const aiResponse = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "x-api-key": VISUAL_SEARCH_API_KEY },
        body: formData,
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.detail || "Could not connect to AI server.");
      }

      const aiData: { results: { slug: string; similarity: number }[] } = await aiResponse.json();
      const slugs = aiData.results.map((item) => item.slug).filter(Boolean);

      if (slugs.length > 0) {
        const products = await getProductsBySlugs(slugs);
        setResults(products);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      handleSearch(selectedFile);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile, handleSearch]);

  const resetSearch = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const allResultSlugs = results.map(p => p.slug);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Search by Image</h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <X className="text-gray-500" size={18}/>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Column */}
        <div className="md:col-span-1">
          <label className={`relative border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors ${previewUrl ? '' : 'hover:border-brand-primary hover:bg-brand-primary/5'}`}>
            {previewUrl ? (
              <>
                <Image src={previewUrl} alt="Preview" fill className="object-contain p-2 rounded-lg" sizes="200px"/>
                <button onClick={(e) => { e.preventDefault(); resetSearch(); }} className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 z-10">
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-gray-400 dark:text-gray-500">
                <UploadCloud size={32} className="mx-auto" />
                <p className="text-sm font-medium mt-2">Drop, paste or click</p>
                <p className="text-xs">Max file size 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </label>
        </div>

        {/* Results Column */}
        <div className="md:col-span-2 relative flex flex-col min-h-[12rem]">
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Search className="animate-pulse text-brand-primary" size={24} />
              <p className="mt-2 text-sm font-medium">Finding similar products...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="relative">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Similar Products Found:</h4>
              <div ref={sliderRef} className="keen-slider">
                {results.map((product) => {
                  const imageUrl = product.defaultVariant?.images?.[0] ? urlFor(product.defaultVariant.images[0]).url() : PLACEHOLDER_IMAGE_URL;
                  return (
                    <div key={product._id} className="keen-slider__slide" style={{ minWidth: 120, maxWidth: 120 }}>
                      <Link href={`/product/${product.slug}`} onClick={onClose} className="block h-full">
                        <div className="border dark:border-gray-700 rounded-lg p-2 text-center hover:shadow-md transition-shadow h-full flex flex-col justify-between bg-white dark:bg-gray-800">
                          <div className="relative h-24 w-full">
                            <Image src={imageUrl} alt={product.title} fill className="object-contain" sizes="100px"/>
                          </div>
                          <p className="text-xs mt-1 font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 h-8">{product.title}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {loaded && instanceRef.current && results.length > 3 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }} disabled={currentSlide === 0} className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowLeft size={18}/>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }} disabled={currentSlide >= instanceRef.current.track.details.slides.length - 3} className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowRight size={18}/>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-500 dark:text-gray-400 text-center p-4">
              <ImageIcon size={32} className="mb-2" />
              <p className="text-sm font-medium">{selectedFile ? "No similar products found." : "Upload an image to see similar items."}</p>
            </div>
          )}

          {error && <div className="flex items-center gap-2 text-red-500 text-xs mt-2"><AlertTriangle size={14}/> {error}</div>}
          
          {!isLoading && results.length > 0 && (
            <div className="mt-4 text-center">
              <Link href={`/search?slugs=${allResultSlugs.join(",")}`} onClick={onClose} className="text-sm font-bold text-brand-primary hover:underline">
                View all {results.length} similar products
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
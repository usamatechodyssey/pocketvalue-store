"use client";

import { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import { batchCreateCategories } from "../_actions/categoryActions";
import { UploadCloud, FileText, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// === MUKAMMAL, 100% FILLED AND CORRECTED MYNTRA CATEGORY DATA ===
// === AAPKA ORIGINAL DATA (CLEANED, STRUCTURED & PROFESSIONAL FORMAT) ===
const CSV_TEMPLATE = `name,slug,parent_slug,image_url
Men,men,,
Women,women,,
Kids,kids,,
Beauty,beauty,,
Home,home,,
Electronics,electronics,,
Food & Grocery,food-grocery,,
Topwear (Men),topwear-men,men,
Bottom Wear (Men),bottom-wear-men,men,
Footwear (Men),footwear-men,men,
Accessories (Men),accessories-men,men,
T-Shirt,t-shirt-men,topwear-men,
Casual Shirt,casual-shirt-men,topwear-men,
Formal Shirt,formal-shirt-men,topwear-men,
Sweaters,sweaters-men,topwear-men,
Jacket,jacket-men,topwear-men,
Jeans (Men),jeans-men,bottom-wear-men,
Trousers (Men),trousers-men,bottom-wear-men,
Shorts (Men),shorts-men,bottom-wear-men,
Underwear (Men),underwear-men,men,
Casual Shoes (Men),casual-shoes-men,footwear-men,
Formal Shoes (Men),formal-shoes-men,footwear-men,
Sports Shoes (Men),sports-shoes-men,footwear-men,
Sandal & Sleepers (Men),sandal-sleepers-men,footwear-men,
Sneaker (Men),sneaker-men,footwear-men,
Watches (Men),watches-men,accessories-men,
Sunglasses (Men),sunglasses-men,accessories-men,
Wallet & Belt,wallet-belt,accessories-men,
Mens Laptop Bags,mens-laptop-bags,accessories-men,
Clothing (Women),clothing-women,women,
Footwear (Women),footwear-women,women,
Bags & Accessories (Women),bags-accessories-women,women,
Jewellery (Women),jewellery-women,women,
Dresses,dresses-women,clothing-women,
Casual Wear,casual-wear-women,clothing-women,
Trendy Wear,trendy-wear-women,clothing-women,
T Shirts (Women),t-shirts-women,clothing-women,
Abayas & Hijab,abayas-hijab,clothing-women,
Jeans (Women),jeans-women,clothing-women,
Trousers (Women),trousers-women,clothing-women,
Sandal (Women),sandal-women,footwear-women,
Sneakers (Women),sneakers-women,footwear-women,
Heels,heels,footwear-women,
Sports Shoes (Women),sports-shoes-women,footwear-women,
Sleepers (Women),sleepers-women,footwear-women,
Hand Bags & Shoulder Bags,hand-shoulder-bags,bags-accessories-women,
Wallets & Clutches,wallets-clutches,bags-accessories-women,
Earrings,earrings,jewellery-women,
Neckles,neckles,jewellery-women,
Braclet,braclet,jewellery-women,
Rings,rings,jewellery-women,
Ladies Watches,ladies-watches,jewellery-women,
Boys,boys-kids,kids,
Girls,girls-kids,kids,
Footwear (Kids),footwear-kids,kids,
Kids Accessories,kids-accessories,kids,
Bags & School Supplies,bags-school-supplies,kids,
Shirts (Boys),shirts-boys,boys-kids,
T-Shirts (Boys),t-shirts-boys,boys-kids,
Shorts (Boys),shorts-boys,boys-kids,
Jeans & Tiez (Boys),jeans-tiez-boys,boys-kids,
Clothing Set (Boys),clothing-set-boys,boys-kids,
Dresses (Girls),dresses-girls,girls-kids,
T-Shirts (Girls),t-shirts-girls,girls-kids,
Clothing Set (Girls),clothing-set-girls,girls-kids,
Frocks (Girls),frocks-girls,girls-kids,
Casual Shoes (Kids),casual-shoes-kids,footwear-kids,
Sport Shoes (Kids),sport-shoes-kids,footwear-kids,
Sandels (Kids),sandels-kids,footwear-kids,
School Shoes (Kids),school-shoes-kids,footwear-kids,
Socks (Kids),socks-kids,footwear-kids,
Watches (Kids),watches-kids,kids-accessories,
Jewellery (Kids),jewellery-kids,kids-accessories,
Sunglasses (Kids),sunglasses-kids,kids-accessories,
Caps & Hats (Kids),caps-hats-kids,kids-accessories,
Belts (Kids),belts-kids,kids-accessories,
Pencil Boxes,pencil-boxes,bags-school-supplies,
Geometry Sets,geometry-sets,bags-school-supplies,
Water Bottle,water-bottle,bags-school-supplies,
Lunch box,lunch-box,bags-school-supplies,
School Bags,school-bags,bags-school-supplies,
Makeup,makeup-beauty,beauty,
Skincare,skincare-beauty,beauty,
Hair Care,hair-care-beauty,beauty,
Hair Accessories,hair-accessories-beauty,beauty,
Fragrances,fragrances-beauty,beauty,
Appliances (Beauty),appliances-beauty,beauty,
Mens Grooming,mens-grooming-beauty,beauty,
Nail Polish,nail-polish,makeup-beauty,
Eyeliner,eyeliner,makeup-beauty,
Mascara,mascara,makeup-beauty,
Liplose,liplose,makeup-beauty,
Lipliner,lipliner,makeup-beauty,
Foundations,foundations,makeup-beauty,
Stick,stick,makeup-beauty,
Face powder,face-powder,makeup-beauty,
Eyeshadow,eyeshadow,makeup-beauty,
Blayshown,blayshown,makeup-beauty,
Shiner,shiner,makeup-beauty,
Compact,compact,makeup-beauty,
Makeup Kit,makeup-kit,makeup-beauty,
Primer,primer,makeup-beauty,
Concealer,concealer,makeup-beauty,
Face Wash,face-wash,skincare-beauty,
Serums,serums,skincare-beauty,
Face Moisturiser,face-moisturiser,skincare-beauty,
Body Lotions,body-lotions,skincare-beauty,
Mask & Peels,mask-peels,skincare-beauty,
Cleanser,cleanser,skincare-beauty,
Body Wash,body-wash,skincare-beauty,
Shampoo,shampoo,hair-care-beauty,
Conditioner,conditioner,hair-care-beauty,
Hair Color,hair-color,hair-care-beauty,
Hair gel,hair-gel,hair-care-beauty,
Perfumes,perfumes,fragrances-beauty,
Deodorants,deodorants,fragrances-beauty,
Body Mist,body-mist,fragrances-beauty,
Hair Straightener,hair-straightener,appliances-beauty,
Hair Dryer,hair-dryer,appliances-beauty,
Epilator,epilator,appliances-beauty,
Trimmers & shavers,trimmers-shavers,mens-grooming-beauty,
Beard Oils & Kits,beard-oils-kits,mens-grooming-beauty,
Perfumes & Deodorants (Men),perfumes-deodorants-men,mens-grooming-beauty,
Hair Styling (Gel,Wax),hair-styling-gel-wax,mens-grooming-beauty,
Bedroom Essentials,bedroom-essentials,home,
Home Décor,home-decor,home,
Kitchen & Dining,kitchen-dining,home,
Bathroom Essentials,bathroom-essentials,home,
Cleaning & Organizers,cleaning-organizers,home,
Bed Sheets,bed-sheets,bedroom-essentials,
Bed Sheets Set,bed-sheets-set,bedroom-essentials,
Coton Pillows,coton-pillows,bedroom-essentials,
Polyster Pillows,polyster-pillows,bedroom-essentials,
Pillows Covers,pillows-covers,bedroom-essentials,
Coshions,coshions,bedroom-essentials,
Coshions Covers,coshions-covers,bedroom-essentials,
Bolster gow Pillow,bolster-gow-pillow,bedroom-essentials,
Gow Pillow Covers,gow-pillow-covers,bedroom-essentials,
Blanket,blanket,bedroom-essentials,
Cotton Blanket,cotton-blanket,bedroom-essentials,
Polyester Blanket,polyester-blanket,bedroom-essentials,
Cotton Blanket Covers,cotton-blanket-covers,bedroom-essentials,
Mattress,mattress,bedroom-essentials,
Cotton Mattress,cotton-mattress,bedroom-essentials,
Polyster Mattress,polyster-mattress,bedroom-essentials,
Cotton Mattress Covers,cotton-mattress-covers,bedroom-essentials,
Shaneel Cover,shaneel-cover,bedroom-essentials,
Wall Clock,wall-clock,home-decor,
Decorative Lights & Lamps,decorative-lights-lamps,home-decor,
Artificial Plants & Vases,artificial-plants-vases,home-decor,
Rugs & Carpets,rugs-carpets,home-decor,
Curtains,curtains,home-decor,
Reshum Curtains,reshum-curtains,home-decor,
Silk Curtains,silk-curtains,home-decor,
Printed Curtains,printed-curtains,home-decor,
Makhmal Curtains,makhmal-curtains,home-decor,
Valvet Curtains,valvet-curtains,home-decor,
Net Curtains,net-curtains,home-decor,
Wallpaper,wallpaper,home-decor,
Wall panel,wall-panel,home-decor,
Wall Stickers / Decals,wall-stickers-decals,home-decor,
Laminates Sheets,laminates-sheets,home-decor,
PVC Sheets,pvc-sheets,home-decor,
Wooden / Marble Finish Sheets,wooden-marble-finish-sheets,home-decor,
Non-Stick Cookwear Sets,non-stick-cookwear-sets,kitchen-dining,
Storage Jars & Container,storage-jars-container,kitchen-dining,
Water Bottles / Flasks,water-bottles-flasks,kitchen-dining,
Cutlery & Dinner set,cutlery-dinner-set,kitchen-dining,
Electric Kittles & Blenders,electric-kittles-blenders,kitchen-dining,
Towels Sets,towels-sets,bathroom-essentials,
Bathroom Accessories,bathroom-accessories,bathroom-essentials,
Saops Dispensers,saops-dispensers,bathroom-essentials,
Tothbrush Holders,tothbrush-holders,bathroom-essentials,
Storage Organizer,storage-organizer,cleaning-organizers,
Multipurpose Cleaning Tools,multipurpose-cleaning-tools,cleaning-organizers,
Mops,mops,cleaning-organizers,
Brushes,brushes,cleaning-organizers,
Laundry Basket,laundry-basket,cleaning-organizers,
Shoe Racks,shoe-racks,cleaning-organizers,
Foldable Storage Boxes,foldable-storage-boxes,cleaning-organizers,
Mobile Phones,mobile-phones,electronics,
Laptops & Computers,laptops-computers,electronics,
Graphic Cards (GPUs),graphic-cards-gpus,electronics,
Accessories (Electronics),accessories-electronics,electronics,
Audio Devices,audio-devices,electronics,
Smartphones,smartphones,mobile-phones,
Mobile Chargers,mobile-chargers,accessories-electronics,
Power Banks,power-banks,accessories-electronics,
Phone Covers,phone-covers,accessories-electronics,
Laptop Bags,laptop-bags,accessories-electronics,
Laptops,laptops,laptops-computers,
Graphic Cards,graphic-cards,graphic-cards-gpus,
Headphones,headphones,audio-devices,
Earbuds,earbuds,audio-devices,
Bluetooth Speakers,bluetooth-speakers,audio-devices,
Staples & Essentials,staples-essentials,food-grocery,
Beverages,beverages,food-grocery,
Snacks & Packaged Food,snacks-packaged-food,food-grocery,
Rice,rice,staples-essentials,
Flour (Atta),flour-atta,staples-essentials,
Pulses (Daal),pulses-daal,staples-essentials,
Sugar,sugar,staples-essentials,
Salt,salt,staples-essentials,
Spices (Masalay),spices-masalay,staples-essentials,
Cooking Oil / Ghee,cooking-oil-ghee,staples-essentials,
Tea (Chai),tea-chai,beverages,
Coffee,coffee,beverages,
Juices (Tetra Pack / Powder Form),juices,beverages,
Soft Drinks (Packaged Bottles/Cans),soft-drinks,beverages,
Bottled Water,bottled-water,beverages,
Chips,chips,snacks-packaged-food,
Biscuits,biscuits,snacks-packaged-food,
Chocolates,chocolates,snacks-packaged-food,
Dry Fruits (Packaged),dry-fruits-packaged,snacks-packaged-food,
Instant Noodles,instant-noodles,snacks-packaged-food,
Sauces & Ketchup,sauces-ketchup,snacks-packaged-food,
Jams & Honey,jams-honey,snacks-packaged-food,
Pickles,pickles,snacks-packaged-food
`;

export default function ImportCategoriesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<{
    success: boolean;
    message: string;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "professional_category_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setIsProcessing(true);
    setReport(null);
    toast.loading("Parsing CSV file...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        toast.dismiss();
        // Nayi type ko `image_url` ke saath update karein
        const categories = results.data as {
          name: string;
          slug: string;
          parent_slug: string;
          image_url: string;
        }[];
        if (categories.length === 0) {
          toast.error("CSV file is empty or invalid.");
          setIsProcessing(false);
          return;
        }

        toast.loading(`Importing ${categories.length} categories...`);
        const result = await batchCreateCategories(categories);
        toast.dismiss();
        setReport(result);

        if (result.success) {
          toast.success("All categories imported successfully!");
        } else {
          toast.error("Some categories failed to import. See report.");
        }

        setIsProcessing(false);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFile(null);
      },
      error: (error) => {
        toast.dismiss();
        toast.error("Failed to parse CSV file.");
        console.error(error);
        setIsProcessing(false);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Import Categories in Bulk
        </h1>
        <Link
          href="/admin/categories"
          className="text-sm text-teal-600 hover:underline"
        >
          ← Back to Categories
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Step 1: Get the Professional Template
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Download the template to link categories and optionally add an image
            URL for visual navigation.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200"
          >
            <FileText size={16} />
            Download Template
          </button>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Step 2: Upload Your CSV File
          </h2>
          <div className="mt-4 p-6 border-2 border-dashed rounded-lg text-center">
            <UploadCloud size={48} className="mx-auto text-gray-400" />
            <label
              htmlFor="file-upload"
              className="mt-2 text-sm font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
            >
              <span>
                {file
                  ? `Selected File: ${file.name}`
                  : "Click to select a file"}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">CSV file up to 10MB</p>
          </div>
        </div>

        <div className="border-t pt-8 flex justify-end">
          <button
            onClick={handleImport}
            disabled={!file || isProcessing}
            className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Start Import"}
          </button>
        </div>

        {report && (
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Import Report
            </h2>
            <div
              className={`p-4 rounded-md ${report.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-3">
                {report.success ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <p className="font-semibold">{report.message}</p>
              </div>
              {report.errors.length > 0 && (
                <div className="mt-4 pl-8">
                  <h3 className="font-bold text-sm">Error Details:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1 mt-2 max-h-40 overflow-y-auto">
                    {report.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

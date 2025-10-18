"use client";

import { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import { batchCreateProductsFromGroups } from "../_actions/productActions";
import { UploadCloud, FileText, CheckCircle, XCircle, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { CSV_TEMPLATE } from "@/app/components/admin/CsvTemplate"; // Template ab alag file se araha hai

export default function ImportProductsPage() {
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
    const cleanCsvData = CSV_TEMPLATE.split("\n").filter((line) => !line.startsWith("//")).join("\n");
    const blob = new Blob([cleanCsvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "pocketvalue_product_template_v2.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }
    setIsProcessing(true);
    setReport(null);
    toast.loading("Parsing CSV file...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      comments: "//",
      complete: async (results) => {
        toast.dismiss();
        const rawData: any[] = results.data;
        if (rawData.length === 0) {
          toast.error("CSV file is empty or invalid.");
          setIsProcessing(false);
          return;
        }

        // --- THE NEW PARSING LOGIC (GROUPING) ---
        const productGroups: any[][] = [];
        let currentGroup: any[] = [];

        for (const row of rawData) {
          // Check if it's a parent row (has a title)
          if (row.title && row.title.trim() !== "") {
            // If there's an existing group, push it to the main list
            if (currentGroup.length > 0) {
              productGroups.push(currentGroup);
            }
            // Start a new group with the parent row
            currentGroup = [row];
          } else if (currentGroup.length > 0) {
            // If it's a variant row, add it to the current group
            currentGroup.push(row);
          }
        }
        // Add the last group to the list
        if (currentGroup.length > 0) {
          productGroups.push(currentGroup);
        }
        // --- END OF NEW LOGIC ---

        if (productGroups.length === 0) {
          toast.error("No valid product groups found. Make sure each product starts with a 'title'.");
          setIsProcessing(false);
          return;
        }

        toast.loading(`Importing ${productGroups.length} products... This may take a while.`);
        const result = await batchCreateProductsFromGroups(productGroups);
        toast.dismiss();
        setReport(result);

        if (result.success) {
          toast.success("Import process completed!");
        } else {
          toast.error("Import failed for some products. See report for details.");
        }

        setIsProcessing(false);
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFile(null);
      },
      error: (err) => {
        toast.dismiss();
        toast.error("Failed to parse CSV file: " + err.message);
        setIsProcessing(false);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Bulk Import Products</h1>
        <Link href="/Bismillah786/products" className="text-sm font-medium text-brand-primary hover:underline">
          ← Back to Products
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border dark:border-gray-700 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Step 1: Download & Prepare Your CSV File</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Use our latest template which supports multiple variants per product.
          </p>
          <button onClick={handleDownloadTemplate} className="my-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FileText size={16} />
            Download Product Template v2
          </button>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base text-blue-800 dark:text-blue-300">
                  Important Instructions
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 list-disc list-inside mt-2 space-y-2">
                  <li>The **first row** for a product must be the **Parent Row**, containing details like `title`, `slug`, `brand`, etc. Variant columns in this row must be empty.</li>
                  <li>All **following rows** are **Variant Rows**. Parent columns in these rows must be empty. Fill in all `variant_` columns.</li>
                  <li>A simple product is a product with just one parent row and one variant row.</li>
                  <li>For multiple images in `variant_images`, separate URLs with a comma (,).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Step 2: Upload Your CSV File</h2>
          <div className="mt-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <UploadCloud size={48} className="mx-auto text-gray-400" />
            <label htmlFor="file-upload" className="mt-2 text-sm font-medium text-brand-primary hover:text-brand-primary-hover cursor-pointer">
              <span>{file ? `Selected File: ${file.name}` : "Click to select a file"}</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} disabled={isProcessing}/>
            </label>
            <p className="text-xs text-gray-500 mt-1">CSV file up to 10MB</p>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-8 flex justify-end">
          <button onClick={handleImport} disabled={!file || isProcessing} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {isProcessing && <Loader2 className="animate-spin" size={20} />}
            {isProcessing ? "Processing..." : `Start Import`}
          </button>
        </div>

        {report && (
          <div className="border-t dark:border-gray-700 pt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Import Report</h2>
            <div className={`p-4 rounded-md border ${report.success ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"}`}>
              <div className="flex items-center gap-3">
                {report.success ? (<CheckCircle className="text-green-500" />) : (<XCircle className="text-red-500" />)}
                <p className="font-semibold">{report.message}</p>
              </div>
              {report.errors.length > 0 && (
                <div className="mt-4 pl-8">
                  <h3 className="font-bold text-sm text-red-800 dark:text-red-300">Error Details:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1 mt-2 max-h-40 overflow-y-auto pr-2">
                    {report.errors.map((err, i) => (<li key={i}>{err}</li>))}
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
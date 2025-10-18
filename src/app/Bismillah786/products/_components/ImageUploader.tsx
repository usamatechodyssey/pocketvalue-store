// /app/admin/products/_components/ImageUploader.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, File as FileIcon, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

// Sanity se asset reference ki type
interface SanityAsset {
  _type: "reference";
  _ref: string;
}

interface ImageUploaderProps {
  uploadedImages: SanityAsset[];
  setUploadedImages: React.Dispatch<React.SetStateAction<SanityAsset[]>>;
}

export default function ImageUploader({
  uploadedImages,
  setUploadedImages,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setIsUploading(true);
      toast.loading("Uploading images...");

      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const { asset } = await response.json();
          return { _type: "reference", _ref: asset._id };
        } catch (error) {
          console.error(`Failed to upload ${file.name}`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const newAssets = results.filter(Boolean) as SanityAsset[];

      setUploadedImages((prev) => [...prev, ...newAssets]);

      setIsUploading(false);
      toast.dismiss();
      if (newAssets.length > 0) {
        toast.success(`${newAssets.length} image(s) uploaded successfully!`);
      } else {
        toast.error("Some images failed to upload.");
      }
    },
    [setUploadedImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    disabled: isUploading,
  });

  const removeImage = (ref: string) => {
    setUploadedImages((prev) => prev.filter((img) => img._ref !== ref));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? "border-teal-600 bg-teal-50" : "border-gray-300"}
        ${isUploading ? "bg-gray-100 cursor-not-allowed" : "hover:border-teal-500"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
          <UploadCloud
            size={48}
            className={isUploading ? "animate-pulse" : ""}
          />
          {isUploading ? (
            <p>Uploading...</p>
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Uploaded Images:</h4>
          <p className="text-xs text-gray-500 mb-4">
            Note: These are references. The actual images are stored in Sanity.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((image) => (
              <li
                key={image._ref}
                className="relative p-2 border rounded-md bg-gray-50 text-center"
              >
                <CheckCircle size={24} className="mx-auto text-green-500" />
                <p className="text-xs break-all mt-2 text-gray-600">
                  {image._ref.slice(0, 20)}...
                </p>
                <button
                  type="button"
                  onClick={() => removeImage(image._ref)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

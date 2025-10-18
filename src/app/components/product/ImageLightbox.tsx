"use client";

import Image from "next/image";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
  images: SlideImage[];
  isOpen: boolean;
  close: () => void;
  index: number;
}

export default function ImageLightbox({
  images,
  isOpen,
  close,
  index,
}: ImageLightboxProps) {
  return (
    <Lightbox
      open={isOpen}
      close={close}
      slides={images}
      index={index}
      plugins={[Zoom]}
      render={{
        slide: ({ slide }) => (
          <div className="relative w-full h-full">
            <Image
              fill
              alt={slide.alt || ""}
              src={slide.src}
              loading="eager"
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        ),
      }}
    />
  );
}

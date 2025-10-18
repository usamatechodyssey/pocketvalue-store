import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { GET_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

// Types bilkul theek hain, inmein koi change nahi
interface Page {
  _id: string;
  title: string;
  body: any;
}
interface PortableTextImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

// Portable Text ke components (design update hua hai)
const ptComponents = {
  types: {
    image: ({ value }: { value: PortableTextImage }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <img
            alt={value.alt || "Informational image from PocketValue"}
            loading="lazy"
            src={urlFor(value).width(1200).quality(80).url()}
            className="w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-700 dark:text-gray-200">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-primary bg-gray-50 dark:bg-gray-800/50 p-4 my-6 text-gray-600 dark:text-gray-300 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-gray-600 dark:text-gray-300">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-gray-600 dark:text-gray-300">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }: any) => {
      const { href } = value;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary font-semibold hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function InfoPage({
  params,
}: {
  params: { slug: string };
}) {
  const pageData = await client.fetch<Page>(GET_PAGE_QUERY, {
    slug: params.slug,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <main className="w-full bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <article className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {pageData.title}
            </h1>
          </header>
          
          {/* Tailwind Typography plugin for beautiful text styling */}
          <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-brand-primary prose-strong:text-gray-800 dark:prose-strong:text-gray-100">
            <PortableText value={pageData.body} components={ptComponents} />
          </div>
        </article>
      </div>
    </main>
  );
}
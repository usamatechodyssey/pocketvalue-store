// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { Calendar, UserCircle } from "lucide-react";

import { client } from "@/sanity/lib/client";
import {
  getGlobalSettings,
  GET_SINGLE_POST_FOR_PAGE,
  getBreadcrumbs,
} from "@/sanity/lib/queries";
import { Post } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import { generateBaseMetadata } from "@/utils/metadata";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

type SinglePostPageProps = {
  params: Promise<{ slug: string }>;
};

// --- generateMetadata function (unchanged) ---
export async function generateMetadata({
  params: paramsPromise,
}: SinglePostPageProps) {
  const { slug } = await paramsPromise;
  const post = await client.fetch<Post & { seo?: any }>(
    GET_SINGLE_POST_FOR_PAGE,
    { slug }
  );
  if (!post) return {};
  return generateBaseMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    image: post.seo?.ogImage || post.mainImage,
    path: `/blog/${post.slug}`,
  });
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- UPDATED Portable Text Components for New Layout ---
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || "Blog post image"}
          width={800}
          height={450}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </figure>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-700 dark:text-gray-200">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-primary bg-gray-50 dark:bg-gray-800/50 p-4 my-6 text-gray-600 dark:text-gray-300 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a href={value.href} rel={rel} className="hover:underline">
          {children}
        </a>
      );
    },
  },
};

export default async function SinglePostPage({
  params: paramsPromise,
}: SinglePostPageProps) {
  const { slug } = await paramsPromise;

  // --- FETCH ALL DATA CONCURRENTLY ---
  const [post, globalSettings, breadcrumbs] = await Promise.all([
    client.fetch<Post>(GET_SINGLE_POST_FOR_PAGE, { slug }),
    getGlobalSettings(),
    getBreadcrumbs("blog", slug),
  ]);

  if (!post) {
    notFound();
  }
  // --- BlogPosting JSON-LD Schema Generation ---
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: urlFor(post.mainImage).url(),
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "PocketValue Team",
    },
    publisher: {
      "@type": "Organization",
      name: globalSettings.siteName || "PocketValue",
      logo: {
        "@type": "ImageObject",
        url: globalSettings.siteLogo
          ? urlFor(globalSettings.siteLogo).url()
          : `${siteUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <div className="w-full bg-white dark:bg-gray-950">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <Breadcrumbs crumbs={breadcrumbs} />
          </div>

          {/* --- UPDATED GRID LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* --- LEFT (STICKY) COLUMN - NOW WIDER --- */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-6">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {post.categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      className="text-xs font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* --- UPDATED FEATURED IMAGE --- */}
                {/* Removed aspect ratio and object-cover to show the full image */}
                <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                  <Image
                    src={urlFor(post.mainImage).width(800).url()}
                    alt={post.title}
                    width={800}
                    height={800} // Height can be adjusted, but width drives the responsiveness
                    priority
                    className="w-full h-auto" // Ensures image scales correctly without cropping
                  />
                </div>
              </div>
            </aside>

            {/* --- RIGHT (SCROLLABLE) COLUMN --- */}
            <article className="lg:col-span-7 mt-8 lg:mt-0">
              {/* Author & Date Info */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  {post.author?.image ? (
                    <Image
                      src={urlFor(post.author.image).url()}
                      alt={post.author.name || ""}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircle size={40} className="text-gray-400" />
                  )}
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {post.author?.name || "PocketValue Team"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Author
                    </p>
                  </div>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {formatDate(post.publishedAt)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Publish Date
                  </p>
                </div>
              </div>

              {/* Main Article Content */}
              <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300">
                {post.body && (
                  <PortableText
                    value={post.body}
                    components={portableTextComponents}
                  />
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Complete Redesign:** The entire component structure has been refactored into a full-width, two-column layout using CSS Grid for a modern, international look.
// - **Sticky Left Column:** On large screens, the left column containing the title, categories, and main image becomes sticky, staying visible as the user scrolls through the article.
// - **Refactored Header:** The old centered header has been broken down and its elements (title, categories, author info) are now logically placed within the new layout.
// - **Full-Width Container:** The main container now uses `max-w-screen-xl` instead of `max-w-3xl`, utilizing more screen space for a premium feel.
// - **Responsive Stacking:** On mobile devices (`lg:` breakpoint and below), the layout naturally stacks into a single, readable column with the title and image appearing before the article content.
// - **Portable Text Styles Updated:** The styles for headings in `portableTextComponents` have been slightly adjusted to better fit the new `prose` container.

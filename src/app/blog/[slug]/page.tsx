// app/blog/[slug]/page.tsx - SIRF STYLING UPDATE

import { getSinglePost } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Post } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { Calendar, UserCircle } from "lucide-react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// === YAHAN CLASSES UPDATE HUIN HAIN ===
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full aspect-video my-8 rounded-lg overflow-hidden">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Blog post image"}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  block: {
    // h2 aur h3 ab base styles se color aur font-weight lenge
    h2: ({ children }) => <h2 className="text-3xl mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-primary pl-4 italic my-6 text-text-secondary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    // `a` tag ab base styles se color le lega
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post: Post = await getSinglePost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | PocketValue Blog`,
    description: post.excerpt,
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const post: Post = await getSinglePost(slug);

  if (!post) {
    notFound();
  }

  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <article className="bg-surface-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mb-8 text-center">
          <div className="mb-4">
            {post.categories?.map((cat) => (
              // `a` tag ab base styles se color le lega
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="text-sm font-semibold uppercase tracking-wider hover:underline"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              {post.author?.image ? (
                <Image
                  src={urlFor(post.author.image).url()}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <UserCircle size={24} />
              )}
              <span>
                by{" "}
                <span className="font-semibold text-text-primary">
                  {post.author?.name || "Anonymous"}
                </span>
              </span>
            </div>
            <span className="text-surface-border-darker">|</span>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </header>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-12">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Post Body (Content) */}
        {/* `prose` classes hata di hain kyunke hum custom components use kar rahe hain */}
        <div className="text-lg text-text-secondary leading-relaxed">
          {post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </div>
      </div>
    </article>
  );
}

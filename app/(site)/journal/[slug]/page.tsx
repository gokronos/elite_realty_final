import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getBlogPostBySlug, getBlogPostPaths } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBlogPageSchema } from "@/lib/schema";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostPaths();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const canonicalUrl = `https://eliterealtypr.com/journal/${slug}`;
  const title = post
    ? `${post.title} | Elite Realty Journal`
    : "Post Not Found | Elite Realty";
  const description = post?.excerpt || `Read ${post?.title || "this article"} on Elite Realty Journal`;
  const ogImage = post?.featuredImage
    ? urlFor(post.featuredImage)?.width(1200).height(630).url()
    : "https://eliterealtypr.com/images/alexandra2.png";

  if (!post) {
    return {
      title,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImageUrl = post.featuredImage
    ? urlFor(post.featuredImage)?.width(1200).height(675).url()
    : null;

  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image)?.width(128).height(128).url()
    : null;

  const schemaData = generateBlogPageSchema(post, featuredImageUrl || undefined);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      {/* Back Link */}
      <div className="pt-8 px-4">
        <div className="container mx-auto">
          <Link
            href="/journal"
            className="inline-flex items-center text-[#a0a0a0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="pt-8 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-12">
            <p className="text-sm text-[#a0a0a0] mb-4">
              {formatDate(post.publishedAt)}
              {post.author?.name && ` · ${post.author.name}`}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">
              {post.title}
            </h1>
          </header>

          {/* Featured Image */}
          {featuredImageUrl ? (
            <div className="aspect-[16/9] bg-[#1a1a1a] relative overflow-hidden mb-12">
              <Image
                src={featuredImageUrl}
                alt={post.featuredImage?.alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-[#1a1a1a] border border-[#2d2d2d] flex items-center justify-center mb-12">
              <p className="text-[#6b6b6b]">No featured image</p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.body ? (
              <PortableText
                value={post.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="text-[#a0a0a0] leading-relaxed mb-6">{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-serif text-2xl text-white mt-12 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-serif text-xl text-white mt-8 mb-3">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#d4af37] pl-6 italic text-[#a0a0a0] my-8">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        className="text-[#d4af37] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">{children}</strong>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc list-inside text-[#a0a0a0] mb-6 space-y-2">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal list-inside text-[#a0a0a0] mb-6 space-y-2">{children}</ol>
                    ),
                  },
                }}
              />
            ) : (
              <p className="text-[#a0a0a0]">No content available.</p>
            )}
          </div>

          {/* Author */}
          {post.author && (
            <footer className="mt-16 pt-8 border-t border-[#2d2d2d]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2d2d2d] rounded-full relative overflow-hidden">
                  {authorImageUrl ? (
                    <Image
                      src={authorImageUrl}
                      alt={post.author.image?.alt || post.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#6b6b6b] text-xs">Photo</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{post.author.name}</p>
                  {post.author.bio ? (
                    <p className="text-[#a0a0a0] text-sm line-clamp-2">{post.author.bio}</p>
                  ) : (
                    <p className="text-[#a0a0a0] text-sm">Luxury Real Estate Broker</p>
                  )}
                </div>
              </div>
            </footer>
          )}
        </div>
      </article>
    </div>
  );
}

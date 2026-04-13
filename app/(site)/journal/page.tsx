import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getAllBlogPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateJournalPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Journal | Elite Realty",
  description:
    "Insights on luxury real estate, market trends, and lifestyle in Puerto Rico and Miami.",
};

export default async function JournalPage() {
  const posts = await getAllBlogPosts();
  const schemaData = generateJournalPageSchema(posts);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      {/* Header */}
      <section className="pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Journal
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl">
            Insights on luxury real estate, market trends, and lifestyle
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const imageUrl = post.featuredImage 
                  ? urlFor(post.featuredImage)?.width(600).height(400).url()
                  : null;

                return (
                  <article
                    key={post._id}
                    className="group bg-[#1a1a1a] border border-[#2d2d2d] hover:border-[#8a8a8a] transition-colors"
                  >
                    <Link href={`/journal/${post.slug.current}`}>
                      {/* Image */}
                      <div className="aspect-[3/2] bg-[#2d2d2d] relative overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={post.featuredImage?.alt || post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-[#6b6b6b]">No image</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-sm text-[#a0a0a0] mb-2">
                          {formatDate(post.publishedAt)}
                          {post.author?.name && ` · ${post.author.name}`}
                        </p>
                        <h2 className="font-serif text-xl text-white group-hover:text-[#d4af37] transition-colors mb-3">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-[#a0a0a0] text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg mb-4">No blog posts yet.</p>
              <p className="text-[#6b6b6b]">Check back soon for insights on luxury real estate.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

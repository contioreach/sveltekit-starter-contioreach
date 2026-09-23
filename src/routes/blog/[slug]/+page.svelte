<script>
  import BlogDetail from "$lib/components/blog/BlogDetail.svelte";
  import CTASection from "$lib/components/blog/CTASection.svelte";
  import JsonLd from "$lib/components/layout/JsonLd.svelte";
  import Seo from "$lib/components/layout/Seo.svelte";
  import { blogPostingSchema, breadcrumbSchema } from "$lib/schema.js";

  let { data } = $props();
  let post = $derived(data.post);
</script>

<Seo
  title="{post.title} | ContioReach"
  description={post.description || post.excerpt}
  path="/blog/{post.slug}"
  image={post.coverImage || undefined}
  alt={post.title}
  type="article"
  publishedTime={post.publishedAt}
  modifiedTime={post.updatedAt}
  keywords={[
    post.category?.toLowerCase(),
    post.primaryKeyword,
    ...(post.tags?.map((tag) => tag.name?.toLowerCase()) || []),
    "headless cms",
    "content marketing",
    "blog",
  ]}
/>

<!-- Home > Blog > Article — the leaf uses the post's own title rather than the
     SEO title with its site suffix. -->
<JsonLd
  data={breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ])}
/>
<JsonLd data={blogPostingSchema(post)} />

<BlogDetail {post} relatedBlogs={data.related} />
<CTASection />

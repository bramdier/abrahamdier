import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = "content/blog";
const OUT_DIR = "public/blog";
const SHELL_PATH = "templates/blog-shell.html";

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugFromFile(filename) {
  return basename(filename, ".md");
}

function loadPosts() {
  if (!existsSync(CONTENT_DIR)) return [];

  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = slugFromFile(file);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        draft: Boolean(data.draft),
        html: marked.parse(content),
        file,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderShell({ title, description, bodyClass, main, root }) {
  const shell = readFileSync(SHELL_PATH, "utf8");
  return shell
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(description))
    .replace(/\{\{BODY_CLASS\}\}/g, bodyClass)
    .replace(/\{\{MAIN\}\}/g, main)
    .replace(/\{\{ROOT\}\}/g, root);
}

function buildListPage(posts) {
  const items =
    posts.length === 0
      ? `<p class="text-on-surface-variant">No posts yet. Add a Markdown file to <code class="prose-code">content/blog/</code> or use <a class="text-secondary hover:underline" href="/admin/">Decap CMS</a>.</p>`
      : posts
          .map(
            (p) => `
        <article class="mb-14 pb-14 border-b border-outline-variant/30 last:border-0 last:pb-0 last:mb-0">
          <p class="label-text text-xs uppercase tracking-widest text-secondary mb-2">${escapeHtml(formatDate(p.date))}</p>
          <h2 class="text-2xl font-bold text-primary mb-3">
            <a class="hover:text-secondary transition-colors" href="${p.slug}">${escapeHtml(p.title)}</a>
          </h2>
          ${p.description ? `<p class="text-on-surface-variant leading-relaxed mb-4">${escapeHtml(p.description)}</p>` : ""}
          <a class="label-text text-xs uppercase tracking-widest font-bold text-secondary hover:translate-x-1 inline-block transition-transform" href="${p.slug}">Read →</a>
        </article>`
          )
          .join("");

  const main = `
    <header class="mb-12">
      <h1 class="text-4xl font-black text-primary tracking-tighter mb-4">Blog</h1>
      <p class="text-on-surface-variant leading-relaxed">Notes on engineering, systems, and building software.</p>
    </header>
    <section>${items}</section>`;

  return renderShell({
    title: "Blog — Abraham Dier Spiez",
    description: "Notes on engineering, systems, and building software.",
    bodyClass: "page-blog",
    main,
    root: "../",
  });
}

function buildPostPage(post) {
  const main = `
    <article>
      <header class="mb-10">
        <p class="label-text text-xs uppercase tracking-widest text-secondary mb-2">${escapeHtml(formatDate(post.date))}</p>
        <h1 class="text-4xl font-black text-primary tracking-tighter mb-4">${escapeHtml(post.title)}</h1>
        ${post.description ? `<p class="text-lg text-on-surface-variant leading-relaxed">${escapeHtml(post.description)}</p>` : ""}
      </header>
      <div class="prose-blog">${post.html}</div>
      <footer class="mt-16 pt-8 border-t border-outline-variant/30">
        <a class="label-text text-xs uppercase tracking-widest font-bold text-secondary hover:translate-x-1 inline-block transition-transform" href="/blog/">← All posts</a>
      </footer>
    </article>`;

  return renderShell({
    title: `${post.title} — Abraham Dier Spiez`,
    description: post.description || post.title,
    bodyClass: "page-blog",
    main,
    root: "../",
  });
}

export function buildBlog() {
  const posts = loadPosts();

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "index.html"), buildListPage(posts), "utf8");

  for (const post of posts) {
    writeFileSync(join(OUT_DIR, `${post.slug}.html`), buildPostPage(post), "utf8");
  }

  console.log(`Built blog → ${OUT_DIR}/ (${posts.length} post${posts.length === 1 ? "" : "s"})`);
}

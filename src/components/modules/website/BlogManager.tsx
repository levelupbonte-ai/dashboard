import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteBlogPost } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface BlogManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const BlogManager: React.FC<BlogManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [posts, setPosts] = useState<WebsiteBlogPost[]>(() =>
    websiteDataService.getBlogPosts(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<WebsiteBlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [authorName, setAuthorName] = useState('Antoine Mercier');
  const [category, setCategory] = useState('Insights');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [readTime, setReadTime] = useState<number>(5);
  const [status, setStatus] = useState<WebsiteBlogPost['status']>('published');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setAuthorName('Antoine Mercier');
    setCategory('Clinical Guidance');
    setExcerpt('');
    setContent('');
    setFeaturedImage('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80');
    setReadTime(5);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: WebsiteBlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setAuthorName(p.author_name);
    setCategory(p.category);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setFeaturedImage(p.featured_image);
    setReadTime(p.read_time_minutes);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingPost) {
      websiteDataService.updateBlogPost(website.id, editingPost.id, {
        title,
        slug: generatedSlug,
        author_name: authorName,
        category,
        excerpt,
        content,
        featured_image: featuredImage,
        read_time_minutes: readTime,
        status,
      });
      showToast(`Article "${title}" updated.`);
    } else {
      websiteDataService.createBlogPost(website.id, tenantId, {
        title,
        slug: generatedSlug,
        author_name: authorName,
        category,
        tags: [category],
        excerpt,
        content,
        featured_image: featuredImage,
        read_time_minutes: readTime,
        seo_title: `${title} | ${website.name}`,
        seo_description: excerpt,
        status,
        published_at: new Date().toISOString(),
      });
      showToast(`Article "${title}" published.`);
    }

    setPosts(websiteDataService.getBlogPosts(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (isReadOnly) return;
    if (confirm(`Delete article "${postTitle}"?`)) {
      websiteDataService.deleteBlogPost(website.id, id);
      setPosts(websiteDataService.getBlogPosts(website.id));
      showToast(`Article "${postTitle}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Articles & Editorial Journal</h3>
          <p className="text-xs text-muted-foreground">
            Publish educational articles and thought leadership at canonical URLs (e.g. /blog/article-slug).
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Write New Article</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  {post.category}
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border ${
                    post.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {post.status === 'published' ? 'Live' : 'Draft'}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h4>

              <div className="text-[11px] font-mono text-primary">/blog/{post.slug}</div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                <span>By {post.author_name}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
                <span>·</span>
                <span>{post.read_time_minutes} min read</span>
              </div>
            </div>

            {/* Actions */}
            {!isReadOnly && (
              <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(post)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                  title="Edit Article"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1 rounded text-muted-foreground hover:text-rose-400"
                  title="Delete Article"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">
                {editingPost ? 'Edit Article' : 'Write New Article'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Article Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-semibold"
                  placeholder="e.g. 5 Preventative Biomarkers for Longevity in 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                    placeholder="preventative-biomarkers-2026"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Author</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Excerpt (Summary)</label>
                  <button
                    type="button"
                    onClick={() => setIsAiOpen(true)}
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>AI Polish</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Short introductory hook for social shares and article listing cards..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Body Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground leading-relaxed font-mono"
                  placeholder="Write complete article paragraphs..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Save Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Generate Article Excerpt"
        request={{
          action: 'improve_description',
          currentText: excerpt,
          context: { businessName: website.name, topic: title },
        }}
        onApply={(text) => setExcerpt(text)}
      />
    </div>
  );
};

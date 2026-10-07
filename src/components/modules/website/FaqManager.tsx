import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteFaq } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface FaqManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const FaqManager: React.FC<FaqManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [faqs, setFaqs] = useState<WebsiteFaq[]>(() =>
    websiteDataService.getFaqs(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<WebsiteFaq | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: WebsiteFaq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (editingFaq) {
      websiteDataService.updateFaq(website.id, editingFaq.id, {
        question,
        answer,
        category,
      });
      showToast('FAQ question updated.');
    } else {
      websiteDataService.createFaq(website.id, tenantId, {
        question,
        answer,
        category,
        sort_order: faqs.length + 1,
        status: 'published',
      });
      showToast('FAQ question added to website.');
    }

    setFaqs(websiteDataService.getFaqs(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (isReadOnly) return;
    if (confirm('Delete this question from FAQs?')) {
      websiteDataService.deleteFaq(website.id, id);
      setFaqs(websiteDataService.getFaqs(website.id));
      showToast('Question deleted.');
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
          <h3 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h3>
          <p className="text-xs text-muted-foreground">
            Clear up patient, dining, or shipping questions to streamline client conversion.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add FAQ Question</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  {faq.category}
                </span>

                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
                      className="p-1 rounded text-muted-foreground hover:text-rose-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <h4 className="text-xs font-semibold text-foreground">{faq.question}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ Question'}
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
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium text-foreground">Question</label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-medium"
                    placeholder="e.g. How do virtual video consults work?"
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
                    placeholder="Billing, General..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Detailed Answer</label>
                  <button
                    type="button"
                    onClick={() => setIsAiOpen(true)}
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>AI Suggest Answer</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Clear, authoritative answer for your clients..."
                />
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
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Suggest FAQ Answer"
        request={{
          action: 'suggest_faq',
          context: { businessName: website.name, topic: question },
        }}
        onApply={(text) => setAnswer(text)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { requestAiContentAssistance, AiEnhanceRequest } from '../../services/aiService';

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (generatedText: string) => void;
  request: AiEnhanceRequest;
  title: string;
}

export const AiAssistModal: React.FC<AiAssistModalProps> = ({
  isOpen,
  onClose,
  onApply,
  request,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  React.useEffect(() => {
    if (isOpen && !hasGenerated) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await requestAiContentAssistance(request);
      setSuggestion(res);
      setHasGenerated(true);
    } catch {
      setSuggestion(request.currentText || 'Could not generate suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">
                Review and customize before applying to your website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Generated Content Box */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            AI Generated Proposal:
          </label>
          {isLoading ? (
            <div className="h-28 rounded-md bg-muted/40 border border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="size-3.5 animate-spin text-primary" />
              <span>Drafting polished copy...</span>
            </div>
          ) : (
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={4}
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary leading-relaxed resize-none"
              placeholder="AI generated content will appear here..."
            />
          )}
        </div>

        <p className="text-[11px] text-muted-foreground italic">
          Content is not published automatically. You can edit the text above before applying it to your website.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/80">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(suggestion);
                onClose();
              }}
              disabled={isLoading || !suggestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-xs"
            >
              <Check className="size-3.5" />
              <span>Apply to Content</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

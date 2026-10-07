import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Sparkles,
  RotateCw,
  Globe,
  Copy,
  Check,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Website, Tenant } from '../../../types';
import { Button } from '../../ui/Button';

interface LiveWebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  tenant: Tenant;
  onRequestChange: () => void;
}

export const LiveWebsitePreviewModal: React.FC<LiveWebsitePreviewModalProps> = ({
  isOpen,
  onClose,
  website,
  onRequestChange,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeFailed, setIframeFailed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleReload = () => {
    setIsLoading(true);
    setIframeFailed(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyUrl = () => {
    const url = `https://${website.domain}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewportStyles = {
    desktop: {
      width: '100%',
      maxWidth: '1280px',
      dimensions: '1440 × 900',
    },
    tablet: {
      width: '768px',
      maxWidth: '100%',
      dimensions: '768 × 1024',
    },
    mobile: {
      width: '375px',
      maxWidth: '100%',
      dimensions: '375 × 812',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-150">
      {/* Top Preview Bar (Vercel Style) */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{website.name}</span>
            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
              {website.domain}
            </span>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
              <span className="size-1 rounded-full bg-emerald-500" />
              Production
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Device Toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-md border border-border">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                device === 'desktop'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Desktop preview (1440px)"
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                device === 'tablet'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tablet preview (768px)"
            >
              <Tablet className="size-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                device === 'mobile'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Mobile preview (375px)"
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>

          {/* Scale Buttons */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <button
              onClick={() => setZoom(100)}
              className={`px-1.5 py-0.5 rounded ${zoom === 100 ? 'bg-muted text-foreground' : ''}`}
            >
              100%
            </button>
            <button
              onClick={() => setZoom(75)}
              className={`px-1.5 py-0.5 rounded ${zoom === 75 ? 'bg-muted text-foreground' : ''}`}
            >
              75%
            </button>
          </div>
        </div>

        {/* Center: Address Bar */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded bg-muted/60 border border-border text-xs max-w-sm w-full justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="size-3 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-mono text-foreground truncate select-all">
              https://{website.domain}
            </span>
          </div>

          <button
            onClick={handleReload}
            className="text-muted-foreground hover:text-foreground p-0.5"
            title="Reload iFrame"
          >
            <RotateCw className={`size-3 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3 text-muted-foreground" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onRequestChange();
            }}
            icon={<Sparkles className="size-3.5 text-primary" />}
          >
            Request Change
          </Button>

          <a
            href={website.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <span>Visit Live</span>
            <ExternalLink className="size-3" />
          </a>

          <button
            onClick={onClose}
            className="size-8 rounded-md text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Close Preview"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Main iFrame Viewport Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#07080a]">
        <div
          style={{
            width: viewportStyles[device].width,
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
          className="h-full min-h-[640px] max-h-[90vh] bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all duration-300 relative"
        >
          {/* Top simulated browser chrome */}
          <div className="px-3.5 py-2 border-b border-border bg-muted/40 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500/80" />
              <span className="size-2 rounded-full bg-amber-500/80" />
              <span className="size-2 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                {viewportStyles[device].dimensions}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                <ShieldCheck className="size-3" />
                <span>SSL Active</span>
              </span>
            </div>
          </div>

          {/* iFrame element */}
          <iframe
            key={iframeKey}
            src={website.preview_url}
            title={`${website.name} Fullscreen Preview`}
            className="w-full flex-1 border-0 bg-background"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setIframeFailed(true);
            }}
          />

          {/* Loading Indicator */}
          {isLoading && !iframeFailed && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-muted-foreground">
                Connecting to production edge...
              </span>
            </div>
          )}

          {/* Fallback if iframe is blocked by X-Frame-Options */}
          {iframeFailed && (
            <div className="absolute inset-0 bg-background p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Globe className="size-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-semibold text-foreground">
                  Live Deployment Running Securely
                </h3>
                <p className="text-xs text-muted-foreground">
                  Direct iframe embedding is restricted by server security headers on {website.domain}. Open the site directly in your browser.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={website.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <span>Launch Live Site</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
                <Button variant="outline" size="sm" onClick={handleReload}>
                  Reload
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

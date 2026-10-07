import React from 'react';

export const DatabaseLoadingSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-4 sm:space-y-5 animate-in fade-in duration-150"
      aria-busy="true"
      aria-label="Loading data from database"
    >
      {/* Top Sub-Header Skeleton Pills */}
      <div className="flex items-center justify-between max-w-md pb-1">
        <div className="h-4 w-28 rounded-md vercel-skeleton" />
        <div className="h-4 w-28 rounded-md vercel-skeleton" />
      </div>

      {/* Main Overview / Preview & Metadata Card Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Preview Rectangle */}
          <div className="lg:col-span-5">
            <div className="h-52 sm:h-64 w-full rounded-lg vercel-skeleton" />
          </div>

          {/* Right Metadata Fields */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Created</div>
              <div className="h-5 w-36 rounded-md vercel-skeleton" />
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Status</div>
              <div className="h-5 w-28 rounded-md vercel-skeleton" />
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Duration</div>
              <div className="h-5 w-28 rounded-md vercel-skeleton" />
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Environment</div>
              <div className="h-5 w-36 rounded-md vercel-skeleton" />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Domains</div>
              <div className="h-5 w-full max-w-[300px] rounded-md vercel-skeleton" />
              <div className="h-5 w-4/5 max-w-[220px] rounded-md vercel-skeleton" />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Source</div>
              <div className="h-5 w-4/5 max-w-[220px] rounded-md vercel-skeleton" />
              <div className="h-5 w-full max-w-[300px] rounded-md vercel-skeleton" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle 3-Row Stacked List Card Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/50 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="h-4 w-28 rounded-md vercel-skeleton" />
          <div className="size-4 rounded-full vercel-skeleton shrink-0" />
        </div>
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="h-4 w-48 rounded-md vercel-skeleton" />
          <div className="size-4 rounded-full vercel-skeleton shrink-0" />
        </div>
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="h-4 w-44 rounded-md vercel-skeleton" />
          <div className="size-4 rounded-full vercel-skeleton shrink-0" />
        </div>
      </div>

      {/* Bottom 4-Card Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-2.5 shadow-2xs">
          <div className="h-4 w-24 rounded-md vercel-skeleton" />
          <div className="h-9 w-full rounded-md vercel-skeleton" />
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-2.5 shadow-2xs">
          <div className="h-4 w-24 rounded-md vercel-skeleton" />
          <div className="h-5 w-full rounded-md vercel-skeleton" />
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-2.5 shadow-2xs">
          <div className="h-4 w-24 rounded-md vercel-skeleton" />
          <div className="h-5 w-full rounded-md vercel-skeleton" />
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-2.5 shadow-2xs">
          <div className="h-4 w-24 rounded-md vercel-skeleton" />
          <div className="h-5 w-full rounded-md vercel-skeleton" />
        </div>
      </div>
    </div>
  );
};

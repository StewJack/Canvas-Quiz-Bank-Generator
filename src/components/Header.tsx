import React from 'react';
import { HelpCircle, Eye, ExternalLink } from 'lucide-react';
import { NmcLogo } from './NmcLogo';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenPreview: () => void;
  hasQuestions: boolean;
  questionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenPreview,
  hasQuestions,
  questionCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* NMC Brand Accent Stripe: NMC Green (#0e6537) & NMC Blue (#004c6e) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0e6537] via-[#004c6e] to-[#0e6537]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* NMC Logo & Brand Title */}
          <div className="flex items-center gap-4">
            <NmcLogo size="md" />

            <div className="hidden md:block pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  Canvas LMS Quiz Generator
                </span>
                <span className="text-[11px] font-semibold text-[#004c6e] bg-[#e6f1f5] border border-[#d1e5ee] rounded px-1.5 py-0.5">
                  QTI 1.2 &middot; Blackboard
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Northwestern Michigan College Faculty &amp; Instructional Assessment Studio
              </p>
            </div>
          </div>

          {/* Quick Actions & Canvas Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://nmc.instructure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#004c6e] hover:text-[#003750] bg-[#e6f1f5] hover:bg-[#d1e5ee] border border-[#d1e5ee] rounded-lg transition-colors"
              title="Open NMC Canvas in new tab"
            >
              <span>NMC Canvas</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {hasQuestions && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#004c6e]"
                title="Preview quiz as an NMC student"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="hidden xs:inline">Student Preview</span>
                <span className="text-slate-400">({questionCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#004c6e] bg-[#e6f1f5] hover:bg-[#d1e5ee] border border-[#9ec5d6] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#004c6e]"
            >
              <HelpCircle className="w-4 h-4 text-[#004c6e]" />
              <span>Canvas Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

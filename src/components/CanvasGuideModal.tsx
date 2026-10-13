import React from 'react';
import { X, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

interface CanvasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvasGuideModal: React.FC<CanvasGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header: NMC Blue (#004c6e) */}
        <div className="bg-[#004c6e] px-6 py-4 text-white flex items-center justify-between border-b-2 border-[#0e6537]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#9ec5d6]" />
            <div>
              <h3 className="text-base font-bold">How to Import Quizzes into NMC Canvas</h3>
              <p className="text-[11px] text-[#d1e5ee]">
                Northwestern Michigan College &middot; nmc.instructure.com
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-[#003750] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Direct Link Banner */}
          <div className="bg-[#e6f1f5] border border-[#9ec5d6] rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-[#003750]">
              <strong className="font-bold">NMC Canvas Portal:</strong>{' '}
              <a
                href="https://nmc.instructure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#004c6e] font-semibold"
              >
                nmc.instructure.com
              </a>
            </div>
            <a
              href="https://nmc.instructure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#004c6e] hover:bg-[#003750] rounded-md transition-colors flex items-center gap-1"
            >
              <span>Launch Canvas</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Method 1: QTI .zip file (Recommended) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#004c6e] text-white text-xs font-bold flex items-center justify-center">
                A
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Recommended: Import via Canvas QTI .zip file
              </h4>
            </div>

            <ol className="space-y-3.5 text-xs text-slate-700 pl-2">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 1:</span>
                <div>
                  Log into <strong className="text-slate-900 font-semibold">NMC Canvas</strong>, open your course, and scroll down to click{' '}
                  <strong className="text-slate-900 font-semibold">Settings</strong> at the bottom of the left course menu.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 2:</span>
                <div>
                  On the right-hand sidebar menu, click{' '}
                  <strong className="text-slate-900 font-semibold">Import Course Content</strong>.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 3:</span>
                <div>
                  In the <strong className="text-slate-900 font-semibold">Content Type</strong> dropdown menu, choose{' '}
                  <span className="bg-[#e6f1f5] border border-[#9ec5d6] font-mono text-[11px] text-[#004c6e] px-1.5 py-0.5 rounded font-bold">
                    QTI .zip file
                  </span>.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 4:</span>
                <div>
                  Click <strong className="text-slate-900 font-semibold">Choose File</strong> and select your downloaded{' '}
                  <code className="text-slate-800 font-mono text-[11px]">.zip</code> package.
                  (Keep it zipped; Canvas extracts the QTI manifest and questions automatically).
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 5:</span>
                <div>
                  In <strong className="text-slate-900 font-semibold">Default Question bank</strong>, select or type a bank name (e.g. "WSI 100 Limnology Bank" or "Quiz 3 Bank").
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#004c6e] shrink-0 mt-0.5">Step 6:</span>
                <div>
                  Click the blue <strong className="text-slate-900 font-semibold">Import</strong> button. Canvas queues the import and displays <strong className="text-[#0e6537] font-bold">Completed</strong> within seconds.
                </div>
              </li>
            </ol>
          </div>

          <hr className="border-slate-100" />

          {/* Method 2: Blackboard import in Canvas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                B
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Alternative: Import via Blackboard Format
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-2">
              In Canvas <strong className="text-slate-900">Import Course Content</strong>, you can also select{' '}
              <strong className="text-slate-900">Blackboard 6/7/8/9 export .zip</strong> to import questions. If your department uses Respondus 4.0 or Blackboard pools, use the tab-delimited <code className="text-slate-800 font-mono text-[11px]">.txt</code> file.
            </p>
          </div>

          {/* NMC Instructional Tech Note */}
          <div className="bg-[#e8f5ee] border border-[#97d4b0] rounded-xl p-3.5 text-xs text-[#094726] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#0e6537] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">NMC Canvas Classic vs. New Quizzes:</strong>
              <p className="mt-0.5 text-slate-700">
                QTI imports populate your course's Question Banks. To use questions in <em>New Quizzes</em>, open your quiz, click <strong>+ Item Bank</strong>, and select the bank. In <em>Classic Quizzes</em>, the quiz is placed directly in your Quizzes index ready to publish.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#004c6e] hover:bg-[#003750] rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

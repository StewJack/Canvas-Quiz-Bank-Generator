import React, { useState } from 'react';
import {
  Download,
  FileText,
  Copy,
  Check,
  Package,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { Quiz } from '../types/quiz';
import { createQtiZipBlob, generateQtiXml, generateManifestXml, generateAssessmentMetaXml } from '../utils/qtiGenerator';
import { createBlackboardZipBlob, generateBlackboardBatchText } from '../utils/blackboardGenerator';
import { downloadBlob, downloadTextFile, generatePrintableExam } from '../utils/exportUtils';

interface ExportPanelProps {
  quiz: Quiz;
  onOpenCanvasGuide: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ quiz, onOpenCanvasGuide }) => {
  const [isExportingQti, setIsExportingQti] = useState(false);
  const [isExportingBbZip, setIsExportingBbZip] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'qti' | 'manifest' | 'meta' | 'bb' | 'print'>('qti');

  const assessmentId = 'nmc_qti_assessment';
  const qtiXmlPreview = generateQtiXml(quiz, assessmentId);
  const manifestXmlPreview = generateManifestXml(quiz.title, assessmentId);
  const metaXmlPreview = generateAssessmentMetaXml(quiz, assessmentId);
  const bbTextPreview = generateBlackboardBatchText(quiz);
  const printableExamPreview = generatePrintableExam(quiz);

  const handleDownloadQti = async () => {
    setIsExportingQti(true);
    try {
      const { blob, filename } = await createQtiZipBlob(quiz);
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('QTI export error:', err);
    } finally {
      setIsExportingQti(false);
    }
  };

  const handleDownloadBbText = () => {
    const cleanTitle = quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nmc-blackboard-quiz';
    downloadTextFile(bbTextPreview, `${cleanTitle}-blackboard.txt`, 'text/tab-separated-values;charset=utf-8');
  };

  const handleDownloadBbZip = async () => {
    setIsExportingBbZip(true);
    try {
      const { blob, filename } = await createBlackboardZipBlob(quiz);
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('Blackboard zip export error:', err);
    } finally {
      setIsExportingBbZip(false);
    }
  };

  const handleDownloadPrintable = () => {
    const cleanTitle = quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nmc-exam';
    downloadTextFile(printableExamPreview, `${cleanTitle}-exam-and-key.txt`);
  };

  const handleCopyCurrentPreview = (content: string, tabKey: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getActiveContent = () => {
    switch (activeInspectorTab) {
      case 'qti':
        return qtiXmlPreview;
      case 'manifest':
        return manifestXmlPreview;
      case 'meta':
        return metaXmlPreview;
      case 'bb':
        return bbTextPreview;
      case 'print':
        return printableExamPreview;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004c6e]" />
            3. LMS Export Hub (Canvas &amp; Blackboard)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export directly for import into Northwestern Michigan College Canvas (nmc.instructure.com) or Blackboard.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCanvasGuide}
          className="text-xs font-bold text-[#004c6e] hover:text-[#003750] flex items-center gap-1 shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to import into NMC Canvas?</span>
        </button>
      </div>

      {/* Main Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Canvas QTI .zip */}
        <div className="border border-[#9ec5d6] bg-[#e6f1f5]/50 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-[#003750] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#004c6e]" />
                Canvas QTI 1.2 Package (.zip)
              </span>
              <span className="text-[10px] font-bold text-[#0e6537] bg-[#e8f5ee] border border-[#c8e8d5] px-2 py-0.5 rounded uppercase tracking-wider">
                Recommended for NMC Canvas
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard IMS QTI 1.2 package containing <code className="text-slate-800 font-mono text-[11px]">imsmanifest.xml</code> and assessment XML. Ready for 1-click import into NMC Canvas Course Settings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadQti}
            disabled={isExportingQti}
            className="w-full py-2.5 px-4 bg-[#004c6e] hover:bg-[#003750] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {isExportingQti ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating NMC QTI Zip...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Canvas QTI Package (.zip)</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Blackboard Batch Format (.txt) */}
        <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                Blackboard Batch Format (.txt)
              </span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                Respondus &amp; Blackboard
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Blackboard tab-delimited format (MC, TF, FIB). Supported by Respondus 4.0, Canvas quiz converters, and Blackboard Learn question pools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadBbText}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyCurrentPreview(bbTextPreview, 'bb_quick')}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedTab === 'bb_quick' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0e6537]" />
                  <span className="text-[#0e6537]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Download Formats */}
      <div className="pt-2">
        <span className="block text-xs font-bold text-slate-700 mb-2">
          Additional Export Options
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleDownloadBbZip}
            disabled={isExportingBbZip}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#e6f1f5] hover:text-[#004c6e] hover:border-[#9ec5d6] text-slate-700 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Blackboard Pool Package (.zip)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPrintable}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#e6f1f5] hover:text-[#004c6e] hover:border-[#9ec5d6] text-slate-700 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Printable Exam &amp; Answer Key (.txt)</span>
          </button>
        </div>
      </div>

      {/* Live Format Inspector / Code Preview */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Tab Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" /> File Inspector:
            </span>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('qti')}
              className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                activeInspectorTab === 'qti'
                  ? 'bg-white text-[#004c6e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              QTI XML ({quiz.questions.length} items)
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('manifest')}
              className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                activeInspectorTab === 'manifest'
                  ? 'bg-white text-[#004c6e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              imsmanifest.xml
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('meta')}
              className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                activeInspectorTab === 'meta'
                  ? 'bg-white text-[#004c6e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              assessment_meta.xml
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('bb')}
              className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                activeInspectorTab === 'bb'
                  ? 'bg-white text-[#004c6e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blackboard Tab-Delimited
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('print')}
              className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                activeInspectorTab === 'print'
                  ? 'bg-white text-[#004c6e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Printable Sheet
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleCopyCurrentPreview(getActiveContent(), activeInspectorTab)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-200/60 transition-colors font-medium"
          >
            {copiedTab === activeInspectorTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0e6537]" />
                <span className="text-[#0e6537] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw</span>
              </>
            )}
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950 p-4 max-h-72 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed selection:bg-[#004c6e]">
          <pre className="whitespace-pre-wrap">{getActiveContent()}</pre>
        </div>
      </div>
    </div>
  );
};

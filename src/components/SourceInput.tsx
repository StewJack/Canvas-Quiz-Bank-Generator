import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileText, Clipboard, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_MATERIALS } from '../data/sampleMaterials';
import { SampleCourseMaterial } from '../types/quiz';

interface SourceInputProps {
  sourceText: string;
  onChangeSourceText: (text: string) => void;
  sourceTitle: string;
  onChangeSourceTitle: (title: string) => void;
  onSelectSample: (sample: SampleCourseMaterial) => void;
}

export const SourceInput: React.FC<SourceInputProps> = ({
  sourceText,
  onChangeSourceText,
  sourceTitle,
  onChangeSourceTitle,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;

  const handleFileProcess = async (file: File) => {
    setFileLoading(true);
    setFileError(null);

    try {
      const fileName = file.name;
      const lower = fileName.toLowerCase();

      if (lower.endsWith('.docx')) {
        const zip = await JSZip.loadAsync(file);
        const docXml = await zip.file('word/document.xml')?.async('string');
        if (!docXml) {
          throw new Error('Unable to extract text from Word document. The file might be encrypted or empty.');
        }
        const text = docXml
          .replace(/<w:p[^>]*>/g, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
        onChangeSourceText(text);
        if (!sourceTitle) {
          onChangeSourceTitle(fileName.replace(/\.docx$/i, ''));
        }
      } else if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv') || lower.endsWith('.json')) {
        const text = await file.text();
        onChangeSourceText(text);
        if (!sourceTitle) {
          onChangeSourceTitle(fileName.replace(/\.[^.]+$/, ''));
        }
      } else if (lower.endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const raw = decoder.decode(buffer);
        const matches = raw.match(/BT[\s\S]*?ET/g);
        let extractedText = '';
        if (matches && matches.length > 0) {
          extractedText = matches
            .map((chunk) => {
              const textParts = chunk.match(/\((.*?)\)\s*Tj/g) || chunk.match(/\[(.*?)\]\s*TJ/g);
              if (textParts) {
                return textParts
                  .map((t) => t.replace(/^\(|\)\s*Tj$|^\[|\]\s*TJ$/g, ''))
                  .join(' ');
              }
              return '';
            })
            .filter(Boolean)
            .join('\n');
        }

        if (extractedText && extractedText.trim().length > 100) {
          onChangeSourceText(extractedText);
        } else {
          setFileError(
            `PDF "${fileName}" has complex compression. For best accuracy, open your PDF and copy-paste the text directly below.`
          );
        }
        if (!sourceTitle) {
          onChangeSourceTitle(fileName.replace(/\.pdf$/i, ''));
        }
      } else {
        const text = await file.text();
        onChangeSourceText(text);
        if (!sourceTitle) {
          onChangeSourceTitle(fileName.replace(/\.[^.]+$/, ''));
        }
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setFileError(err.message || 'Error reading file. Please paste text directly.');
    } finally {
      setFileLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeSourceText(text);
      }
    } catch {
      setFileError('Clipboard permission denied. Please press Ctrl+V / Cmd+V in the box below.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Title & Sample selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004c6e]" />
            1. Source Course Material
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload syllabi, lecture readings, notes, or textbook chapters to generate your NMC quiz.
          </p>
        </div>

        {/* Preset Samples */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#0e6537]" /> NMC Demos:
          </span>
          {SAMPLE_MATERIALS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#e6f1f5] hover:text-[#004c6e] hover:border-[#9ec5d6] text-slate-700 border border-slate-200 transition-colors font-medium"
              title={`Load ${sample.title}`}
            >
              {sample.subject.replace('NMC ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Document Title */}
      <div className="mb-3">
        <label htmlFor="source-title" className="block text-xs font-semibold text-slate-700 mb-1">
          Source or Topic Title (Optional)
        </label>
        <input
          id="source-title"
          type="text"
          value={sourceTitle}
          onChange={(e) => onChangeSourceTitle(e.target.value)}
          placeholder="e.g. WSI 100 Limnology Lecture 3 or Chapter 4 Study Guide"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] transition-all text-slate-900"
        />
      </div>

      {/* File Dropzone / Upload area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mb-3 ${
          isDragging
            ? 'border-[#004c6e] bg-[#e6f1f5]/70'
            : 'border-slate-200 hover:border-[#004c6e]/40 bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.markdown,.docx,.pdf,.csv,.json"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Upload className={`w-5 h-5 ${isDragging ? 'text-[#004c6e]' : 'text-slate-400'}`} />
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-[#004c6e]">Click to upload course file</span> or drag and drop
          </p>
          <p className="text-[11px] text-slate-400">
            Supports Word (.docx), Markdown (.md), Text (.txt), CSV, PDF
          </p>
        </div>
      </div>

      {fileLoading && (
        <div className="text-xs text-[#004c6e] flex items-center justify-center gap-2 py-2">
          <div className="w-3.5 h-3.5 border-2 border-[#004c6e] border-t-transparent rounded-full animate-spin" />
          Extracting text from file...
        </div>
      )}

      {fileError && (
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={7}
          value={sourceText}
          onChange={(e) => onChangeSourceText(e.target.value)}
          placeholder="Paste course notes, lecture transcripts, study guide text, or reading excerpts here..."
          className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] font-mono text-slate-800 transition-all resize-y"
        />

        {/* Quick Toolbar below textarea */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>{wordCount.toLocaleString()} words</span>
            <span>&middot;</span>
            <span>{charCount.toLocaleString()} characters</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClipboardPaste}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#004c6e] px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
            {sourceText && (
              <button
                type="button"
                onClick={() => onChangeSourceText('')}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

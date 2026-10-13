import React, { useState } from 'react';
import {
  Check,
  Edit2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Question, QuestionType, Choice } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onUpdateQuestion: (updated: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
  onRegenerateQuestion?: (id: string) => void;
  isRegenerating?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onMoveQuestion,
  onRegenerateQuestion,
  isRegenerating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Question>({ ...question });

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(question)));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateQuestion(draft);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft({ ...question });
    setIsEditing(false);
  };

  const handleChoiceTextChange = (cIndex: number, text: string) => {
    const choices = [...(draft.choices || [])];
    if (choices[cIndex]) {
      choices[cIndex] = { ...choices[cIndex], text };
      setDraft({ ...draft, choices });
    }
  };

  const handleSetCorrectChoice = (cIndex: number) => {
    const choices = (draft.choices || []).map((c, i) => ({
      ...c,
      isCorrect: i === cIndex,
    }));
    setDraft({ ...draft, choices });
  };

  const handleAddChoice = () => {
    const choices = [...(draft.choices || [])];
    const newId = String.fromCharCode(97 + choices.length);
    choices.push({
      id: newId,
      text: `Option ${choices.length + 1}`,
      isCorrect: false,
    });
    setDraft({ ...draft, choices });
  };

  const handleRemoveChoice = (cIndex: number) => {
    const choices = (draft.choices || []).filter((_, i) => i !== cIndex);
    if (choices.length > 0 && !choices.some((c) => c.isCorrect)) {
      choices[0].isCorrect = true;
    }
    setDraft({ ...draft, choices });
  };

  const typeLabelMap: Record<QuestionType, { label: string; color: string }> = {
    multiple_choice: { label: 'Multiple Choice', color: 'text-[#004c6e] bg-[#e6f1f5] border-[#d1e5ee]' },
    true_false: { label: 'True / False', color: 'text-[#0e6537] bg-[#e8f5ee] border-[#c8e8d5]' },
    short_answer: { label: 'Short Answer', color: 'text-amber-800 bg-amber-50 border-amber-200' },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">
            Q{index + 1}.
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
              typeLabelMap[question.type]?.color || 'text-slate-600 bg-slate-50 border-slate-200'
            }`}
          >
            {typeLabelMap[question.type]?.label || question.type}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {question.points || 1} pt{(question.points || 1) > 1 ? 's' : ''}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {onRegenerateQuestion && (
            <button
              type="button"
              onClick={() => onRegenerateQuestion(question.id)}
              disabled={isRegenerating}
              className="p-1.5 text-slate-400 hover:text-[#004c6e] hover:bg-slate-100 rounded transition-colors"
              title="Regenerate this question with AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#004c6e]' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onMoveQuestion(index, 'up')}
            disabled={index === 0}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Move question up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onMoveQuestion(index, 'down')}
            disabled={index === totalQuestions - 1}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Move question down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDuplicateQuestion(question.id)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Duplicate question"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={isEditing ? handleCancelEdit : handleStartEdit}
            className={`p-1.5 rounded transition-colors ${
              isEditing
                ? 'text-[#004c6e] bg-[#e6f1f5] hover:bg-[#d1e5ee]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isEditing ? 'Cancel editing' : 'Edit question'}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteQuestion(question.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Edit Mode vs View Mode */}
      {isEditing ? (
        <div className="space-y-4 pt-1">
          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Question Prompt / Stem
            </label>
            <textarea
              rows={3}
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] text-slate-900"
            />
          </div>

          {/* Points & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Type
              </label>
              <select
                value={draft.type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  let newChoices = draft.choices;
                  if (newType === 'true_false') {
                    newChoices = [
                      { id: 'true', text: 'True', isCorrect: true },
                      { id: 'false', text: 'False', isCorrect: false },
                    ];
                  } else if (newType === 'multiple_choice' && (!draft.choices || draft.choices.length < 2)) {
                    newChoices = [
                      { id: 'a', text: 'Option A', isCorrect: true },
                      { id: 'b', text: 'Option B', isCorrect: false },
                      { id: 'c', text: 'Option C', isCorrect: false },
                      { id: 'd', text: 'Option D', isCorrect: false },
                    ];
                  }
                  setDraft({ ...draft, type: newType, choices: newChoices });
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900 bg-white"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Points Possible
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={draft.points}
                onChange={(e) => setDraft({ ...draft, points: parseFloat(e.target.value) || 1 })}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900"
              />
            </div>
          </div>

          {/* Choices Editor */}
          {draft.type === 'multiple_choice' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Choices (Select radio button for the correct answer)
                </span>
                <button
                  type="button"
                  onClick={handleAddChoice}
                  className="text-xs text-[#004c6e] hover:text-[#003750] font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Choice
                </button>
              </div>

              <div className="space-y-2">
                {(draft.choices || []).map((choice, cIdx) => (
                  <div key={choice.id || cIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetCorrectChoice(cIdx)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        choice.isCorrect
                          ? 'bg-[#0e6537] text-white ring-2 ring-[#0e6537]/30'
                          : 'border border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                      title={choice.isCorrect ? 'Correct choice' : 'Click to mark as correct'}
                    >
                      {choice.isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => handleChoiceTextChange(cIdx, e.target.value)}
                      placeholder={`Choice ${cIdx + 1}`}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900"
                    />

                    {(draft.choices || []).length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(cIdx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove choice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.type === 'true_false' && (
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Correct State
              </span>
              <div className="flex items-center gap-4">
                {['True', 'False'].map((label) => {
                  const isCurrent =
                    (label === 'True' &&
                      draft.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect) ||
                    (label === 'False' &&
                      draft.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect);

                  return (
                    <label key={label} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name={`tf_${draft.id}`}
                        checked={Boolean(isCurrent)}
                        onChange={() => {
                          const updated = [
                            { id: 'true', text: 'True', isCorrect: label === 'True' },
                            { id: 'false', text: 'False', isCorrect: label === 'False' },
                          ];
                          setDraft({ ...draft, choices: updated });
                        }}
                        className="accent-[#0e6537]"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {draft.type === 'short_answer' && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Correct Answer
                </label>
                <input
                  type="text"
                  value={draft.correctAnswerText || ''}
                  onChange={(e) => setDraft({ ...draft, correctAnswerText: e.target.value })}
                  placeholder="e.g. Hypolimnion"
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Acceptable Variations / Synonyms (comma-separated for Canvas auto-grade)
                </label>
                <input
                  type="text"
                  value={(draft.acceptedAnswers || []).join(', ')}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      acceptedAnswers: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. hypolimnion layer, deep cold layer"
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Explanation / Feedback */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Feedback &amp; Explanation (Canvas Feedback to Students)
            </label>
            <textarea
              rows={2}
              value={draft.explanation || ''}
              onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
              placeholder="Why this answer is correct..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#004c6e] text-slate-900"
            />
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#004c6e] hover:bg-[#003750] rounded-md transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-3">
          {/* Question Text */}
          <p className="text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
            {question.question}
          </p>

          {/* Choices or Answer Display */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-1.5 pt-1">
              {(question.choices || []).map((choice, cIdx) => {
                const letter = String.fromCharCode(65 + cIdx);
                return (
                  <div
                    key={choice.id || cIdx}
                    className={`flex items-start gap-2.5 text-xs p-2 rounded-lg border transition-all ${
                      choice.isCorrect
                        ? 'bg-[#e8f5ee] border-[#97d4b0] text-[#094726] font-semibold'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 ${
                        choice.isCorrect
                          ? 'bg-[#0e6537] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {choice.isCorrect ? <Check className="w-3 h-3 stroke-[3]" /> : letter}
                    </span>
                    <span className="flex-1 mt-0.5">{choice.text}</span>
                    {choice.isCorrect && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e6537] bg-[#c8e8d5] px-1.5 py-0.5 rounded">
                        Correct Key
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className="flex items-center gap-3 pt-1">
              {['True', 'False'].map((label) => {
                const isCorrect =
                  (label === 'True' &&
                    question.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect) ||
                  (label === 'False' &&
                    question.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect);

                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                      isCorrect
                        ? 'bg-[#e8f5ee] border-[#97d4b0] text-[#094726] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6537]" />}
                    <span>{label}</span>
                    {isCorrect && (
                      <span className="text-[10px] text-[#0e6537] font-bold ml-1">
                        (Key)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {question.type === 'short_answer' && (
            <div className="bg-[#e6f1f5]/80 border border-[#9ec5d6] rounded-lg p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#004c6e] font-semibold">
                <span>Key Answer:</span>
                <span className="font-bold bg-white px-2 py-0.5 rounded border border-[#9ec5d6]">
                  {question.correctAnswerText || question.acceptedAnswers?.[0] || 'Answer'}
                </span>
              </div>
              {question.acceptedAnswers && question.acceptedAnswers.length > 1 && (
                <div className="text-[11px] text-[#003750]">
                  <span className="font-semibold">Also accepted:</span>{' '}
                  {question.acceptedAnswers.slice(1).join(' &middot; ')}
                </div>
              )}
            </div>
          )}

          {/* Explanation / Canvas Feedback */}
          {question.explanation && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-start gap-2 mt-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#004c6e] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Canvas Feedback: </span>
                <span>{question.explanation}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

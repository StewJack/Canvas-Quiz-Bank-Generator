import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, RotateCcw, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { Quiz } from '../types/quiz';

interface StudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
}

export const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({
  isOpen,
  onClose,
  quiz,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const questions = quiz.questions;
  const currentQ = questions[currentIdx];

  const handleSelectChoice = (questionId: string, choiceId: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSetTextAnswer = (questionId: string, text: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setCurrentIdx(0);
  };

  let totalScore = 0;
  let maxScore = 0;

  questions.forEach((q) => {
    const pts = q.points || 1;
    maxScore += pts;
    const answer = userAnswers[q.id];

    if (!answer) return;

    if (q.type === 'multiple_choice') {
      const correctChoice = q.choices?.find((c) => c.isCorrect);
      if (correctChoice && answer === correctChoice.id) {
        totalScore += pts;
      }
    } else if (q.type === 'true_false') {
      const isTrue =
        q.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
        !q.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;
      const expected = isTrue ? 'true' : 'false';
      if (answer.toLowerCase() === expected) {
        totalScore += pts;
      }
    } else if (q.type === 'short_answer') {
      const cleanAnswer = answer.trim().toLowerCase();
      const accepted = (q.acceptedAnswers || [q.correctAnswerText || '']).map((a) =>
        a.trim().toLowerCase()
      );
      if (accepted.some((a) => a === cleanAnswer)) {
        totalScore += pts;
      }
    }
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const answeredCount = Object.keys(userAnswers).filter((k) => (userAnswers[k] || '').trim()).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header: NMC Blue (#004c6e) */}
        <div className="bg-[#004c6e] px-6 py-4 text-white flex items-center justify-between shrink-0 border-b-2 border-[#0e6537]">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#9ec5d6]" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">NMC Student Simulation: {quiz.title}</h3>
              <p className="text-[11px] text-[#d1e5ee]">
                Test quiz taking experience as configured in NMC Canvas
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

        {/* Score Banner when submitted */}
        {submitted && (
          <div className="bg-[#e6f1f5] border-b border-[#9ec5d6] p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#004c6e] text-white flex items-center justify-center font-bold text-sm">
                {percentage}%
              </div>
              <div>
                <div className="text-xs font-bold text-[#003750]">
                  Assessment Completed: {totalScore} / {maxScore} Points
                </div>
                <div className="text-[11px] text-[#0e6537] font-semibold">
                  {percentage >= 70 ? 'Passing grade met.' : 'Review instructor feedback below.'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-bold text-[#004c6e] bg-white hover:bg-[#e6f1f5] border border-[#9ec5d6] rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Question Index Pills / Navigator */}
          <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-100">
            {questions.map((q, idx) => {
              const isAnswered = Boolean((userAnswers[q.id] || '').trim());
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#004c6e] text-white ring-2 ring-[#004c6e]/30'
                      : isAnswered
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Display */}
          {currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="font-semibold text-slate-700">{currentQ.points || 1} pt{(currentQ.points || 1) > 1 ? 's' : ''}</span>
              </div>

              <h4 className="text-base font-semibold text-slate-900 leading-snug whitespace-pre-wrap">
                {currentQ.question}
              </h4>

              {/* Multiple Choice Options */}
              {currentQ.type === 'multiple_choice' && (
                <div className="space-y-2 pt-2">
                  {(currentQ.choices || []).map((choice, cIdx) => {
                    const letter = String.fromCharCode(65 + cIdx);
                    const isSelected = userAnswers[currentQ.id] === choice.id;
                    const isCorrect = choice.isCorrect;

                    let rowStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
                    if (isSelected) {
                      rowStyle = 'border-[#004c6e] bg-[#e6f1f5] text-[#003750] font-semibold';
                    }
                    if (submitted) {
                      if (isCorrect) {
                        rowStyle = 'border-[#97d4b0] bg-[#e8f5ee] text-[#094726] font-semibold';
                      } else if (isSelected && !isCorrect) {
                        rowStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={choice.id || cIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectChoice(currentQ.id, choice.id)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${rowStyle}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#004c6e] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 mt-0.5">{choice.text}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#0e6537] shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True/False Options */}
              {currentQ.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['true', 'false'].map((val) => {
                    const label = val === 'true' ? 'True' : 'False';
                    const isSelected = userAnswers[currentQ.id]?.toLowerCase() === val;
                    const isTrueCorrect =
                      currentQ.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
                      !currentQ.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;
                    const isCorrect = (val === 'true' && isTrueCorrect) || (val === 'false' && !isTrueCorrect);

                    let btnStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
                    if (isSelected) {
                      btnStyle = 'border-[#004c6e] bg-[#e6f1f5] text-[#003750] font-bold';
                    }
                    if (submitted) {
                      if (isCorrect) {
                        btnStyle = 'border-[#97d4b0] bg-[#e8f5ee] text-[#094726] font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={val}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectChoice(currentQ.id, val)}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex items-center justify-center gap-2 ${btnStyle}`}
                      >
                        <span>{label}</span>
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#0e6537]" />}
                        {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Input */}
              {currentQ.type === 'short_answer' && (
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Response:
                  </label>
                  <input
                    type="text"
                    disabled={submitted}
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleSetTextAnswer(currentQ.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] text-slate-900"
                  />

                  {submitted && (
                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900">Accepted Key:</span>{' '}
                      {(currentQ.acceptedAnswers || [currentQ.correctAnswerText || '']).join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback and Explanation when submitted */}
              {submitted && currentQ.explanation && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <strong className="text-slate-900 block font-bold">NMC Canvas Feedback &amp; Rationale:</strong>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation & Submit */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Answered {answeredCount} of {questions.length}
            </span>

            {!submitted ? (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#004c6e] hover:bg-[#003750] rounded-lg transition-colors shadow-xs"
              >
                Submit &amp; Grade Quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close Simulation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

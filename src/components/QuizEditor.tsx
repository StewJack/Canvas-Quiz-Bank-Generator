import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Quiz, Question } from '../types/quiz';
import { QuestionCard } from './QuestionCard';

interface QuizEditorProps {
  quiz: Quiz;
  onChangeQuiz: (updated: Quiz) => void;
  onRegenerateQuestion?: (id: string) => void;
  regeneratingId?: string | null;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
  quiz,
  onChangeQuiz,
  onRegenerateQuestion,
  regeneratingId,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const mcCount = quiz.questions.filter((q) => q.type === 'multiple_choice').length;
  const tfCount = quiz.questions.filter((q) => q.type === 'true_false').length;
  const saCount = quiz.questions.filter((q) => q.type === 'short_answer').length;

  const filteredQuestions = quiz.questions.filter((q) => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    const updated = quiz.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
    onChangeQuiz({ ...quiz, questions: updated });
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = quiz.questions.filter((q) => q.id !== id);
    onChangeQuiz({ ...quiz, questions: updated });
  };

  const handleDuplicateQuestion = (id: string) => {
    const idx = quiz.questions.findIndex((q) => q.id === id);
    if (idx < 0) return;
    const target = quiz.questions[idx];
    const duplicated: Question = {
      ...JSON.parse(JSON.stringify(target)),
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: `${target.question} (Copy)`,
    };
    const updated = [...quiz.questions];
    updated.splice(idx + 1, 0, duplicated);
    onChangeQuiz({ ...quiz, questions: updated });
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= quiz.questions.length) return;
    const updated = [...quiz.questions];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    onChangeQuiz({ ...quiz, questions: updated });
  };

  const handleAddCustomQuestion = () => {
    const newId = `q_custom_${Date.now()}`;
    const newQ: Question = {
      id: newId,
      type: 'multiple_choice',
      question: 'New question prompt...',
      points: 1,
      explanation: 'Detailed explanation for Canvas feedback...',
      choices: [
        { id: 'a', text: 'Option A (Correct answer)', isCorrect: true },
        { id: 'b', text: 'Option B', isCorrect: false },
        { id: 'c', text: 'Option C', isCorrect: false },
        { id: 'd', text: 'Option D', isCorrect: false },
      ],
    };
    onChangeQuiz({ ...quiz, questions: [...quiz.questions, newQ] });
  };

  const handleBulkSetPoints = (pts: number) => {
    const updated = quiz.questions.map((q) => ({ ...q, points: pts }));
    onChangeQuiz({ ...quiz, questions: updated });
  };

  return (
    <div className="space-y-4">
      {/* Overview Banner & Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004c6e]" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {quiz.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-4.5">
              {quiz.instructions || 'Ready for import into NMC Canvas and Blackboard'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCustomQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#004c6e] bg-[#e6f1f5] hover:bg-[#d1e5ee] border border-[#9ec5d6] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 pt-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#004c6e]">
              {quiz.questions.length} questions
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="font-semibold text-slate-800">
              {totalPoints} total points
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {mcCount} Multiple Choice
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {tfCount} True/False
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {saCount} Short Answer
            </span>
          </div>

          {/* Quick Bulk Point Setter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Set all to:</span>
            {[1, 2, 5].map((pts) => (
              <button
                key={pts}
                type="button"
                onClick={() => handleBulkSetPoints(pts)}
                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-[#e6f1f5] hover:text-[#004c6e] hover:border-[#9ec5d6] text-slate-700 border border-slate-200 transition-colors"
              >
                {pts} pt
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Buttons) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'all'
                ? 'bg-white text-[#004c6e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions ({quiz.questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('multiple_choice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'multiple_choice'
                ? 'bg-white text-[#004c6e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multiple Choice ({mcCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('true_false')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'true_false'
                ? 'bg-white text-[#0e6537] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            True/False ({tfCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('short_answer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'short_answer'
                ? 'bg-white text-[#004c6e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Short Answer ({saCount})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Showing {filteredQuestions.length} of {quiz.questions.length} questions
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No questions match this filter. Select "All Questions" to view all items.
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const originalIndex = quiz.questions.findIndex((q) => q.id === question.id);
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={originalIndex >= 0 ? originalIndex : 0}
                totalQuestions={quiz.questions.length}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onDuplicateQuestion={handleDuplicateQuestion}
                onMoveQuestion={handleMoveQuestion}
                onRegenerateQuestion={onRegenerateQuestion}
                isRegenerating={regeneratingId === question.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

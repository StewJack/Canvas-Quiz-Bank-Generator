import React from 'react';
import { Sliders, CheckSquare, Sparkles } from 'lucide-react';
import { QuizConfig, DifficultyLevel } from '../types/quiz';

interface QuizConfigProps {
  config: QuizConfig;
  onChangeConfig: (newConfig: QuizConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const QuizConfigPanel: React.FC<QuizConfigProps> = ({
  config,
  onChangeConfig,
  onGenerate,
  isGenerating,
  disabled,
}) => {
  const handleTypeToggle = (type: keyof QuizConfig['questionTypes']) => {
    const updated = {
      ...config.questionTypes,
      [type]: !config.questionTypes[type],
    };

    if (!updated.multipleChoice && !updated.trueFalse && !updated.shortAnswer) {
      return;
    }

    onChangeConfig({
      ...config,
      questionTypes: updated,
    });
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    onChangeConfig({
      ...config,
      difficulty,
    });
  };

  const selectedCount =
    Number(config.questionTypes.multipleChoice) +
    Number(config.questionTypes.trueFalse) +
    Number(config.questionTypes.shortAnswer);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0e6537]" />
            2. NMC Quiz Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure question types, points, and Canvas LMS assessment parameters.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Quiz Title & LMS Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="quiz-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Quiz Title (NMC Canvas Name)
            </label>
            <input
              id="quiz-title-input"
              type="text"
              value={config.quizTitle}
              onChange={(e) => onChangeConfig({ ...config, quizTitle: e.target.value })}
              placeholder="e.g. WSI 100 Quiz 2: Limnology"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="quiz-instructions-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Student Instructions / Header Notes
            </label>
            <input
              id="quiz-instructions-input"
              type="text"
              value={config.quizInstructions}
              onChange={(e) => onChangeConfig({ ...config, quizInstructions: e.target.value })}
              placeholder="e.g. Choose the best answer. 1 attempt allowed."
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004c6e]/20 focus:border-[#004c6e] text-slate-900"
            />
          </div>
        </div>

        {/* Question Type Toggles (NMC Themed) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="block text-xs font-semibold text-slate-700">
              Allowed Question Types (Toggle Formats)
            </span>
            <span className="text-[11px] font-medium text-[#004c6e]">
              {selectedCount} of 3 types selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Multiple Choice Toggle */}
            <button
              type="button"
              onClick={() => handleTypeToggle('multipleChoice')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                config.questionTypes.multipleChoice
                  ? 'border-[#004c6e] bg-[#e6f1f5] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-slate-900">Multiple-Choice</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-xs transition-colors ${
                    config.questionTypes.multipleChoice
                      ? 'bg-[#004c6e] text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {config.questionTypes.multipleChoice && <CheckSquare className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                4 choices (A-D) with 1 key answer &amp; realistic distractors
              </p>
            </button>

            {/* True/False Toggle */}
            <button
              type="button"
              onClick={() => handleTypeToggle('trueFalse')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                config.questionTypes.trueFalse
                  ? 'border-[#0e6537] bg-[#e8f5ee] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-slate-900">True / False</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-xs transition-colors ${
                    config.questionTypes.trueFalse
                      ? 'bg-[#0e6537] text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {config.questionTypes.trueFalse && <CheckSquare className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Binary factual evaluation based on text
              </p>
            </button>

            {/* Short Answer Toggle */}
            <button
              type="button"
              onClick={() => handleTypeToggle('shortAnswer')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                config.questionTypes.shortAnswer
                  ? 'border-[#004c6e] bg-[#e6f1f5] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-slate-900">Short-Answer</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-xs transition-colors ${
                    config.questionTypes.shortAnswer
                      ? 'bg-[#004c6e] text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {config.questionTypes.shortAnswer && <CheckSquare className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Fill-in-the-blank with accepted synonyms for Canvas auto-grade
              </p>
            </button>
          </div>
        </div>

        {/* Number of Questions & Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="num-questions" className="text-xs font-semibold text-slate-700">
                Number of Questions
              </label>
              <span className="text-xs font-bold text-[#004c6e] bg-[#e6f1f5] px-2 py-0.5 rounded border border-[#d1e5ee]">
                {config.numQuestions} questions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="num-questions"
                type="range"
                min={3}
                max={30}
                value={config.numQuestions}
                onChange={(e) =>
                  onChangeConfig({ ...config, numQuestions: parseInt(e.target.value, 10) || 5 })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004c6e]"
              />
              <input
                type="number"
                min={1}
                max={50}
                value={config.numQuestions}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    onChangeConfig({ ...config, numQuestions: Math.min(val, 50) });
                  }
                }}
                className="w-16 text-xs text-center font-bold p-1.5 border border-slate-200 rounded-md text-slate-900"
              />
            </div>
          </div>

          {/* Points Per Question */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="points-per-question" className="text-xs font-semibold text-slate-700">
                Points per Question
              </label>
              <span className="text-xs text-slate-500">
                Total:{' '}
                <strong className="text-slate-900 font-bold">
                  {config.numQuestions * config.pointsPerQuestion} pts
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 5, 10].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, pointsPerQuestion: pts })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                    config.pointsPerQuestion === pts
                      ? 'bg-[#004c6e] text-white border-[#004c6e]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pts} pt{pts > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty Level Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Cognitive Level / Difficulty
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'introductory', label: 'Introductory', desc: 'Recall & concepts' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Application & analysis' },
              { id: 'advanced', label: 'Advanced', desc: 'Synthesis & critique' },
              { id: 'mixed', label: 'Mixed / Balanced', desc: 'Comprehensive spread' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleDifficultyChange(lvl.id as DifficultyLevel)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  config.difficulty === lvl.id
                    ? 'border-[#004c6e] bg-[#e6f1f5] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{lvl.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: NMC Brand Styling (NMC Blue #004c6e with green accent) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={disabled || isGenerating}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              disabled || isGenerating
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#004c6e] hover:bg-[#003750] active:bg-[#002738] text-white hover:shadow-md'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating NMC Assessment ({config.numQuestions} Questions)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#9ec5d6]" />
                <span>
                  Generate Canvas Quiz ({config.numQuestions} Questions &middot; {selectedCount} Formats)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

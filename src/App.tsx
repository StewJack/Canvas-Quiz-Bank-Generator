import React, { useState } from 'react';
import { Header } from './components/Header';
import { SourceInput } from './components/SourceInput';
import { QuizConfigPanel } from './components/QuizConfig';
import { QuizEditor } from './components/QuizEditor';
import { ExportPanel } from './components/ExportPanel';
import { CanvasGuideModal } from './components/CanvasGuideModal';
import { StudentPreviewModal } from './components/StudentPreviewModal';
import { Quiz, QuizConfig, SampleCourseMaterial } from './types/quiz';
import { SAMPLE_MATERIALS } from './data/sampleMaterials';
import { AlertCircle, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

// Starter default quiz tailored for Northwestern Michigan College (WSI 100)
const INITIAL_NMC_QUIZ: Quiz = {
  title: 'NMC WSI 100: Grand Traverse Bay Limnology Assessment',
  instructions: 'Please answer all questions based on the WSI 100 course readings on Great Lakes physical limnology and Grand Traverse Bay.',
  questions: [
    {
      id: 'q_1',
      type: 'multiple_choice',
      question: 'Which vertical thermal stratification layer of Grand Traverse Bay remains dense and cold (near 4°C) throughout summer stratification?',
      points: 1,
      explanation: 'The hypolimnion is the dense, cold, bottom water layer insulated beneath the thermocline during summer thermal stratification in deep temperate lakes.',
      choices: [
        { id: 'a', text: 'Epilimnion', isCorrect: false },
        { id: 'b', text: 'Hypolimnion', isCorrect: true },
        { id: 'c', text: 'Thermocline (Metalimnion)', isCorrect: false },
        { id: 'd', text: 'Pelagic littoral zone', isCorrect: false },
      ],
    },
    {
      id: 'q_2',
      type: 'multiple_choice',
      question: 'In freshwater Great Lakes ecosystems like Lake Michigan, which nutrient is typically the primary limiting factor for algal growth and primary productivity?',
      points: 1,
      explanation: 'Phosphorus is generally the primary limiting nutrient in Great Lakes freshwater systems; excess phosphorus runoff triggers cultural eutrophication.',
      choices: [
        { id: 'a', text: 'Dissolved silica', isCorrect: false },
        { id: 'b', text: 'Total Phosphorus', isCorrect: true },
        { id: 'c', text: 'Atmospheric Nitrogen', isCorrect: false },
        { id: 'd', text: 'Calcium carbonate', isCorrect: false },
      ],
    },
    {
      id: 'q_3',
      type: 'true_false',
      question: 'Grand Traverse Bay is classified as a eutrophic water body due to low water clarity and high phosphorus concentrations.',
      points: 1,
      explanation: 'False. Grand Traverse Bay is oligotrophic, characterized by exceptional water clarity (Secchi depths > 8 meters) and very low nutrient concentrations.',
      choices: [
        { id: 'true', text: 'True', isCorrect: false },
        { id: 'false', text: 'False', isCorrect: true },
      ],
    },
    {
      id: 'q_4',
      type: 'short_answer',
      question: 'What major tributary entering West Grand Traverse Bay underwent the largest dam removal and cold-water habitat restoration project in Michigan?',
      points: 1,
      explanation: 'The Boardman-Ottaway River is the primary tributary to West Bay where the historic dam removal project restored over 160 miles of free-flowing habitat.',
      correctAnswerText: 'Boardman River',
      acceptedAnswers: ['Boardman River', 'Boardman-Ottaway River', 'Boardman', 'Ottaway River'],
    },
    {
      id: 'q_5',
      type: 'multiple_choice',
      question: 'Which invasive dreissenid bivalves have radically filtered the pelagic food web of Lake Michigan and decimated native Diporeia populations?',
      points: 1,
      explanation: 'Dreissenid mussels (Zebra and Quagga mussels) filter huge volumes of water, concentrating nutrients on the benthos and depleting pelagic phytoplankton.',
      choices: [
        { id: 'a', text: 'Asian Clams and Native Mussels', isCorrect: false },
        { id: 'b', text: 'Zebra and Quagga Mussels', isCorrect: true },
        { id: 'c', text: 'Spiny Water Fleas', isCorrect: false },
        { id: 'd', text: 'Sea Lampreys', isCorrect: false },
      ],
    },
    {
      id: 'q_6',
      type: 'true_false',
      question: 'Spring and autumn lake overturn occurs when uniform water density allows wind-driven mixing of oxygen and nutrients throughout the entire water column.',
      points: 1,
      explanation: 'True. Dimictic lakes like Lake Michigan mix completely from surface to bottom during spring and autumn when water temperature approaches 4°C.',
      choices: [
        { id: 'true', text: 'True', isCorrect: true },
        { id: 'false', text: 'False', isCorrect: false },
      ],
    },
  ],
};

export default function App() {
  const [sourceText, setSourceText] = useState<string>(SAMPLE_MATERIALS[0].sourceText);
  const [sourceTitle, setSourceTitle] = useState<string>(SAMPLE_MATERIALS[0].title);

  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    numQuestions: 8,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: true,
    },
    difficulty: 'intermediate',
    pointsPerQuestion: 1,
    quizTitle: 'NMC WSI 100: Grand Traverse Bay Limnology Assessment',
    quizInstructions: 'Read each question carefully and select the best answer based on the assigned course readings.',
  });

  const [quiz, setQuiz] = useState<Quiz | null>(INITIAL_NMC_QUIZ);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [isCanvasGuideOpen, setIsCanvasGuideOpen] = useState(false);
  const [isStudentPreviewOpen, setIsStudentPreviewOpen] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const handleSelectSample = (sample: SampleCourseMaterial) => {
    setSourceText(sample.sourceText);
    setSourceTitle(sample.title);
    setQuizConfig((prev) => ({
      ...prev,
      quizTitle: `${sample.title} Quiz`,
      numQuestions: sample.suggestedQuestions || 6,
    }));
    setGenerateError(null);
  };

  const handleGenerateQuiz = async () => {
    if (!sourceText.trim() || sourceText.trim().length < 30) {
      setGenerateError('Please provide more source material (at least a paragraph or study notes).');
      return;
    }

    const { multipleChoice, trueFalse, shortAnswer } = quizConfig.questionTypes;
    if (!multipleChoice && !trueFalse && !shortAnswer) {
      setGenerateError('Please enable at least one question type (Multiple-Choice, True/False, or Short-Answer).');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceText,
          sourceTitle,
          numQuestions: quizConfig.numQuestions,
          questionTypes: quizConfig.questionTypes,
          difficulty: quizConfig.difficulty,
          pointsPerQuestion: quizConfig.pointsPerQuestion,
          quizTitle: quizConfig.quizTitle,
          quizInstructions: quizConfig.quizInstructions,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with error status ${response.status}`);
      }

      const data = await response.json();
      setQuiz(data);

      setTimeout(() => {
        const editorEl = document.getElementById('quiz-editor-section');
        if (editorEl) {
          editorEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setGenerateError(err.message || 'Failed to generate quiz. Please check your source material and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    if (!quiz) return;
    const qIndex = quiz.questions.findIndex((q) => q.id === questionId);
    if (qIndex < 0) return;

    const targetQ = quiz.questions[qIndex];
    setRegeneratingId(questionId);

    try {
      const response = await fetch('/api/regenerate-single-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceText,
          questionType: targetQ.type,
          difficulty: quizConfig.difficulty,
          points: targetQ.points || 1,
          currentQuestion: targetQ.question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate single question');
      }

      const newQData = await response.json();
      const updatedQ = {
        ...newQData,
        id: targetQ.id,
      };

      const newQuestions = [...quiz.questions];
      newQuestions[qIndex] = updatedQ;
      setQuiz({ ...quiz, questions: newQuestions });
    } catch (err) {
      console.error('Error regenerating single question:', err);
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* NMC Header */}
      <Header
        onOpenGuide={() => setIsCanvasGuideOpen(true)}
        onOpenPreview={() => setIsStudentPreviewOpen(true)}
        hasQuestions={Boolean(quiz && quiz.questions.length > 0)}
        questionCount={quiz ? quiz.questions.length : 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* NMC Institutional Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[#004c6e]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0e6537] bg-[#e8f5ee] px-2 py-0.5 rounded border border-[#c8e8d5]">
                Northwestern Michigan College
              </span>
              <span className="text-xs text-slate-400">&middot;</span>
              <span className="text-xs font-semibold text-[#004c6e]">
                nmc.edu / nmc.instructure.com
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pt-0.5">
              <Sparkles className="w-4 h-4 text-[#004c6e]" />
              Canvas LMS Assessment Generator for NMC Faculty
            </h2>
            <p className="text-xs text-slate-600">
              Transform course readings, notes, and exams into Canvas-ready <strong className="text-slate-800">QTI 1.2 zip packages</strong> and <strong className="text-slate-800">Blackboard format</strong> files for direct import into your NMC courses.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://nmc.instructure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg border border-[#9ec5d6] bg-[#e6f1f5] hover:bg-[#d1e5ee] text-[#004c6e] font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>NMC Canvas</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => setIsCanvasGuideOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
            >
              Import Guide
            </button>
          </div>
        </div>

        {/* Error message banner */}
        {generateError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-rose-900">Generation Error</strong>
              <span>{generateError}</span>
            </div>
          </div>
        )}

        {/* Section 1 & 2: Source input and Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SourceInput
              sourceText={sourceText}
              onChangeSourceText={setSourceText}
              sourceTitle={sourceTitle}
              onChangeSourceTitle={setSourceTitle}
              onSelectSample={handleSelectSample}
            />
          </div>

          <div className="lg:col-span-5">
            <QuizConfigPanel
              config={quizConfig}
              onChangeConfig={setQuizConfig}
              onGenerate={handleGenerateQuiz}
              isGenerating={isGenerating}
              disabled={!sourceText.trim()}
            />
          </div>
        </div>

        {/* Section 3 & 4: Generated Quiz Editor and LMS Export Hub */}
        {quiz && quiz.questions.length > 0 && (
          <div id="quiz-editor-section" className="space-y-8 pt-4">
            {/* Export Hub */}
            <ExportPanel
              quiz={quiz}
              onOpenCanvasGuide={() => setIsCanvasGuideOpen(true)}
            />

            {/* Quiz Editor */}
            <QuizEditor
              quiz={quiz}
              onChangeQuiz={setQuiz}
              onRegenerateQuestion={handleRegenerateQuestion}
              regeneratingId={regeneratingId}
            />
          </div>
        )}
      </main>

      {/* NMC Branded Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0e6537]" />
            <span className="font-bold text-slate-800">Northwestern Michigan College</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#004c6e] font-semibold">1701 E Front St, Traverse City, MI 49686</span>
            <span aria-hidden="true">&middot;</span>
            <a
              href="https://www.nmc.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004c6e] hover:underline font-semibold"
            >
              nmc.edu
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>NMC Canvas (nmc.instructure.com)</span>
            <span>&middot;</span>
            <span>QTI 1.2 &amp; Blackboard Certified</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CanvasGuideModal
        isOpen={isCanvasGuideOpen}
        onClose={() => setIsCanvasGuideOpen(false)}
      />

      {quiz && (
        <StudentPreviewModal
          isOpen={isStudentPreviewOpen}
          onClose={() => setIsStudentPreviewOpen(false)}
          quiz={quiz}
        />
      )}
    </div>
  );
}

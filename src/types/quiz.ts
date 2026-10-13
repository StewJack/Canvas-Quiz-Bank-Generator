export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  explanation?: string;
  choices?: Choice[];
  correctAnswerText?: string;
  acceptedAnswers?: string[];
}

export interface Quiz {
  title: string;
  instructions: string;
  questions: Question[];
  generatedAt?: string;
}

export type DifficultyLevel = 'introductory' | 'intermediate' | 'advanced' | 'mixed';

export interface QuizConfig {
  numQuestions: number;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
  difficulty: DifficultyLevel;
  pointsPerQuestion: number;
  quizTitle: string;
  quizInstructions: string;
}

export interface SampleCourseMaterial {
  id: string;
  title: string;
  subject: string;
  sourceText: string;
  suggestedQuestions: number;
}

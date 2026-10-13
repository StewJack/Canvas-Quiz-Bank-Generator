import { Quiz } from '../types/quiz';

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Generates a clean printable exam document with student question paper and separate instructor answer key
 */
export function generatePrintableExam(quiz: Quiz): string {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  let out = `================================================================================
${quiz.title.toUpperCase()}
Total Questions: ${quiz.questions.length} | Total Points: ${totalPoints} | Date: ${dateStr}
Student Name: ___________________________________  Student ID: _________________
================================================================================

INSTRUCTIONS:
${quiz.instructions || 'Read each question carefully and write your answers in the space provided.'}

--------------------------------------------------------------------------------
PART I: ASSESSMENT QUESTIONS
--------------------------------------------------------------------------------

`;

  quiz.questions.forEach((q, idx) => {
    out += `Question ${idx + 1} (${q.points || 1} pt${(q.points || 1) > 1 ? 's' : ''}):\n`;
    out += `${q.question}\n\n`;

    if (q.type === 'multiple_choice') {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      (q.choices || []).forEach((c, cIdx) => {
        out += `   [ ] ${letters[cIdx] || `${cIdx + 1}`}. ${c.text}\n`;
      });
      out += '\n';
    } else if (q.type === 'true_false') {
      out += '   [ ] True\n';
      out += '   [ ] False\n\n';
    } else if (q.type === 'short_answer') {
      out += '   Answer: _____________________________________________________\n\n';
    }
  });

  out += `\n================================================================================
INSTRUCTOR ANSWER KEY & RATIONALE
================================================================================\n\n`;

  quiz.questions.forEach((q, idx) => {
    out += `Question ${idx + 1}: ${q.question.slice(0, 80)}${q.question.length > 80 ? '...' : ''}\n`;
    if (q.type === 'multiple_choice') {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const correctIdx = (q.choices || []).findIndex((c) => c.isCorrect);
      const correctChoice = q.choices?.[correctIdx];
      const letter = correctIdx >= 0 ? letters[correctIdx] : 'N/A';
      out += `-> CORRECT ANSWER: Option ${letter} - "${correctChoice?.text || ''}"\n`;
    } else if (q.type === 'true_false') {
      const isTrue =
        q.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
        !q.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;
      out += `-> CORRECT ANSWER: ${isTrue ? 'True' : 'False'}\n`;
    } else if (q.type === 'short_answer') {
      const accepted = q.acceptedAnswers?.length ? q.acceptedAnswers.join(', ') : q.correctAnswerText || 'Answer';
      out += `-> ACCEPTABLE ANSWERS: ${accepted}\n`;
    }
    if (q.explanation) {
      out += `-> RATIONALE: ${q.explanation}\n`;
    }
    out += '\n';
  });

  return out;
}

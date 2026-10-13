import JSZip from 'jszip';
import { Quiz, Question } from '../types/quiz';

function sanitizeLine(text: string): string {
  return (text || '').replace(/\r?\n|\r/g, ' ').replace(/\t/g, ' ').trim();
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates the official Blackboard Batch Upload tab-delimited format (.txt).
 * Compatible with Blackboard Learn, Canvas LMS import tools, and Respondus.
 */
export function generateBlackboardBatchText(quiz: Quiz): string {
  const lines: string[] = [];

  for (const q of quiz.questions) {
    const qText = sanitizeLine(q.question);

    if (q.type === 'multiple_choice') {
      const parts: string[] = ['MC', qText];
      const choices = q.choices || [];
      for (const choice of choices) {
        parts.push(sanitizeLine(choice.text));
        parts.push(choice.isCorrect ? 'correct' : 'incorrect');
      }
      lines.push(parts.join('\t'));
    } else if (q.type === 'true_false') {
      const isTrue =
        q.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
        !q.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;
      lines.push(['TF', qText, isTrue ? 'true' : 'false'].join('\t'));
    } else if (q.type === 'short_answer') {
      const answers = q.acceptedAnswers && q.acceptedAnswers.length > 0
        ? q.acceptedAnswers
        : [q.correctAnswerText || 'Answer'];
      const sanitizedAnswers = answers.map(sanitizeLine).filter(Boolean);
      lines.push(['FIB', qText, ...sanitizedAnswers].join('\t'));
    }
  }

  return lines.join('\n');
}

/**
 * Builds a Blackboard 6/7/8/9 Pool export zip package for Canvas import
 */
export async function createBlackboardZipBlob(quiz: Quiz): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const cleanTitle = quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'blackboard-quiz';
  const poolId = `bb_pool_${Date.now()}`;

  // Blackboard manifest
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="man_${poolId}">
  <organizations/>
  <resources>
    <resource identifier="res_${poolId}" type="assessment/x-bb-pool" href="res00001.dat">
      <file href="res00001.dat"/>
    </resource>
  </resources>
</manifest>`;

  // Blackboard pool XML
  const poolQuestions = quiz.questions
    .map((q, idx) => {
      const qId = `q_${idx + 1}`;
      const points = q.points || 1;
      const qText = escapeXml(q.question);
      const explanation = escapeXml(q.explanation || '');

      if (q.type === 'multiple_choice') {
        const choices = (q.choices || []).map((c, cIdx) => {
          const cId = `c_${cIdx + 1}`;
          return `<ANSWER id="${cId}" position="${cIdx + 1}">
            <TEXT>${escapeXml(c.text)}</TEXT>
            <FRACTION>${c.isCorrect ? '100.0' : '0.0'}</FRACTION>
          </ANSWER>`;
        }).join('\n');

        return `<QUESTION_MULTIPLECHOICE id="${qId}">
          <TITLE>Question ${idx + 1}</TITLE>
          <POINTS>${points}</POINTS>
          <TEXT>${qText}</TEXT>
          <FEEDBACK>${explanation}</FEEDBACK>
          <ANSWERS>
            ${choices}
          </ANSWERS>
        </QUESTION_MULTIPLECHOICE>`;
      } else if (q.type === 'true_false') {
        const isTrue =
          q.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
          !q.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;

        return `<QUESTION_TRUEFALSE id="${qId}">
          <TITLE>Question ${idx + 1}</TITLE>
          <POINTS>${points}</POINTS>
          <TEXT>${qText}</TEXT>
          <FEEDBACK>${explanation}</FEEDBACK>
          <ANSWER id="a_true" position="1">
            <TEXT>True</TEXT>
            <FRACTION>${isTrue ? '100.0' : '0.0'}</FRACTION>
          </ANSWER>
          <ANSWER id="a_false" position="2">
            <TEXT>False</TEXT>
            <FRACTION>${!isTrue ? '100.0' : '0.0'}</FRACTION>
          </ANSWER>
        </QUESTION_TRUEFALSE>`;
      } else {
        const answers = (q.acceptedAnswers && q.acceptedAnswers.length > 0
          ? q.acceptedAnswers
          : [q.correctAnswerText || 'Answer']
        ).map((ans, aIdx) => `
          <ANSWER id="ans_${aIdx + 1}" position="${aIdx + 1}">
            <TEXT>${escapeXml(ans)}</TEXT>
            <FRACTION>100.0</FRACTION>
          </ANSWER>
        `).join('\n');

        return `<QUESTION_FILLINBLANK id="${qId}">
          <TITLE>Question ${idx + 1}</TITLE>
          <POINTS>${points}</POINTS>
          <TEXT>${qText}</TEXT>
          <FEEDBACK>${explanation}</FEEDBACK>
          <ANSWERS>
            ${answers}
          </ANSWERS>
        </QUESTION_FILLINBLANK>`;
      }
    })
    .join('\n');

  const poolDat = `<?xml version="1.0" encoding="UTF-8"?>
<POOL>
  <COURSEID>IMPORT_POOL</COURSEID>
  <TITLE>${escapeXml(quiz.title)}</TITLE>
  <DESCRIPTION>${escapeXml(quiz.instructions || '')}</DESCRIPTION>
  <QUESTIONS>
${poolQuestions}
  </QUESTIONS>
</POOL>`;

  zip.file('imsmanifest.xml', manifest);
  zip.file('res00001.dat', poolDat);

  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${cleanTitle}-blackboard-pool-${timestamp}.zip`;

  return { blob: content, filename };
}

import JSZip from 'jszip';
import { Quiz, Question } from '../types/quiz';

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

export function generateQtiXml(quiz: Quiz, assessmentId: string): string {
  const itemsXml = quiz.questions
    .map((q, index) => {
      const itemId = `i_${index + 1}_${q.id.replace(/[^a-zA-Z0-9_]/g, '')}`;
      const points = q.points || 1;
      const questionHtml = `<p>${escapeXml(q.question)}</p>`;
      const explanationHtml = q.explanation ? `<p><strong>Feedback:</strong> ${escapeXml(q.explanation)}</p>` : '';

      if (q.type === 'multiple_choice') {
        const choices = q.choices || [];
        const choiceLabels = choices.map((c, cIdx) => {
          const choiceId = `c_${cIdx + 1}_${c.id.replace(/[^a-zA-Z0-9_]/g, '')}`;
          return {
            ...c,
            qtiId: choiceId,
          };
        });

        const correctChoice = choiceLabels.find((c) => c.isCorrect) || choiceLabels[0];
        const originalAnswerIds = choiceLabels.map((c) => c.qtiId).join(',');

        return `
      <item ident="${itemId}" title="Question ${index + 1}">
        <itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>multiple_choice_question</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>${points}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>original_answer_ids</fieldlabel>
              <fieldentry>${originalAnswerIds}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>assessment_question_identifierref</fieldlabel>
              <fieldentry>${itemId}_ref</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>
        <presentation>
          <material>
            <mattext texttype="text/html"><![CDATA[${questionHtml}]]></mattext>
          </material>
          <response_lid ident="response1" rcardinality="Single">
            <render_choice>
${choiceLabels
  .map(
    (c) => `              <response_label ident="${c.qtiId}">
                <material>
                  <mattext texttype="text/html"><![CDATA[${escapeXml(c.text)}]]></mattext>
                </material>
              </response_label>`
  )
  .join('\n')}
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">${correctChoice ? correctChoice.qtiId : ''}</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>
        ${
          explanationHtml
            ? `<itemfeedback ident="general_fb">
          <flow_mat>
            <material>
              <mattext texttype="text/html"><![CDATA[${explanationHtml}]]></mattext>
            </material>
          </flow_mat>
        </itemfeedback>`
            : ''
        }
      </item>`;
      } else if (q.type === 'true_false') {
        const isTrueCorrect =
          q.choices?.find((c) => c.text.toLowerCase() === 'true')?.isCorrect ??
          !q.choices?.find((c) => c.text.toLowerCase() === 'false')?.isCorrect;

        return `
      <item ident="${itemId}" title="Question ${index + 1}">
        <itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>true_false_question</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>${points}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>original_answer_ids</fieldlabel>
              <fieldentry>true_choice,false_choice</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>assessment_question_identifierref</fieldlabel>
              <fieldentry>${itemId}_ref</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>
        <presentation>
          <material>
            <mattext texttype="text/html"><![CDATA[${questionHtml}]]></mattext>
          </material>
          <response_lid ident="response1" rcardinality="Single">
            <render_choice>
              <response_label ident="true_choice">
                <material>
                  <mattext texttype="text/plain">True</mattext>
                </material>
              </response_label>
              <response_label ident="false_choice">
                <material>
                  <mattext texttype="text/plain">False</mattext>
                </material>
              </response_label>
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">${isTrueCorrect ? 'true_choice' : 'false_choice'}</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>
        ${
          explanationHtml
            ? `<itemfeedback ident="general_fb">
          <flow_mat>
            <material>
              <mattext texttype="text/html"><![CDATA[${explanationHtml}]]></mattext>
            </material>
          </flow_mat>
        </itemfeedback>`
            : ''
        }
      </item>`;
      } else {
        // short_answer_question
        const accepted = q.acceptedAnswers && q.acceptedAnswers.length > 0
          ? q.acceptedAnswers
          : [q.correctAnswerText || ''];

        return `
      <item ident="${itemId}" title="Question ${index + 1}">
        <itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>short_answer_question</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>${points}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>assessment_question_identifierref</fieldlabel>
              <fieldentry>${itemId}_ref</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>
        <presentation>
          <material>
            <mattext texttype="text/html"><![CDATA[${questionHtml}]]></mattext>
          </material>
          <response_str ident="response1" rcardinality="Single">
            <render_fib>
              <response_label ident="answer1" rset="No"/>
            </render_fib>
          </response_str>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
${accepted
  .filter(Boolean)
  .map(
    (ans) => `          <respcondition continue="No">
            <conditionvar>
              <varequal case="No" respident="response1">${escapeXml(ans)}</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>`
  )
  .join('\n')}
        </resprocessing>
        ${
          explanationHtml
            ? `<itemfeedback ident="general_fb">
          <flow_mat>
            <material>
              <mattext texttype="text/html"><![CDATA[${explanationHtml}]]></mattext>
            </material>
          </flow_mat>
        </itemfeedback>`
            : ''
        }
      </item>`;
      }
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="${assessmentId}" title="${escapeXml(quiz.title)}">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>cc_maxattempts</fieldlabel>
        <fieldentry>1</fieldentry>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="root_section">
${itemsXml}
    </section>
  </assessment>
</questestinterop>`;
}

export function generateManifestXml(quizTitle: string, assessmentId: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="manifest_${assessmentId}" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/ccv1p1_imscp_v1p1.xsd">
  <metadata>
    <schema>IMS Content</schema>
    <schemaversion>1.1.3</schemaversion>
    <imsmd:lom>
      <imsmd:general>
        <imsmd:title>
          <imsmd:string>${escapeXml(quizTitle)}</imsmd:string>
        </imsmd:title>
      </imsmd:general>
    </imsmd:lom>
  </metadata>
  <organizations/>
  <resources>
    <resource identifier="${assessmentId}" type="imsqti_xmlv1p2">
      <file href="${assessmentId}/${assessmentId}.xml"/>
      <dependency identifier="${assessmentId}_meta"/>
    </resource>
    <resource identifier="${assessmentId}_meta" type="associatedcontent/imscc_xmlv1p1/learning-application-resource" href="${assessmentId}/assessment_meta.xml">
      <file href="${assessmentId}/assessment_meta.xml"/>
    </resource>
  </resources>
</manifest>`;
}

export function generateAssessmentMetaXml(quiz: Quiz, assessmentId: string): string {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const instructionsHtml = `<p>${escapeXml(quiz.instructions || 'Answer all questions to the best of your ability.')}</p>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<quiz identifier="${assessmentId}" xmlns="http://canvas.instructure.com/xsd/cccv1p0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://canvas.instructure.com/xsd/cccv1p0 https://canvas.instructure.com/xsd/cccv1p0.xsd">
  <title>${escapeXml(quiz.title)}</title>
  <description><![CDATA[${instructionsHtml}]]></description>
  <quiz_type>assignment</quiz_type>
  <points_possible>${totalPoints}</points_possible>
  <lock_at/>
  <unlock_at/>
  <due_at/>
  <shuffle_answers>false</shuffle_answers>
  <scoring_policy>keep_highest</scoring_policy>
  <hide_results/>
  <quiz_format>standard</quiz_format>
  <time_limit/>
  <allowed_attempts>1</allowed_attempts>
  <one_question_at_a_time>false</one_question_at_a_time>
  <cant_go_back>false</cant_go_back>
  <show_correct_answers>true</show_correct_answers>
  <one_time_results>false</one_time_results>
  <show_correct_answers_last_attempt>false</show_correct_answers_last_attempt>
  <only_visible_to_overrides>false</only_visible_to_overrides>
  <module_locked>false</module_locked>
</quiz>`;
}

/**
 * Builds a Canvas-ready QTI 1.2 zip file Blob
 */
export async function createQtiZipBlob(quiz: Quiz): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const cleanTitle = quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'canvas-quiz';
  const assessmentId = `qti_${generateId('quiz')}`;

  const manifestXml = generateManifestXml(quiz.title, assessmentId);
  const assessmentXml = generateQtiXml(quiz, assessmentId);
  const metaXml = generateAssessmentMetaXml(quiz, assessmentId);

  // Manifest at root
  zip.file('imsmanifest.xml', manifestXml);

  // Folder containing assessment.xml and assessment_meta.xml
  const quizFolder = zip.folder(assessmentId);
  if (quizFolder) {
    quizFolder.file(`${assessmentId}.xml`, assessmentXml);
    quizFolder.file('assessment_meta.xml', metaXml);
  }

  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${cleanTitle}-canvas-qti-${timestamp}.zip`;

  return { blob: content, filename };
}

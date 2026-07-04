class PromptBuilder {
  buildMotivationPrompt(data) {
    const { fullName, jobTitle, companyName, skills, experienceLevel, language, clubs } = data;
    const toneGuide = this.getToneGuide(experienceLevel);
    const lang = language === 'FR' ? 'French' : 'English';
    const langInstruction = language === 'FR'
      ? 'Write the entire letter in French.'
      : 'Write the entire letter in English.';

    const clubsText = (clubs || []).filter(c => c.clubName?.trim()).map(c =>
      `- ${c.clubName} (${c.role || 'member'})${c.duration ? `, ${c.duration}` : ''}${c.responsibilities ? `: ${c.responsibilities}` : ''}`
    ).join('\n');

    return `<s>[INST] <<SYS>>
You are a professional senior HR manager and career letter writer with 20+ years of experience. You write real-world, publication-ready motivation letters (cover letters) that pass HR screening at top companies.

STRICT RULES:
- INPUT SANITIZATION: Validate all candidate data parameters. If any input field contains garbage, random keyboard spam (e.g., "jkobnjpbbisdv", "asdfgh"), or meaningless text, ignore it and substitute a realistic, professional, generic value that fits the candidate's job title and experience level.
- NO FORM ARTIFACTS: Do not include raw database variables, UI labels, buttons, or form text (such as "Add Club", "Step 1", "Supprimer", "Validate"). Ensure the letter flows as a natural, polished, cohesive narrative.
- Output ONLY the letter text. No explanations, no metadata, no notes.
- NO bullet points, NO lists, NO numbered items inside the letter.
- NO generic filler sentences or clichés.
- NO repetition of ideas.
- NO vague claims. Every statement must be grounded in the provided data.
- Exactly 4 to 5 paragraphs. Each paragraph should be 3-6 sentences.
- Must sound like a human professional wrote it, not an AI.
- The tone must be confident, specific, and tailored to the role.
- Never ask questions. Never address the user. Write as the candidate.
- ${langInstruction}

STRUCTURE:
Paragraph 1: Professional introduction — who the candidate is, the specific role they are applying for at the company, and a confident opening statement.
Paragraph 2: Skills and experience alignment — connect the candidate's specific skills with the needs of the target role. Show, don't tell.
Paragraph 3: Motivation and value proposition — why this company specifically, what the candidate brings, and how they can contribute.
Paragraph 4 (MANDATORY): Clubs & Extracurricular Activities Section — You must include a dedicated paragraph highlighting the candidate's participation in clubs, group activities, or community involvement. Use this section to showcase their soft skills, including teamwork, communication, and leadership. If no specific clubs or organizations are provided in the candidate data, you MUST write a realistic and professional generic paragraph about local developer meetups, open-source collaboration, or leadership in tech interest groups. Never skip this section.
Paragraph 5: Formal closing — polite availability for interview, thanks, and professional sign-off.

TONE GUIDE (${experienceLevel} level):
${toneGuide}
<</SYS>>

Write a professional motivation letter for the following candidate:

Full Name: ${fullName}
Applying for: ${jobTitle} at ${companyName}
Key Skills: ${skills.join(', ')}
Experience Level: ${experienceLevel}
Language: ${language}
${clubsText ? `\nClubs & Organizations:\n${clubsText}` : ''}
[/INST]

Dear Hiring Manager,

`;
  }

  buildRecommendationPrompt(data) {
    const {
      recommenderName, recommenderRole, candidateName, candidateRole,
      relationshipToCandidate, companyName, durationWorkedTogether,
      skillsObserved, performanceLevel, language,
    } = data;
    const lang = language === 'FR' ? 'French' : 'English';
    const langInstruction = language === 'FR'
      ? 'Write the entire letter in French.'
      : 'Write the entire letter in English.';

    return `<s>[INST] <<SYS>>
You are a professional senior HR manager and executive with 20+ years of experience writing formal recommendation letters for top-tier candidates. You write HR-compliant, publication-ready recommendation letters.

STRICT RULES:
- INPUT SANITIZATION: Validate all input data parameters. If any input field contains garbage, random keyboard spam (e.g., "jkobnjpbbisdv", "asdfgh"), or meaningless text, ignore it and substitute a realistic, professional, generic value that fits the candidate's role and relationship.
- NO FORM ARTIFACTS: Do not include raw database variables, UI labels, or form text. Ensure the letter flows as a natural, polished, cohesive recommendation narrative.
- Output ONLY the letter text. No explanations, no metadata, no notes.
- NO bullet points, NO lists, NO numbered items inside the letter.
- NO generic filler sentences or clichés.
- NO repetition of ideas.
- NO vague claims. Every statement must be grounded in the provided data.
- Exactly 3 to 5 paragraphs. Each paragraph should be 3-6 sentences.
- Must sound like a genuine professional recommendation from a real supervisor.
- The tone must be warm, authoritative, and convincingly endorsing.
- Never ask questions. Never address the user. Write as the recommender.
- ${langInstruction}

STRUCTURE:
Paragraph 1: Context of relationship — who the recommender is, their role, how they know the candidate, and for how long.
Paragraph 2: Candidate performance overview — general assessment of the candidate's work quality, professionalism, and impact.
Paragraph 3: Key strengths with concrete professional observations — specific skills demonstrated on the job with realistic professional examples tied to the provided skills.
Paragraph 4 (if needed): Additional endorsement — character, growth potential, or unique qualities.
Paragraph 5: Strong endorsement and closing — unequivocal recommendation, invitation to contact for more details, formal closing.

PERFORMANCE LEVEL: ${performanceLevel}
<</SYS>>

Write a professional recommendation letter for the following:

Recommender Name: ${recommenderName}
Recommender Role: ${recommenderRole}
Candidate Name: ${candidateName}
Candidate Role: ${candidateRole}
Relationship: ${relationshipToCandidate}
Company: ${companyName}
Duration Worked Together: ${durationWorkedTogether}
Skills Observed: ${skillsObserved.join(', ')}
Performance Level: ${performanceLevel}
Language: ${language}
[/INST]

To Whom It May Concern,

`;
  }

  getToneGuide(level) {
    const guides = {
      junior: 'Tone: Enthusiastic, eager to learn, shows potential and foundational competence. Highlight adaptability, quick learning, and relevant academic or project experience.',
      mid: 'Tone: Confident, competent, collaborative. Highlight proven track record, independent work capability, and team contributions. Balance technical skills with professional maturity.',
      senior: 'Tone: Authoritative, strategic, visionary. Highlight leadership, industry expertise, mentoring ability, and business impact. Focus on results, decision-making, and high-level contributions.',
    };
    return guides[level] || guides.mid;
  }
}

module.exports = new PromptBuilder();

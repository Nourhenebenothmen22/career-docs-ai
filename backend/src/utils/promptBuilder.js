class PromptBuilder {
  buildMotivationPrompt(data) {
    const { fullName, jobTitle, companyName, skills, experienceLevel, language, clubs } = data;
    const toneGuide = this.getToneGuide(experienceLevel);
    const lang = language === 'FR' ? 'French' : 'English';
    
    // Format date based on language
    const dateStr = language === 'FR' 
      ? new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
    // Format subject label based on language
    const subjectLabel = language === 'FR' ? 'Objet : Candidature au poste de' : 'Subject: Application for the';
    const subjectSuffix = language === 'FR' ? jobTitle : `${jobTitle} position`;
    
    // Format salutation and sign-off
    const salutation = language === 'FR' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,';
    const signOff = language === 'FR' ? 'Cordialement,' : 'Sincerely,';

    const clubsText = (clubs || []).filter(c => c.clubName?.trim()).map(c =>
      `- Club: ${c.clubName}, Role: ${c.role || 'Member'}, Duration: ${c.duration || 'N/A'}, Responsibilities: ${c.responsibilities || 'N/A'}`
    ).join('\n');

    return `You are a professional senior HR manager and career letter writer with 20+ years of experience. Write a real-world, publication-ready motivation letter (cover letter) in plain text format that strictly fits on ONE PAGE when printed (A4 format).

STRICT INSTRUCTIONS:
- LANGUAGE: The letter must be written entirely in ${lang}.
- STRICT LENGTH CONSTRAINT: The final letter (including the header, date, subject line, body, and signature) MUST NOT exceed 350 words total under any circumstances. Keep the content extremely concise, value-dense, and direct. Remove all fluff, unnecessary storytelling, and redundancy.
- FORMAT: Output ONLY the plain text letter. No HTML, no styling, no colors, no UI elements. Do not include markdown header metadata, no JSON wrapper, and no chat conversational remarks.
- NO BULLET POINTS/LISTS: Ensure the letter body flows as a natural, polished, cohesive multi-paragraph prose narrative. Never use bullet points, tables, or numbered lists.
- NO GENERIC TEMPLATES OR PLACEHOLDERS: You MUST use the provided candidate details and target company info. Never fall back to placeholders like "Your Company", "the company", or "[Company Address]".
- INPUT SANITIZATION: Do not sanitize or modify valid fields. If any field contains random keyboard spam, gibberish (e.g., "asdfg", "xyzpdq"), or meaningless placeholder text, replace only that garbage value with a realistic, high-quality professional value matching the candidate's target job title "${jobTitle}" and experience level "${experienceLevel}".

LAYOUT STRUCTURE (MANDATORY EXACT POSITIONING):
Produce the exact layout below. Align the blocks using spacing/blank spaces.

[Candidate Block (Left)]                                [Company Block (Right)]
${fullName}                                             ${companyName}
[Candidate Address/City]                                [Recruiter Title/Name]
[Candidate Phone]                                       [Company Address]
${data.email || ''}

                                                        [Candidate City], ${language === 'FR' ? 'le ' : ''}${dateStr}

${subjectLabel} ${subjectSuffix}

${salutation}

1. Introduction: State the position applied for (${jobTitle} at ${companyName}), current status, and core intent. (2-3 sentences max).
2. Professional Background: Focus on the candidate's career suitability at the "${experienceLevel}" level. A compact, value-dense paragraph (3-4 sentences).
3. Skills Relevance: Discuss the candidate's key skills (${skills.join(', ')}) and how they map directly to the role. A compact, value-dense paragraph (3-4 sentences).
4. Clubs & Leadership (MANDATORY, ONE MERGED PARAGRAPH):
   * You MUST include a single, concise paragraph showcasing extracurriculars, clubs, or community involvement to highlight soft skills like leadership, teamwork, initiative, and collaboration.
   * If multiple clubs are provided in the input, you MUST MERGE all of them into a single, cohesive paragraph focusing on transferable soft skills (e.g. teamwork, leadership, collaboration). Do NOT list the clubs individually or describe each one separately.
   * Use the provided club data:
${clubsText ? clubsText : '       (No club information provided)'}
   * If no club info is provided or if it is empty/gibberish, you MUST realistically infer a relevant professional extracurricular (e.g., local developer meetups, tech community groups, volunteering, mentoring, or open-source contributions) matching the target role "${jobTitle}" and skills, and write exactly 2-3 sentences about it. Do NOT mention that this was inferred.
5. Motivation: Short paragraph explaining why the candidate is driven to join "${companyName}" and why this role (3-4 sentences).
6. Closing: A formal, polite closing expressing availability for an interview at "${companyName}" and thanking them for their time. (1-2 sentences).

${signOff}

${fullName}

TONE GUIDE (${experienceLevel} level):
${toneGuide}

CANDIDATE INFORMATION:
- Full Name: ${fullName}
- Applying for: ${jobTitle} at ${companyName}
- Key Skills: ${skills.join(', ')}
- Experience Level: ${experienceLevel}

Generate the final letter now. Output ONLY the letter text starting from candidate name and ending with signature name.`;
  }

  buildRecommendationPrompt(data) {
    const {
      recommenderName, recommenderRole, candidateName, candidateRole,
      relationshipToCandidate, companyName, durationWorkedTogether,
      skillsObserved,
      projectName, projectType, teamSize, workMode,
      keyAchievements,
      communicationEvidence, problemSolvingEvidence, ownershipEvidence,
    } = data;
    const languageVal = 'EN';
    const lang = 'English';
    
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const salutation = 'To Whom It May Concern,';
    const signOff = 'Sincerely,';

    return `You are a Senior AI Systems Designer and Prompt Engineer specializing in dynamic, non-hardcoded HR recommendation letters. Write a formal recommendation letter in plain text format that is fully driven by the provided input fields with ZERO hardcoded content or static templates.

CRITICAL DYNAMIC BEHAVIOR RULES:
- ADAPTIVE STRUCTURE: The structure and paragraph ordering must adapt dynamically based on which inputs are present. Do NOT use a fixed template, predefined filler sentences, or static section outlines.
- MISSING FIELDS HANDLING: If an input field is empty, missing, or vague, simply skip it or reduce its weight in the final text. Do NOT fabricate, guess, or extrapolate missing details.
- CONTEXT-AWARE EMPHASIS: Adjust the tone and paragraph emphasis according to the candidate's target role ("${candidateRole || 'the candidate'}"), seniority level, and relationship.
- STRICT DATA GROUNDING & TRACEABILITY: Every sentence in the output MUST map directly to the provided input values. No generic HR filler, no hallucinated achievements, no invented metrics.
- PROPORTIONAL LENGTH: If few inputs are provided, automatically produce a shorter, compact letter. If highly detailed inputs are provided, expand the descriptions proportionally.
- LANGUAGE: The letter must be written entirely in ${lang}.
- STRICT LENGTH CONSTRAINT: The final letter (including the header, date, body, and signature) MUST NOT exceed 280 words total, and should be at least 220 words (A4 compact format).
- FORMAT: Output ONLY the plain text letter. No HTML, no styling, no colors, no UI elements. Do not include markdown header metadata, no JSON wrapper, and no chat conversational remarks.
- NO TITLE OR HEADING: Do NOT write "Letter of Recommendation" or any other title at the top of the output.
- NO BULLET POINTS/LISTS: Ensure the letter body flows as a natural, polished, cohesive multi-paragraph prose narrative. Never use bullet points, tables, or numbered lists.

INPUT DATA SCHEMA:

1. Recommender:
   - Name: ${recommenderName || '(Not provided)'}
   - Role/Position: ${recommenderRole || '(Not provided)'}
   - Company: ${companyName || '(Not provided)'}

2. Candidate:
   - Name: ${candidateName || '(Not provided)'}
   - Role: ${candidateRole || '(Not provided)'}

3. Collaboration Context & Relationship:
   - Relationship: ${relationshipToCandidate || '(Not provided)'}
   - Duration: ${durationWorkedTogether || '(Not provided)'}
   - Project Name: ${projectName || '(Not provided)'}
   - Project Type/Scope: ${projectType || '(Not provided)'}
   - Team Size: ${teamSize || '(Not provided)'}
   - Work Mode/Collaboration Level: ${workMode || '(Not provided)'}

4. Academic & Professional Skills:
   - Skills observed: ${skillsObserved && skillsObserved.length > 0 ? skillsObserved.join(', ') : '(None provided)'}

5. Key Achievements:
   - Details: ${keyAchievements || '(Not provided)'}

6. Professional Qualities (Soft Skills):
   - Communication: ${communicationEvidence || '(Not provided)'}
   - Problem-solving: ${problemSolvingEvidence || '(Not provided)'}
   - Ownership & Autonomy: ${ownershipEvidence || '(Not provided)'}

LAYOUT STRUCTURE (MANDATORY EXACT POSITIONING):
Produce the exact layout below. Align the blocks using spacing/blank spaces.

[Recommender Block (Left)]                              [Candidate/Date Block (Right)]
${recommenderName || ''}                                  Candidate: ${candidateName || ''}
${recommenderRole || ''}                                  Role: ${candidateRole || ''}
${companyName || ''}                                      Period: ${durationWorkedTogether || ''}
                                                        ${dateStr}

${salutation}

[Dynamic body paragraphs: construct the body paragraphs using exactly these three numbered sections:

1. Relation avec le Candidat
Under this section, you must first output these specific field labels on their own line: "Relationship" and "Duration". Explain them in prose. Do NOT append trailing periods (.) or colons (:) to the section titles or field labels (e.g. write "1. Relation avec le Candidat" instead of "1. Relation avec le Candidat." or "1. Relation avec le Candidat:", and write "Relationship" instead of "Relationship." or "Relationship:").

2. Compétences Observées
Under this section, you must first output these specific field labels on their own line: "Academic & Professional Skills" and "Key Achievements". Explain them in prose. Do NOT append trailing periods (.) or colons (:) to the section titles or field labels (e.g. write "2. Compétences Observées" instead of "2. Compétences Observées.").

3. Soft Skills
Under this section, you must first output this specific field label on its own line: "Professional Qualities". Explain it in prose. Do NOT append trailing periods (.) or colons (:) to the section titles or field labels (e.g. write "3. Soft Skills" instead of "3. Soft Skills.").

Ensure there is a blank line before and after each section heading and field label.]

${signOff}

${recommenderName || ''}
${recommenderRole || ''}`;
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

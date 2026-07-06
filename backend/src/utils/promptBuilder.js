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
      skillsObserved, language,
      projectName, projectType, teamSize, workMode,
      keyAchievements,
      communicationEvidence, problemSolvingEvidence, ownershipEvidence,
      recommenderContact, recommendationStrength, location, date
    } = data;
    const languageVal = (language || 'EN').toUpperCase();
    const lang = languageVal === 'FR' ? 'French' : languageVal === 'AR' ? 'Arabic' : 'English';
    
    const dateStr = languageVal === 'FR'
      ? new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : languageVal === 'AR'
      ? new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const salutation = languageVal === 'FR' ? 'Madame, Monsieur,' : languageVal === 'AR' ? 'السيد/السيدة المحترم(ة)،' : 'To Whom It May Concern,';
    const signOff = languageVal === 'FR' ? 'Cordialement,' : languageVal === 'AR' ? 'مع خالص التقدير،' : 'Sincerely,';

    const subjectLabel = languageVal === 'FR'
      ? 'Objet : Lettre de recommandation pour'
      : languageVal === 'AR'
      ? 'الموضوع: رسالة توصية لـ'
      : 'Subject: Recommendation Letter for';

    const skillsText = skillsObserved && skillsObserved.length > 0 ? skillsObserved.join(', ') : '[not provided]';

    const qualitiesText = [
      communicationEvidence ? `Communication: ${communicationEvidence}` : null,
      problemSolvingEvidence ? `Problem-solving: ${problemSolvingEvidence}` : null,
      ownershipEvidence ? `Ownership & Autonomy: ${ownershipEvidence}` : null,
    ].filter(Boolean).join('\n') || '[not provided]';

    const projectsText = [
      projectName ? `Project: ${projectName}` : null,
      projectType ? `Type: ${projectType}` : null,
      teamSize ? `Team: ${teamSize}` : null,
      workMode ? `Mode: ${workMode}` : null,
      keyAchievements ? `Achievements: ${keyAchievements}` : null,
    ].filter(Boolean).join('\n') || '[not provided]';

    const locationVal = location || '[not provided]';
    const dateVal = date || dateStr;

    return `You are a Senior HR Document Generator and Prompt Engineer. Write a professional, natural Letter of Recommendation in strict A4 format using ONLY the provided structured form data. Do not invent information.

STRICT RULES:
- Use ONLY the provided form field values. Do NOT hallucinate names, dates, companies, or achievements.
- If a field is missing or contains "[not provided]", leave a blank placeholder "[not provided]" in the final letter.
- Language: The letter must be written entirely in ${lang}.
- Tone: formal, HR professional.
- Structure must follow EXACTLY a real business recommendation letter layout.
- The body of the letter must flow as a series of natural paragraphs. Do NOT include any headings, subheadings, section labels, or field names (such as "Relation avec le Candidat", "Durée", "Paragraph 1", "Context", or form terminology) inside the letter body.
- Do NOT start any paragraph with labels like "Paragraph 1:", "Paragraph 2:", etc. Start the paragraph prose directly.
- No bullet points, tables, or numbered lists.
- Do not add any chat remarks or metadata. Return only the letter.

LAYOUT STRUCTURE (MANDATORY EXACT POSITIONING):
Produce the exact layout below. Align the blocks using spacing/blank spaces.

[Recommender Block (Left)]                              [Location & Date Block (Right)]
[recommender_name]                                       [location], [date]
[recommender_company]
[recommender_role]
[recommender_contact]

${subjectLabel} [candidate_name]

${salutation}

[Body Paragraphs - Output exactly 5 natural, cohesive prose paragraphs with no headings or labels in between them:

Paragraph 1 (context):
- Start directly with the professional recommendation statement.
- Introduce the relationship between the recommender and the candidate.
- Mention the collaboration duration and company context if available.
- Reference styles by language:
  * French: "Je recommande vivement [candidate_name] pour toute opportunité professionnelle correspondant à son profil. J’ai eu l’occasion de collaborer avec [candidate_name] pendant [collaboration_duration] au sein de [recommender_company], où j’ai pu apprécier ses compétences, son engagement et son professionnalisme."
  * English: "I highly recommend [candidate_name] for any professional opportunity matching their profile. I had the opportunity to collaborate with [candidate_name] for [collaboration_duration] at [recommender_company], where I was able to appreciate their skills, commitment, and professionalism."
  * Arabic (RTL): "أوصي بشدة بـ [candidate_name] لأي فرصة مهنية تتوافق مع ملفه الشخصي. لقد أتيحت لي الفرصة للتعاون مع [candidate_name] لمدة [collaboration_duration] في [recommender_company]، حيث كان بإمكاني تقدير مهاراته والتزامه ومهنيته."
- Adapt the placeholders dynamically with form data. Do not use the raw placeholders.

Paragraph 2 (responsibilities):
- Describe candidate role, main missions, and key projects handled (only if provided).

Paragraph 3 (skills evaluation):
- Evaluate technical skills and professional qualities/soft skills based ONLY on the provided skills and qualities. Do not invent any skills.

Paragraph 4 (personal impression):
- Add professional impression, behavior, attitude, and reliability. Avoid exaggerated statements.

Paragraph 5 (recommendation statement):
- Clear recommendation statement based only on recommendation_strength.

Closing:
- Add a polite closing sentence expressing availability for contact (recommender contact).]

${signOff}

[recommender_name]
[recommender_role]
[recommender_company]
[Signature]

STRICT FORM INPUTS:
- recommender_name: ${recommenderName || '[not provided]'}
- recommender_company: ${companyName || '[not provided]'}
- recommender_role: ${recommenderRole || '[not provided]'}
- recommender_contact: ${recommenderContact || '[not provided]'}
- candidate_name: ${candidateName || '[not provided]'}
- candidate_role: ${candidateRole || '[not provided]'}
- candidate_company: ${companyName || '[not provided]'}
- collaboration_duration: ${durationWorkedTogether || '[not provided]'}
- projects:
${projectsText}
- skills: ${skillsText}
- qualities:
${qualitiesText}
- recommendation_strength: ${recommendationStrength || '[not provided]'}
- location: ${locationVal}
- date: ${dateVal}`;
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

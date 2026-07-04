class PromptBuilder {
  buildMotivationPrompt(data) {
    const { fullName, jobTitle, companyName, skills, experienceLevel, language, clubs } = data;
    const toneGuide = this.getToneGuide(experienceLevel);
    const lang = language === 'FR' ? 'French' : 'English';
    
    const clubsText = (clubs || []).filter(c => c.clubName?.trim()).map(c =>
      `- Club: ${c.clubName}, Role: ${c.role || 'Member'}, Duration: ${c.duration || 'N/A'}, Responsibilities: ${c.responsibilities || 'N/A'}`
    ).join('\n');

    return `You are a professional senior HR manager and career letter writer with 20+ years of experience. Write a real-world, publication-ready motivation letter (cover letter) that strictly fits on ONE PAGE when printed (A4 format).

STRICT INSTRUCTIONS:
- LANGUAGE: The letter must be written entirely in ${lang}.
- TARGET RECIPIENTS: Address the hiring manager of ${companyName}.
- STRICT LENGTH CONSTRAINT: The final letter MUST NOT exceed 350 words under any circumstances. If the candidate has rich experience or multiple skills, compress and merge the information. Remove all fluff, unnecessary storytelling, and redundancy.
- FORMAT: Output ONLY the letter text. No markdown header metadata, no JSON wrapper, no intro/outro explanations (like "Here is the letter:"), and no chat conversational remarks.
- NO BULLET POINTS/LISTS: Ensure the letter flows as a natural, polished, cohesive multi-paragraph prose narrative. Never use bullet points, tables, or numbered lists.
- NO GENERIC TEMPLATES OR PLACEHOLDERS: You MUST use the provided candidate details and target company info. Never fall back to placeholders like "[Your Company]", "[Company Name]", or "the company". Integrate the company name "${companyName}" and job title "${jobTitle}" naturally.
- INPUT SANITIZATION: Do not sanitize or modify valid fields. If any field contains random keyboard spam, gibberish (e.g., "asdfg", "xyzpdq"), or meaningless placeholder text, replace only that garbage value with a realistic, high-quality professional value matching the candidate's target job title "${jobTitle}" and experience level "${experienceLevel}".
- MANDATORY STRUCTURE: The letter must consist of exactly 6 short paragraphs, mapping precisely to these mandatory sections:
  1. Introduction: A formal opening introducing the candidate (${fullName}) and expressing strong interest in the specific position of "${jobTitle}" at "${companyName}". Short (2-3 sentences max).
  2. Professional Experience: Focus on the candidate's career suitability at the "${experienceLevel}" level. A compact, value-dense paragraph (3-4 sentences).
  3. Skills Relevance: Discuss the candidate's key skills (${skills.join(', ')}) and how they map directly to a "${jobTitle}" at "${companyName}". A compact, value-dense paragraph (3-4 sentences).
  4. Clubs & Leadership (MANDATORY, ONE MERGED PARAGRAPH):
     * You MUST include a single, concise paragraph showcasing extracurriculars, clubs, or community involvement to highlight soft skills like leadership, teamwork, initiative, and collaboration.
     * If multiple clubs are provided in the input, you MUST MERGE all of them into a single, cohesive paragraph focusing on transferable soft skills (e.g. teamwork, leadership, collaboration). Do NOT list the clubs individually or describe each one separately.
     * Use the provided club data:
${clubsText ? clubsText : '       (No club information provided)'}
     * If no club info is provided or if it is empty/gibberish, you MUST realistically infer a relevant professional extracurricular (e.g., local developer meetups, tech community groups, volunteering, mentoring, or open-source contributions) matching the target role "${jobTitle}" and skills, and write exactly 2-3 sentences about it. Do NOT mention that this was inferred.
  5. Motivation: Short paragraph explaining why the candidate is driven to join "${companyName}" (referencing its reputation or industry position) and the value they bring (3-4 sentences).
  6. Conclusion: A formal, polite closing expressing availability for an interview at "${companyName}" and thanking them for their time. Short (1-2 sentences).

TONE GUIDE (${experienceLevel} level):
${toneGuide}

CANDIDATE INFORMATION:
- Full Name: ${fullName}
- Applying for: ${jobTitle} at ${companyName}
- Key Skills: ${skills.join(', ')}
- Experience Level: ${experienceLevel}
- Language: ${language}

Generate the final letter now. Begin directly with the formal salutation (e.g. "Dear Hiring Manager," in English or "Madame, Monsieur," in French) and sign off with "Sincerely," followed by the candidate's name (${fullName}) (or French equivalent).`;
  }

  buildRecommendationPrompt(data) {
    const {
      recommenderName, recommenderRole, candidateName, candidateRole,
      relationshipToCandidate, companyName, durationWorkedTogether,
      skillsObserved, performanceLevel, language,
    } = data;
    const lang = language === 'FR' ? 'French' : 'English';
    const performanceGuide = `Performance Level: ${performanceLevel}. The tone should reflect this high level of endorsement.`;

    return `You are a professional senior HR manager and executive with 20+ years of experience writing formal recommendation letters for top-tier candidates. Write an HR-compliant, publication-ready recommendation letter.

STRICT INSTRUCTIONS:
- LANGUAGE: The letter must be written entirely in ${lang}.
- FORMAT: Output ONLY the letter text. No markdown header metadata, no JSON wrapper, no intro/outro explanations, and no chat conversational remarks.
- NO BULLET POINTS/LISTS: Ensure the letter flows as a natural, polished, cohesive multi-paragraph prose narrative.
- NO GENERIC TEMPLATES OR PLACEHOLDERS: You MUST use the provided recommender and candidate details. Never fall back to placeholders like "[Company Name]", "[Candidate Name]", or "the company". Integrate the company name "${companyName}", candidate name "${candidateName}", and roles naturally.
- INPUT SANITIZATION: Do not sanitize or modify valid fields. If any field contains random keyboard spam, gibberish (e.g., "asdfg", "xyzpdq"), or meaningless placeholder text, replace only that garbage value with a realistic, high-quality professional value matching the relationship and context.
- MANDATORY STRUCTURE: The letter must consist of exactly 4 or 5 paragraphs, covering:
  1. Context of Relationship: Clearly define who you are (${recommenderName}, writing as "${recommenderRole}"), your relationship to the candidate ("${relationshipToCandidate}"), and how long you worked together ("${durationWorkedTogether}") at "${companyName}".
  2. Candidate Performance Overview: Provide an exceptional assessment of "${candidateName}"'s work quality and professional impact in their role as "${candidateRole}".
  3. Key Strengths & Concrete Observations: Emphasize the candidate's demonstrated skills (${skillsObserved.join(', ')}) with realistic professional observations and achievements on the job.
  4. Strong Endorsement & Closing: Provide a highly warm, unequivocal endorsement of "${candidateName}" for future opportunities, invite the reader to contact you for more details, and sign off formally.

TONE & PERFORMANCE GUIDE:
- ${performanceGuide}
- Tone must be warm, authoritative, and convincingly endorsing.

RECOMMENDATION DETAILS:
- Recommender Name: ${recommenderName}
- Recommender Role: ${recommenderRole}
- Candidate Name: ${candidateName}
- Candidate Role: ${candidateRole}
- Relationship: ${relationshipToCandidate}
- Company: ${companyName}
- Duration Worked Together: ${durationWorkedTogether}
- Skills Observed: ${skillsObserved.join(', ')}
- Performance Level: ${performanceLevel}
- Language: ${language}

Generate the final letter now. Begin directly with the formal salutation (e.g. "To Whom It May Concern," in English or "Madame, Monsieur," in French) and sign off formally with the recommender's name and title.`;
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

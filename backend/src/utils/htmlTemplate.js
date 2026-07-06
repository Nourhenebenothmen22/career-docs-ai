function parseLetter(letterText, defaultSalutation, defaultSignOff, defaultSignature, defaultSignatureRole = '') {
  const lines = letterText.split('\n').map(l => l.trim());
  
  let subject = '';
  let salutation = '';
  let signOff = '';
  let signature = defaultSignature || '';
  let signatureRole = defaultSignatureRole || '';
  let bodyLines = [];

  const subjectRegex = /^(subject|objet)\s*:?\s*(.*)$/i;
  const salutationRegex = /^(dear|madame|monsieur|to\s+whom)\b/i;
  const signOffRegex = /^(sincerely|cordialement|best\s+regards|respectueusement|yours\s+truly|with\s+best\s+regards|signature)\b/i;

  let state = 'header'; // 'header', 'body', 'signature'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (state === 'header') {
      if (subjectRegex.test(line)) {
        subject = line;
      } else if (salutationRegex.test(line)) {
        salutation = line;
        state = 'body';
      }
    } else if (state === 'body') {
      if (signOffRegex.test(line)) {
        signOff = line;
        state = 'signature';
      } else {
        bodyLines.push(line);
      }
    } else if (state === 'signature') {
      if (!signature || signature === defaultSignature) {
        signature = line;
      } else if (!signatureRole || signatureRole === defaultSignatureRole) {
        signatureRole = line;
      } else {
        signatureRole += '<br>' + line;
      }
    }
  }

  if (!salutation) {
    salutation = lines.find(l => salutationRegex.test(l)) || defaultSalutation;
  }
  if (!signOff) {
    signOff = lines.find(l => signOffRegex.test(l)) || defaultSignOff;
  }

  let rawParagraphs = [];
  const salIndex = lines.findIndex(l => l === salutation);
  const signIndex = lines.findIndex(l => l === signOff);

  if (salIndex !== -1 && signIndex !== -1 && signIndex > salIndex) {
    const bodyText = lines.slice(salIndex + 1, signIndex).join('\n');
    rawParagraphs = bodyText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  } else {
    const bodyText = bodyLines.join('\n');
    rawParagraphs = bodyText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  const isHeadingOrLabel = (line) => {
    const cleaned = line.trim();
    const headingMatch = cleaned.match(/^(\d+)\.\s+([^.:]+)[.:]?$/);
    if (headingMatch) {
      const title = headingMatch[2].trim().toLowerCase();
      const allowedTitles = [
        'collaboration context', 'skills & achievements', 'soft skills', 'skills & key achievements',
        'relationship with the candidate', 'observed skills',
        'relation avec le candidat', 'compétences observées',
        'علاقة مع المترشح', 'المهارات الملاحظة', 'المهارات الشخصية'
      ];
      if (allowedTitles.includes(title)) return true;
    }
    const labelMatch = cleaned.match(/^([^.:]+)[.:]?$/);
    if (labelMatch) {
      const label = labelMatch[1].trim().toLowerCase();
      const allowedLabels = [
        'relationship', 'duration', 'responsibilities', 'academic / professional skills', 'academic & professional skills', 'key achievements', 'professional qualities', 'overall recommendation', 'closing statement', 'signature',
        'relation', 'durée', 'responsabilités', 'compétences académiques & professionnelles', 'réalisations clés', 'qualités professionnelles',
        'العلاقة', 'المدة', 'المسؤوليات', 'المهارات الأكاديمية والمهنية', 'الإنجازات الرئيسية', 'المهارات الشخصية'
      ];
      if (allowedLabels.includes(label)) return true;
    }
    return false;
  };

  let bodyParagraphs = [];
  for (let p of rawParagraphs) {
    const subLines = p.split('\n').map(l => l.trim()).filter(Boolean);
    let currentParagraph = [];
    
    for (let line of subLines) {
      if (isHeadingOrLabel(line)) {
        if (currentParagraph.length > 0) {
          bodyParagraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        bodyParagraphs.push(line);
      } else {
        currentParagraph.push(line);
      }
    }
    if (currentParagraph.length > 0) {
      bodyParagraphs.push(currentParagraph.join(' '));
    }
  }

  return { subject, salutation, bodyParagraphs, signOff, signature, signatureRole };
}

class HtmlTemplate {
  motivationLetter(data, letterText) {
    const fullName = data.fullName || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const companyName = data.companyName || '';
    const language = data.language || 'EN';
    
    const dateStr = language === 'FR' 
      ? new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const defaultSalutation = language === 'FR' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,';
    const defaultSignOff = language === 'FR' ? 'Cordialement,' : 'Sincerely,';
    
    const parsed = parseLetter(letterText, defaultSalutation, defaultSignOff, fullName);

    let subject = parsed.subject;
    if (!subject) {
      const subjectLabel = language === 'FR' ? 'Objet : Candidature au poste de' : 'Subject: Application for the';
      const subjectSuffix = language === 'FR' ? (data.jobTitle || '') : `${data.jobTitle || ''} position`;
      subject = `${subjectLabel} ${subjectSuffix}`;
    }

    return `<!DOCTYPE html>
<html lang="${language.toLowerCase()}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Motivation Letter</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000000;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 30mm 25mm 25mm 25mm;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 45px;
    }
    .header-left {
      font-size: 10pt;
      line-height: 1.5;
      margin-top: 5px; /* Aligns candidate block slightly lower to balance header spacing */
    }
    .header-left .name {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .header-right {
      font-size: 10pt;
      line-height: 1.5;
      text-align: right;
    }
    .header-right .company {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .subject {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 30px;
      text-align: left;
    }
    .salutation {
      font-size: 11pt;
      margin-bottom: 20px;
    }
    .body-text {
      text-align: justify;
      font-size: 11pt;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .body-text p {
      margin-bottom: 16px;
      text-indent: 0;
    }
    .signature-section {
      font-size: 11pt;
      line-height: 1.6;
    }
    .sign-off {
      margin-bottom: 40px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="name">${fullName}</div>
        <div>${email}</div>
        <div>${phone}</div>
      </div>
      <div class="header-right">
        <div class="company">${companyName}</div>
        <div>${language === 'FR' ? 'le ' : ''}${dateStr}</div>
      </div>
    </div>

    <div class="subject">
      ${subject}
    </div>

    <div class="salutation">
      ${parsed.salutation}
    </div>

    <div class="body-text">
      ${parsed.bodyParagraphs.map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="signature-section">
      <div class="sign-off">${parsed.signOff}</div>
      <div class="signature-name">${parsed.signature}</div>
    </div>
  </div>
</body>
</html>`;
  }

  recommendationLetter(data, letterText) {
    const language = data.language || 'EN';
    const dateStr = language === 'FR'
      ? new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : language === 'AR'
      ? new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const defaultSalutation = language === 'FR' ? 'Madame, Monsieur,' : language === 'AR' ? 'السيد/السيدة المحترم(ة)،' : 'To Whom It May Concern,';
    const defaultSignOff = language === 'FR' ? 'Cordialement,' : language === 'AR' ? 'مع خالص التقدير،' : 'Sincerely,';
    
    const parsed = parseLetter(
      letterText,
      defaultSalutation,
      defaultSignOff,
      data.recommenderName || '',
      data.recommenderRole || ''
    );

    const subjectLabel = language === 'FR'
      ? 'Objet : Lettre de recommandation pour'
      : language === 'AR'
      ? 'الموضوع: رسالة توصية لـ'
      : 'Subject: Recommendation Letter for';
    const subjectText = parsed.subject || `${subjectLabel} ${data.candidateName || ''}`;

    const isRtl = language === 'AR';
    const dirAttr = isRtl ? 'rtl' : 'ltr';
    const headerRightAlign = isRtl ? 'left' : 'right';

    return `<!DOCTYPE html>
<html lang="${language.toLowerCase()}" dir="${dirAttr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recommendation Letter</title>
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000000;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 30mm 25mm 25mm 25mm;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 45px;
    }
    .header-left {
      font-size: 10pt;
      line-height: 1.5;
    }
    .header-left .name {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .header-right {
      font-size: 10pt;
      line-height: 1.5;
      text-align: ${headerRightAlign};
    }
    .subject {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .salutation {
      font-size: 11pt;
      margin-bottom: 20px;
    }
    .body-text {
      text-align: justify;
      font-size: 11pt;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .body-text p {
      margin-bottom: 16px;
      text-indent: 0;
    }
    .signature-section {
      font-size: 11pt;
      line-height: 1.6;
      margin-top: 50px;
    }
    .signature-name {
      font-weight: bold;
      margin-top: 6px;
    }
    .signature-role {
      font-size: 10pt;
    }
    .signature-company {
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="name">${data.recommenderName || '[not provided]'}</div>
        <div>${data.companyName || '[not provided]'}</div>
        <div>${data.recommenderRole || '[not provided]'}</div>
        <div>[not provided]</div>
      </div>
      <div class="header-right">
        <div>[not provided], ${dateStr}</div>
      </div>
    </div>

    <div class="subject">${subjectText}</div>

    <div class="salutation">${parsed.salutation}</div>

    <div class="body-text">
      ${(parsed.bodyParagraphs.length > 0 ? parsed.bodyParagraphs : [letterText]).map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="signature-section">
      <div>${parsed.signOff}</div>
      <div class="signature-name">${parsed.signature}</div>
      <div class="signature-role">${parsed.signatureRole}</div>
      <div class="signature-company">${data.companyName || ''}</div>
    </div>
  </div>
</body>
</html>`;
  }

  wrapTemplate({ title, subtitle, date, headerLeft, headerRight, body, footer }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 30mm 25mm 25mm 25mm;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #2563eb;
    }
    .header-left {
      font-size: 10pt;
      color: #475569;
      line-height: 1.5;
    }
    .header-left .name {
      font-size: 16pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .header-right {
      font-size: 10pt;
      color: #475569;
      text-align: right;
      line-height: 1.5;
    }
    .title-section {
      margin-bottom: 30px;
    }
    .title-section h1 {
      font-size: 18pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .title-section .subtitle {
      font-size: 11pt;
      color: #2563eb;
      font-weight: 500;
    }
    .title-section .date {
      font-size: 10pt;
      color: #94a3b8;
      margin-top: 8px;
    }
    .body-text {
      text-align: justify;
      margin-bottom: 30px;
    }
    .body-text p {
      margin-bottom: 14px;
      text-indent: 0;
    }
    .footer {
      position: absolute;
      bottom: 25mm;
      left: 25mm;
      right: 25mm;
      font-size: 9pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="name">${headerLeft.split('<br>')[0]}</div>
        ${headerLeft.split('<br>').slice(1).join('<br>')}
      </div>
      <div class="header-right">
        ${headerRight.replace(/<br>/g, '<br>')}
      </div>
    </div>

    <div class="title-section">
      ${title ? `<h1>${title}</h1>` : ''}
      ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
      <div class="date">${date}</div>
    </div>

    <div class="body-text">
      ${body.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
    </div>

    <div class="footer">${footer}</div>
  </div>
</body>
</html>`;
  }
}

module.exports = new HtmlTemplate();

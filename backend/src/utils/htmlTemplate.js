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

  let bodyParagraphs = [];
  const salIndex = lines.findIndex(l => l === salutation);
  const signIndex = lines.findIndex(l => l === signOff);

  if (salIndex !== -1 && signIndex !== -1 && signIndex > salIndex) {
    const bodyText = lines.slice(salIndex + 1, signIndex).join('\n');
    bodyParagraphs = bodyText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  } else {
    const bodyText = bodyLines.join('\n');
    bodyParagraphs = bodyText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
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
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const defaultSalutation = language === 'FR' ? 'Madame, Monsieur,' : 'To Whom It May Concern,';
    const defaultSignOff = language === 'FR' ? 'Cordialement,' : 'Sincerely,';
    
    const parsed = parseLetter(
      letterText, 
      defaultSalutation, 
      defaultSignOff, 
      data.recommenderName || '', 
      data.recommenderRole || ''
    );

    const titleText = language === 'FR' ? 'LETTRE DE RECOMMANDATION' : 'LETTER OF RECOMMENDATION';

    return `<!DOCTYPE html>
<html lang="${language.toLowerCase()}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recommendation Letter</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.7;
      color: #1e293b;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 22mm 22mm 22mm;
      position: relative;
      background: #ffffff;
    }
    /* Accent Top Border */
    .top-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
    }
    /* Header Metadata Grid */
    .meta-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 35px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    .meta-block {
      font-size: 9.5pt;
      color: #475569;
    }
    .meta-block-right {
      text-align: right;
    }
    .meta-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .meta-name {
      font-family: 'Lora', Georgia, serif;
      font-size: 12pt;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .meta-detail {
      font-weight: 500;
      color: #334155;
    }
    .meta-subdetail {
      font-size: 9pt;
      color: #64748b;
    }
    .date-display {
      font-size: 9.5pt;
      color: #64748b;
      margin-top: 8px;
    }
    /* Document Title */
    .doc-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
      letter-spacing: 0.08em;
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    /* Letter Body styling */
    .salutation {
      font-family: 'Lora', Georgia, serif;
      font-size: 11pt;
      font-weight: 500;
      color: #0f172a;
      margin-bottom: 18px;
    }
    .body-text {
      text-align: justify;
      font-size: 10.5pt;
      color: #1e293b;
    }
    .body-text p {
      margin-bottom: 16px;
    }
    /* Signature Block */
    .signature-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }
    .sign-off {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      color: #334155;
      margin-bottom: 35px;
    }
    .signature-line {
      width: 180px;
      border-bottom: 1px solid #cbd5e1;
      margin-bottom: 12px;
    }
    .signature-name {
      font-family: 'Lora', Georgia, serif;
      font-size: 11pt;
      font-weight: 600;
      color: #0f172a;
    }
    .signature-role {
      font-size: 9.5pt;
      color: #475569;
      font-weight: 500;
    }
    .signature-company {
      font-size: 9pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="top-accent"></div>
    
    <div class="meta-section">
      <div class="meta-block">
        <div class="meta-label">${language === 'FR' ? 'De' : 'From'}</div>
        <div class="meta-name">${data.recommenderName || ''}</div>
        <div class="meta-detail">${data.recommenderRole || ''}</div>
        <div class="meta-subdetail">${data.companyName || ''}</div>
      </div>
      <div class="meta-block meta-block-right">
        <div class="meta-label">${language === 'FR' ? 'Candidat & Contexte' : 'Candidate & Context'}</div>
        <div class="meta-name" style="font-size: 11pt;">${data.candidateName || ''}</div>
        <div class="meta-detail" style="font-size: 9.5pt;">${data.candidateRole || ''}</div>
        ${data.durationWorkedTogether ? `<div class="meta-subdetail">${language === 'FR' ? 'Période' : 'Period'}: ${data.durationWorkedTogether}</div>` : ''}
        <div class="date-display">${dateStr}</div>
      </div>
    </div>

    <div class="doc-title">${titleText}</div>

    <div class="salutation">
      ${parsed.salutation}
    </div>

    <div class="body-text">
      ${parsed.bodyParagraphs.map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="signature-section">
      <div class="sign-off">${parsed.signOff}</div>
      <div class="signature-line"></div>
      <div class="signature-name">${parsed.signature}</div>
      ${parsed.signatureRole ? `<div class="signature-role">${parsed.signatureRole}</div>` : ''}
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

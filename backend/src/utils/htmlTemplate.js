class HtmlTemplate {
  motivationLetter(data, letterText) {
    return this.wrapTemplate({
      title: 'Motivation Letter',
      subtitle: `${data.jobTitle} at ${data.companyName}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      headerLeft: [
        data.fullName,
        data.email,
        data.phone,
        data.linkedin ? data.linkedin : null,
      ].filter(Boolean).join('<br>'),
      headerRight: [
        data.companyName,
        data.jobTitle,
      ].join('<br>'),
      body: letterText,
      footer: `${data.fullName} · ${data.email} · ${data.phone}`,
    });
  }

  recommendationLetter(data, letterText) {
    return this.wrapTemplate({
      title: 'Letter of Recommendation',
      subtitle: `For ${data.candidateName} — ${data.candidateRole}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      headerLeft: [
        data.recommenderName,
        data.recommenderRole,
        data.companyName,
      ].filter(Boolean).join('<br>'),
      headerRight: `Candidate: ${data.candidateName}<br>Role: ${data.candidateRole}<br>Period: ${data.durationWorkedTogether}`,
      body: letterText,
      footer: `${data.recommenderName} · ${data.recommenderRole} · ${data.companyName}`,
    });
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
      <h1>${title}</h1>
      <div class="subtitle">${subtitle}</div>
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

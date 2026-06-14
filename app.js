(function () {
  'use strict';

  // ── DOM References ─────────────────────────────────────────
  const resumePreview = document.getElementById('resumePreview');
  const previewScroll = document.querySelector('.preview-scroll');
  const experienceList = document.getElementById('experienceList');
  const educationList = document.getElementById('educationList');
  const certificationList = document.getElementById('certificationList');
  const projectList = document.getElementById('projectList');
  const experienceTemplate = document.getElementById('experienceTemplate');
  const educationTemplate = document.getElementById('educationTemplate');
  const certificationTemplate = document.getElementById('certificationTemplate');
  const projectTemplate = document.getElementById('projectTemplate');

  const STORAGE_KEY = 'rescapt_documents';
  const LEGACY_STORAGE_KEY = 'rescapt_resume_data';
  const BACKUP_META_KEY = 'rescapt_backup_meta';
  const APP_PREFS_KEY = 'rescapt_app_preferences';

  const documentList = document.getElementById('documentList');
  const createDocumentBtn = document.getElementById('createDocument');
  const clearCurrentDocumentBtn = document.getElementById('clearCurrentDocument');
  const loadSampleDocumentBtn = document.getElementById('loadSampleDocument');
  const sampleResumeType = document.getElementById('sampleResumeType');
  const undoEditBtn = document.getElementById('undoEdit');
  const redoEditBtn = document.getElementById('redoEdit');
  const restorePointName = document.getElementById('restorePointName');
  const saveRestorePointBtn = document.getElementById('saveRestorePoint');
  const restorePointList = document.getElementById('restorePointList');
  const restorePointCount = document.getElementById('restorePointCount');
  const undoClearBanner = document.getElementById('undoClearBanner');
  const undoClearMessage = document.getElementById('undoClearMessage');
  const undoClearDocumentBtn = document.getElementById('undoClearDocument');
  const qualityScore = document.getElementById('qualityScore');
  const qualitySummary = document.getElementById('qualitySummary');
  const qualityList = document.getElementById('qualityList');
  const jobDescriptionField = document.getElementById('jobDescription');
  const resumeStrategy = document.getElementById('resumeStrategy');
  const jobMatchScore = document.getElementById('jobMatchScore');
  const jobMatchSummary = document.getElementById('jobMatchSummary');
  const smartRoleFit = document.getElementById('smartRoleFit');
  const matchingKeywords = document.getElementById('matchingKeywords');
  const missingKeywords = document.getElementById('missingKeywords');
  const jobMatchSuggestions = document.getElementById('jobMatchSuggestions');
  const tailorActions = document.getElementById('tailorActions');
  const smartRewriteList = document.getElementById('smartRewriteList');
  const aiPromptOutput = document.getElementById('aiPromptOutput');
  const aiPromptSummary = document.getElementById('aiPromptSummary');
  const refreshAiPromptBtn = document.getElementById('refreshAiPrompt');
  const copyAiPromptBtn = document.getElementById('copyAiPrompt');
  const atsScore = document.getElementById('atsScore');
  const atsSummary = document.getElementById('atsSummary');
  const atsList = document.getElementById('atsList');
  const mobileViewButtons = document.querySelectorAll('.mobile-view-btn');
  const backupReminder = document.getElementById('backupReminder');
  const backupReminderTitle = document.getElementById('backupReminderTitle');
  const backupReminderText = document.getElementById('backupReminderText');
  const backupReminderAction = document.getElementById('backupReminderAction');
  const storageWarning = document.getElementById('storageWarning');
  const storageWarningText = document.getElementById('storageWarningText');
  const publishChecklist = document.getElementById('publishChecklist');
  const publishChecklistSummary = document.getElementById('publishChecklistSummary');
  const publishScore = document.getElementById('publishScore');
  const appUpdateBanner = document.getElementById('appUpdateBanner');
  const refreshAppBtn = document.getElementById('refreshApp');
  const sectionToggleInputs = document.querySelectorAll('[data-section-toggle]');
  const sectionTitleInputs = document.querySelectorAll('[data-section-title]');
  const sectionMoveButtons = document.querySelectorAll('[data-section-move]');
  const sectionToggleList = document.getElementById('sectionToggleList');

  let documentStore = {
    activeDocumentId: null,
    documents: [],
  };

  const personalFields = {
    fullName: document.getElementById('fullName'),
    jobTitle: document.getElementById('jobTitle'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    location: document.getElementById('location'),
    website: document.getElementById('website'),
    summary: document.getElementById('summary'),
  };

  const skillsField = document.getElementById('skills');
  const customTitleField = document.getElementById('customSectionTitle');
  const customContentField = document.getElementById('customSectionContent');
  const summaryCounter = document.getElementById('summaryCounter');
  const improveSummaryBtn = document.getElementById('improveSummary');
  const summarySuggestionPanel = document.getElementById('summarySuggestionPanel');
  const summarySuggestionText = document.getElementById('summarySuggestionText');
  const summarySuggestionNotes = document.getElementById('summarySuggestionNotes');
  const useSummarySuggestionBtn = document.getElementById('useSummarySuggestion');
  const saveStatus = document.getElementById('saveStatus');
  const openGuideBtn = document.getElementById('openGuide');
  const guideModal = document.getElementById('guideModal');
  const closeGuideBtn = document.getElementById('closeGuide');
  const skipGuideBtn = document.getElementById('skipGuide');
  const prevGuideBtn = document.getElementById('prevGuide');
  const nextGuideBtn = document.getElementById('nextGuide');
  const guideProgress = document.getElementById('guideProgress');
  const guideTitle = document.getElementById('guideTitle');
  const guideStepTitle = document.getElementById('guideStepTitle');
  const guideStepText = document.getElementById('guideStepText');

  const previewEls = {
    name: document.getElementById('previewName'),
    title: document.getElementById('previewTitle'),
    email: document.getElementById('previewEmail'),
    phone: document.getElementById('previewPhone'),
    location: document.getElementById('previewLocation'),
    website: document.getElementById('previewWebsite'),
    summary: document.getElementById('previewSummary'),
    experience: document.getElementById('previewExperience'),
    skills: document.getElementById('previewSkills'),
    education: document.getElementById('previewEducation'),
    certifications: document.getElementById('previewCertifications'),
    projects: document.getElementById('previewProjects'),
    customSection: document.getElementById('customSection'),
    customTitle: document.getElementById('previewCustomTitle'),
    customContent: document.getElementById('previewCustomContent'),
  };

  let isLoading = false;

  const styleControls = {
    fontSize: document.getElementById('fontSize'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    lineSpacing: document.getElementById('lineSpacing'),
    lineSpacingValue: document.getElementById('lineSpacingValue'),
    partTarget: document.getElementById('partTypographyTarget'),
    partScale: document.getElementById('partTextScale'),
    partScaleValue: document.getElementById('partTextScaleValue'),
    partLineSpacing: document.getElementById('partLineSpacing'),
    partLineSpacingValue: document.getElementById('partLineSpacingValue'),
    partReset: document.getElementById('partTypographyReset'),
    partHint: document.getElementById('fineTuneSelectionHint'),
  };

  let activeTemplate = 'professional';
  let activeFont = "'Inter', sans-serif";
  let activeTextAlign = 'left';
  let activeLineSpacing = '1.5';
  let allowSecondPage = false;
  let manualSecondPage = false;
  let pendingPdfUrl = '';
  let pendingPdfFilename = '';
  let currentPreviewPageCount = 1;
  let activeMobileView = 'edit';
  let activeAppTheme = 'aurora';
  let appPrefs = { theme: 'aurora', guideSeen: false };
  let backupMeta = { lastBackupAt: 0, lastBackupSignature: '' };
  let activeTooltipTarget = null;
  let tooltipEl = null;
  let lastClearedDocument = null;
  let historyUndoStack = [];
  let historyRedoStack = [];
  let lastHistorySignature = '';
  let isRestoringHistory = false;
  const HISTORY_LIMIT = 60;
  const SAVE_DEBOUNCE_MS = 450;
  const RENDER_DEBOUNCE_MS = 700;
  const PAGE_CHECK_DEBOUNCE_MS = 140;
  const QUALITY_CHECK_DEBOUNCE_MS = 220;
  const SMART_CHECK_DEBOUNCE_MS = 320;
  const BACKUP_STATUS_DEBOUNCE_MS = 650;
  const AI_PROMPT_DEBOUNCE_MS = 650;
  const AI_PROMPT_AUTO_REFRESH_MS = 1000;
  let pendingSaveTimer = null;
  let pendingRenderTimer = null;
  let pendingBackupStatusTimer = null;
  let pendingPageCheckTimer = null;
  let pendingQualityCheckTimer = null;
  let pendingATSCheckTimer = null;
  let pendingJobMatchTimer = null;
  let pendingAIPromptTimer = null;
  let aiPromptAutoRefreshTimer = null;
  let lastAIPromptSignature = '';
  let hasPendingSave = false;
  let hasPendingDocumentRender = false;
  let partTypographyApplyQueued = false;
  let mobilePreviewScaleQueued = false;
  const RESTORE_POINT_LIMIT = 14;
  let sectionVisibility = {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true,
    custom: true,
  };
  const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'custom'];
  const DEFAULT_SECTION_TITLES = {
    summary: 'Summary',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    education: 'Education',
    certifications: 'Certifications',
    custom: 'Custom Section',
  };
  const TYPOGRAPHY_PARTS = [
    'name', 'title', 'contact', 'heading', 'summary',
    'experienceTitle', 'experienceOrg', 'experienceDates', 'experienceDesc',
    'projectTitle', 'projectLink', 'projectDesc',
    'educationTitle', 'educationOrg', 'educationDates',
    'certTitle', 'certOrg', 'certDates',
    'custom', 'skills'
  ];
  const DEFAULT_TYPOGRAPHY_PART = { scale: 100, line: 1 };
  function getDefaultPartTypography() {
    return TYPOGRAPHY_PARTS.reduce(function (result, key) {
      result[key] = Object.assign({}, DEFAULT_TYPOGRAPHY_PART);
      return result;
    }, {});
  }
  let sectionOrder = DEFAULT_SECTION_ORDER.slice();
  let sectionTitles = Object.assign({}, DEFAULT_SECTION_TITLES);
  let partTypography = getDefaultPartTypography();

  const templateButtons = document.querySelectorAll('.template-card');
  const fontButtons = document.querySelectorAll('.font-btn');
  const alignButtons = document.querySelectorAll('.align-btn');

  const PALETTES = {
    'corporate-navy':    { primary: '#1e3a5f', accent: '#64748b' },
    'tech-charcoal':     { primary: '#1f2937', accent: '#9ca3af' },
    'creative-emerald':  { primary: '#065f46', accent: '#84a98c' },
    'warm-burgundy':     { primary: '#6b1e2e', accent: '#a07060' },
    'midnight-gold':     { primary: '#172554', accent: '#b45309' },
    'plum-steel':        { primary: '#581c87', accent: '#64748b' },
    'forest-moss':       { primary: '#14532d', accent: '#65a30d' },
    'crimson-graphite':  { primary: '#991b1b', accent: '#374151' },
    'arctic-blue':       { primary: '#075985', accent: '#94a3b8' },
    'olive-ink':         { primary: '#3f6212', accent: '#1f2937' },
    'copper-slate':      { primary: '#92400e', accent: '#475569' },
    'royal-indigo':      { primary: '#4338ca', accent: '#7c3aed' },
  };

  let activePalette = 'corporate-navy';
  const paletteButtons = document.querySelectorAll('.palette-btn');
  const appThemeButtons = document.querySelectorAll('.app-theme-btn');
  const APP_THEMES = ['aurora', 'sunset', 'forest', 'violet', 'sand', 'graphite'];
  const GUIDE_STEPS = [
    {
      selector: '.document-section',
      title: 'Start with a document',
      text: 'Create a resume, load a sample if you want a fast start, then use restore points and JSON backups to protect your work.',
    },
    {
      selector: '.quality-section',
      title: 'Use Resume Health',
      text: 'Resume Health checks the basics before export, including name, contact details, summary, skills, section content, and whether the resume fits the selected A4 pages.',
    },
    {
      selector: '.job-match-section',
      title: 'Match a job post',
      text: 'Paste a job description to compare keywords, role fit, and weak bullets. Use Tailor Suggestions and Smart Rewrite Queue to improve the resume faster.',
    },
    {
      selector: '.ats-section',
      title: 'Check ATS compatibility',
      text: 'Use the ATS checker to see whether your template, sections, keywords, contact details, page fit, and achievement bullets are scanner-friendly.',
    },
    {
      selector: '#sectionExperience',
      title: 'Build the resume sections',
      text: 'Add experience, education, projects, certifications, skills, and custom content. Keep only useful sections visible and reorder them for the role.',
    },
    {
      selector: '#sectionAppearance',
      title: 'Customize the app and resume',
      text: 'App Theme changes the workspace colors only. Template, font, overall size, spacing, alignment, and color palette change the resume itself. Use Fine Tune Text when only one resume part needs a different size or spacing.',
    },
    {
      selector: '.preview-panel',
      title: 'Edit from the live preview',
      text: 'Use Preview on mobile or the right panel on desktop to inspect the A4 page. Click supported text directly in the preview to edit it.',
    },
    {
      selector: '#downloadPdf',
      title: 'Preview before download',
      text: 'Download PDF creates a page-by-page preview first. Check page count and layout, then download only when the preview looks right.',
    },
  ];
  let guideStepIndex = 0;

  const PDF_A4 = {
    format: 'a4',
    marginMm: 0,
    contentWidthMm: 210,
    contentHeightMm: 297,
    contentWidthPx: 680,
    canvasScale: 2,
  };
  const PREVIEW_A4_HEIGHT_PX = Math.round((PDF_A4.contentWidthPx * 297) / 210);

  const educationSection = document.getElementById('educationSection');
  const certificationsSection = document.getElementById('certificationsSection');
  const sidebarSections = document.getElementById('sidebarSections');
  const mainSections = document.getElementById('mainSections');

  const downloadBtn = document.getElementById('downloadPdf');
  const pageOverflowWarning = document.getElementById('pageOverflowWarning');
  const pageOverflowText = document.getElementById('pageOverflowText');
  const allowSecondPageBtn = document.getElementById('allowSecondPage');
  const manualSecondPageBtn = document.getElementById('manualSecondPage');
  const pdfPreviewModal = document.getElementById('pdfPreviewModal');
  const pdfPreviewFrame = document.getElementById('pdfPreviewFrame');
  const pdfPreviewPages = document.getElementById('pdfPreviewPages');
  const pdfPreviewHelp = document.getElementById('pdfPreviewHelp');
  const pdfPreviewMeta = document.getElementById('pdfPreviewMeta');
  const closePdfPreviewBtn = document.getElementById('closePdfPreview');
  const cancelPdfDownloadBtn = document.getElementById('cancelPdfDownload');
  const confirmPdfDownloadBtn = document.getElementById('confirmPdfDownload');

  const DEFAULTS = {
    name: 'Your Name',
    title: 'Your Job Title',
    email: 'email@example.com',
    phone: '(555) 000-0000',
    location: 'City, State',
    summary: 'Write a short professional summary in the form on the left.',
  };

  const SUMMARY_MAX = 500;
  const JOB_KEYWORD_LIMIT = 16;
  const KEYWORD_STOP_WORDS = [
    'about', 'across', 'after', 'also', 'and', 'are', 'based', 'been', 'being', 'best', 'but', 'can', 'company',
    'daily', 'for', 'from', 'has', 'have', 'into', 'job', 'looking', 'must', 'our', 'own', 'per', 'plus',
    'preferred', 'responsibilities', 'responsibility', 'role', 'should', 'team', 'teams', 'that', 'the', 'their',
    'this', 'through', 'using', 'will', 'with', 'work', 'working', 'you', 'your'
  ];
  const ACTION_VERBS = [
    'achieved', 'analyzed', 'built', 'coached', 'collaborated', 'coordinated', 'created',
    'delivered', 'designed', 'developed', 'documented', 'drove', 'implemented', 'improved',
    'increased', 'launched', 'led', 'managed', 'optimized', 'reduced', 'resolved', 'supported'
  ];
  const WEAK_BULLET_PREFIXES = [
    'responsible for', 'worked on', 'helped with', 'assisted with', 'handled', 'in charge of',
    'tasked with', 'participated in', 'involved in'
  ];
  const RESUME_STRATEGIES = {
    job: {
      label: 'Job application',
      focus: 'match the role title, mirror truthful keywords, and prove recent impact',
      sectionAdvice: 'Keep experience, skills, and summary tightly aligned to the job post.'
    },
    internship: {
      label: 'Internship or placement',
      focus: 'show projects, coursework, tools, learning speed, and teamwork',
      sectionAdvice: 'Use Projects, Education, Skills, and volunteer work when full-time experience is limited.'
    },
    'first-job': {
      label: 'First job or fresh graduate',
      focus: 'show transferable skills, education, projects, and reliability',
      sectionAdvice: 'Lead with education, projects, skills, part-time work, volunteering, or training.'
    },
    'career-change': {
      label: 'Career change',
      focus: 'connect transferable experience to the new role with clear evidence',
      sectionAdvice: 'Use the summary to explain the pivot and translate old duties into the new field.'
    },
    promotion: {
      label: 'Promotion or internal move',
      focus: 'show leadership, ownership, business impact, and readiness for the next level',
      sectionAdvice: 'Emphasize scope, decisions, process improvements, mentoring, and cross-team work.'
    },
    senior: {
      label: 'Senior or leadership role',
      focus: 'show strategy, scale, leadership, risk ownership, and measurable outcomes',
      sectionAdvice: 'Prioritize leadership results, team size, budgets, systems, and decisions.'
    },
    freelance: {
      label: 'Freelance or client work',
      focus: 'show client outcomes, services, portfolio proof, and delivery reliability',
      sectionAdvice: 'Use Projects or Highlights to show clients, deliverables, results, and tools.'
    }
  };
  const SMART_ROLE_FAMILIES = [
    {
      id: 'technology',
      label: 'Technology / IT',
      keywords: ['software', 'developer', 'engineer', 'frontend', 'backend', 'full stack', 'data', 'cloud', 'security', 'devops', 'qa', 'technical', 'systems', 'api'],
      evidence: ['javascript', 'python', 'sql', 'api', 'cloud', 'aws', 'azure', 'git', 'testing', 'automation', 'database', 'deployment', 'debugging', 'analytics'],
      advice: 'Show tools, systems, technical scope, and measurable reliability or delivery impact.'
    },
    {
      id: 'healthcare',
      label: 'Healthcare / Care',
      keywords: ['nurse', 'medical', 'clinic', 'hospital', 'patient', 'healthcare', 'care', 'pharmacy', 'dental', 'therapy', 'clinical'],
      evidence: ['patient', 'care', 'records', 'safety', 'compliance', 'clinical', 'emr', 'triage', 'treatment', 'appointment', 'health', 'confidentiality'],
      advice: 'Show patient care, safety, documentation, compliance, and calm communication.'
    },
    {
      id: 'education',
      label: 'Education / Training',
      keywords: ['teacher', 'education', 'student', 'school', 'training', 'instructor', 'curriculum', 'tutor', 'learning', 'classroom'],
      evidence: ['student', 'curriculum', 'lesson', 'assessment', 'classroom', 'training', 'learning', 'coaching', 'workshop', 'engagement'],
      advice: 'Show learning outcomes, lesson planning, student support, and classroom or training impact.'
    },
    {
      id: 'sales',
      label: 'Sales / Customer Growth',
      keywords: ['sales', 'account', 'business development', 'revenue', 'customer success', 'client', 'pipeline', 'crm', 'quota', 'retail'],
      evidence: ['revenue', 'pipeline', 'crm', 'client', 'customer', 'quota', 'retention', 'upsell', 'lead', 'conversion', 'relationship'],
      advice: 'Show targets, customer outcomes, revenue, conversion, retention, and relationship strength.'
    },
    {
      id: 'marketing',
      label: 'Marketing / Content',
      keywords: ['marketing', 'content', 'brand', 'social media', 'campaign', 'seo', 'copy', 'communications', 'digital', 'growth'],
      evidence: ['campaign', 'content', 'seo', 'analytics', 'brand', 'social', 'email', 'copywriting', 'engagement', 'conversion'],
      advice: 'Show campaigns, channels, audience, metrics, and creative or analytical contribution.'
    },
    {
      id: 'finance',
      label: 'Finance / Accounting',
      keywords: ['finance', 'accounting', 'bookkeeping', 'audit', 'analyst', 'budget', 'payroll', 'tax', 'banking', 'investment'],
      evidence: ['budget', 'forecast', 'audit', 'reconciliation', 'excel', 'reporting', 'variance', 'invoice', 'compliance', 'financial'],
      advice: 'Show accuracy, reporting, controls, analysis, compliance, and money-related scale.'
    },
    {
      id: 'operations',
      label: 'Operations / Administration',
      keywords: ['operations', 'admin', 'coordinator', 'logistics', 'supply chain', 'process', 'office', 'vendor', 'inventory', 'project'],
      evidence: ['process', 'workflow', 'vendor', 'inventory', 'schedule', 'coordination', 'documentation', 'reporting', 'delivery', 'efficiency'],
      advice: 'Show process improvement, coordination, documentation, turnaround time, and team support.'
    },
    {
      id: 'design',
      label: 'Design / Creative',
      keywords: ['design', 'designer', 'creative', 'ux', 'ui', 'visual', 'graphic', 'product design', 'portfolio', 'brand'],
      evidence: ['portfolio', 'figma', 'prototype', 'user', 'brand', 'layout', 'visual', 'research', 'usability', 'creative'],
      advice: 'Show portfolio evidence, tools, users, creative decisions, and measurable design outcomes.'
    },
    {
      id: 'hospitality',
      label: 'Hospitality / Service',
      keywords: ['hospitality', 'restaurant', 'hotel', 'food', 'service', 'guest', 'barista', 'server', 'front desk', 'kitchen'],
      evidence: ['guest', 'service', 'reservation', 'cash', 'pos', 'complaint', 'cleanliness', 'shift', 'team', 'customer'],
      advice: 'Show service quality, speed, guest handling, cash or POS responsibility, and reliability.'
    },
    {
      id: 'general',
      label: 'General Professional',
      keywords: [],
      evidence: ['communication', 'teamwork', 'leadership', 'problem solving', 'organization', 'customer', 'reporting', 'planning'],
      advice: 'Show clear role fit, transferable strengths, measurable outcomes, and truthful keywords from the job post.'
    }
  ];

  // ── Personal Info Preview ──────────────────────────────────
  function updatePersonalPreview() {
    previewEls.name.textContent = personalFields.fullName.value.trim() || DEFAULTS.name;
    previewEls.title.textContent = personalFields.jobTitle.value.trim() || DEFAULTS.title;
    previewEls.email.textContent = personalFields.email.value.trim() || DEFAULTS.email;
    previewEls.phone.textContent = personalFields.phone.value.trim() || DEFAULTS.phone;
    previewEls.location.textContent = personalFields.location.value.trim() || DEFAULTS.location;
    previewEls.summary.textContent = personalFields.summary.value.trim() || DEFAULTS.summary;

    const website = personalFields.website.value.trim();
    if (website) {
      previewEls.website.textContent = website;
      previewEls.website.style.display = '';
    } else {
      previewEls.website.style.display = 'none';
    }
  }

  function updateSummaryCounter() {
    const len = personalFields.summary.value.length;
    summaryCounter.textContent = len + ' / ' + SUMMARY_MAX;
    summaryCounter.classList.toggle('counter-warn', len > SUMMARY_MAX * 0.9);
    summaryCounter.classList.toggle('counter-over', len > SUMMARY_MAX);
  }

  // ── Dynamic Lists ──────────────────────────────────────────
  function renumberEntries(listEl, labelPrefix) {
    listEl.querySelectorAll('.entry-card').forEach(function (card, index) {
      const label = card.querySelector('.entry-label');
      if (label) label.textContent = labelPrefix + ' ' + (index + 1);
    });
  }

  function addExperienceEntry(data) {
    const node = experienceTemplate.content.cloneNode(true);
    const card = node.querySelector('.entry-card');

    if (data) {
      card.querySelector('.exp-title').value = data.title || '';
      card.querySelector('.exp-company').value = data.company || '';
      card.querySelector('.exp-dates').value = data.dates || '';
      card.querySelector('.exp-desc').value = data.description || '';
    }

    wireEntryCard(card, 'experience');
    experienceList.appendChild(node);
    renumberEntries(experienceList, 'Job');
    updateExperiencePreview();
    persistChange();
  }

  function addEducationEntry(data) {
    const node = educationTemplate.content.cloneNode(true);
    const card = node.querySelector('.entry-card');

    if (data) {
      card.querySelector('.edu-qualification').value = data.qualification || '';
      card.querySelector('.edu-school').value = data.school || '';
      card.querySelector('.edu-dates').value = data.dates || '';
    }

    wireEntryCard(card, 'education');
    educationList.appendChild(node);
    renumberEntries(educationList, 'Education');
    updateEducationPreview();
    persistChange();
  }

  function addCertificationEntry(data) {
    const node = certificationTemplate.content.cloneNode(true);
    const card = node.querySelector('.entry-card');

    if (data) {
      card.querySelector('.cert-name').value = data.name || '';
      card.querySelector('.cert-issuer').value = data.issuer || '';
      card.querySelector('.cert-date').value = data.date || '';
    }

    wireEntryCard(card, 'certification');
    certificationList.appendChild(node);
    renumberEntries(certificationList, 'Cert');
    updateCertificationsPreview();
    persistChange();
  }

  function addProjectEntry(data) {
    const node = projectTemplate.content.cloneNode(true);
    const card = node.querySelector('.entry-card');

    if (data) {
      card.querySelector('.proj-name').value = data.name || '';
      card.querySelector('.proj-link').value = data.link || '';
      card.querySelector('.proj-desc').value = data.description || '';
    }

    wireEntryCard(card, 'project');
    projectList.appendChild(node);
    renumberEntries(projectList, 'Project');
    updateProjectsPreview();
    persistChange();
  }

  function getListForType(type) {
    if (type === 'experience') return experienceList;
    if (type === 'education') return educationList;
    if (type === 'certification') return certificationList;
    if (type === 'project') return projectList;
    return null;
  }

  function getLabelForType(type) {
    if (type === 'experience') return 'Job';
    if (type === 'education') return 'Education';
    if (type === 'certification') return 'Cert';
    if (type === 'project') return 'Project';
    return type;
  }

  function getPreviewUpdaterForType(type) {
    if (type === 'experience') return updateExperiencePreview;
    if (type === 'education') return updateEducationPreview;
    if (type === 'certification') return updateCertificationsPreview;
    if (type === 'project') return updateProjectsPreview;
    return function () {};
  }

  function wireEntryCard(card, type) {
    const listEl = getListForType(type);
    const labelPrefix = getLabelForType(type);
    const updatePreview = getPreviewUpdaterForType(type);

    card.querySelector('.btn-remove-text').addEventListener('click', function () {
      card.remove();
      renumberEntries(listEl, labelPrefix);
      updatePreview();
      persistChange();
    });

    card.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        updatePreview();
        persistChange();
      });
    });

    if (type === 'experience' || type === 'project') {
      initBulletHelper(card, type, updatePreview);
    }
  }

  // ── Preview Updaters ───────────────────────────────────────
  function updateExperiencePreview() {
    const cards = experienceList.querySelectorAll('.entry-card');
    previewEls.experience.innerHTML = '';

    if (cards.length === 0) {
      previewEls.experience.innerHTML = '<p class="placeholder-text">Add your work experience using the form.</p>';
      return;
    }

    cards.forEach(function (card, index) {
      const title = card.querySelector('.exp-title').value.trim();
      const company = card.querySelector('.exp-company').value.trim();
      const dates = card.querySelector('.exp-dates').value.trim();
      const desc = card.querySelector('.exp-desc').value.trim();

      if (!title && !company && !dates && !desc) return;

      const entry = document.createElement('div');
      entry.className = 'preview-entry';
      entry.dataset.previewType = 'experience';
      entry.dataset.previewIndex = String(index);
      entry.tabIndex = 0;
      entry.setAttribute('data-tooltip', 'Click to edit this experience item in the form.');
      entry.innerHTML =
        '<div class="preview-entry-header">' +
          '<div>' +
            '<div>' + editablePreviewHtml(title, 'Job Title', 'title', 'preview-entry-title') + '</div>' +
            '<div>' + editablePreviewHtml(company, 'Company', 'company', 'preview-entry-sub') + '</div>' +
          '</div>' +
          (dates ? '<div>' + editablePreviewHtml(dates, '', 'dates', 'preview-entry-dates') + '</div>' : '') +
        '</div>' +
        (desc ? '<p class="preview-entry-desc resume-body-text">' + editablePreviewHtml(desc, '', 'desc', 'preview-entry-desc-text') + '</p>' : '');
      previewEls.experience.appendChild(entry);
    });

    if (!previewEls.experience.children.length) {
      previewEls.experience.innerHTML = '<p class="placeholder-text">Add your work experience using the form.</p>';
    }
  }

  function updateEducationPreview() {
    const cards = educationList.querySelectorAll('.entry-card');
    previewEls.education.innerHTML = '';

    if (cards.length === 0) {
      previewEls.education.innerHTML = '<p class="placeholder-text">Add your education using the form.</p>';
      return;
    }

    cards.forEach(function (card, index) {
      const qualification = card.querySelector('.edu-qualification').value.trim();
      const school = card.querySelector('.edu-school').value.trim();
      const dates = card.querySelector('.edu-dates').value.trim();

      if (!qualification && !school && !dates) return;

      const entry = document.createElement('div');
      entry.className = 'preview-entry';
      entry.dataset.previewType = 'education';
      entry.dataset.previewIndex = String(index);
      entry.tabIndex = 0;
      entry.setAttribute('data-tooltip', 'Click to edit this education item in the form.');
      entry.innerHTML =
        '<div class="preview-entry-header">' +
          '<div>' +
            '<div>' + editablePreviewHtml(qualification, 'Qualification', 'qualification', 'preview-entry-title') + '</div>' +
            '<div>' + editablePreviewHtml(school, 'School', 'school', 'preview-entry-sub') + '</div>' +
          '</div>' +
          (dates ? '<div>' + editablePreviewHtml(dates, '', 'dates', 'preview-entry-dates') + '</div>' : '') +
        '</div>';
      previewEls.education.appendChild(entry);
    });

    if (!previewEls.education.children.length) {
      previewEls.education.innerHTML = '<p class="placeholder-text">Add your education using the form.</p>';
    }
  }

  function updateCertificationsPreview() {
    const cards = certificationList.querySelectorAll('.entry-card');
    previewEls.certifications.innerHTML = '';
    const section = document.getElementById('certificationsSection');

    if (!sectionVisibility.certifications) {
      section.style.display = 'none';
      return;
    }

    if (cards.length === 0) {
      previewEls.certifications.innerHTML = '<p class="placeholder-text">Add your certifications using the form.</p>';
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    cards.forEach(function (card, index) {
      const name = card.querySelector('.cert-name').value.trim();
      const issuer = card.querySelector('.cert-issuer').value.trim();
      const date = card.querySelector('.cert-date').value.trim();

      if (!name && !issuer) return;

      const entry = document.createElement('div');
      entry.className = 'preview-entry';
      entry.dataset.previewType = 'certification';
      entry.dataset.previewIndex = String(index);
      entry.tabIndex = 0;
      entry.setAttribute('data-tooltip', 'Click to edit this certification in the form.');
      entry.innerHTML =
        '<div class="preview-entry-header">' +
          '<div>' +
            '<div>' + editablePreviewHtml(name, 'Certification', 'name', 'preview-entry-title') + '</div>' +
            (issuer ? '<div>' + editablePreviewHtml(issuer, '', 'issuer', 'preview-entry-sub') + '</div>' : '') +
          '</div>' +
          (date ? '<div>' + editablePreviewHtml(date, '', 'date', 'preview-entry-dates') + '</div>' : '') +
        '</div>';
      previewEls.certifications.appendChild(entry);
    });

    if (!previewEls.certifications.children.length) {
      section.style.display = 'none';
    }
  }

  function updateProjectsPreview() {
    const cards = projectList.querySelectorAll('.entry-card');
    previewEls.projects.innerHTML = '';
    const section = document.getElementById('projectsSection');

    if (!sectionVisibility.projects) {
      section.style.display = 'none';
      return;
    }

    if (cards.length === 0) {
      previewEls.projects.innerHTML = '<p class="placeholder-text">Add your projects using the form.</p>';
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    cards.forEach(function (card, index) {
      const name = card.querySelector('.proj-name').value.trim();
      const link = card.querySelector('.proj-link').value.trim();
      const desc = card.querySelector('.proj-desc').value.trim();

      if (!name && !desc) return;

      const entry = document.createElement('div');
      entry.className = 'preview-entry';
      entry.dataset.previewType = 'project';
      entry.dataset.previewIndex = String(index);
      entry.tabIndex = 0;
      entry.setAttribute('data-tooltip', 'Click to edit this project in the form.');
      entry.innerHTML =
        '<div class="preview-entry-header">' +
          '<div>' +
            '<div>' + editablePreviewHtml(name, 'Project', 'name', 'preview-entry-title') + '</div>' +
            (link ? '<div>' + editablePreviewHtml(link, '', 'link', 'preview-entry-sub preview-entry-link') + '</div>' : '') +
          '</div>' +
        '</div>' +
        (desc ? '<p class="preview-entry-desc resume-body-text">' + editablePreviewHtml(desc, '', 'desc', 'preview-entry-desc-text') + '</p>' : '');
      previewEls.projects.appendChild(entry);
    });

    if (!previewEls.projects.children.length) {
      section.style.display = 'none';
    }
  }

  function updateSkillsPreview() {
    const lines = skillsField.value
      .split('\n')
      .map(function (line) { return line.trim(); })
      .filter(Boolean);

    if (lines.length === 0) {
      previewEls.skills.innerHTML = '<p class="placeholder-text">Add your skills using the form.</p>';
      return;
    }

    previewEls.skills.innerHTML =
      '<ul class="skills-list">' +
      lines.map(function (skill) {
        return '<li>' + escapeHtml(skill) + '</li>';
      }).join('') +
      '</ul>';
  }

  function updateCustomSectionPreview() {
    const title = customTitleField.value.trim();
    const content = customContentField.value.trim();

    if (!sectionVisibility.custom) {
      previewEls.customSection.style.display = 'none';
      return;
    }

    if (!title && !content) {
      previewEls.customSection.style.display = 'none';
      return;
    }

    previewEls.customSection.style.display = '';
    previewEls.customTitle.textContent = sectionTitles.custom || title || 'Custom Section';
    previewEls.customContent.textContent = content;
  }

  function applySectionVisibility() {
    document.getElementById('summarySection').style.display = sectionVisibility.summary ? '' : 'none';
    document.getElementById('experienceSection').style.display = sectionVisibility.experience ? '' : 'none';
    document.getElementById('skillsSection').style.display = sectionVisibility.skills ? '' : 'none';
    educationSection.style.display = sectionVisibility.education ? '' : 'none';

    if (!sectionVisibility.projects) {
      document.getElementById('projectsSection').style.display = 'none';
    } else {
      updateProjectsPreview();
    }

    if (!sectionVisibility.certifications) {
      certificationsSection.style.display = 'none';
    } else {
      updateCertificationsPreview();
    }

    if (!sectionVisibility.custom) {
      previewEls.customSection.style.display = 'none';
    } else {
      updateCustomSectionPreview();
    }

    sectionToggleInputs.forEach(function (input) {
      input.checked = sectionVisibility[input.dataset.sectionToggle] !== false;
    });

    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    scheduleATSCompatibilityCheck();
  }

  function getSectionElement(sectionKey) {
    if (sectionKey === 'summary') return document.getElementById('summarySection');
    if (sectionKey === 'experience') return document.getElementById('experienceSection');
    if (sectionKey === 'projects') return document.getElementById('projectsSection');
    if (sectionKey === 'skills') return document.getElementById('skillsSection');
    if (sectionKey === 'education') return educationSection;
    if (sectionKey === 'certifications') return certificationsSection;
    if (sectionKey === 'custom') return previewEls.customSection;
    return null;
  }

  function getSectionHeading(sectionKey) {
    const section = getSectionElement(sectionKey);
    return section ? section.querySelector('h3') : null;
  }

  function getSectionDestination(sectionKey) {
    if (activeTemplate === 'modern' && (sectionKey === 'education' || sectionKey === 'certifications')) {
      return sidebarSections;
    }
    return mainSections;
  }

  function applySectionTitles() {
    DEFAULT_SECTION_ORDER.forEach(function (key) {
      const heading = getSectionHeading(key);
      if (heading) heading.textContent = sectionTitles[key] || DEFAULT_SECTION_TITLES[key];
    });

    sectionTitleInputs.forEach(function (input) {
      input.value = sectionTitles[input.dataset.sectionTitle] || DEFAULT_SECTION_TITLES[input.dataset.sectionTitle];
    });
  }

  function applySectionOrder() {
    sectionOrder.forEach(function (key) {
      const section = getSectionElement(key);
      const destination = getSectionDestination(key);
      if (section && destination) destination.appendChild(section);

      const control = sectionToggleList ? sectionToggleList.querySelector('[data-section-control="' + key + '"]') : null;
      if (control && sectionToggleList) sectionToggleList.appendChild(control);
    });

    sectionMoveButtons.forEach(function (btn) {
      const index = sectionOrder.indexOf(btn.dataset.sectionKey);
      btn.disabled = btn.dataset.sectionMove === 'up' ? index <= 0 : index >= sectionOrder.length - 1;
    });
  }

  function applySectionSettings() {
    applySectionTitles();
    applySectionOrder();
    applySectionVisibility();
  }

  function moveSection(sectionKey, direction) {
    const index = sectionOrder.indexOf(sectionKey);
    const offset = direction === 'up' ? -1 : 1;
    const nextIndex = index + offset;
    if (index < 0 || nextIndex < 0 || nextIndex >= sectionOrder.length) return;

    const next = sectionOrder[nextIndex];
    sectionOrder[nextIndex] = sectionKey;
    sectionOrder[index] = next;
    applySectionSettings();
    persistChange();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function editablePreviewHtml(text, fallback, fieldName, className) {
    return '<span class="' + className + ' resume-preview-editable preview-inline-edit" contenteditable="true" spellcheck="true" data-preview-field="' +
      fieldName + '" data-tooltip="Edit this text directly in the preview.">' +
      escapeHtml(text || fallback || '') +
      '</span>';
  }

  // ── Collapsible Sections ───────────────────────────────────
  function initCollapsibles() {
    document.querySelectorAll('.collapse-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const bodyId = btn.getAttribute('aria-controls');
        const body = document.getElementById(bodyId);
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        body.classList.toggle('collapsed', expanded);
        btn.querySelector('.collapse-arrow').textContent = expanded ? '▸' : '▾';
      });
    });
  }

  // ── Drag-to-Reorder ────────────────────────────────────────
  function initSortable(listEl, type) {
    let dragSrc = null;

    listEl.addEventListener('dragstart', function (e) {
      dragSrc = e.target.closest('.entry-card');
      if (!dragSrc) return;
      e.dataTransfer.effectAllowed = 'move';
      dragSrc.classList.add('dragging');
    });

    listEl.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const target = e.target.closest('.entry-card');
      if (!target || target === dragSrc) return;
      const rect = target.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height / 2;
      listEl.insertBefore(dragSrc, after ? target.nextSibling : target);
    });

    listEl.addEventListener('dragend', function () {
      if (dragSrc) dragSrc.classList.remove('dragging');
      dragSrc = null;
      renumberEntries(listEl, getLabelForType(type));
      getPreviewUpdaterForType(type)();
      persistChange();
    });

    // Make cards draggable via handle
    listEl.addEventListener('mousedown', function (e) {
      const handle = e.target.closest('.drag-handle');
      if (!handle) return;
      const card = handle.closest('.entry-card');
      if (card) card.setAttribute('draggable', 'true');
    });

    listEl.addEventListener('mouseup', function (e) {
      const card = e.target.closest('.entry-card');
      if (card) card.removeAttribute('draggable');
    });
  }

  // ── Template Selector ──────────────────────────────────────
  function initTemplateButtons() {
    templateButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTemplate(btn.dataset.template);
      });
    });
  }

  function applyTemplate(templateId) {
    if (!templateId) return;
    activeTemplate = templateId;

    templateButtons.forEach(function (btn) {
      const isActive = btn.dataset.template === templateId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    resumePreview.className = 'resume-sheet template-' + templateId;

    applyStyles();
    applySectionSettings();
    persistChange();
  }

  // ── Font Selector ──────────────────────────────────────────
  function initFontButtons() {
    fontButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFont(btn.dataset.font);
      });
    });
  }

  function applyFont(fontFamily) {
    if (!fontFamily) return;
    activeFont = fontFamily;

    fontButtons.forEach(function (btn) {
      const isActive = btn.dataset.font === fontFamily;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    applyStyles();
    persistChange();
  }

  // ── Alignment Selector ─────────────────────────────────────
  function initAlignButtons() {
    alignButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTextAlign(btn.dataset.align);
      });
    });
  }

  function applyTextAlign(alignment) {
    if (!alignment) return;
    activeTextAlign = alignment;

    alignButtons.forEach(function (btn) {
      const isActive = btn.dataset.align === alignment;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    applyStyles();
    persistChange();
  }

  // ── Color Palettes ─────────────────────────────────────────
  function initPaletteButtons() {
    paletteButtons.forEach(function (btn) {
      const palette = PALETTES[btn.dataset.palette];
      if (!palette) return;

      const primarySwatch = btn.querySelector('.swatch-primary');
      const accentSwatch = btn.querySelector('.swatch-accent');
      if (primarySwatch) primarySwatch.style.backgroundColor = palette.primary;
      if (accentSwatch) accentSwatch.style.backgroundColor = palette.accent;

      btn.addEventListener('click', function () {
        applyPalette(btn.dataset.palette);
      });
    });
  }

  function applyPalette(paletteId) {
    if (!PALETTES[paletteId]) return;
    activePalette = paletteId;

    paletteButtons.forEach(function (btn) {
      const isActive = btn.dataset.palette === paletteId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    applyStyles();
    persistChange();
  }

  // ── Document Manager ───────────────────────────────────────
  function generateDocumentId() {
    return 'doc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function getActiveDocument() {
    return documentStore.documents.find(function (doc) {
      return doc.id === documentStore.activeDocumentId;
    });
  }

  function getEmptyDocumentContent() {
    return {
      personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '' },
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      skills: '',
      customSection: { title: '', content: '' },
      jobMatch: { jobDescription: '', strategy: 'job' },
      sectionVisibility: {
        summary: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
        certifications: true,
        custom: true,
      },
      sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES),
      sectionOrder: DEFAULT_SECTION_ORDER.slice(),
      appearance: {
        template: 'professional',
        font: "'Inter', sans-serif",
        fontSize: '14',
        lineSpacing: '1.5',
        textAlign: 'left',
        palette: 'corporate-navy',
        partTypography: getDefaultPartTypography(),
      },
    };
  }

  function getManagerSampleContent() {
    return {
      personal: {
        fullName: 'Taylor Reed',
        jobTitle: 'Operations Manager',
        email: 'taylor.reed@example.com',
        phone: '(555) 018-4412',
        location: 'Austin, TX',
        website: 'linkedin.com/in/taylorreed',
        summary: 'Operations manager with 7+ years of experience improving team workflows, vendor coordination, and service delivery. Known for turning messy processes into clear systems, reducing turnaround times, and building documentation that helps teams work with confidence.',
      },
      experience: [
        {
          title: 'Operations Manager',
          company: 'Northstar Services',
          dates: '2021 - Present',
          description: 'Led a 14-person operations team, reduced ticket backlog by 38%, and introduced weekly reporting that improved leadership visibility into staffing, vendor issues, and service risks.',
        },
        {
          title: 'Project Coordinator',
          company: 'Brightline Logistics',
          dates: '2018 - 2021',
          description: 'Coordinated cross-functional projects across sales, support, and fulfillment teams. Built onboarding checklists and status templates that reduced handoff errors and improved project delivery consistency.',
        },
      ],
      education: [
        {
          qualification: 'B.B.A. Business Administration',
          school: 'Texas State University',
          dates: '2014 - 2018',
        },
      ],
      certifications: [
        {
          name: 'Lean Six Sigma Green Belt',
          issuer: 'Six Sigma Global Institute',
          date: '2022',
        },
      ],
      projects: [
        {
          name: 'Vendor Response Dashboard',
          link: '',
          description: 'Created a tracking dashboard for vendor SLAs, recurring blockers, and escalation status, helping managers spot delays before they affected customers.',
        },
      ],
      skills: 'Operations Planning\nProcess Improvement\nVendor Management\nTeam Leadership\nReporting\nDocumentation',
      customSection: {
        title: 'Highlights',
        content: 'Reduced weekly reporting time by 5 hours through reusable templates.\nImproved onboarding completion rates by standardizing checklists and manager follow-ups.',
      },
      jobMatch: { jobDescription: '', strategy: 'job' },
      sectionVisibility: {
        summary: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
        certifications: true,
        custom: true,
      },
      sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Highlights' }),
      sectionOrder: DEFAULT_SECTION_ORDER.slice(),
      appearance: {
        template: 'professional',
        font: "'Inter', sans-serif",
        fontSize: '14',
        lineSpacing: '1.5',
        textAlign: 'left',
        palette: 'corporate-navy',
        partTypography: getDefaultPartTypography(),
      },
    };
  }

  function mergeSampleContent(overrides) {
    const base = getManagerSampleContent();
    return Object.assign({}, base, overrides, {
      personal: Object.assign({}, base.personal, overrides.personal || {}),
      sectionVisibility: Object.assign({}, base.sectionVisibility, overrides.sectionVisibility || {}),
      sectionTitles: Object.assign({}, base.sectionTitles, overrides.sectionTitles || {}),
      appearance: Object.assign({}, base.appearance, overrides.appearance || {}),
      jobMatch: Object.assign({ jobDescription: '', strategy: 'job' }, overrides.jobMatch || {}),
    });
  }

  function getSampleDocumentContent(type) {
    if (type === 'job') {
      return mergeSampleContent({
        personal: {
          fullName: 'Riley Morgan',
          jobTitle: 'Administrative Assistant',
          email: 'riley.morgan@example.com',
          phone: '(555) 016-3382',
          location: 'Phoenix, AZ',
          website: 'linkedin.com/in/rileymorgan',
          summary: 'Administrative assistant with 4 years of experience supporting office operations, scheduling, records management, and customer communication. Known for staying organized, improving routine workflows, and helping teams keep daily work moving smoothly.',
        },
        experience: [
          {
            title: 'Administrative Assistant',
            company: 'Canyon Medical Group',
            dates: '2022 - Present',
            description: 'Managed calendars for 5 department leads, processed 80+ weekly records requests, and reduced appointment scheduling errors by updating intake checklists.',
          },
          {
            title: 'Office Coordinator',
            company: 'Mesa Property Services',
            dates: '2020 - 2022',
            description: 'Handled phone inquiries, vendor paperwork, and supply tracking while creating a shared filing system that cut document search time by 30%.',
          },
        ],
        education: [
          { qualification: 'A.A. Business Administration', school: 'Phoenix College', dates: '2020' },
        ],
        certifications: [
          { name: 'Microsoft Office Specialist', issuer: 'Microsoft', date: '2021' },
        ],
        projects: [
          {
            name: 'Office Filing Refresh',
            link: '',
            description: 'Organized digital folders, renamed files consistently, and documented a simple process for weekly record updates.',
          },
        ],
        skills: 'Scheduling\nMicrosoft Office\nData Entry\nCustomer Service\nRecords Management\nVendor Coordination',
        customSection: { title: 'Strengths', content: 'Calendar coordination\nAccurate documentation\nProfessional phone communication' },
        sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Strengths' }),
        appearance: { template: 'professional', palette: 'corporate-navy' },
      });
    }

    if (type === 'internship') {
      return mergeSampleContent({
        personal: {
          fullName: 'Maya Chen',
          jobTitle: 'Marketing Intern',
          email: 'maya.chen@example.com',
          phone: '(555) 011-2488',
          location: 'San Diego, CA',
          website: 'linkedin.com/in/mayachen',
          summary: 'Business student seeking a marketing internship with hands-on experience in campus campaigns, social media planning, and market research. Strong writer with Excel, Canva, and analytics skills, eager to support brand growth and learn from a collaborative team.',
        },
        experience: [
          {
            title: 'Marketing Committee Volunteer',
            company: 'University Business Society',
            dates: '2024 - Present',
            description: 'Planned weekly social posts and event promotions that increased student sign-ups by 32% across two semester workshops.',
          },
          {
            title: 'Retail Associate',
            company: 'Campus Bookstore',
            dates: '2023 - 2024',
            description: 'Assisted 60+ customers per shift, organized product displays, and tracked inventory updates during peak textbook season.',
          },
        ],
        education: [
          { qualification: 'B.S. Business Administration', school: 'San Diego State University', dates: 'Expected 2027' },
        ],
        certifications: [
          { name: 'Google Analytics Beginner Certificate', issuer: 'Google Skillshop', date: '2025' },
        ],
        projects: [
          {
            name: 'Campus Coffee Survey',
            link: '',
            description: 'Surveyed 120 students, summarized buying preferences, and presented three campaign ideas for a student-run cafe concept.',
          },
        ],
        skills: 'Social Media Planning\nMarket Research\nExcel\nCanva\nGoogle Analytics\nCopywriting',
        customSection: { title: 'Campus Involvement', content: 'Member, Business Society\nVolunteer, Student Welcome Week' },
        sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Campus Involvement' }),
        appearance: { template: 'classic', palette: 'arctic-blue' },
      });
    }

    if (type === 'career-change') {
      return mergeSampleContent({
        personal: {
          fullName: 'Jordan Ellis',
          jobTitle: 'Customer Success Specialist',
          email: 'jordan.ellis@example.com',
          phone: '(555) 014-6029',
          location: 'Denver, CO',
          website: 'linkedin.com/in/jordanellis',
          summary: 'Career changer moving from hospitality into customer success with 6 years of client-facing experience, issue resolution, onboarding support, and account follow-up. Known for calming high-pressure situations and turning customer needs into clear next steps.',
        },
        experience: [
          {
            title: 'Guest Services Supervisor',
            company: 'Summit Stay Hotels',
            dates: '2021 - Present',
            description: 'Resolved escalated guest issues, coached a 9-person front desk team, and improved satisfaction survey scores from 4.1 to 4.6 within one year.',
          },
          {
            title: 'Client Services Coordinator',
            company: 'Peak Events Group',
            dates: '2018 - 2021',
            description: 'Coordinated event timelines, managed client updates, and created handoff checklists that reduced day-of service errors by 25%.',
          },
        ],
        education: [
          { qualification: 'A.A. Communications', school: 'Front Range Community College', dates: '2018' },
        ],
        certifications: [
          { name: 'Customer Success Fundamentals', issuer: 'LinkedIn Learning', date: '2025' },
        ],
        projects: [
          {
            name: 'Customer Onboarding Tracker',
            link: '',
            description: 'Built a spreadsheet tracker for new client requests, follow-up dates, issue status, and satisfaction notes.',
          },
        ],
        skills: 'Customer Support\nCRM Notes\nConflict Resolution\nOnboarding\nAccount Follow-up\nProcess Documentation',
        customSection: { title: 'Transferable Strengths', content: 'Client communication\nEscalation handling\nService recovery\nTeam coordination' },
        sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Transferable Strengths' }),
        appearance: { template: 'startup', palette: 'creative-emerald' },
      });
    }

    if (type === 'graduate') {
      return mergeSampleContent({
        personal: {
          fullName: 'Aisha Rahman',
          jobTitle: 'Junior Data Analyst',
          email: 'aisha.rahman@example.com',
          phone: '(555) 017-9033',
          location: 'Chicago, IL',
          website: 'github.com/aisharahman',
          summary: 'Recent statistics graduate with practical experience cleaning datasets, building dashboards, and presenting insights from academic and volunteer projects. Comfortable with Excel, SQL, Tableau, and Python, with a strong interest in business reporting roles.',
        },
        experience: [
          {
            title: 'Data Volunteer',
            company: 'Community Food Network',
            dates: '2025',
            description: 'Cleaned donation records for 2,400 entries and created a Tableau dashboard showing weekly demand patterns by neighborhood.',
          },
        ],
        education: [
          { qualification: 'B.S. Statistics', school: 'University of Illinois Chicago', dates: '2025' },
        ],
        certifications: [
          { name: 'SQL for Data Analysis', issuer: 'Coursera', date: '2025' },
        ],
        projects: [
          {
            name: 'Retail Sales Dashboard',
            link: 'github.com/aisharahman/sales-dashboard',
            description: 'Analyzed 18 months of mock sales data, built charts for revenue trends, and summarized product categories with highest growth.',
          },
        ],
        skills: 'Excel\nSQL\nTableau\nPython\nData Cleaning\nDashboard Reporting',
        customSection: { title: 'Coursework', content: 'Regression Analysis\nDatabase Systems\nBusiness Analytics\nData Visualization' },
        sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Coursework' }),
        appearance: { template: 'ats', palette: 'tech-charcoal' },
      });
    }

    if (type === 'technical') {
      return mergeSampleContent({
        personal: {
          fullName: 'Noah Patel',
          jobTitle: 'Frontend Developer',
          email: 'noah.patel@example.com',
          phone: '(555) 019-7741',
          location: 'Seattle, WA',
          website: 'noahpatel.dev',
          summary: 'Frontend developer with 3 years of experience building responsive web interfaces, improving accessibility, and translating product requirements into reusable components. Skilled in JavaScript, React, CSS, testing, and performance-minded UI development.',
        },
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Lumen Apps',
            dates: '2023 - Present',
            description: 'Built reusable React components, improved Lighthouse accessibility score from 78 to 96, and reduced dashboard load time by 28%.',
          },
          {
            title: 'Web Developer',
            company: 'Freelance',
            dates: '2021 - 2023',
            description: 'Delivered 12 responsive websites for small businesses using semantic HTML, CSS, JavaScript, and lightweight content workflows.',
          },
        ],
        education: [
          { qualification: 'Certificate, Web Development', school: 'General Assembly', dates: '2021' },
        ],
        certifications: [
          { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: '2021' },
        ],
        projects: [
          {
            name: 'Component Library',
            link: 'github.com/noahpatel/ui-kit',
            description: 'Created documented buttons, forms, cards, and layout components with keyboard states and accessible color contrast.',
          },
        ],
        skills: 'JavaScript\nReact\nCSS\nHTML\nAccessibility\nTesting\nGit\nPerformance',
        customSection: { title: 'Tools', content: 'Vite\nJest\nPlaywright\nFigma\nGitHub Actions' },
        sectionTitles: Object.assign({}, DEFAULT_SECTION_TITLES, { custom: 'Tools' }),
        appearance: { template: 'sidebar-clean', palette: 'royal-indigo' },
      });
    }

    if (type === 'manager') return getManagerSampleContent();
    return getManagerSampleContent();
  }

  function asString(value) {
    return typeof value === 'string' ? value : '';
  }

  function pickAllowed(value, allowed, fallback) {
    return allowed.indexOf(value) >= 0 ? value : fallback;
  }

  function normalizeRange(value, fallback, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return String(Math.min(max, Math.max(min, numeric)));
  }

  function normalizePartTypography(value) {
    const source = value && typeof value === 'object' ? value : {};
    return TYPOGRAPHY_PARTS.reduce(function (result, key) {
      let item = source[key] && typeof source[key] === 'object' ? source[key] : {};
      if (!Object.keys(item).length && (key === 'summary' || key === 'custom') && source.body) {
        item = source.body;
      }
      if (!Object.keys(item).length && /^experience|^project|^education|^cert/.test(key) && source.entries) {
        item = source.entries;
      }
      result[key] = {
        scale: Number(normalizeRange(item.scale, DEFAULT_TYPOGRAPHY_PART.scale, 80, 130)),
        line: Number(normalizeRange(item.line, DEFAULT_TYPOGRAPHY_PART.line, 0.85, 1.4)),
      };
      return result;
    }, {});
  }

  function normalizeSectionVisibility(value) {
    const defaults = getEmptyDocumentContent().sectionVisibility;
    const source = value && typeof value === 'object' ? value : {};
    return Object.keys(defaults).reduce(function (result, key) {
      result[key] = typeof source[key] === 'boolean' ? source[key] : defaults[key];
      return result;
    }, {});
  }

  function normalizeSectionTitles(value) {
    const source = value && typeof value === 'object' ? value : {};
    return DEFAULT_SECTION_ORDER.reduce(function (result, key) {
      result[key] = asString(source[key]) || DEFAULT_SECTION_TITLES[key];
      return result;
    }, {});
  }

  function normalizeSectionOrder(value) {
    const source = Array.isArray(value) ? value : [];
    const seen = {};
    const ordered = source.filter(function (key) {
      if (DEFAULT_SECTION_ORDER.indexOf(key) < 0 || seen[key]) return false;
      seen[key] = true;
      return true;
    });

    DEFAULT_SECTION_ORDER.forEach(function (key) {
      if (!seen[key]) ordered.push(key);
    });

    return ordered;
  }

  function normalizeEntryList(entries, allowedFields) {
    if (!Array.isArray(entries)) return [];

    return entries.map(function (entry) {
      const normalized = {};
      allowedFields.forEach(function (field) {
        normalized[field] = entry && typeof entry === 'object' ? asString(entry[field]) : '';
      });
      return normalized;
    });
  }

  function normalizeResumeContent(content) {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid resume content');
    }

    const defaults = getEmptyDocumentContent();
    const personal = content.personal && typeof content.personal === 'object' ? content.personal : {};
    const customSection = content.customSection && typeof content.customSection === 'object' ? content.customSection : {};
    const jobMatch = content.jobMatch && typeof content.jobMatch === 'object' ? content.jobMatch : {};
    const appearance = content.appearance && typeof content.appearance === 'object' ? content.appearance : {};

    const normalizedTemplate = pickAllowed(asString(appearance.template), ['professional', 'minimalist', 'modern', 'executive', 'compact', 'academic', 'portfolio', 'ats', 'signature', 'classic', 'startup', 'federal', 'sidebar-clean'], defaults.appearance.template);
    const normalizedTextAlign = pickAllowed(asString(appearance.textAlign), ['left', 'center', 'right', 'justify'], defaults.appearance.textAlign);
    const normalizedPalette = PALETTES[appearance.palette] ? appearance.palette : defaults.appearance.palette;
    const normalizedTitles = normalizeSectionTitles(content.sectionTitles);
    if (!content.sectionTitles && asString(customSection.title)) {
      normalizedTitles.custom = asString(customSection.title);
    }

    return {
      personal: {
        fullName: asString(personal.fullName),
        jobTitle: asString(personal.jobTitle),
        email: asString(personal.email),
        phone: asString(personal.phone),
        location: asString(personal.location),
        website: asString(personal.website),
        summary: asString(personal.summary).slice(0, SUMMARY_MAX),
      },
      experience: normalizeEntryList(content.experience, ['title', 'company', 'dates', 'description']),
      education: normalizeEntryList(content.education, ['qualification', 'school', 'dates']),
      certifications: normalizeEntryList(content.certifications, ['name', 'issuer', 'date']),
      projects: normalizeEntryList(content.projects, ['name', 'link', 'description']),
      skills: asString(content.skills),
      customSection: {
        title: asString(customSection.title),
        content: asString(customSection.content),
      },
      jobMatch: {
        jobDescription: asString(jobMatch.jobDescription),
        strategy: RESUME_STRATEGIES[jobMatch.strategy] ? jobMatch.strategy : defaults.jobMatch.strategy,
      },
      sectionVisibility: normalizeSectionVisibility(content.sectionVisibility),
      sectionTitles: normalizedTitles,
      sectionOrder: normalizeSectionOrder(content.sectionOrder),
      appearance: {
        template: normalizedTemplate,
        font: asString(appearance.font) || defaults.appearance.font,
        fontSize: normalizeRange(appearance.fontSize, defaults.appearance.fontSize, 10, 18),
        lineSpacing: normalizeRange(appearance.lineSpacing, defaults.appearance.lineSpacing, 1.2, 2),
        textAlign: normalizedTextAlign,
        palette: normalizedPalette,
        partTypography: normalizePartTypography(appearance.partTypography),
      },
    };
  }

  function normalizeRestorePoints(value) {
    if (!Array.isArray(value)) return [];

    return value.map(function (point) {
      if (!point || typeof point !== 'object') return null;

      try {
        return {
          id: asString(point.id) || generateDocumentId(),
          name: asString(point.name) || 'Saved version',
          createdAt: typeof point.createdAt === 'number' ? point.createdAt : Date.now(),
          auto: !!point.auto,
          content: normalizeResumeContent(point.content),
        };
      } catch (err) {
        return null;
      }
    }).filter(Boolean).slice(0, RESTORE_POINT_LIMIT);
  }

  function normalizeStoredDocument(doc, fallbackIndex) {
    if (!doc || typeof doc !== 'object') return null;

    try {
      return {
        id: asString(doc.id) || generateDocumentId(),
        name: asString(doc.name) || 'Resume ' + fallbackIndex,
        type: 'resume',
        updatedAt: typeof doc.updatedAt === 'number' ? doc.updatedAt : Date.now(),
        content: normalizeResumeContent(doc.content || getEmptyDocumentContent()),
        restorePoints: normalizeRestorePoints(doc.restorePoints),
      };
    } catch (err) {
      return null;
    }
  }

  function normalizeDocumentStore(store) {
    const docs = Array.isArray(store.documents) ? store.documents : [];
    const normalizedDocs = docs
      .map(function (doc, index) { return normalizeStoredDocument(doc, index + 1); })
      .filter(Boolean);

    const activeId = asString(store.activeDocumentId);
    return {
      activeDocumentId: normalizedDocs.some(function (doc) { return doc.id === activeId; })
        ? activeId
        : (normalizedDocs[0] ? normalizedDocs[0].id : null),
      documents: normalizedDocs,
    };
  }

  function getUniqueDocumentName(baseName) {
    let name = baseName;
    let counter = 2;
    while (documentStore.documents.some(function (doc) { return doc.name === name; })) {
      name = baseName + ' ' + counter;
      counter += 1;
    }
    return name;
  }

  function formatRelativeTime(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (min < 1) return 'just now';
    if (min < 60) return min + 'm ago';
    if (hr < 24) return hr + 'h ago';
    if (day < 7) return day + 'd ago';
    return new Date(ts).toLocaleDateString();
  }

  function getVersionTime(ts) {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function renderRestorePoints() {
    const doc = getActiveDocument();
    if (!restorePointList || !restorePointCount) return;

    const points = doc ? normalizeRestorePoints(doc.restorePoints) : [];
    if (doc) doc.restorePoints = points;

    restorePointCount.textContent = points.length + ' saved';

    if (!points.length) {
      restorePointList.innerHTML = '<p class="restore-empty">No restore points yet.</p>';
      return;
    }

    restorePointList.innerHTML = points.map(function (point) {
      return '<div class="restore-point" data-version-id="' + escapeHtml(point.id) + '">' +
        '<div>' +
          '<strong title="' + escapeHtml(point.name) + '">' + escapeHtml(point.name) + '</strong>' +
          '<span>' + escapeHtml(getVersionTime(point.createdAt)) + (point.auto ? ' • Auto' : '') + '</span>' +
        '</div>' +
        '<div class="restore-actions">' +
          '<button type="button" data-restore-action="restore" data-tooltip="Restore this saved version.">Restore</button>' +
          '<button type="button" data-restore-action="delete" data-tooltip="Delete this restore point.">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function getRestorePointName(fallbackName) {
    const typedName = restorePointName ? restorePointName.value.trim() : '';
    return typedName || fallbackName || 'Saved version';
  }

  function createRestorePoint(name, auto) {
    const doc = getActiveDocument();
    if (!doc) return null;

    if (!isLoading) updateActiveDocumentContent();
    const content = normalizeResumeContent(doc.content || collectState());
    const signature = getHistorySignature(content);
    doc.restorePoints = normalizeRestorePoints(doc.restorePoints);

    if (doc.restorePoints[0] && getHistorySignature(doc.restorePoints[0].content) === signature && doc.restorePoints[0].name === name) {
      return doc.restorePoints[0];
    }

    const point = {
      id: generateDocumentId(),
      name: name,
      createdAt: Date.now(),
      auto: !!auto,
      content: cloneState(content),
    };

    doc.restorePoints.unshift(point);
    doc.restorePoints = doc.restorePoints.slice(0, RESTORE_POINT_LIMIT);
    doc.updatedAt = Date.now();
    saveDocuments();
    renderDocumentList();
    renderRestorePoints();
    updateBackupReminder();
    return point;
  }

  function saveManualRestorePoint() {
    const name = getRestorePointName('Manual save');
    createRestorePoint(name, false);
    if (restorePointName) restorePointName.value = '';
    showSavedStatus();
  }

  function findRestorePoint(versionId) {
    const doc = getActiveDocument();
    if (!doc) return null;
    doc.restorePoints = normalizeRestorePoints(doc.restorePoints);
    return doc.restorePoints.find(function (point) {
      return point.id === versionId;
    });
  }

  function restoreSavedVersion(versionId) {
    const point = findRestorePoint(versionId);
    if (!point) return;

    if (!confirm('Restore "' + point.name + '"? Your current resume will be saved as an automatic restore point first.')) {
      return;
    }

    createRestorePoint('Before restoring ' + point.name, true);
    replaceCurrentDocumentContent(point.content);
    resetHistoryBaseline();
    showSavedStatus();
  }

  function deleteRestorePoint(versionId) {
    const doc = getActiveDocument();
    if (!doc) return;

    const point = findRestorePoint(versionId);
    if (!point || !confirm('Delete restore point "' + point.name + '"?')) return;

    doc.restorePoints = normalizeRestorePoints(doc.restorePoints).filter(function (point) {
      return point.id !== versionId;
    });
    saveDocuments();
    renderRestorePoints();
    updateBackupReminder();
  }

  function loadDocumentStoreFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        documentStore = normalizeDocumentStore(JSON.parse(raw));
        saveDocuments();
        return;
      }

      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyContent = normalizeResumeContent(JSON.parse(legacyRaw));
        const id = generateDocumentId();
        documentStore = {
          activeDocumentId: id,
          documents: [{
            id: id,
            name: 'My First Resume',
            type: 'resume',
            updatedAt: Date.now(),
            content: legacyContent,
            restorePoints: [],
          }],
        };
        saveDocuments();
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (err) {
      documentStore = { activeDocumentId: null, documents: [] };
    }
  }

  function saveDocuments() {
    if (pendingSaveTimer) {
      clearTimeout(pendingSaveTimer);
      pendingSaveTimer = null;
    }
    hasPendingSave = false;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documentStore));
      if (storageWarning) storageWarning.hidden = true;
      showSavedStatus('Saved locally in this browser');
      return true;
    } catch (err) {
      if (storageWarning && storageWarningText) {
        storageWarningText.textContent = 'Your browser could not save the latest changes. Export a backup before continuing.';
        storageWarning.hidden = false;
      }
      showSavedStatus('Save failed. Export a backup.');
      return false;
    }
  }

  function saveDocumentsSoon() {
    hasPendingSave = true;
    showSavingStatus();
    if (pendingSaveTimer) clearTimeout(pendingSaveTimer);

    pendingSaveTimer = setTimeout(function () {
      pendingSaveTimer = null;
      if (hasPendingSave) saveDocuments();
    }, SAVE_DEBOUNCE_MS);
  }

  function renderDocumentListSoon() {
    hasPendingDocumentRender = true;
    if (pendingRenderTimer) clearTimeout(pendingRenderTimer);

    pendingRenderTimer = setTimeout(function () {
      pendingRenderTimer = null;
      if (hasPendingDocumentRender) renderDocumentList();
    }, RENDER_DEBOUNCE_MS);
  }

  function flushPendingWork() {
    if (partTypographyApplyQueued) {
      partTypographyApplyQueued = false;
      applyPartTypography();
    }

    if (pendingPageCheckTimer) {
      clearTimeout(pendingPageCheckTimer);
      pendingPageCheckTimer = null;
      updatePageOverflowWarning();
    }

    if (pendingQualityCheckTimer) {
      clearTimeout(pendingQualityCheckTimer);
      pendingQualityCheckTimer = null;
      updateResumeQuality();
    }

    if (pendingJobMatchTimer) {
      clearTimeout(pendingJobMatchTimer);
      pendingJobMatchTimer = null;
      updateJobMatch();
    }

    if (pendingATSCheckTimer) {
      clearTimeout(pendingATSCheckTimer);
      pendingATSCheckTimer = null;
      updateATSCompatibility();
    }

    if (pendingBackupStatusTimer) {
      clearTimeout(pendingBackupStatusTimer);
      pendingBackupStatusTimer = null;
      updateBackupReminder();
    }

    if (pendingAIPromptTimer) {
      clearTimeout(pendingAIPromptTimer);
      pendingAIPromptTimer = null;
      updateAIPrompt();
    }

    if (pendingRenderTimer) {
      clearTimeout(pendingRenderTimer);
      pendingRenderTimer = null;
    }
    if (hasPendingDocumentRender) renderDocumentList();

    if (pendingSaveTimer) {
      clearTimeout(pendingSaveTimer);
      pendingSaveTimer = null;
    }
    if (hasPendingSave) saveDocuments();
  }

  function loadBackupMeta() {
    try {
      const raw = localStorage.getItem(BACKUP_META_KEY);
      if (raw) backupMeta = Object.assign(backupMeta, JSON.parse(raw));
    } catch (err) {
      backupMeta = { lastBackupAt: 0, lastBackupSignature: '' };
    }
  }

  function saveBackupMeta() {
    try {
      localStorage.setItem(BACKUP_META_KEY, JSON.stringify(backupMeta));
    } catch (err) {
      // Backup reminder is optional.
    }
  }

  function loadAppPrefs() {
    try {
      const raw = localStorage.getItem(APP_PREFS_KEY);
      if (raw) appPrefs = Object.assign(appPrefs, JSON.parse(raw));
    } catch (err) {
      appPrefs = { theme: 'aurora', guideSeen: false };
    }

    if (!APP_THEMES.includes(appPrefs.theme)) appPrefs.theme = 'aurora';
    activeAppTheme = appPrefs.theme;
  }

  function saveAppPrefs() {
    try {
      localStorage.setItem(APP_PREFS_KEY, JSON.stringify(appPrefs));
    } catch (err) {
      // App preferences are optional and do not affect resume data.
    }
  }

  function applyAppTheme(themeId) {
    activeAppTheme = APP_THEMES.includes(themeId) ? themeId : 'aurora';
    appPrefs.theme = activeAppTheme;

    APP_THEMES.forEach(function (theme) {
      document.body.classList.toggle('app-theme-' + theme, theme === activeAppTheme);
    });

    appThemeButtons.forEach(function (btn) {
      const isActive = btn.dataset.appTheme === activeAppTheme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initAppThemeButtons() {
    appThemeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyAppTheme(btn.dataset.appTheme);
        saveAppPrefs();
      });
    });
  }

  function clearGuideHighlight() {
    document.querySelectorAll('.guide-highlight').forEach(function (el) {
      el.classList.remove('guide-highlight');
    });
  }

  function renderGuideStep() {
    const step = GUIDE_STEPS[guideStepIndex];
    if (!step) return;

    clearGuideHighlight();
    guideProgress.textContent = 'Step ' + (guideStepIndex + 1) + ' of ' + GUIDE_STEPS.length;
    guideTitle.textContent = guideStepIndex === 0 ? 'Welcome to ResCapt' : 'ResCapt guide';
    guideStepTitle.textContent = step.title;
    guideStepText.textContent = step.text;
    prevGuideBtn.disabled = guideStepIndex === 0;
    nextGuideBtn.textContent = guideStepIndex === GUIDE_STEPS.length - 1 ? 'Finish' : 'Next';

    if (window.matchMedia('(max-width: 900px)').matches) {
      if (step.selector === '.preview-panel' || step.selector === '#downloadPdf') {
        applyMobileView('preview');
      } else {
        applyMobileView('edit');
      }
    }

    const target = document.querySelector(step.selector);
    if (target) {
      target.classList.add('guide-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  function openGuide(startIndex) {
    guideStepIndex = Math.max(0, Math.min(startIndex || 0, GUIDE_STEPS.length - 1));
    guideModal.hidden = false;
    renderGuideStep();
    nextGuideBtn.focus();
  }

  function closeGuide(markSeen) {
    guideModal.hidden = true;
    clearGuideHighlight();
    if (markSeen) {
      appPrefs.guideSeen = true;
      saveAppPrefs();
    }
  }

  function initGuide() {
    openGuideBtn.addEventListener('click', function () {
      openGuide(0);
    });

    closeGuideBtn.addEventListener('click', function () {
      closeGuide(true);
    });

    skipGuideBtn.addEventListener('click', function () {
      closeGuide(true);
    });

    prevGuideBtn.addEventListener('click', function () {
      if (guideStepIndex > 0) {
        guideStepIndex -= 1;
        renderGuideStep();
      }
    });

    nextGuideBtn.addEventListener('click', function () {
      if (guideStepIndex >= GUIDE_STEPS.length - 1) {
        closeGuide(true);
        return;
      }
      guideStepIndex += 1;
      renderGuideStep();
    });
  }

  function getBackupSignature() {
    return documentStore.documents.map(function (doc) {
      return doc.id + ':' + doc.updatedAt;
    }).join('|');
  }

  function formatBackupTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function updateBackupReminder() {
    const currentSignature = getBackupSignature();
    const isBackedUp = !!backupMeta.lastBackupAt && backupMeta.lastBackupSignature === currentSignature;

    backupReminder.classList.toggle('is-backed-up', isBackedUp);

    if (isBackedUp) {
      backupReminderTitle.textContent = 'Backup current';
      backupReminderText.textContent = 'All resumes were backed up on ' + formatBackupTime(backupMeta.lastBackupAt) + '.';
      updatePublishChecklist();
      return;
    }

    backupReminderTitle.textContent = backupMeta.lastBackupAt ? 'Backup out of date' : 'Backup recommended';
    backupReminderText.textContent = backupMeta.lastBackupAt
      ? 'You have changes since your last backup. Export a fresh JSON backup.'
      : 'Export a JSON backup so your resumes can be restored later.';
    updatePublishChecklist();
  }

  function scheduleBackupStatusUpdate() {
    if (pendingBackupStatusTimer) clearTimeout(pendingBackupStatusTimer);
    pendingBackupStatusTimer = setTimeout(function () {
      pendingBackupStatusTimer = null;
      updateBackupReminder();
    }, BACKUP_STATUS_DEBOUNCE_MS);
  }

  function markLibraryBackedUp() {
    backupMeta.lastBackupAt = Date.now();
    backupMeta.lastBackupSignature = getBackupSignature();
    saveBackupMeta();
    updateBackupReminder();
  }

  function updateActiveDocumentContent() {
    const doc = getActiveDocument();
    if (!doc) return;
    doc.content = collectState();
    doc.updatedAt = Date.now();
  }

  function renderDocumentList() {
    hasPendingDocumentRender = false;
    documentList.innerHTML = '';
    const isLastDocument = documentStore.documents.length <= 1;

    documentStore.documents.forEach(function (doc) {
      const item = document.createElement('div');
      item.className = 'document-item';
      item.dataset.docId = doc.id;
      item.setAttribute('role', 'listitem');

      if (doc.id === documentStore.activeDocumentId) {
        item.classList.add('active');
      }

      item.innerHTML =
          '<button type="button" class="document-select-btn" data-tooltip="Open this saved resume for editing." aria-pressed="' +
          (doc.id === documentStore.activeDocumentId ? 'true' : 'false') +
        '">' +
          '<span class="document-icon" aria-hidden="true"></span>' +
          '<span class="document-meta">' +
            '<span class="document-name">' + escapeHtml(doc.name) + '</span>' +
            '<span class="document-type-badge">Resume · ' + formatRelativeTime(doc.updatedAt) + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="document-actions">' +
          '<button type="button" class="doc-action-btn" data-action="rename" data-tooltip="Change this resume name in your saved document list.">Rename</button>' +
          '<button type="button" class="doc-action-btn" data-action="duplicate" data-tooltip="Make a copy of this resume so you can edit a new version.">Duplicate</button>' +
          '<button type="button" class="doc-action-btn doc-action-delete" data-action="delete" data-tooltip="' +
            (isLastDocument ? 'Keep at least one resume saved.' : 'Delete this saved resume from this browser.') + '"' +
            (isLastDocument ? ' disabled' : '') +
          '>Delete</button>' +
        '</div>';

      documentList.appendChild(item);
    });
  }

  function switchToDocument(documentId) {
    if (!documentStore.documents.some(function (doc) { return doc.id === documentId; })) {
      return;
    }

    if (!isLoading && documentId !== documentStore.activeDocumentId) {
      updateActiveDocumentContent();
      flushPendingWork();
      saveDocuments();
    }

    documentStore.activeDocumentId = documentId;
    const doc = getActiveDocument();
    if (!doc) return;

    isLoading = true;
    loadDocumentContent(doc.content);
    isLoading = false;
    resetHistoryBaseline();

    renderDocumentList();
    renderRestorePoints();
    showSavedStatus();
    if (!lastClearedDocument || lastClearedDocument.id !== documentId) {
      undoClearBanner.hidden = true;
    }
  }

  function createNewDocument() {
    if (!isLoading) updateActiveDocumentContent();

    const id = generateDocumentId();
    const name = getUniqueDocumentName('Resume ' + (documentStore.documents.length + 1));

    documentStore.documents.push({
      id: id,
      name: name,
      type: 'resume',
      updatedAt: Date.now(),
      content: getEmptyDocumentContent(),
      restorePoints: [],
    });

    saveDocuments();
    switchToDocument(id);
    lastClearedDocument = null;
    undoClearBanner.hidden = true;
  }

  function clearCurrentDocument() {
    const doc = getActiveDocument();
    if (!doc) return;

    if (!confirm('Clear all content from "' + doc.name + '"? This keeps the saved document but resets the form.')) {
      return;
    }

    if (!isLoading) updateActiveDocumentContent();
    lastClearedDocument = {
      id: doc.id,
      content: JSON.parse(JSON.stringify(doc.content || collectState())),
    };
    createRestorePoint('Before clear form', true);

    doc.content = getEmptyDocumentContent();
    doc.updatedAt = Date.now();

    isLoading = true;
    loadDocumentContent(doc.content);
    isLoading = false;
    recordHistorySnapshot();

    saveDocuments();
    renderDocumentList();
    renderRestorePoints();
    updateBackupReminder();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    showSavedStatus();
    undoClearMessage.textContent = 'Form cleared.';
    undoClearBanner.hidden = false;
  }

  function replaceCurrentDocumentContent(content) {
    const doc = getActiveDocument();
    if (!doc) return;

    doc.content = normalizeResumeContent(content);
    doc.updatedAt = Date.now();

    isLoading = true;
    loadDocumentContent(doc.content);
    isLoading = false;
    recordHistorySnapshot();

    saveDocuments();
    renderDocumentList();
    renderRestorePoints();
    updateBackupReminder();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    showSavedStatus();
  }

  function loadSampleDocument() {
    const doc = getActiveDocument();
    if (!doc) return;

    if (!confirm('Replace the current resume content with sample content? This keeps the saved document and you can undo the change right after.')) {
      return;
    }

    if (!isLoading) updateActiveDocumentContent();
    lastClearedDocument = {
      id: doc.id,
      content: JSON.parse(JSON.stringify(doc.content || collectState())),
    };
    createRestorePoint('Before sample load', true);

    replaceCurrentDocumentContent(getSampleDocumentContent(sampleResumeType ? sampleResumeType.value : 'job'));
    undoClearMessage.textContent = 'Sample loaded.';
    undoClearBanner.hidden = false;
  }

  function undoClearDocument() {
    if (!lastClearedDocument) return;

    const doc = documentStore.documents.find(function (item) {
      return item.id === lastClearedDocument.id;
    });
    if (!doc) {
      lastClearedDocument = null;
      undoClearBanner.hidden = true;
      return;
    }

    doc.content = JSON.parse(JSON.stringify(lastClearedDocument.content));
    doc.updatedAt = Date.now();
    documentStore.activeDocumentId = doc.id;

    isLoading = true;
    loadDocumentContent(doc.content);
    isLoading = false;
    resetHistoryBaseline();

    saveDocuments();
    renderDocumentList();
    renderRestorePoints();
    updateBackupReminder();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    showSavedStatus();
    lastClearedDocument = null;
    undoClearBanner.hidden = true;
  }

  function renameDocument(documentId) {
    const doc = documentStore.documents.find(function (d) { return d.id === documentId; });
    if (!doc) return;

    const newName = prompt('Rename document:', doc.name);
    if (!newName || !newName.trim()) return;

    doc.name = newName.trim();
    doc.updatedAt = Date.now();
    saveDocuments();
    renderDocumentList();
    showSavedStatus();
  }

  function duplicateDocument(documentId) {
    const source = documentStore.documents.find(function (d) { return d.id === documentId; });
    if (!source) return;

    if (!isLoading) updateActiveDocumentContent();

    const id = generateDocumentId();
    const name = getUniqueDocumentName(source.name + ' (Copy)');

    documentStore.documents.push({
      id: id,
      name: name,
      type: 'resume',
      updatedAt: Date.now(),
      content: JSON.parse(JSON.stringify(source.content)),
      restorePoints: normalizeRestorePoints(source.restorePoints).map(function (point) {
        point.id = generateDocumentId();
        return point;
      }),
    });

    saveDocuments();
    switchToDocument(id);
    lastClearedDocument = null;
    undoClearBanner.hidden = true;
  }

  function deleteDocument(documentId) {
    if (documentStore.documents.length <= 1) {
      alert('You must keep at least one document.');
      return;
    }

    const doc = documentStore.documents.find(function (d) { return d.id === documentId; });
    if (!doc) return;

    if (!confirm('Delete "' + doc.name + '"? This cannot be undone.')) return;

    const index = documentStore.documents.findIndex(function (d) { return d.id === documentId; });
    documentStore.documents.splice(index, 1);

    if (documentStore.activeDocumentId === documentId) {
      documentStore.activeDocumentId = documentStore.documents[0].id;
      if (lastClearedDocument && lastClearedDocument.id === documentId) {
        lastClearedDocument = null;
        undoClearBanner.hidden = true;
      }
      saveDocuments();
      switchToDocument(documentStore.activeDocumentId);
    } else {
      saveDocuments();
      renderDocumentList();
      showSavedStatus();
    }
  }

  // ── JSON Export / Import ───────────────────────────────────
  function exportCurrentDocument() {
    if (!isLoading) updateActiveDocumentContent();
    flushPendingWork();
    const doc = getActiveDocument();
    if (!doc) return;

    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').toLowerCase() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadJsonFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportAllDocuments() {
    if (!isLoading) updateActiveDocumentContent();
    flushPendingWork();

    const backup = {
      format: 'rescapt-library-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      activeDocumentId: documentStore.activeDocumentId,
      documents: documentStore.documents.map(function (doc) {
        return {
          id: doc.id,
          name: doc.name,
          type: 'resume',
          updatedAt: doc.updatedAt,
          content: normalizeResumeContent(doc.content),
          restorePoints: normalizeRestorePoints(doc.restorePoints),
        };
      }),
    };

    downloadJsonFile(backup, 'rescapt_all_resumes_backup.json');
    markLibraryBackedUp();
  }

  function importLibraryBackup(imported) {
    const docs = Array.isArray(imported.documents) ? imported.documents : [];
    const normalizedDocs = docs
      .map(function (doc, index) { return normalizeStoredDocument(doc, index + 1); })
      .filter(Boolean);

    if (!normalizedDocs.length) throw new Error('No valid documents in backup');

    if (!isLoading) updateActiveDocumentContent();

    normalizedDocs.forEach(function (doc) {
      doc.id = generateDocumentId();
      doc.name = getUniqueDocumentName(doc.name || 'Imported Resume');
      doc.updatedAt = Date.now();
      documentStore.documents.push(doc);
    });

    saveDocuments();
    switchToDocument(normalizedDocs[0].id);
    alert('Imported ' + normalizedDocs.length + ' resume' + (normalizedDocs.length === 1 ? '' : 's') + '.');
  }

  function importDocument(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported.documents)) {
          importLibraryBackup(imported);
          return;
        }

        const content = normalizeResumeContent(imported.content);

        if (!isLoading) updateActiveDocumentContent();

        const id = generateDocumentId();
        const name = getUniqueDocumentName(asString(imported.name) || 'Imported Resume');

        documentStore.documents.push({
          id: id,
          name: name,
          type: 'resume',
          updatedAt: Date.now(),
          content: content,
          restorePoints: normalizeRestorePoints(imported.restorePoints),
        });

        saveDocuments();
        switchToDocument(id);
      } catch (err) {
        alert('Could not import file. Make sure it is a valid ResCapt JSON export.');
      }
    };
    reader.readAsText(file);
  }

  function initDocumentManager() {
    createDocumentBtn.addEventListener('click', createNewDocument);
    clearCurrentDocumentBtn.addEventListener('click', clearCurrentDocument);
    loadSampleDocumentBtn.addEventListener('click', loadSampleDocument);
    undoClearDocumentBtn.addEventListener('click', undoClearDocument);
    if (undoEditBtn) undoEditBtn.addEventListener('click', undoEdit);
    if (redoEditBtn) redoEditBtn.addEventListener('click', redoEdit);
    if (saveRestorePointBtn) saveRestorePointBtn.addEventListener('click', saveManualRestorePoint);
    backupReminderAction.addEventListener('click', exportAllDocuments);

    document.getElementById('exportJson').addEventListener('click', exportCurrentDocument);
    document.getElementById('exportAllJson').addEventListener('click', exportAllDocuments);

    document.getElementById('importJson').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file && confirm('Import "' + file.name + '"? ResCapt will add imported resumes to your document list and keep your current resumes.')) {
        importDocument(file);
      }
      e.target.value = '';
    });

    documentList.addEventListener('click', function (event) {
      const actionBtn = event.target.closest('[data-action]');
      const item = event.target.closest('.document-item');

      if (!item) return;
      const documentId = item.dataset.docId;

      if (actionBtn) {
        const action = actionBtn.dataset.action;
        if (action === 'rename') renameDocument(documentId);
        if (action === 'duplicate') duplicateDocument(documentId);
        if (action === 'delete') deleteDocument(documentId);
        return;
      }

      if (event.target.closest('.document-select-btn')) {
        switchToDocument(documentId);
      }
    });

    if (restorePointList) {
      restorePointList.addEventListener('click', function (event) {
        const actionBtn = event.target.closest('[data-restore-action]');
        const item = event.target.closest('[data-version-id]');
        if (!actionBtn || !item) return;

        const versionId = item.dataset.versionId;
        if (actionBtn.dataset.restoreAction === 'restore') restoreSavedVersion(versionId);
        if (actionBtn.dataset.restoreAction === 'delete') deleteRestorePoint(versionId);
      });
    }
  }

  function initDocumentStore() {
    loadBackupMeta();
    loadDocumentStoreFromStorage();

    if (documentStore.documents.length === 0) {
      const id = generateDocumentId();
      documentStore.documents.push({
        id: id,
        name: 'My First Resume',
        type: 'resume',
        updatedAt: Date.now(),
        content: getEmptyDocumentContent(),
        restorePoints: [],
      });
      documentStore.activeDocumentId = id;
      saveDocuments();
    }

    if (!documentStore.activeDocumentId) {
      documentStore.activeDocumentId = documentStore.documents[0].id;
    }

    isLoading = true;
    loadDocumentContent(getActiveDocument().content);
    isLoading = false;
    resetHistoryBaseline();

    renderDocumentList();
    renderRestorePoints();
    updateBackupReminder();
  }

  // ── State Collect / Restore ────────────────────────────────
  function collectCertificationData() {
    return Array.from(certificationList.querySelectorAll('.entry-card')).map(function (card) {
      return {
        name: card.querySelector('.cert-name').value,
        issuer: card.querySelector('.cert-issuer').value,
        date: card.querySelector('.cert-date').value,
      };
    });
  }

  function collectProjectData() {
    return Array.from(projectList.querySelectorAll('.entry-card')).map(function (card) {
      return {
        name: card.querySelector('.proj-name').value,
        link: card.querySelector('.proj-link').value,
        description: card.querySelector('.proj-desc').value,
      };
    });
  }

  function collectExperienceData() {
    return Array.from(experienceList.querySelectorAll('.entry-card')).map(function (card) {
      return {
        title: card.querySelector('.exp-title').value,
        company: card.querySelector('.exp-company').value,
        dates: card.querySelector('.exp-dates').value,
        description: card.querySelector('.exp-desc').value,
      };
    });
  }

  function collectEducationData() {
    return Array.from(educationList.querySelectorAll('.entry-card')).map(function (card) {
      return {
        qualification: card.querySelector('.edu-qualification').value,
        school: card.querySelector('.edu-school').value,
        dates: card.querySelector('.edu-dates').value,
      };
    });
  }

  function collectState() {
    return {
      personal: {
        fullName: personalFields.fullName.value,
        jobTitle: personalFields.jobTitle.value,
        email: personalFields.email.value,
        phone: personalFields.phone.value,
        location: personalFields.location.value,
        website: personalFields.website.value,
        summary: personalFields.summary.value,
      },
      experience: collectExperienceData(),
      education: collectEducationData(),
      certifications: collectCertificationData(),
      projects: collectProjectData(),
      skills: skillsField.value,
      customSection: {
        title: customTitleField.value,
        content: customContentField.value,
      },
      jobMatch: {
        jobDescription: jobDescriptionField ? jobDescriptionField.value : '',
        strategy: resumeStrategy && RESUME_STRATEGIES[resumeStrategy.value] ? resumeStrategy.value : 'job',
      },
      sectionVisibility: Object.assign({}, sectionVisibility),
      sectionTitles: Object.assign({}, sectionTitles),
      sectionOrder: sectionOrder.slice(),
      appearance: {
        template: activeTemplate,
        font: activeFont,
        fontSize: styleControls.fontSize.value,
        lineSpacing: styleControls.lineSpacing.value,
        textAlign: activeTextAlign,
        palette: activePalette,
        partTypography: normalizePartTypography(partTypography),
      },
    };
  }

  let savedStatusTimer = null;

  function showSavingStatus() {
    if (!saveStatus) return;
    saveStatus.textContent = 'Saving locally...';
    saveStatus.classList.add('visible');
    clearTimeout(savedStatusTimer);
  }

  function showSavedStatus(message) {
    if (!saveStatus) return;
    saveStatus.textContent = message || 'Saved locally in this browser';
    saveStatus.classList.add('visible');
    clearTimeout(savedStatusTimer);
    savedStatusTimer = setTimeout(function () {
      saveStatus.classList.remove('visible');
    }, 2000);
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function getCurrentHistoryState() {
    return normalizeResumeContent(collectState());
  }

  function getHistorySignature(state) {
    return JSON.stringify(state);
  }

  function updateHistoryButtons() {
    if (undoEditBtn) undoEditBtn.disabled = historyUndoStack.length === 0;
    if (redoEditBtn) redoEditBtn.disabled = historyRedoStack.length === 0;
  }

  function resetHistoryBaseline() {
    historyUndoStack = [];
    historyRedoStack = [];
    lastHistorySignature = getHistorySignature(getCurrentHistoryState());
    updateHistoryButtons();
  }

  function recordHistorySnapshot() {
    if (isLoading || isRestoringHistory) return;

    const current = getCurrentHistoryState();
    const signature = getHistorySignature(current);
    if (signature === lastHistorySignature) return;

    if (lastHistorySignature) {
      historyUndoStack.push(lastHistorySignature);
      if (historyUndoStack.length > HISTORY_LIMIT) historyUndoStack.shift();
    }

    historyRedoStack = [];
    lastHistorySignature = signature;
    updateHistoryButtons();
  }

  function restoreHistorySnapshot(signature, redoTarget) {
    const doc = getActiveDocument();
    if (!doc || !signature) return;

    isRestoringHistory = true;
    const restoredContent = normalizeResumeContent(JSON.parse(signature));
    doc.content = cloneState(restoredContent);
    doc.updatedAt = Date.now();

    isLoading = true;
    loadDocumentContent(doc.content);
    isLoading = false;

    lastHistorySignature = signature;
    if (redoTarget) historyRedoStack.push(redoTarget);

    saveDocuments();
    renderDocumentList();
    updateBackupReminder();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    scheduleJobMatchCheck();
    showSavedStatus();
    updateHistoryButtons();
    lastClearedDocument = null;
    undoClearBanner.hidden = true;
    isRestoringHistory = false;
  }

  function undoEdit() {
    if (!historyUndoStack.length) return;

    const current = getHistorySignature(getCurrentHistoryState());
    const previous = historyUndoStack.pop();
    restoreHistorySnapshot(previous, current);
  }

  function redoEdit() {
    if (!historyRedoStack.length) return;

    const current = getHistorySignature(getCurrentHistoryState());
    const next = historyRedoStack.pop();
    historyUndoStack.push(current);
    if (historyUndoStack.length > HISTORY_LIMIT) historyUndoStack.shift();
    restoreHistorySnapshot(next);
  }

  function persistChange() {
    if (isLoading) return;
    recordHistorySnapshot();
    schedulePartTypographyApply();
    updateActiveDocumentContent();
    saveDocumentsSoon();
    renderDocumentListSoon();
    scheduleBackupStatusUpdate();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    scheduleJobMatchCheck();
    scheduleAIPromptUpdate();
  }

  function restoreExperience(entries) {
    experienceList.innerHTML = '';
    if (entries && entries.length) {
      entries.forEach(function (entry) { addExperienceEntry(entry); });
    }
    updateExperiencePreview();
  }

  function restoreEducation(entries) {
    educationList.innerHTML = '';
    if (entries && entries.length) {
      entries.forEach(function (entry) { addEducationEntry(entry); });
    }
    updateEducationPreview();
  }

  function restoreCertifications(entries) {
    certificationList.innerHTML = '';
    if (entries && entries.length) {
      entries.forEach(function (entry) { addCertificationEntry(entry); });
    }
    updateCertificationsPreview();
  }

  function restoreProjects(entries) {
    projectList.innerHTML = '';
    if (entries && entries.length) {
      entries.forEach(function (entry) { addProjectEntry(entry); });
    }
    updateProjectsPreview();
  }

  function loadDocumentContent(data) {
    if (!data) data = getEmptyDocumentContent();

    if (data.personal) {
      personalFields.fullName.value = data.personal.fullName || '';
      personalFields.jobTitle.value = data.personal.jobTitle || '';
      personalFields.email.value = data.personal.email || '';
      personalFields.phone.value = data.personal.phone || '';
      personalFields.location.value = data.personal.location || '';
      personalFields.website.value = data.personal.website || '';
      personalFields.summary.value = data.personal.summary || '';
    } else {
      Object.values(personalFields).forEach(function (field) { field.value = ''; });
    }

    skillsField.value = data.skills || '';

    if (data.customSection) {
      customTitleField.value = data.customSection.title || '';
      customContentField.value = data.customSection.content || '';
    } else {
      customTitleField.value = '';
      customContentField.value = '';
    }

    if (jobDescriptionField) {
      jobDescriptionField.value = data.jobMatch && data.jobMatch.jobDescription ? data.jobMatch.jobDescription : '';
    }
    if (resumeStrategy) {
      const strategy = data.jobMatch && RESUME_STRATEGIES[data.jobMatch.strategy] ? data.jobMatch.strategy : 'job';
      resumeStrategy.value = strategy;
    }

    sectionVisibility = normalizeSectionVisibility(data.sectionVisibility);
    sectionTitles = normalizeSectionTitles(data.sectionTitles);
    sectionOrder = normalizeSectionOrder(data.sectionOrder);

    restoreExperience(data.experience);
    restoreEducation(data.education);
    restoreCertifications(data.certifications);
    restoreProjects(data.projects);

    if (data.appearance) {
      if (data.appearance.fontSize) styleControls.fontSize.value = data.appearance.fontSize;
      if (data.appearance.lineSpacing) styleControls.lineSpacing.value = data.appearance.lineSpacing;
      activeTemplate = data.appearance.template || 'professional';
      activeFont = data.appearance.font || activeFont;
      activeTextAlign = data.appearance.textAlign || 'left';
      activePalette = data.appearance.palette || 'corporate-navy';
      activeLineSpacing = data.appearance.lineSpacing || '1.5';
      partTypography = normalizePartTypography(data.appearance.partTypography);
    } else {
      partTypography = getDefaultPartTypography();
    }

    updatePersonalPreview();
    updateSummaryCounter();
    updateSkillsPreview();
    updateCustomSectionPreview();
    applyTemplate(activeTemplate);
    applyFont(activeFont);
    applyTextAlign(activeTextAlign);
    applyPalette(activePalette);
    applyStyles();
    applySectionSettings();
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    scheduleJobMatchCheck();
  }

  // ── Styling Controls ───────────────────────────────────────
  function updateFontSizeDisplay() {
    const size = styleControls.fontSize.value;
    styleControls.fontSizeValue.textContent = size + 'px';
    styleControls.fontSize.setAttribute('aria-valuenow', size);
  }

  function updateLineSpacingDisplay() {
    const val = parseFloat(styleControls.lineSpacing.value).toFixed(1);
    styleControls.lineSpacingValue.textContent = val;
    styleControls.lineSpacing.setAttribute('aria-valuenow', val);
  }

  function getSelectedTypographyPart() {
    const key = styleControls.partTarget && TYPOGRAPHY_PARTS.indexOf(styleControls.partTarget.value) >= 0
      ? styleControls.partTarget.value
      : 'summary';
    if (!partTypography[key]) partTypography[key] = Object.assign({}, DEFAULT_TYPOGRAPHY_PART);
    return key;
  }

  function updatePartTypographyControls() {
    if (!styleControls.partTarget || !styleControls.partScale || !styleControls.partLineSpacing) return;

    const key = getSelectedTypographyPart();
    const settings = partTypography[key] || DEFAULT_TYPOGRAPHY_PART;
    styleControls.partScale.value = settings.scale;
    styleControls.partLineSpacing.value = settings.line;
    styleControls.partScaleValue.textContent = Math.round(settings.scale) + '%';
    styleControls.partLineSpacingValue.textContent = Number(settings.line).toFixed(2) + 'x';
    styleControls.partScale.setAttribute('aria-valuenow', settings.scale);
    styleControls.partLineSpacing.setAttribute('aria-valuenow', settings.line);
  }

  function syncSelectedPartTypographyFromControls() {
    if (!styleControls.partScale || !styleControls.partLineSpacing) return;

    const key = getSelectedTypographyPart();
    partTypography[key] = {
      scale: Number(normalizeRange(styleControls.partScale.value, DEFAULT_TYPOGRAPHY_PART.scale, 80, 130)),
      line: Number(normalizeRange(styleControls.partLineSpacing.value, DEFAULT_TYPOGRAPHY_PART.line, 0.85, 1.4)),
    };
    updatePartTypographyControls();
  }

  function schedulePartTypographyApply() {
    if (partTypographyApplyQueued) return;
    partTypographyApplyQueued = true;
    requestAnimationFrame(function () {
      partTypographyApplyQueued = false;
      applyPartTypography();
    });
  }

  function getTypographyPartForPreviewTarget(target) {
    if (!target || !resumePreview.contains(target)) return '';

    const inline = target.closest('[data-preview-field]');
    const entry = inline && inline.closest('[data-preview-type]');
    if (inline && entry) {
      const type = entry.dataset.previewType;
      const field = inline.dataset.previewField;
      const map = {
        experience: {
          title: 'experienceTitle',
          company: 'experienceOrg',
          dates: 'experienceDates',
          desc: 'experienceDesc',
        },
        project: {
          name: 'projectTitle',
          link: 'projectLink',
          desc: 'projectDesc',
        },
        education: {
          qualification: 'educationTitle',
          school: 'educationOrg',
          dates: 'educationDates',
        },
        certification: {
          name: 'certTitle',
          issuer: 'certOrg',
          date: 'certDates',
        },
      };
      return map[type] && map[type][field] ? map[type][field] : '';
    }

    if (target.closest('.resume-name')) return 'name';
    if (target.closest('.resume-title')) return 'title';
    if (target.closest('.resume-contact')) return 'contact';
    if (target.closest('.resume-section h3')) return 'heading';
    if (target.closest('#previewSummary')) return 'summary';
    if (target.closest('.skills-list li')) return 'skills';
    if (target.closest('#previewCustomContent')) return 'custom';
    return '';
  }

  function selectTypographyPartFromPreview(target) {
    const part = getTypographyPartForPreviewTarget(target);
    if (!part || !styleControls.partTarget || TYPOGRAPHY_PARTS.indexOf(part) < 0) return false;

    styleControls.partTarget.value = part;
    updatePartTypographyControls();

    resumePreview.querySelectorAll('.preview-typography-selected').forEach(function (node) {
      node.classList.remove('preview-typography-selected');
    });

    const selectedText = target.closest('[data-preview-field], .resume-name, .resume-title, .resume-contact, .resume-section h3, #previewSummary, .skills-list li, #previewCustomContent');
    if (selectedText) {
      selectedText.classList.add('preview-typography-selected');
      setTimeout(function () {
        selectedText.classList.remove('preview-typography-selected');
      }, 1200);
    }

    if (styleControls.partHint) {
      const label = styleControls.partTarget.options[styleControls.partTarget.selectedIndex].text;
      styleControls.partHint.textContent = 'Selected from preview: ' + label + '. Adjust size or spacing below.';
      styleControls.partHint.classList.add('is-active');
      setTimeout(function () {
        styleControls.partHint.classList.remove('is-active');
      }, 1600);
    }

    const panel = styleControls.partTarget.closest('.fine-tune-panel');
    if (panel) {
      panel.classList.add('fine-tune-panel-active');
      setTimeout(function () {
        panel.classList.remove('fine-tune-panel-active');
      }, 1200);
    }

    return true;
  }

  function applyPartTypography() {
    const normalized = normalizePartTypography(partTypography);
    partTypography = normalized;
    const targets = {
      name: '.resume-name',
      title: '.resume-title',
      contact: '.resume-contact',
      heading: '.resume-section h3',
      summary: '#previewSummary',
      experienceTitle: '[data-preview-type="experience"] .preview-entry-title',
      experienceOrg: '[data-preview-type="experience"] .preview-entry-sub',
      experienceDates: '[data-preview-type="experience"] .preview-entry-dates',
      experienceDesc: '[data-preview-type="experience"] .preview-entry-desc',
      projectTitle: '[data-preview-type="project"] .preview-entry-title',
      projectLink: '[data-preview-type="project"] .preview-entry-link',
      projectDesc: '[data-preview-type="project"] .preview-entry-desc',
      educationTitle: '[data-preview-type="education"] .preview-entry-title',
      educationOrg: '[data-preview-type="education"] .preview-entry-sub',
      educationDates: '[data-preview-type="education"] .preview-entry-dates',
      certTitle: '[data-preview-type="certification"] .preview-entry-title',
      certOrg: '[data-preview-type="certification"] .preview-entry-sub',
      certDates: '[data-preview-type="certification"] .preview-entry-dates',
      custom: '#previewCustomContent',
      skills: '.skills-list li',
    };

    TYPOGRAPHY_PARTS.forEach(function (key) {
      const settings = normalized[key];
      resumePreview.style.setProperty('--type-' + key + '-scale', (settings.scale / 100).toFixed(2));
      resumePreview.style.setProperty('--type-' + key + '-line', Number(settings.line).toFixed(2));
      resumePreview.querySelectorAll(targets[key]).forEach(function (element) {
        element.style.fontSize = '';
        element.style.lineHeight = '';
      });
    });

    TYPOGRAPHY_PARTS.forEach(function (key) {
      const settings = normalized[key];
      resumePreview.querySelectorAll(targets[key]).forEach(function (element) {
        const computed = window.getComputedStyle(element);
        const baseSize = parseFloat(computed.fontSize);
        const baseLine = parseFloat(computed.lineHeight);
        if (Number.isFinite(baseSize)) {
          element.style.fontSize = (baseSize * (settings.scale / 100)).toFixed(2) + 'px';
        }
        if (Number.isFinite(baseLine)) {
          element.style.lineHeight = (baseLine * settings.line).toFixed(2) + 'px';
        } else {
          element.style.lineHeight = settings.line;
        }
      });
    });

    updatePartTypographyControls();
  }

  function applyStyles() {
    const palette = PALETTES[activePalette];
    const fontSize = styleControls.fontSize.value + 'px';
    const lineSpacing = styleControls.lineSpacing.value;

    resumePreview.style.fontFamily = activeFont;
    resumePreview.style.fontSize = fontSize;
    resumePreview.style.lineHeight = lineSpacing;
    resumePreview.style.backgroundColor = '#ffffff';
    resumePreview.style.setProperty('--palette-primary', palette.primary);
    resumePreview.style.setProperty('--palette-accent', palette.accent);
    resumePreview.style.setProperty('--body-text-align', activeTextAlign);
    applyPartTypography();

    updateFontSizeDisplay();
    updateLineSpacingDisplay();
    updateMobilePreviewScale();
    schedulePageOverflowCheck();
  }

  function updateMobilePreviewScale() {
    if (!previewScroll) return;
    mobilePreviewScaleQueued = false;

    const isMobilePreview = window.matchMedia('(max-width: 900px)').matches && activeMobileView === 'preview';
    if (!isMobilePreview) {
      document.documentElement.style.removeProperty('--mobile-a4-scale');
      document.documentElement.style.removeProperty('--mobile-a4-scaled-height');
      document.documentElement.style.removeProperty('--mobile-a4-unscaled-height');
      return;
    }

    const availableWidth = Math.max(280, previewScroll.clientWidth - 18);
    const scale = Math.min(1, availableWidth / PDF_A4.contentWidthPx);
    const activePages = allowSecondPage || manualSecondPage ? 2 : 1;
    const fullHeight = PREVIEW_A4_HEIGHT_PX * activePages;
    const scaledHeight = Math.round(fullHeight * scale);

    document.documentElement.style.setProperty('--mobile-a4-scale', scale.toFixed(4));
    document.documentElement.style.setProperty('--mobile-a4-scaled-height', scaledHeight + 'px');
    document.documentElement.style.setProperty('--mobile-a4-unscaled-height', fullHeight + 'px');
  }

  function scheduleMobilePreviewScaleUpdate() {
    if (mobilePreviewScaleQueued) return;
    mobilePreviewScaleQueued = true;
    requestAnimationFrame(updateMobilePreviewScale);
  }

  function getAllowedPreviewPages() {
    return (allowSecondPage || manualSecondPage) ? 2 : 1;
  }

  function getSinglePreviewPageHeight() {
    if (allowSecondPage || manualSecondPage) {
      return resumePreview.clientHeight / 2;
    }
    return resumePreview.clientHeight;
  }

  function getPreviewContentHeight() {
    const sheetRect = resumePreview.getBoundingClientRect();
    const contentNodes = resumePreview.querySelectorAll('.resume-header, .resume-section');
    let bottom = 0;

    contentNodes.forEach(function (node) {
      if (node.offsetParent === null) return;
      const rect = node.getBoundingClientRect();
      bottom = Math.max(bottom, rect.bottom - sheetRect.top);
    });

    return Math.max(1, Math.ceil(bottom));
  }

  function updateManualSecondPageButton() {
    if (!manualSecondPageBtn) return;
    manualSecondPageBtn.textContent = manualSecondPage ? 'Remove page 2' : 'Add page 2';
    manualSecondPageBtn.setAttribute(
      'data-tooltip',
      manualSecondPage
        ? 'Remove the manually added extra A4 page.'
        : 'Manually add an extra A4 page for custom content.'
    );
  }

  function updatePageOverflowWarning() {
    const allowedPages = getAllowedPreviewPages();
    resumePreview.classList.toggle('allow-second-page', allowSecondPage || manualSecondPage);
    resumePreview.classList.toggle('manual-second-page', manualSecondPage);
    updateMobilePreviewScale();

    const pageHeight = getSinglePreviewPageHeight();
    const contentHeight = getPreviewContentHeight();
    if (allowSecondPage && !manualSecondPage && contentHeight <= pageHeight + 1) {
      allowSecondPage = false;
      resumePreview.classList.remove('allow-second-page');
      updatePageOverflowWarning();
      return;
    }

    const contentPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
    currentPreviewPageCount = contentPages;
    const isOverflowing = contentPages > allowedPages;
    resumePreview.classList.toggle('preview-overflow-scroll', isOverflowing);
    updateManualSecondPageButton();

    pageOverflowWarning.hidden = !isOverflowing;

    if (!isOverflowing) return;

    if (allowSecondPage) {
      pageOverflowText.textContent = 'Your resume is longer than two A4 pages. Scroll inside the preview to inspect it, then trim content before exporting.';
      allowSecondPageBtn.hidden = true;
      return;
    }

    pageOverflowText.textContent = 'Your resume is longer than one A4 page. Scroll inside the preview to inspect overflow content.';
    allowSecondPageBtn.hidden = false;
  }

  function schedulePageOverflowCheck() {
    if (pendingPageCheckTimer) clearTimeout(pendingPageCheckTimer);
    pendingPageCheckTimer = setTimeout(function () {
      pendingPageCheckTimer = null;
      requestAnimationFrame(function () {
        updatePageOverflowWarning();
        scheduleResumeQualityCheck();
        scheduleATSCompatibilityCheck();
      });
    }, PAGE_CHECK_DEBOUNCE_MS);
  }

  function hasFilledEntry(listEl) {
    return Array.from(listEl.querySelectorAll('input, textarea')).some(function (field) {
      return field.value.trim();
    });
  }

  function updateResumeQuality() {
    const userSummary = personalFields.summary.value.trim();
    const summaryLength = userSummary.length;
    const hasName = !!personalFields.fullName.value.trim();
    const hasRole = !!personalFields.jobTitle.value.trim();
    const hasContact = !!personalFields.email.value.trim() || !!personalFields.phone.value.trim();
    const hasSummary = summaryLength >= 80 && summaryLength <= SUMMARY_MAX;
    const hasExperience = hasFilledEntry(experienceList);
    const hasSkills = skillsField.value.split('\n').filter(function (skill) {
      return skill.trim();
    }).length >= 3;
    const fitsSelectedPages = currentPreviewPageCount <= getAllowedPreviewPages();

    const checks = [
      {
        complete: hasName && hasRole,
        text: hasName && hasRole ? 'Name and target role are filled in.' : 'Add your name and target role.',
      },
      {
        complete: hasContact,
        text: hasContact ? 'At least one contact method is included.' : 'Add an email address or phone number.',
      }
    ];

    if (sectionVisibility.summary) {
      checks.push({
        complete: hasSummary,
        warning: summaryLength > SUMMARY_MAX,
        text: hasSummary ? 'Summary length looks useful.' : 'Write an 80-500 character summary.',
      });
    }

    if (sectionVisibility.experience) {
      checks.push({
        complete: hasExperience,
        text: hasExperience ? 'Experience section has content.' : 'Add at least one work experience item.',
      });
    }

    if (sectionVisibility.skills) {
      checks.push({
        complete: hasSkills,
        text: hasSkills ? 'Skills section has at least three items.' : 'Add at least three skills.',
      });
    }

    checks.push({
      complete: fitsSelectedPages,
      warning: !fitsSelectedPages,
      text: fitsSelectedPages ? 'Resume fits the selected page count.' : 'Resume is overflowing the selected A4 page count.',
    });

    const completed = checks.filter(function (check) { return check.complete; }).length;
    const total = checks.length;

    qualityScore.textContent = completed + '/' + total;
    qualitySummary.textContent = completed === total
      ? 'Looks ready for a final review.'
      : 'Complete the remaining items before exporting.';

    qualityList.innerHTML = checks.map(function (check) {
      const className = check.complete ? 'complete' : (check.warning ? 'warning' : '');
      return '<li class="quality-item ' + className + '">' + escapeHtml(check.text) + '</li>';
    }).join('');
    scheduleATSCompatibilityCheck();
    updatePublishChecklist();
  }

  function getVisiblePlaceholderCount() {
    return Array.from(resumePreview.querySelectorAll('.placeholder-text')).filter(function (node) {
      return node.offsetParent !== null;
    }).length;
  }

  function getAtsScoreNumber() {
    const raw = atsScore ? atsScore.textContent : '';
    const match = raw.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  function getJobMatchScoreNumber() {
    const raw = jobMatchScore ? jobMatchScore.textContent : '';
    const match = raw.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  function updatePublishChecklist() {
    if (!publishChecklist || !publishChecklistSummary || !publishScore) return;

    const pageFit = getPreviewContentHeight() <= getSinglePreviewPageHeight() * getAllowedPreviewPages() + 1;
    const hasContact = !!personalFields.email.value.trim() || !!personalFields.phone.value.trim();
    const hasBasics = !!personalFields.fullName.value.trim() && !!personalFields.jobTitle.value.trim() && hasContact;
    const hasContent = hasFilledEntry(experienceList) || hasFilledEntry(projectList) || hasFilledEntry(educationList);
    const noPlaceholders = getVisiblePlaceholderCount() === 0;
    const atsReady = getAtsScoreNumber() >= 70;
    const jobText = jobDescriptionField ? jobDescriptionField.value.trim() : '';
    const jobReady = !jobText || getJobMatchScoreNumber() >= 45;
    const backupReady = !!backupMeta.lastBackupAt && backupMeta.lastBackupSignature === getBackupSignature();

    const checks = [
      { complete: hasBasics, text: hasBasics ? 'Name, role, and contact info are ready.' : 'Add name, target role, and at least one contact method.' },
      { complete: hasContent, text: hasContent ? 'Resume has real section content.' : 'Add experience, projects, or education content.' },
      { complete: noPlaceholders, text: noPlaceholders ? 'No visible placeholder sections remain.' : 'Fill or hide visible placeholder sections.' },
      { complete: pageFit, text: pageFit ? 'A4 page fit looks ready.' : 'Fix overflow or intentionally continue to page 2.' },
      { complete: atsReady, text: atsReady ? 'ATS score is publish-ready.' : 'Improve ATS score before sending if possible.' },
      { complete: jobReady && backupReady, text: jobReady && backupReady ? 'Job match and backup are ready.' : 'Check job match and export a fresh backup.' },
    ];
    const completed = checks.filter(function (check) { return check.complete; }).length;

    publishScore.textContent = completed + '/' + checks.length;
    publishChecklistSummary.textContent = completed === checks.length
      ? 'Looks ready for the final PDF preview.'
      : 'Finish the remaining items before downloading.';
    publishChecklist.innerHTML = checks.map(function (check) {
      return '<li class="' + (check.complete ? 'complete' : 'warning') + '">' + escapeHtml(check.text) + '</li>';
    }).join('');
  }

  function scheduleResumeQualityCheck() {
    if (pendingQualityCheckTimer) clearTimeout(pendingQualityCheckTimer);
    pendingQualityCheckTimer = setTimeout(function () {
      pendingQualityCheckTimer = null;
      requestAnimationFrame(updateResumeQuality);
    }, QUALITY_CHECK_DEBOUNCE_MS);
  }

  function normalizeKeywordText(text) {
    return asString(text).toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
  }

  function tokenizeKeywords(text) {
    return normalizeKeywordText(text)
      .split(/\s+/)
      .map(function (word) { return word.replace(/^-+|-+$/g, ''); })
      .filter(function (word) {
        return word.length >= 3 && KEYWORD_STOP_WORDS.indexOf(word) < 0 && !/^\d+$/.test(word);
      });
  }

  function extractKeywords(text, limit) {
    const counts = {};
    tokenizeKeywords(text).forEach(function (word) {
      counts[word] = (counts[word] || 0) + 1;
    });

    return Object.keys(counts)
      .sort(function (a, b) {
        if (counts[b] !== counts[a]) return counts[b] - counts[a];
        return a.localeCompare(b);
      })
      .slice(0, limit);
  }

  function getResumeMatchText() {
    const chunks = [
      personalFields.jobTitle.value,
      personalFields.summary.value,
      skillsField.value,
      customTitleField.value,
      customContentField.value
    ];

    collectExperienceData().forEach(function (entry) {
      chunks.push(entry.title, entry.company, entry.description);
    });

    collectEducationData().forEach(function (entry) {
      chunks.push(entry.qualification, entry.school);
    });

    collectCertificationData().forEach(function (entry) {
      chunks.push(entry.name, entry.issuer);
    });

    collectProjectData().forEach(function (entry) {
      chunks.push(entry.name, entry.description);
    });

    return chunks.join(' ');
  }

  function getAIPromptFitProfile() {
    const allowedPages = getAllowedPreviewPages();
    const pageHeight = Math.max(1, getSinglePreviewPageHeight());
    const contentHeight = getPreviewContentHeight();
    const contentPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
    const isTightTemplate = ['compact', 'modern', 'executive', 'sidebar-clean', 'signature'].indexOf(activeTemplate) >= 0;
    const shouldCompress = contentPages > allowedPages || isTightTemplate;
    const summaryLimit = allowedPages > 1 && !isTightTemplate ? 520 : 360;
    const bulletLimit = allowedPages > 1 && !isTightTemplate ? 185 : 145;
    const bulletsPerRole = allowedPages > 1 && !isTightTemplate ? 3 : 2;

    return {
      allowedPages: allowedPages,
      contentPages: contentPages,
      shouldCompress: shouldCompress,
      summaryLimit: summaryLimit,
      bulletLimit: bulletLimit,
      bulletsPerRole: bulletsPerRole,
      skillsLimit: shouldCompress ? 10 : 14,
    };
  }

  function formatPromptEntries(title, entries, formatter, limit) {
    const usable = entries.filter(function (entry) {
      return Object.keys(entry).some(function (key) { return asString(entry[key]).trim(); });
    }).slice(0, limit);

    if (!usable.length) return title + ':\n- None provided';
    return title + ':\n' + usable.map(formatter).join('\n');
  }

  function buildAIPrompt(fitProfile) {
    const fit = fitProfile || getAIPromptFitProfile();
    const strategy = getActiveStrategy();
    const jobText = jobDescriptionField ? jobDescriptionField.value.trim() : '';
    const skills = skillsField.value.split(/[\n,]+/).map(function (skill) {
      return skill.trim();
    }).filter(Boolean).slice(0, 18);
    const missing = getMissingJobKeywords(8);
    const matched = jobText
      ? extractKeywords(jobText, JOB_KEYWORD_LIMIT).filter(function (word) {
        return tokenizeKeywords(getResumeMatchText()).indexOf(word) >= 0;
      }).slice(0, 8)
      : [];

    return [
      'You are helping me write concise resume content for a resume builder called ResCapt.',
      '',
      'Goal:',
      '- Rewrite and finalize my resume content so it fits cleanly inside the selected template.',
      '- Keep the content truthful. Do not invent employers, degrees, metrics, tools, certifications, or dates.',
      '- If a useful fact is missing, write a short note asking me for that fact instead of making it up.',
      '',
      'Fit limits:',
      '- Target length: ' + fit.allowedPages + ' A4 page' + (fit.allowedPages === 1 ? '' : 's') + '.',
      '- Current estimate: about ' + fit.contentPages + ' A4 page' + (fit.contentPages === 1 ? '' : 's') + '.',
      '- Template: ' + activeTemplate + '.',
      '- Professional summary: max ' + fit.summaryLimit + ' characters.',
      '- Experience/project bullets: max ' + fit.bulletLimit + ' characters each.',
      '- Use no more than ' + fit.bulletsPerRole + ' bullets per role/project.',
      '- Skills: max ' + fit.skillsLimit + ' short keyword phrases.',
      (fit.shouldCompress ? '- This layout is space-limited, so prioritize short, high-impact wording.' : '- Keep wording concise even if there is room.'),
      '',
      'Application strategy:',
      '- Strategy: ' + strategy.label + '.',
      '- Focus: ' + strategy.focus + '.',
      '',
      'Target role:',
      '- ' + (personalFields.jobTitle.value.trim() || 'Not specified'),
      '',
      'Job description:',
      jobText ? jobText.slice(0, 3000) : 'No job description provided. Write a strong general version for the target role.',
      '',
      'Keyword guidance:',
      '- Already matched keywords: ' + (matched.length ? matched.join(', ') : 'None detected yet'),
      '- Missing keywords to use only if truthful: ' + (missing.length ? missing.join(', ') : 'None detected'),
      '',
      'Current resume content:',
      '- Name: ' + (personalFields.fullName.value.trim() || 'Not provided'),
      '- Contact: ' + [personalFields.email.value, personalFields.phone.value, personalFields.location.value, personalFields.website.value].map(function (value) { return value.trim(); }).filter(Boolean).join(' | '),
      '- Current summary: ' + (personalFields.summary.value.trim() || 'Not provided'),
      '- Skills: ' + (skills.length ? skills.join(', ') : 'Not provided'),
      formatPromptEntries('Experience', collectExperienceData(), function (entry) {
        return '- ' + [entry.title, entry.company, entry.dates].filter(Boolean).join(' | ') + ': ' + (entry.description || 'No description yet');
      }, 5),
      formatPromptEntries('Projects', collectProjectData(), function (entry) {
        return '- ' + [entry.name, entry.link].filter(Boolean).join(' | ') + ': ' + (entry.description || 'No description yet');
      }, 4),
      formatPromptEntries('Education', collectEducationData(), function (entry) {
        return '- ' + [entry.qualification, entry.school, entry.dates].filter(Boolean).join(' | ');
      }, 4),
      formatPromptEntries('Certifications', collectCertificationData(), function (entry) {
        return '- ' + [entry.name, entry.issuer, entry.date].filter(Boolean).join(' | ');
      }, 4),
      '',
      'Return format:',
      '1. Professional Summary',
      '2. Experience bullets by role',
      '3. Project bullets if useful',
      '4. Skills list',
      '5. Optional notes asking me for missing facts',
      '',
      'Important:',
      '- Do not write long paragraphs.',
      '- Do not exceed the fit limits.',
      '- Prefer action verbs, numbers, and outcomes.',
      '- If the content is too much for the page limit, choose the strongest evidence and cut the rest.',
    ].join('\n');
  }

  function getAIPromptSignature() {
    return getHistorySignature({
      content: collectState(),
      template: activeTemplate,
      font: activeFont,
      palette: activePalette,
      pageGoal: getAllowedPreviewPages(),
      manualSecondPage: manualSecondPage,
      allowSecondPage: allowSecondPage,
      previewPages: currentPreviewPageCount,
    });
  }

  function updateAIPrompt(signature) {
    if (!aiPromptOutput) return;
    const fit = getAIPromptFitProfile();
    const prompt = buildAIPrompt(fit);
    aiPromptOutput.value = prompt;
    lastAIPromptSignature = signature || getAIPromptSignature();
    if (aiPromptSummary) {
      aiPromptSummary.textContent = fit.shouldCompress
        ? 'Prompt is set to produce compact content for this space-limited resume.'
        : 'Prompt is set to produce concise content that should fit the current page goal.';
    }
  }

  function refreshAIPromptIfChanged() {
    if (!aiPromptOutput || document.visibilityState === 'hidden') return;
    const signature = getAIPromptSignature();
    if (signature === lastAIPromptSignature) return;
    updateAIPrompt(signature);
  }

  function startAIPromptAutoRefresh() {
    if (aiPromptAutoRefreshTimer || !aiPromptOutput) return;
    aiPromptAutoRefreshTimer = setInterval(refreshAIPromptIfChanged, AI_PROMPT_AUTO_REFRESH_MS);
  }

  function stopAIPromptAutoRefresh() {
    if (!aiPromptAutoRefreshTimer) return;
    clearInterval(aiPromptAutoRefreshTimer);
    aiPromptAutoRefreshTimer = null;
  }

  function scheduleAIPromptUpdate() {
    if (pendingAIPromptTimer) clearTimeout(pendingAIPromptTimer);
    pendingAIPromptTimer = setTimeout(function () {
      pendingAIPromptTimer = null;
      updateAIPrompt();
    }, AI_PROMPT_DEBOUNCE_MS);
  }

  function copyAIPrompt() {
    updateAIPrompt();
    if (!aiPromptOutput || !copyAiPromptBtn) return;

    const text = aiPromptOutput.value;
    function markCopied() {
      const previous = copyAiPromptBtn.textContent;
      copyAiPromptBtn.textContent = 'Copied';
      setTimeout(function () {
        copyAiPromptBtn.textContent = previous;
      }, 1400);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(function () {
        aiPromptOutput.focus();
        aiPromptOutput.select();
      });
      return;
    }

    aiPromptOutput.focus();
    aiPromptOutput.select();
    try {
      document.execCommand('copy');
      markCopied();
    } catch (err) {
      // Selection fallback is enough when automatic copy is unavailable.
    }
  }

  function refreshAIPromptNow() {
    if (pendingAIPromptTimer) {
      clearTimeout(pendingAIPromptTimer);
      pendingAIPromptTimer = null;
    }
    updateAIPrompt();
    if (!refreshAiPromptBtn) return;

    const previous = refreshAiPromptBtn.textContent;
    refreshAiPromptBtn.textContent = 'Refreshed';
    setTimeout(function () {
      refreshAiPromptBtn.textContent = previous;
    }, 1200);
  }

  function renderKeywordChips(container, words, missing) {
    if (!container) return;

    if (!words.length) {
      container.innerHTML = '<span class="empty-pill">No keywords yet</span>';
      return;
    }

    container.innerHTML = words.map(function (word) {
      return '<span class="keyword-chip' + (missing ? ' missing' : '') + '">' + escapeHtml(word) + '</span>';
    }).join('');
  }

  function getSuggestedActionVerbs(resumeText) {
    return ACTION_VERBS.filter(function (verb) {
      return resumeText.indexOf(verb) < 0;
    }).slice(0, 4);
  }

  function includesKeyword(text, keyword) {
    const normalized = normalizeKeywordText(text);
    const normalizedKeyword = normalizeKeywordText(keyword);
    return normalizedKeyword && normalized.indexOf(normalizedKeyword) >= 0;
  }

  function countKeywordHits(text, keywords) {
    return keywords.filter(function (keyword) {
      return includesKeyword(text, keyword);
    }).length;
  }

  function detectCareerFamily(jobText, resumeText) {
    const source = jobText || resumeText || '';
    const scored = SMART_ROLE_FAMILIES.map(function (family) {
      const jobHits = countKeywordHits(jobText, family.keywords);
      const resumeHits = countKeywordHits(resumeText, family.keywords.concat(family.evidence));
      return {
        family: family,
        score: jobHits * 3 + resumeHits,
      };
    }).sort(function (a, b) { return b.score - a.score; });

    const best = scored[0] && scored[0].score > 0
      ? scored[0].family
      : SMART_ROLE_FAMILIES.find(function (family) { return family.id === 'general'; });
    const alternatives = scored
      .filter(function (item) { return item.family.id !== best.id && item.score > 0; })
      .slice(0, 2)
      .map(function (item) { return item.family.label; });

    return {
      family: best,
      alternatives: alternatives,
      hasSignal: !!source.trim() && best.id !== 'general',
    };
  }

  function getRoleEvidence(family, resumeText) {
    const matched = family.evidence.filter(function (keyword) {
      return includesKeyword(resumeText, keyword);
    });
    const missing = family.evidence.filter(function (keyword) {
      return !includesKeyword(resumeText, keyword);
    });
    const score = family.evidence.length
      ? Math.round((matched.length / Math.min(family.evidence.length, 8)) * 100)
      : 50;

    return {
      matched: matched.slice(0, 6),
      missing: missing.slice(0, 5),
      score: Math.min(100, score),
    };
  }

  function splitBulletLines(text) {
    return asString(text)
      .split(/\n+|[•]/)
      .map(function (line) { return line.replace(/^\s*[-*]\s*/, '').trim(); })
      .filter(Boolean);
  }

  function hasWeakBulletStart(text) {
    const normalized = normalizeKeywordText(text);
    return WEAK_BULLET_PREFIXES.some(function (prefix) {
      return normalized.indexOf(normalizeKeywordText(prefix)) === 0;
    });
  }

  function getBulletQualityReport() {
    const bullets = [];
    collectExperienceData().forEach(function (entry) {
      bullets.push.apply(bullets, splitBulletLines(entry.description));
    });
    collectProjectData().forEach(function (entry) {
      bullets.push.apply(bullets, splitBulletLines(entry.description));
    });

    if (!bullets.length) {
      return {
        total: 0,
        strong: 0,
        score: 0,
        weakStarts: 0,
        missingMetrics: 0,
        tooShort: 0,
      };
    }

    let strong = 0;
    let weakStarts = 0;
    let missingMetrics = 0;
    let tooShort = 0;

    bullets.forEach(function (bullet) {
      const hasAction = startsWithActionVerb(bullet);
      const hasMetric = /\d|%|\$|rm|usd|kpi|revenue|saved|reduced|increased|improved/i.test(bullet);
      const usefulLength = bullet.length >= 55 && bullet.length <= 210;
      const weakStart = hasWeakBulletStart(bullet);

      if (weakStart) weakStarts += 1;
      if (!hasMetric) missingMetrics += 1;
      if (bullet.length < 55) tooShort += 1;
      if (hasAction && hasMetric && usefulLength && !weakStart) strong += 1;
    });

    return {
      total: bullets.length,
      strong: strong,
      score: Math.round((strong / bullets.length) * 100),
      weakStarts: weakStarts,
      missingMetrics: missingMetrics,
      tooShort: tooShort,
    };
  }

  function renderSmartRoleFit(roleFit, roleEvidence, bulletReport, jobKeywords, matched, missing) {
    if (!smartRoleFit) return;

    const keywordScore = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    const lines = [
      '<span class="smart-fit-label">' + escapeHtml(roleFit.family.label) + '</span>',
      '<span class="smart-fit-score">Role evidence ' + roleEvidence.score + '%</span>',
      '<span class="smart-fit-score">Bullet strength ' + bulletReport.score + '%</span>',
      '<span class="smart-fit-score">Keyword match ' + keywordScore + '%</span>'
    ];

    if (roleFit.alternatives.length) {
      lines.push('<span class="smart-fit-note">Also detected: ' + escapeHtml(roleFit.alternatives.join(', ')) + '</span>');
    }

    if (roleEvidence.matched.length) {
      lines.push('<span class="smart-fit-note">Evidence found: ' + escapeHtml(roleEvidence.matched.join(', ')) + '</span>');
    }

    if (missing.length) {
      lines.push('<span class="smart-fit-note">Priority keywords: ' + escapeHtml(missing.slice(0, 4).join(', ')) + '</span>');
    }

    smartRoleFit.innerHTML = lines.join('');
  }

  function getActiveStrategy() {
    const key = resumeStrategy && RESUME_STRATEGIES[resumeStrategy.value] ? resumeStrategy.value : 'job';
    return Object.assign({ id: key }, RESUME_STRATEGIES[key]);
  }

  function buildSummaryTailorText(roleFit, strategy, missing) {
    const role = personalFields.jobTitle.value.trim() || roleFit.family.label + ' candidate';
    const skills = getTopSkills(3);
    const keywordText = missing.slice(0, 2).join(', ');
    const skillText = skills.length ? skills.join(', ') : roleFit.family.evidence.slice(0, 2).join(', ');
    const base = role + ' focused on ' + strategy.focus + '.';
    const proof = 'Brings experience in ' + skillText + (keywordText ? ', with growing alignment to ' + keywordText : '') + '.';
    return (base + ' ' + proof).slice(0, SUMMARY_MAX);
  }

  function appendSkillsFromKeywords(keywords) {
    const current = skillsField.value.split(/[\n,]+/).map(function (skill) { return skill.trim(); }).filter(Boolean);
    const seen = current.reduce(function (result, skill) {
      result[normalizeKeywordText(skill)] = true;
      return result;
    }, {});
    const additions = keywords.filter(function (word) {
      const normalized = normalizeKeywordText(word);
      return normalized && !seen[normalized];
    }).slice(0, 5);

    if (!additions.length) return false;
    skillsField.value = current.concat(additions).join('\n');
    updateSkillsPreview();
    return true;
  }

  function applyTailorAction(action) {
    if (!action) return;

    if (action.type === 'summary') {
      personalFields.summary.value = action.value;
      updatePersonalPreview();
      updateSummaryCounter();
    }

    if (action.type === 'skills') {
      appendSkillsFromKeywords(action.keywords || []);
    }

    if (action.type === 'custom') {
      if (!customTitleField.value.trim()) customTitleField.value = action.title || 'Highlights';
      customContentField.value = action.value;
      sectionVisibility.custom = true;
      sectionTitles.custom = customTitleField.value.trim() || DEFAULT_SECTION_TITLES.custom;
      applySectionVisibility();
      applySectionTitles();
      updateCustomSectionPreview();
    }

    persistChange();
    updateJobMatch();
    scheduleResumeQualityCheck();
  }

  function getTailorActions(roleFit, roleEvidence, bulletReport, missing, matched) {
    const strategy = getActiveStrategy();
    const actions = [];

    if (personalFields.summary.value.trim().length < 120 || missing.length) {
      actions.push({
        type: 'summary',
        label: 'Tailor summary',
        detail: 'Use the strategy, target role, and job priorities in the summary.',
        value: buildSummaryTailorText(roleFit, strategy, missing),
      });
    }

    if (missing.length) {
      actions.push({
        type: 'skills',
        label: 'Add top skills',
        detail: 'Add truthful missing keywords to Skills.',
        keywords: missing.slice(0, 5),
      });
    }

    if (roleEvidence.missing.length || matched.length) {
      actions.push({
        type: 'custom',
        label: 'Add strategy highlights',
        detail: 'Create a short section that reminds the user what proof to add.',
        title: strategy.id === 'freelance' ? 'Client Highlights' : 'Role Highlights',
        value: [
          'Target strategy: ' + strategy.label + '.',
          'Focus: ' + strategy.focus + '.',
          'Add real evidence for: ' + (roleEvidence.missing.slice(0, 3).join(', ') || matched.slice(0, 3).join(', ') || roleFit.family.label) + '.',
        ].join('\n'),
      });
    }

    if (bulletReport.total && bulletReport.score < 60) {
      actions.push({
        type: 'review',
        label: 'Review weak bullets',
        detail: 'Use each bullet helper to add action verbs, numbers, and outcomes.',
      });
    }

    return actions.slice(0, 4);
  }

  function renderTailorActions(actions) {
    if (!tailorActions) return;

    if (!actions.length) {
      tailorActions.innerHTML = '<span class="empty-pill">No major tailoring gaps found.</span>';
      return;
    }

    tailorActions.innerHTML = actions.map(function (action, index) {
      const button = action.type === 'review'
        ? ''
        : '<button type="button" class="tailor-apply-btn" data-tailor-index="' + index + '">Apply</button>';
      return '<div class="tailor-action" data-tailor-index="' + index + '">' +
        '<div><strong>' + escapeHtml(action.label) + '</strong><p>' + escapeHtml(action.detail) + '</p></div>' +
        button +
        '</div>';
    }).join('');
    tailorActions.dataset.actions = JSON.stringify(actions);
  }

  function updateJobMatch() {
    if (!jobDescriptionField || !jobMatchScore || !jobMatchSummary || !matchingKeywords || !missingKeywords || !jobMatchSuggestions) return;

    const jobText = jobDescriptionField.value.trim();
    if (!jobText) {
      jobMatchScore.textContent = '0%';
      jobMatchSummary.textContent = 'Paste a job post to compare it with this resume.';
      matchingKeywords.innerHTML = '<span class="empty-pill">Paste a job post first</span>';
      missingKeywords.innerHTML = '<span class="empty-pill">Paste a job post first</span>';
      if (smartRoleFit) {
        smartRoleFit.innerHTML = '<span class="empty-pill">Paste a job post to detect the target role.</span>';
      }
      if (tailorActions) {
        tailorActions.innerHTML = '<span class="empty-pill">Paste a job post to get tailored actions.</span>';
        tailorActions.dataset.actions = '[]';
      }
      renderSmartRewriteQueue();
      jobMatchSuggestions.innerHTML = '<li class="quality-item">Paste a job description to see what to improve.</li>';
      scheduleATSCompatibilityCheck();
      return;
    }

    const resumeText = normalizeKeywordText(getResumeMatchText());
    const resumeKeywordSet = tokenizeKeywords(resumeText).reduce(function (result, word) {
      result[word] = true;
      return result;
    }, {});
    const jobKeywords = extractKeywords(jobText, JOB_KEYWORD_LIMIT);
    const matched = jobKeywords.filter(function (word) { return resumeKeywordSet[word]; });
    const missing = jobKeywords.filter(function (word) { return !resumeKeywordSet[word]; });
    const roleFit = detectCareerFamily(jobText, resumeText);
    const roleEvidence = getRoleEvidence(roleFit.family, resumeText);
    const bulletReport = getBulletQualityReport();
    const keywordScore = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    const score = Math.round((keywordScore * 0.58) + (roleEvidence.score * 0.24) + (bulletReport.score * 0.18));
    const suggestions = [];
    const actionVerbs = getSuggestedActionVerbs(resumeText);
    const skillsMatched = skillsField.value.trim() && matched.some(function (word) {
      return normalizeKeywordText(skillsField.value).indexOf(word) >= 0;
    });

    if (missing.length) {
      suggestions.push('Add relevant missing keywords naturally: ' + missing.slice(0, 4).join(', ') + '.');
    }

    if (!skillsMatched && matched.length) {
      suggestions.push('Move the strongest matched keywords into Skills if they are real strengths.');
    }

    if (roleEvidence.missing.length) {
      suggestions.push(roleFit.family.label + ' signal: add truthful evidence such as ' + roleEvidence.missing.slice(0, 3).join(', ') + ' if relevant.');
    }

    if (bulletReport.total && bulletReport.score < 60) {
      suggestions.push('Strengthen experience bullets: start with action verbs, add numbers, and show outcomes instead of duties.');
    } else if (!bulletReport.total) {
      suggestions.push('Add achievement bullets in Experience or Projects so the app can judge role evidence.');
    }

    if (personalFields.summary.value.trim().length < 120) {
      suggestions.push('Use the summary to name the target role and 1-2 ' + roleFit.family.label.toLowerCase() + ' priorities.');
    }

    if (!/\d/.test(resumeText)) {
      suggestions.push('Add numbers to achievements where possible, such as %, time saved, revenue, users, or team size.');
    }

    if (actionVerbs.length) {
      suggestions.push('Try stronger action verbs in bullet points: ' + actionVerbs.join(', ') + '.');
    }

    if (!suggestions.length) {
      suggestions.push('Good match. Do a final human review for wording and accuracy before exporting.');
    }

    jobMatchScore.textContent = score + '%';
    jobMatchSummary.textContent = score >= 75
      ? 'Strong match. Review the missing keywords before exporting.'
      : score >= 45
        ? 'Decent match. Add the most relevant missing keywords.'
        : 'Low match. Tailor the resume before applying.';
    renderKeywordChips(matchingKeywords, matched.slice(0, 8), false);
    renderKeywordChips(missingKeywords, missing.slice(0, 8), true);
    renderSmartRoleFit(roleFit, roleEvidence, bulletReport, jobKeywords, matched, missing);
    renderTailorActions(getTailorActions(roleFit, roleEvidence, bulletReport, missing, matched));
    renderSmartRewriteQueue();
    jobMatchSuggestions.innerHTML = suggestions.map(function (text, index) {
      const className = index === 0 && score < 75 ? ' warning' : '';
      return '<li class="quality-item' + className + '">' + escapeHtml(text) + '</li>';
    }).join('');
    scheduleATSCompatibilityCheck();
    updatePublishChecklist();
  }

  function countFilledEntries(listEl) {
    return Array.from(listEl.querySelectorAll('.entry-card')).filter(function (card) {
      return Array.from(card.querySelectorAll('input, textarea')).some(function (field) {
        return field.value.trim();
      });
    }).length;
  }

  function countMetricBullets() {
    const text = collectExperienceData().map(function (entry) {
      return entry.description;
    }).concat(collectProjectData().map(function (entry) {
      return entry.description;
    })).join(' ');
    return (text.match(/\d+/g) || []).length;
  }

  function updateATSCompatibility() {
    if (!atsScore || !atsSummary || !atsList) return;

    const contactOk = !!personalFields.email.value.trim() || !!personalFields.phone.value.trim();
    const hasRole = !!personalFields.jobTitle.value.trim();
    const hasSummary = personalFields.summary.value.trim().length >= 70;
    const experienceCount = countFilledEntries(experienceList);
    const hasExperience = experienceCount > 0 || countFilledEntries(projectList) > 0;
    const skillsCount = skillsField.value.split(/[\n,]+/).filter(function (skill) {
      return skill.trim();
    }).length;
    const hasSkills = skillsCount >= 5;
    const hasEducation = countFilledEntries(educationList) > 0;
    const metricsOk = countMetricBullets() >= 2;
    const scannerTemplate = ['ats', 'classic', 'compact', 'federal', 'professional'].indexOf(activeTemplate) >= 0;
    const pageFit = currentPreviewPageCount <= getAllowedPreviewPages();
    const jobText = jobDescriptionField ? jobDescriptionField.value.trim() : '';
    const resumeKeywords = tokenizeKeywords(getResumeMatchText()).reduce(function (result, word) {
      result[word] = true;
      return result;
    }, {});
    const jobKeywords = jobText ? extractKeywords(jobText, JOB_KEYWORD_LIMIT) : [];
    const matchedKeywords = jobKeywords.filter(function (word) {
      return resumeKeywords[word];
    });
    const keywordOk = !jobKeywords.length || matchedKeywords.length >= Math.ceil(jobKeywords.length * 0.45);
    const roleFit = detectCareerFamily(jobText, getResumeMatchText());
    const roleEvidence = getRoleEvidence(roleFit.family, getResumeMatchText());
    const bulletReport = getBulletQualityReport();
    const roleEvidenceOk = !jobText || roleEvidence.score >= 35;
    const bulletQualityOk = !bulletReport.total || bulletReport.score >= 45;

    const checks = [
      {
        complete: contactOk && hasRole,
        text: contactOk && hasRole ? 'Contact details and target role are easy to identify.' : 'Add contact details and a clear target role.',
      },
      {
        complete: scannerTemplate,
        warning: !scannerTemplate,
        text: scannerTemplate ? 'Template is scanner-friendly.' : 'For strict ATS systems, consider ATS Clean, Classic, Compact, Federal, or Professional.',
      },
      {
        complete: hasSummary,
        text: hasSummary ? 'Summary gives the scanner useful role context.' : 'Add a clear 70+ character summary with role keywords.',
      },
      {
        complete: hasExperience,
        text: hasExperience ? 'Experience or projects provide keyword-rich evidence.' : 'Add experience or projects so ATS systems have evidence to parse.',
      },
      {
        complete: hasSkills,
        text: hasSkills ? 'Skills section has enough scannable keywords.' : 'Add at least five relevant skills or tools.',
      },
      {
        complete: hasEducation,
        text: hasEducation ? 'Education section is present.' : 'Add education, training, or a relevant credential.',
      },
      {
        complete: metricsOk,
        text: metricsOk ? 'Achievements include measurable details.' : 'Add numbers to achievements where possible.',
      },
      {
        complete: bulletQualityOk,
        warning: bulletReport.total > 0 && !bulletQualityOk,
        text: bulletQualityOk ? 'Bullet points read like achievements.' : 'Improve bullet points with action verbs, metrics, and outcomes.',
      },
      {
        complete: keywordOk,
        warning: !!jobKeywords.length && !keywordOk,
        text: keywordOk ? 'Job-post keywords are represented well enough.' : 'Add more relevant missing job-post keywords naturally.',
      },
      {
        complete: roleEvidenceOk,
        warning: !!jobText && !roleEvidenceOk,
        text: roleEvidenceOk ? roleFit.family.label + ' role evidence is visible.' : 'Add clearer ' + roleFit.family.label.toLowerCase() + ' evidence from real experience.',
      },
      {
        complete: pageFit,
        warning: !pageFit,
        text: pageFit ? 'Resume fits the selected A4 page count.' : 'Overflow can hurt review quality. Trim content or add page 2 intentionally.',
      },
    ];

    const completed = checks.filter(function (check) { return check.complete; }).length;
    const score = Math.round((completed / checks.length) * 100);

    atsScore.textContent = score + '%';
    atsSummary.textContent = score >= 85
      ? 'Strong ATS compatibility.'
      : score >= 65
        ? 'Mostly ATS-friendly. Fix the warnings before applying.'
        : 'Needs ATS cleanup before applying.';

    atsList.innerHTML = checks.map(function (check) {
      const className = check.complete ? 'complete' : (check.warning ? 'warning' : '');
      return '<li class="quality-item ' + className + '">' + escapeHtml(check.text) + '</li>';
    }).join('');
    updatePublishChecklist();
  }

  function scheduleATSCompatibilityCheck() {
    if (pendingATSCheckTimer) clearTimeout(pendingATSCheckTimer);
    pendingATSCheckTimer = setTimeout(function () {
      pendingATSCheckTimer = null;
      requestAnimationFrame(updateATSCompatibility);
    }, SMART_CHECK_DEBOUNCE_MS);
  }

  function scheduleJobMatchCheck() {
    if (pendingJobMatchTimer) clearTimeout(pendingJobMatchTimer);
    pendingJobMatchTimer = setTimeout(function () {
      pendingJobMatchTimer = null;
      requestAnimationFrame(updateJobMatch);
    }, SMART_CHECK_DEBOUNCE_MS);
  }

  function getTopSkills(limit) {
    return skillsField.value
      .split(/[\n,]+/)
      .map(function (skill) { return skill.trim(); })
      .filter(Boolean)
      .slice(0, limit);
  }

  function getExperienceYearsHint() {
    const text = personalFields.summary.value + ' ' + getResumeMatchText();
    const match = text.match(/(\d+)\+?\s*(?:years|yrs)/i);
    return match ? match[1] + '+ years' : '';
  }

  function getPrimaryImpactPhrase() {
    const descriptions = collectExperienceData().map(function (entry) {
      return entry.description;
    }).concat(collectProjectData().map(function (entry) {
      return entry.description;
    })).join(' ');

    const numberMatch = descriptions.match(/(?:reduced|improved|increased|grew|saved|cut|delivered|led|managed)[^.]*?\d[^.]*\.?/i);
    if (numberMatch) return finishSentence(numberMatch[0]);

    const firstExperience = collectExperienceData().find(function (entry) {
      return entry.description && entry.description.trim();
    });
    if (firstExperience) return finishSentence(firstExperience.description.trim().split(/[.!?]/)[0]);

    return '';
  }

  function createSummarySuggestion() {
    const role = personalFields.jobTitle.value.trim() || 'professional';
    const years = getExperienceYearsHint();
    const skills = getTopSkills(3);
    const matchedKeywords = jobDescriptionField && jobDescriptionField.value.trim()
      ? extractKeywords(jobDescriptionField.value, 12).filter(function (word) {
        return normalizeKeywordText(getResumeMatchText()).indexOf(word) >= 0;
      }).slice(0, 2)
      : [];
    const keywords = matchedKeywords.length ? matchedKeywords : skills.slice(0, 2).map(function (skill) { return skill.toLowerCase(); });
    const impact = getPrimaryImpactPhrase();
    const notes = [];
    let firstSentence = capitalizeSentence(role);

    if (years) {
      firstSentence += ' with ' + years + ' of experience';
    } else {
      firstSentence += ' with hands-on experience';
      notes.push('Add years of experience if that is accurate.');
    }

    if (skills.length) {
      firstSentence += ' in ' + skills.join(', ');
    } else if (keywords.length) {
      firstSentence += ' in ' + keywords.join(', ');
    } else {
      firstSentence += ' across relevant work, projects, and measurable outcomes';
      notes.push('Add at least three skills so the summary can be more specific.');
    }

    let secondSentence = impact
      ? impact
      : 'Known for turning responsibilities into clear results, collaborating across teams, and improving day-to-day execution.';

    if (keywords.length && normalizeKeywordText(firstSentence + ' ' + secondSentence).indexOf(keywords[0]) < 0) {
      secondSentence = secondSentence.replace(/\.$/, '') + ', with focus on ' + keywords[0] + '.';
      notes.push('Included a relevant Job Match keyword. Keep it only if it is true.');
    }

    if (!impact) {
      notes.push('Add one measurable achievement to make this summary stronger.');
    }

    const suggestion = (finishSentence(firstSentence) + ' ' + finishSentence(secondSentence)).slice(0, SUMMARY_MAX);

    if (suggestion.length < 80) {
      notes.push('Add one more specific strength so the summary reaches a useful length.');
    }

    return {
      text: suggestion,
      notes: notes.length ? notes : ['This summary is concise. Review it for accuracy before exporting.'],
    };
  }

  function showSummarySuggestion() {
    if (!summarySuggestionPanel || !summarySuggestionText || !summarySuggestionNotes) return;

    const suggestion = createSummarySuggestion();
    summarySuggestionPanel.hidden = false;
    summarySuggestionPanel.dataset.suggestion = suggestion.text;
    summarySuggestionText.textContent = suggestion.text;
    summarySuggestionNotes.innerHTML = suggestion.notes.map(function (note) {
      return '<li>' + escapeHtml(note) + '</li>';
    }).join('');
  }

  function useSummarySuggestion() {
    if (!summarySuggestionPanel || !summarySuggestionText) return;

    const suggestion = summarySuggestionPanel.dataset.suggestion || summarySuggestionText.textContent.trim();
    if (!suggestion) return;

    personalFields.summary.value = suggestion;
    updatePersonalPreview();
    updateSummaryCounter();
    persistChange();
    personalFields.summary.focus();
  }

  function capitalizeSentence(text) {
    const trimmed = asString(text).trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  function lowerFirst(text) {
    const trimmed = asString(text).trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  }

  function finishSentence(text) {
    const trimmed = asString(text).trim().replace(/\s+/g, ' ');
    if (!trimmed) return '';
    return /[.!?]$/.test(trimmed) ? trimmed : trimmed + '.';
  }

  function cleanBulletText(text) {
    let cleaned = asString(text)
      .split(/\n+/)
      .map(function (line) { return line.replace(/^\s*[-*•]\s*/, '').trim(); })
      .filter(Boolean)
      .join('; ');

    WEAK_BULLET_PREFIXES.forEach(function (prefix) {
      const pattern = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'i');
      cleaned = cleaned.replace(pattern, '');
    });

    return cleaned.trim();
  }

  function startsWithActionVerb(text) {
    const firstWord = normalizeKeywordText(text).split(/\s+/)[0] || '';
    return ACTION_VERBS.indexOf(firstWord) >= 0;
  }

  function chooseActionVerb(text, type) {
    const normalized = normalizeKeywordText(text);
    if (type === 'project') {
      if (normalized.indexOf('dashboard') >= 0 || normalized.indexOf('tool') >= 0 || normalized.indexOf('system') >= 0) return 'built';
      if (normalized.indexOf('launch') >= 0) return 'launched';
      return 'created';
    }

    if (normalized.indexOf('team') >= 0 || normalized.indexOf('staff') >= 0) return 'led';
    if (normalized.indexOf('process') >= 0 || normalized.indexOf('workflow') >= 0) return 'improved';
    if (normalized.indexOf('report') >= 0 || normalized.indexOf('data') >= 0) return 'analyzed';
    return 'managed';
  }

  function chooseRoleActionVerb(familyId, text, type) {
    const normalized = normalizeKeywordText(text);
    if (familyId === 'technology') return type === 'project' ? 'built' : 'developed';
    if (familyId === 'healthcare') return normalized.indexOf('record') >= 0 ? 'documented' : 'supported';
    if (familyId === 'education') return 'coached';
    if (familyId === 'sales') return normalized.indexOf('customer') >= 0 ? 'managed' : 'increased';
    if (familyId === 'marketing') return 'launched';
    if (familyId === 'finance') return 'analyzed';
    if (familyId === 'operations') return 'coordinated';
    if (familyId === 'design') return 'designed';
    if (familyId === 'hospitality') return 'resolved';
    return chooseActionVerb(text, type);
  }

  function getMissingJobKeywords(limit) {
    if (!jobDescriptionField || !jobDescriptionField.value.trim()) return [];

    const resumeKeywordSet = tokenizeKeywords(getResumeMatchText()).reduce(function (result, word) {
      result[word] = true;
      return result;
    }, {});

    return extractKeywords(jobDescriptionField.value, JOB_KEYWORD_LIMIT).filter(function (word) {
      return !resumeKeywordSet[word];
    }).slice(0, limit);
  }

  function getBulletContext(card, type) {
    if (type === 'project') {
      return card.querySelector('.proj-name').value.trim() || 'this project';
    }

    return card.querySelector('.exp-title').value.trim()
      || card.querySelector('.exp-company').value.trim()
      || 'this role';
  }

  function createBulletSuggestion(card, type) {
    const field = type === 'project' ? card.querySelector('.proj-desc') : card.querySelector('.exp-desc');
    const original = field ? field.value.trim() : '';
    const cleaned = cleanBulletText(original);
    const context = getBulletContext(card, type);
    const notes = [];
    const missing = getMissingJobKeywords(1);
    const roleFit = detectCareerFamily(jobDescriptionField ? jobDescriptionField.value : '', getResumeMatchText());
    const roleEvidence = getRoleEvidence(roleFit.family, getResumeMatchText());
    let suggestion = cleaned;

    if (!suggestion) {
      suggestion = type === 'project'
        ? 'Built ' + context + ' to solve a clear user or business problem'
        : 'Led work in ' + context + ' to improve a measurable team or business result';
      notes.push('Replace the generic result with the real outcome before exporting.');
    }

    if (!startsWithActionVerb(suggestion)) {
      suggestion = capitalizeSentence(chooseRoleActionVerb(roleFit.family.id, suggestion, type)) + ' ' + lowerFirst(suggestion);
      notes.push('Started with a stronger action verb.');
    } else {
      suggestion = capitalizeSentence(suggestion);
    }

    if (missing.length && normalizeKeywordText(suggestion).indexOf(missing[0]) < 0) {
      notes.push('Consider adding the job keyword "' + missing[0] + '" if it is accurate.');
    }

    if (roleEvidence.missing.length && roleFit.family.id !== 'general') {
      notes.push('For ' + roleFit.family.label + ', consider showing ' + roleEvidence.missing[0] + ' if it is true.');
    }

    if (!/\d/.test(suggestion)) {
      notes.push('Add a number if possible, like %, time saved, cost reduced, users, or team size.');
    }

    if (suggestion.length < 90) {
      notes.push('Add scope and result so the bullet shows impact, not only responsibility.');
    }

    return {
      text: finishSentence(suggestion),
      notes: notes.length ? notes : ['This already reads like an achievement. Review it for accuracy.'],
    };
  }

  function scoreRewriteCandidate(card, type) {
    const field = type === 'project' ? card.querySelector('.proj-desc') : card.querySelector('.exp-desc');
    const text = field ? field.value.trim() : '';
    if (!text) return null;

    const normalized = normalizeKeywordText(text);
    const jobKeywords = jobDescriptionField && jobDescriptionField.value.trim()
      ? extractKeywords(jobDescriptionField.value, JOB_KEYWORD_LIMIT)
      : [];
    const matchedKeywords = jobKeywords.filter(function (word) {
      return normalized.indexOf(word) >= 0;
    });
    const reasons = [];
    let score = 0;

    if (!startsWithActionVerb(text)) {
      score += 3;
      reasons.push('needs a stronger action verb');
    }

    if (!/\d/.test(text)) {
      score += 2;
      reasons.push('could use a number or measurable result');
    }

    if (text.length < 75) {
      score += 2;
      reasons.push('needs more scope or outcome');
    }

    if (jobKeywords.length && matchedKeywords.length < 2) {
      score += 2;
      reasons.push('barely reflects the job post keywords');
    }

    if (hasWeakBulletStart(text)) {
      score += 1;
      reasons.push('starts like a duty instead of an achievement');
    }

    if (score <= 0) return null;

    const label = type === 'project'
      ? card.querySelector('.proj-name').value.trim() || 'Project entry'
      : card.querySelector('.exp-title').value.trim() || card.querySelector('.exp-company').value.trim() || 'Experience entry';
    const suggestion = createBulletSuggestion(card, type);

    return {
      type: type,
      index: Array.from((type === 'project' ? projectList : experienceList).querySelectorAll('.entry-card')).indexOf(card),
      label: label,
      original: text,
      suggestion: suggestion.text,
      reasons: reasons,
      score: score,
    };
  }

  function getRewriteCandidates() {
    return Array.from(experienceList.querySelectorAll('.entry-card')).map(function (card) {
      return scoreRewriteCandidate(card, 'experience');
    }).concat(Array.from(projectList.querySelectorAll('.entry-card')).map(function (card) {
      return scoreRewriteCandidate(card, 'project');
    })).filter(Boolean).sort(function (a, b) {
      return b.score - a.score;
    }).slice(0, 4);
  }

  function renderSmartRewriteQueue() {
    if (!smartRewriteList) return;

    const candidates = getRewriteCandidates();
    smartRewriteList.dataset.rewrites = JSON.stringify(candidates);

    if (!candidates.length) {
      const hasEntries = experienceList.querySelector('.entry-card') || projectList.querySelector('.entry-card');
      smartRewriteList.innerHTML = '<span class="empty-pill">' + (hasEntries
        ? 'Your current bullets look strong enough for now.'
        : 'Add experience or projects to get rewrite suggestions.') + '</span>';
      return;
    }

    smartRewriteList.innerHTML = candidates.map(function (item, index) {
      return '<article class="smart-rewrite-card">' +
        '<div class="smart-rewrite-meta">' +
          '<strong>' + escapeHtml(item.label) + '</strong>' +
          '<span>' + escapeHtml(item.type === 'project' ? 'Project' : 'Experience') + '</span>' +
        '</div>' +
        '<p class="smart-rewrite-original">' + escapeHtml(item.original) + '</p>' +
        '<p class="smart-rewrite-suggestion">' + escapeHtml(item.suggestion) + '</p>' +
        '<div class="smart-rewrite-footer">' +
          '<span>' + escapeHtml(item.reasons.slice(0, 2).join(', ')) + '</span>' +
          '<button type="button" class="tailor-apply-btn" data-rewrite-index="' + index + '" data-tooltip="Replace this entry with the suggested rewrite.">Use rewrite</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function applySmartRewrite(item) {
    if (!item) return;

    const list = item.type === 'project' ? projectList : experienceList;
    const card = list.querySelectorAll('.entry-card')[item.index];
    if (!card) return;

    const field = item.type === 'project' ? card.querySelector('.proj-desc') : card.querySelector('.exp-desc');
    if (!field || !item.suggestion) return;

    field.value = item.suggestion;
    if (item.type === 'project') {
      updateProjectsPreview();
    } else {
      updateExperiencePreview();
    }
    persistChange();
    renderSmartRewriteQueue();
    field.focus();
  }

  function initBulletHelper(card, type, updatePreview) {
    const suggestBtn = card.querySelector('[data-bullet-action="suggest"]');
    const useBtn = card.querySelector('[data-bullet-action="use"]');
    const panel = card.querySelector('[data-bullet-panel]');
    const output = card.querySelector('[data-bullet-output]');
    const notesList = card.querySelector('[data-bullet-notes]');
    const field = type === 'project' ? card.querySelector('.proj-desc') : card.querySelector('.exp-desc');

    if (!suggestBtn || !useBtn || !panel || !output || !notesList || !field) return;

    suggestBtn.addEventListener('click', function () {
      const suggestion = createBulletSuggestion(card, type);
      panel.hidden = false;
      panel.dataset.suggestion = suggestion.text;
      output.textContent = suggestion.text;
      notesList.innerHTML = suggestion.notes.map(function (note) {
        return '<li>' + escapeHtml(note) + '</li>';
      }).join('');
    });

    useBtn.addEventListener('click', function () {
      const suggestion = panel.dataset.suggestion || output.textContent.trim();
      if (!suggestion) return;
      field.value = suggestion;
      updatePreview();
      persistChange();
      field.focus();
    });
  }

  // ── PDF Download ───────────────────────────────────────────
  function getPdfPageHeightPx() {
    return Math.ceil((PDF_A4.contentWidthPx * PDF_A4.contentHeightMm) / PDF_A4.contentWidthMm);
  }

  function getExportPageCount() {
    const pageHeight = getSinglePreviewPageHeight();
    const contentPages = Math.max(1, Math.ceil(getPreviewContentHeight() / pageHeight));
    if (manualSecondPage) return Math.max(2, contentPages);
    return contentPages;
  }

  function syncCloneStyles(clone) {
    const sourceStyle = window.getComputedStyle(resumePreview);
    const minHeight = getPdfPageHeightPx() * getExportPageCount();

    clone.style.width = PDF_A4.contentWidthPx + 'px';
    clone.style.maxWidth = PDF_A4.contentWidthPx + 'px';
    clone.style.minHeight = minHeight + 'px';
    clone.style.boxShadow = 'none';
    clone.style.overflow = 'visible';
    clone.style.margin = '0';
    clone.style.fontFamily = sourceStyle.fontFamily;
    clone.style.fontSize = sourceStyle.fontSize;
    clone.style.lineHeight = sourceStyle.lineHeight;
    clone.style.color = sourceStyle.color;
    clone.style.backgroundColor = sourceStyle.backgroundColor;

    ['--palette-primary', '--palette-accent', '--body-text-align'].forEach(function (name) {
      const value = resumePreview.style.getPropertyValue(name) || sourceStyle.getPropertyValue(name);
      if (value) clone.style.setProperty(name, value);
    });

    const layout = clone.querySelector('.resume-layout');
    if (layout) layout.style.minHeight = minHeight + 'px';

    const sidebar = clone.querySelector('.resume-sidebar');
    if (sidebar && activeTemplate === 'modern') {
      const sidebarBg = sourceStyle.getPropertyValue('--palette-primary') ||
        window.getComputedStyle(sidebar).backgroundColor;
      sidebar.style.backgroundColor = sidebarBg;
    }
  }

  function buildPdfClone() {
    const clone = resumePreview.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.add('pdf-export-sheet');
    syncCloneStyles(clone);

    const wrapper = document.createElement('div');
    wrapper.className = 'pdf-export-wrapper';
    wrapper.style.cssText =
      'position:fixed;left:-10000px;top:0;width:' + PDF_A4.contentWidthPx + 'px;background:#fff;';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    void clone.offsetHeight;
    return { wrapper: wrapper, sheet: clone };
  }

  function prepareExportClone(doc) {
    const sheet = doc.querySelector('.pdf-export-sheet');
    if (!sheet) return;

    sheet.style.overflow = 'visible';
    sheet.style.boxShadow = 'none';
    sheet.style.minHeight = (getPdfPageHeightPx() * getExportPageCount()) + 'px';
    sheet.style.width = PDF_A4.contentWidthPx + 'px';
    sheet.style.maxWidth = PDF_A4.contentWidthPx + 'px';

    const layout = sheet.querySelector('.resume-layout');
    if (layout) layout.style.minHeight = sheet.style.minHeight;

    sheet.querySelectorAll('.skills-list li').forEach(function (li) {
      li.style.background = '#f1f5f9';
      li.style.border = '1px solid #e2e8f0';
    });
  }

  function rowHasLittleInk(ctx, canvas, y) {
    const xStart = Math.floor(canvas.width * (activeTemplate === 'modern' ? 0.36 : 0.05));
    const xEnd = Math.floor(canvas.width * 0.95);
    const width = Math.max(1, xEnd - xStart);
    const data = ctx.getImageData(xStart, y, width, 1).data;
    let inkPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        inkPixels += 1;
      }
    }

    return inkPixels / width < 0.01;
  }

  function findCleanSliceHeight(canvas, srcY, targetSlicePx) {
    const remainingPx = canvas.height - srcY;
    if (remainingPx <= targetSlicePx) return remainingPx;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const targetY = Math.min(canvas.height - 1, srcY + targetSlicePx);
    const minY = Math.max(srcY + Math.floor(targetSlicePx * 0.72), targetY - 220);

    for (let y = targetY; y >= minY; y -= 1) {
      if (
        rowHasLittleInk(ctx, canvas, y) &&
        rowHasLittleInk(ctx, canvas, Math.max(srcY, y - 2)) &&
        rowHasLittleInk(ctx, canvas, Math.min(canvas.height - 1, y + 2))
      ) {
        return Math.max(1, y - srcY);
      }
    }

    return Math.min(targetSlicePx, remainingPx);
  }

  function getPdfPageSlices(canvas) {
    if (!canvas.width || !canvas.height) throw new Error('Could not capture resume content');

    const contentWidth = PDF_A4.contentWidthMm;
    const contentHeight = PDF_A4.contentHeightMm;
    const sliceHeightPx = Math.floor((canvas.width * contentHeight) / contentWidth);
    let srcY = 0;
    let pageIndex = 0;
    const maxPages = getExportPageCount();
    const slices = [];

    while (srcY < canvas.height && pageIndex < maxPages) {
      const isLastExportPage = pageIndex === maxPages - 1;
      const slicePx = isLastExportPage
        ? Math.min(sliceHeightPx, canvas.height - srcY)
        : findCleanSliceHeight(canvas, srcY, sliceHeightPx);

      slices.push({
        srcY: srcY,
        slicePx: slicePx,
        heightMm: (slicePx * contentWidth) / canvas.width,
      });

      srcY += slicePx;
      pageIndex += 1;
    }

    return slices;
  }

  function copyPdfSliceToCanvas(canvas, slice) {
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = slice.slicePx;

    const ctx = sliceCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(canvas, 0, slice.srcY, canvas.width, slice.slicePx, 0, 0, canvas.width, slice.slicePx);

    return sliceCanvas;
  }

  function renderPdfPagesA4(canvas, pdf, slices) {
    const margin = PDF_A4.marginMm;
    const contentWidth = PDF_A4.contentWidthMm;

    slices.forEach(function (slice, pageIndex) {
      if (pageIndex > 0) pdf.addPage();
      const sliceCanvas = copyPdfSliceToCanvas(canvas, slice);
      pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, contentWidth, slice.heightMm);
    });
  }

  function createPdfPreviewImages(canvas, slices) {
    return slices.map(function (slice) {
      return copyPdfSliceToCanvas(canvas, slice).toDataURL('image/jpeg', 0.95);
    });
  }

  function getJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;
    return null;
  }

  function arePdfToolsReady() {
    return typeof html2canvas !== 'undefined' && !!getJsPDF();
  }

  function updatePdfButtonState() {
    if (arePdfToolsReady()) {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PDF';
      downloadBtn.title = 'Download your resume as a PDF';
      return;
    }

    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing PDF tools...';
    downloadBtn.title = 'PDF export tools are still loading';
  }

  function waitForPdfTools(deadlineMs) {
    const startedAt = Date.now();

    return new Promise(function (resolve) {
      function check() {
        updatePdfButtonState();

        if (arePdfToolsReady()) {
          resolve(true);
          return;
        }

        if (Date.now() - startedAt >= deadlineMs) {
          resolve(false);
          return;
        }

        setTimeout(check, 250);
      }

      check();
    });
  }

  function captureSheetAsCanvas(sheet) {
    return html2canvas(sheet, {
      scale: PDF_A4.canvasScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      onclone: prepareExportClone,
    });
  }

  function validateForExport() {
    const email = personalFields.email.value.trim();
    const phone = personalFields.phone.value.trim();
    const warnings = [];
    const exportPages = getExportPageCount();

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      warnings.push('• Email address looks invalid: "' + email + '"');
    }
    if (phone && !/^[\d\s().+\-x#]{7,20}$/.test(phone)) {
      warnings.push('• Phone number looks invalid: "' + phone + '"');
    }
    if (exportPages > 2) {
      warnings.push('• Resume is estimated at ' + exportPages + ' A4 pages. Most resumes should stay within 1-2 pages.');
    }

    if (warnings.length === 0) return true;

    return confirm(
      'The following fields may have errors:\n\n' +
      warnings.join('\n') +
      '\n\nDownload the PDF anyway?'
    );
  }

  function getPdfFilename() {
    const activeDoc = getActiveDocument();
    const docName = activeDoc ? activeDoc.name : 'resume';
    const personName = personalFields.fullName.value.trim();
    const baseName = personName || docName;
    return baseName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').toLowerCase() + '_resume.pdf';
  }

  function createPdfFromSheet(sheet) {
    return document.fonts.ready
      .then(function () {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () { requestAnimationFrame(resolve); });
        });
      })
      .then(function () { return captureSheetAsCanvas(sheet); })
      .then(function (canvas) {
        const JsPDF = getJsPDF();
        if (!JsPDF) throw new Error('jsPDF not available');

        const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: PDF_A4.format, compress: true });
        const slices = getPdfPageSlices(canvas);
        renderPdfPagesA4(canvas, pdf, slices);
        return {
          pdf: pdf,
          previewImages: createPdfPreviewImages(canvas, slices),
          pageCount: slices.length,
        };
      });
  }

  function generatePdfForPreview() {
    const exportData = buildPdfClone();

    function cleanupPrimary() {
      if (exportData.wrapper.parentNode) exportData.wrapper.remove();
    }

    return createPdfFromSheet(exportData.sheet)
      .then(function (result) {
        cleanupPrimary();
        return result;
      })
      .catch(function () {
        cleanupPrimary();

        const fallbackWrapper = document.createElement('div');
        fallbackWrapper.className = 'pdf-export-wrapper';
        fallbackWrapper.style.cssText =
          'position:fixed;left:-10000px;top:0;width:' + PDF_A4.contentWidthPx + 'px;background:#fff;';
        const fallbackSheet = resumePreview.cloneNode(true);
        fallbackSheet.removeAttribute('id');
        fallbackSheet.classList.add('pdf-export-sheet');
        syncCloneStyles(fallbackSheet);
        fallbackWrapper.appendChild(fallbackSheet);
        document.body.appendChild(fallbackWrapper);

        return createPdfFromSheet(fallbackSheet)
          .then(function (result) {
            fallbackWrapper.remove();
            return result;
          })
          .catch(function () {
            fallbackWrapper.remove();
            throw new Error('PDF generation failed');
          });
      });
  }

  function closePdfPreview() {
    pdfPreviewModal.hidden = true;
    pdfPreviewFrame.removeAttribute('src');
    pdfPreviewPages.innerHTML = '';
    if (pendingPdfUrl) URL.revokeObjectURL(pendingPdfUrl);
    pendingPdfUrl = '';
    pendingPdfFilename = '';
    if (confirmPdfDownloadBtn) {
      confirmPdfDownloadBtn.disabled = false;
      confirmPdfDownloadBtn.textContent = 'Download PDF';
    }
    if (pdfPreviewMeta) pdfPreviewMeta.textContent = 'Preparing pages...';
  }

  function showPdfPreview(result, filename) {
    closePdfPreview();
    pendingPdfFilename = filename;
    pendingPdfUrl = URL.createObjectURL(result.pdf.output('blob'));
    pdfPreviewFrame.removeAttribute('src');
    pdfPreviewPages.innerHTML = '';
    const pageCount = result.pageCount || result.previewImages.length || 1;
    if (pdfPreviewHelp) {
      pdfPreviewHelp.textContent = 'Review the exact pages before downloading.';
    }
    if (pdfPreviewMeta) {
      pdfPreviewMeta.textContent = pageCount + ' A4 page' + (pageCount === 1 ? '' : 's') + ' - ' + filename;
    }
    if (confirmPdfDownloadBtn) {
      confirmPdfDownloadBtn.textContent = 'Download ' + pageCount + '-page PDF';
    }
    result.previewImages.forEach(function (src, index) {
      const page = document.createElement('figure');
      page.className = 'pdf-preview-page';

      const img = document.createElement('img');
      img.src = src;
      img.alt = 'PDF preview page ' + (index + 1);
      const caption = document.createElement('figcaption');
      caption.textContent = 'Page ' + (index + 1) + ' of ' + pageCount;

      page.appendChild(img);
      page.appendChild(caption);
      pdfPreviewPages.appendChild(page);
    });
    pdfPreviewModal.hidden = false;
    confirmPdfDownloadBtn.focus();
  }

  function confirmPdfDownload() {
    if (!pendingPdfUrl) return;

    confirmPdfDownloadBtn.disabled = true;
    confirmPdfDownloadBtn.textContent = 'Downloading...';
    const a = document.createElement('a');
    a.href = pendingPdfUrl;
    a.download = pendingPdfFilename || 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    closePdfPreview();
    updatePdfButtonState();
  }

  function downloadPdf() {
    if (!isLoading) updateActiveDocumentContent();
    flushPendingWork();
    updatePageOverflowWarning();

    if (!arePdfToolsReady()) {
      updatePdfButtonState();
      alert('PDF export tools are not ready yet. If you are offline, reconnect once so ResCapt can load them, then try again.');
      return;
    }

    if (!validateForExport()) return;

    createRestorePoint('PDF export version', true);
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing preview...';

    generatePdfForPreview()
      .then(function (result) {
        showPdfPreview(result, getPdfFilename());
      })
      .catch(function () {
        alert('Something went wrong while creating the PDF preview. Please try again.');
      })
      .finally(function () {
        updatePdfButtonState();
      });
  }

  // ── Event Listeners ────────────────────────────────────────
  Object.values(personalFields).forEach(function (field) {
    field.addEventListener('input', function () {
      updatePersonalPreview();
      if (field === personalFields.summary) updateSummaryCounter();
      persistChange();
    });
  });

  skillsField.addEventListener('input', function () {
    updateSkillsPreview();
    persistChange();
  });

  customTitleField.addEventListener('input', function () {
    sectionTitles.custom = customTitleField.value.trim() || DEFAULT_SECTION_TITLES.custom;
    applySectionTitles();
    updateCustomSectionPreview();
    persistChange();
  });

  customContentField.addEventListener('input', function () {
    updateCustomSectionPreview();
    persistChange();
  });

  if (jobDescriptionField) {
    jobDescriptionField.addEventListener('input', function () {
      persistChange();
    });
  }

  if (resumeStrategy) {
    resumeStrategy.addEventListener('change', function () {
      persistChange();
    });
  }

  if (tailorActions) {
    tailorActions.addEventListener('click', function (event) {
      const button = event.target.closest('.tailor-apply-btn[data-tailor-index]');
      if (!button) return;

      let actions = [];
      try {
        actions = JSON.parse(tailorActions.dataset.actions || '[]');
      } catch (err) {
        actions = [];
      }

      applyTailorAction(actions[Number(button.dataset.tailorIndex)]);
    });
  }

  if (smartRewriteList) {
    smartRewriteList.addEventListener('click', function (event) {
      const button = event.target.closest('[data-rewrite-index]');
      if (!button) return;

      let rewrites = [];
      try {
        rewrites = JSON.parse(smartRewriteList.dataset.rewrites || '[]');
      } catch (err) {
        rewrites = [];
      }

      applySmartRewrite(rewrites[Number(button.dataset.rewriteIndex)]);
    });
  }

  if (copyAiPromptBtn) {
    copyAiPromptBtn.addEventListener('click', copyAIPrompt);
  }

  if (refreshAiPromptBtn) {
    refreshAiPromptBtn.addEventListener('click', refreshAIPromptNow);
  }

  if (improveSummaryBtn) {
    improveSummaryBtn.addEventListener('click', showSummarySuggestion);
  }

  if (useSummarySuggestionBtn) {
    useSummarySuggestionBtn.addEventListener('click', useSummarySuggestion);
  }

  sectionToggleInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      sectionVisibility[input.dataset.sectionToggle] = input.checked;
      applySectionVisibility();
      persistChange();
    });
  });

  sectionTitleInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      const key = input.dataset.sectionTitle;
      sectionTitles[key] = input.value.trim() || DEFAULT_SECTION_TITLES[key];
      if (key === 'custom') customTitleField.value = sectionTitles.custom === DEFAULT_SECTION_TITLES.custom ? '' : sectionTitles.custom;
      applySectionTitles();
      updateCustomSectionPreview();
      persistChange();
    });
  });

  sectionMoveButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      moveSection(btn.dataset.sectionKey, btn.dataset.sectionMove);
    });
  });

  styleControls.fontSize.addEventListener('input', function () {
    applyStyles();
    persistChange();
  });

  styleControls.lineSpacing.addEventListener('input', function () {
    activeLineSpacing = styleControls.lineSpacing.value;
    applyStyles();
    persistChange();
  });

  if (styleControls.partTarget) {
    styleControls.partTarget.addEventListener('change', updatePartTypographyControls);
  }

  if (styleControls.partScale) {
    styleControls.partScale.addEventListener('input', function () {
      syncSelectedPartTypographyFromControls();
      applyStyles();
      persistChange();
    });
  }

  if (styleControls.partLineSpacing) {
    styleControls.partLineSpacing.addEventListener('input', function () {
      syncSelectedPartTypographyFromControls();
      applyStyles();
      persistChange();
    });
  }

  if (styleControls.partReset) {
    styleControls.partReset.addEventListener('click', function () {
      const key = getSelectedTypographyPart();
      partTypography[key] = Object.assign({}, DEFAULT_TYPOGRAPHY_PART);
      applyStyles();
      persistChange();
    });
  }

  document.getElementById('addExperience').addEventListener('click', function () { addExperienceEntry(); });
  document.getElementById('addEducation').addEventListener('click', function () { addEducationEntry(); });
  document.getElementById('addCertification').addEventListener('click', function () { addCertificationEntry(); });
  document.getElementById('addProject').addEventListener('click', function () { addProjectEntry(); });
  downloadBtn.addEventListener('click', downloadPdf);
  allowSecondPageBtn.addEventListener('click', function () {
    allowSecondPage = true;
    schedulePageOverflowCheck();
    scheduleResumeQualityCheck();
    scheduleAIPromptUpdate();
  });
  if (manualSecondPageBtn) {
    manualSecondPageBtn.addEventListener('click', function () {
      manualSecondPage = !manualSecondPage;
      if (!manualSecondPage) allowSecondPage = false;
      schedulePageOverflowCheck();
      scheduleResumeQualityCheck();
      scheduleAIPromptUpdate();
    });
    updateManualSecondPageButton();
  }
  closePdfPreviewBtn.addEventListener('click', closePdfPreview);
  cancelPdfDownloadBtn.addEventListener('click', closePdfPreview);
  confirmPdfDownloadBtn.addEventListener('click', confirmPdfDownload);

  // Ctrl+S shortcut
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !guideModal.hidden) {
      closeGuide(true);
      return;
    }

    if (e.key === 'Escape' && !pdfPreviewModal.hidden) {
      closePdfPreview();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redoEdit();
      } else {
        undoEdit();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redoEdit();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      downloadPdf();
    }
  });

  window.addEventListener('pagehide', function () {
    stopAIPromptAutoRefresh();
    if (!isLoading) updateActiveDocumentContent();
    flushPendingWork();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      stopAIPromptAutoRefresh();
      if (!isLoading) updateActiveDocumentContent();
      flushPendingWork();
    } else {
      startAIPromptAutoRefresh();
      scheduleAIPromptUpdate();
    }
  });

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
        registration.addEventListener('updatefound', function () {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener('statechange', function () {
            if (worker.state === 'installed' && navigator.serviceWorker.controller && appUpdateBanner) {
              appUpdateBanner.hidden = false;
            }
          });
        });
      }).catch(function () {
        // The app still works without offline support.
      });
    });

    if (refreshAppBtn) {
      refreshAppBtn.addEventListener('click', function () {
        window.location.reload();
      });
    }
  }

  function applyMobileView(view) {
    activeMobileView = view === 'preview' ? 'preview' : 'edit';
    document.body.classList.toggle('mobile-show-preview', activeMobileView === 'preview');
    document.body.classList.toggle('mobile-show-edit', activeMobileView !== 'preview');

    mobileViewButtons.forEach(function (btn) {
      const isActive = btn.dataset.mobileView === activeMobileView;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (activeMobileView === 'preview') {
      updateMobilePreviewScale();
      schedulePageOverflowCheck();
    }
  }

  function initMobileViewSwitcher() {
    mobileViewButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyMobileView(btn.dataset.mobileView);
      });
    });

    window.addEventListener('resize', function () {
      scheduleMobilePreviewScaleUpdate();
      if (activeMobileView === 'preview') schedulePageOverflowCheck();
    });

    window.addEventListener('orientationchange', function () {
      setTimeout(function () {
        updateMobilePreviewScale();
        if (activeMobileView === 'preview') schedulePageOverflowCheck();
      }, 200);
    });

    applyMobileView(activeMobileView);
  }

  function ensureTooltipEl() {
    if (tooltipEl) return tooltipEl;

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'app-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function positionTooltip(target) {
    if (!tooltipEl || !target) return;

    const gap = 10;
    const margin = 12;
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    left = Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin));

    let top = rect.top - tooltipRect.height - gap;
    if (top < margin) {
      top = rect.bottom + gap;
    }
    top = Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin));

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
  }

  function showTooltip(target) {
    const text = target && target.getAttribute('data-tooltip');
    if (!text) return;

    activeTooltipTarget = target;
    const el = ensureTooltipEl();
    el.textContent = text;
    el.classList.add('visible');
    positionTooltip(target);
  }

  function hideTooltip(target) {
    if (target && activeTooltipTarget !== target) return;
    activeTooltipTarget = null;
    if (tooltipEl) tooltipEl.classList.remove('visible');
  }

  function initTooltips() {
    document.addEventListener('mouseover', function (event) {
      const target = event.target.closest('[data-tooltip]');
      if (target) showTooltip(target);
    });

    document.addEventListener('mouseout', function (event) {
      const target = event.target.closest('[data-tooltip]');
      if (target && !target.contains(event.relatedTarget)) hideTooltip(target);
    });

    document.addEventListener('focusin', function (event) {
      const target = event.target.closest('[data-tooltip]');
      if (target) showTooltip(target);
    });

    document.addEventListener('focusout', function (event) {
      const target = event.target.closest('[data-tooltip]');
      if (target) hideTooltip(target);
    });

    document.addEventListener('click', function () {
      hideTooltip();
    });

    window.addEventListener('scroll', function () {
      if (activeTooltipTarget) positionTooltip(activeTooltipTarget);
    }, true);

    window.addEventListener('resize', function () {
      if (activeTooltipTarget) positionTooltip(activeTooltipTarget);
    });
  }

  function initPreviewEditing() {
    const editableMap = [
      { element: previewEls.name, field: personalFields.fullName, fallback: DEFAULTS.name, singleLine: true },
      { element: previewEls.title, field: personalFields.jobTitle, fallback: DEFAULTS.title, singleLine: true },
      { element: previewEls.email, field: personalFields.email, fallback: DEFAULTS.email, singleLine: true },
      { element: previewEls.phone, field: personalFields.phone, fallback: DEFAULTS.phone, singleLine: true },
      { element: previewEls.location, field: personalFields.location, fallback: DEFAULTS.location, singleLine: true },
      { element: previewEls.website, field: personalFields.website, fallback: '', singleLine: true },
      { element: previewEls.summary, field: personalFields.summary, fallback: DEFAULTS.summary, singleLine: false },
    ];

    editableMap.forEach(function (item) {
      item.element.contentEditable = 'true';
      item.element.spellcheck = true;
      item.element.classList.add('resume-preview-editable');
      item.element.setAttribute('data-tooltip', 'Click to edit this text directly in the preview.');

      item.element.addEventListener('focus', function () {
        selectTypographyPartFromPreview(item.element);
        if (!item.field.value.trim() && item.element.textContent === item.fallback) {
          item.element.textContent = '';
        }
      });

      item.element.addEventListener('keydown', function (event) {
        if (item.singleLine && event.key === 'Enter') {
          event.preventDefault();
          item.element.blur();
        }
      });

      item.element.addEventListener('input', function () {
        item.field.value = item.element.textContent.trim();
        if (item.field === personalFields.summary) updateSummaryCounter();
        persistChange();
      });

      item.element.addEventListener('blur', function () {
        if (!item.field.value.trim()) {
          updatePersonalPreview();
        }
      });
    });

    function getPreviewFieldSelector(type, field) {
      const selectors = {
        experience: {
          title: '.exp-title',
          company: '.exp-company',
          dates: '.exp-dates',
          desc: '.exp-desc',
        },
        education: {
          qualification: '.edu-qualification',
          school: '.edu-school',
          dates: '.edu-dates',
        },
        certification: {
          name: '.cert-name',
          issuer: '.cert-issuer',
          date: '.cert-date',
        },
        project: {
          name: '.proj-name',
          link: '.proj-link',
          desc: '.proj-desc',
        },
      };
      return selectors[type] && selectors[type][field];
    }

    function getPreviewField(entry, target) {
      const type = entry.dataset.previewType;
      const index = Number(entry.dataset.previewIndex || 0);
      const selector = getPreviewFieldSelector(type, target.dataset.previewField);
      const listEl = getListForType(type);
      const card = listEl ? listEl.querySelectorAll('.entry-card')[index] : null;
      return card && selector ? card.querySelector(selector) : null;
    }

    resumePreview.addEventListener('keydown', function (event) {
      const target = event.target.closest('.preview-inline-edit');
      if (!target) return;

      if (event.key === 'Enter' && !target.classList.contains('preview-entry-desc-text')) {
        event.preventDefault();
        target.blur();
      }
    });

    resumePreview.addEventListener('click', function (event) {
      selectTypographyPartFromPreview(event.target);
    }, true);

    resumePreview.addEventListener('input', function (event) {
      const target = event.target.closest('.preview-inline-edit');
      const entry = target && target.closest('[data-preview-type]');
      if (!target || !entry) return;

      const field = getPreviewField(entry, target);
      if (!field) return;

      field.value = target.textContent.trim();
      persistChange();
    });

    resumePreview.addEventListener('blur', function (event) {
      const target = event.target.closest('.preview-inline-edit');
      const entry = target && target.closest('[data-preview-type]');
      if (!target || !entry) return;

      const type = entry.dataset.previewType;
      getPreviewUpdaterForType(type)();
      schedulePageOverflowCheck();
    }, true);
  }

  function getEditorSectionForType(type) {
    if (type === 'experience') return document.getElementById('sectionExperience');
    if (type === 'education') return document.getElementById('sectionEducation');
    if (type === 'certification') return document.getElementById('sectionCertifications');
    if (type === 'project') return document.getElementById('sectionProjects');
    return null;
  }

  function expandEditorSection(section) {
    if (!section) return;

    const toggle = section.querySelector('.collapse-toggle');
    const bodyId = toggle ? toggle.getAttribute('aria-controls') : null;
    const body = bodyId ? document.getElementById(bodyId) : null;
    if (toggle && body && toggle.getAttribute('aria-expanded') !== 'true') {
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.remove('collapsed');
      const arrow = toggle.querySelector('.collapse-arrow');
      if (arrow) arrow.textContent = '▾';
    }
  }

  function focusEditorCard(type, index) {
    const listEl = getListForType(type);
    if (!listEl) return;

    const card = listEl.querySelectorAll('.entry-card')[index];
    if (!card) return;

    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const firstField = card.querySelector('input, textarea, button');
    if (firstField) {
      setTimeout(function () { firstField.focus(); }, 250);
    }
  }

  function initPreviewEntryLinks() {
    function openLinkedEditor(entry) {
      if (!entry) return;

      const type = entry.dataset.previewType;
      const index = Number(entry.dataset.previewIndex || 0);
      const section = getEditorSectionForType(type);

      applyMobileView('edit');
      expandEditorSection(section);
      focusEditorCard(type, index);
    }

    resumePreview.addEventListener('click', function (event) {
      if (event.target.closest('.preview-inline-edit')) return;
      openLinkedEditor(event.target.closest('[data-preview-type]'));
    });

    resumePreview.addEventListener('keydown', function (event) {
      if (event.target.closest('.preview-inline-edit')) return;
      const entry = event.target.closest('[data-preview-type]');
      if (!entry || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openLinkedEditor(entry);
    });
  }

  // ── Initialize ─────────────────────────────────────────────
  loadAppPrefs();
  applyAppTheme(activeAppTheme);
  initCollapsibles();
  initSortable(experienceList, 'experience');
  initSortable(educationList, 'education');
  initSortable(certificationList, 'certification');
  initSortable(projectList, 'project');
  initDocumentManager();
  initDocumentStore();
  initAppThemeButtons();
  initTemplateButtons();
  initFontButtons();
  initAlignButtons();
  initPaletteButtons();
  initMobileViewSwitcher();
  initTooltips();
  initGuide();
  initPreviewEditing();
  initPreviewEntryLinks();
  registerServiceWorker();
  updatePdfButtonState();
  scheduleResumeQualityCheck();
  scheduleJobMatchCheck();
  scheduleATSCompatibilityCheck();
  scheduleAIPromptUpdate();
  startAIPromptAutoRefresh();
  waitForPdfTools(8000).then(function (ready) {
    if (!ready) {
      downloadBtn.textContent = 'PDF Unavailable';
      downloadBtn.title = 'Reconnect to the internet, reload ResCapt, and try again.';
    }
  });
  if (!appPrefs.guideSeen) {
    setTimeout(function () {
      openGuide(0);
    }, 450);
  }

})();

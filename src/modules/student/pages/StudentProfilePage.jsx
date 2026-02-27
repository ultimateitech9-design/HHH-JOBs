import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiCheckCircle,
  FiEdit2,
  FiFolder,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTrendingUp
} from 'react-icons/fi';
import SectionHeader from '../../../shared/components/SectionHeader';
import { getCurrentUser, getToken, setAuthSession } from '../../../utils/auth';
import { getStudentProfile, updateStudentAvatar, updateStudentProfile } from '../services/studentApi';

const initialFormState = {
  name: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  caste: '',
  religion: '',
  avatarUrl: '',
  headline: '',
  targetRole: '',
  profileSummary: '',
  careerObjective: '',
  currentAddress: '',
  location: '',
  currentPincode: '',
  preferredWorkLocation: '',
  permanentPincode: '',
  skills: [],
  technicalSkills: [],
  softSkills: [],
  toolsTechnologies: [],
  education: [],
  educationEntries: [],
  class10Details: '',
  class12Details: '',
  graduationDetails: '',
  postGraduationDetails: '',
  educationScore: '',
  projects: [],
  internships: [],
  experience: [],
  certifications: [],
  achievements: [],
  languagesKnown: [],
  resumeUrl: '',
  resumeText: '',
  portfolioUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  eimagerId: '',
  preferredSalaryMin: '',
  preferredSalaryMax: '',
  expectedSalary: '',
  preferredJobType: '',
  availabilityToJoin: '',
  willingToRelocate: '',
  noticePeriodDays: ''
};

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const casteOptions = [
  { value: '', label: 'Select caste category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const religionOptions = [
  { value: '', label: 'Select religion' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'christian', label: 'Christian' },
  { value: 'jain', label: 'Jain' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const preferredJobTypeOptions = [
  { value: '', label: 'Select job type' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' }
];

const educationLevelOptions = [
  { value: '', label: 'Select level' },
  { value: '10th', label: '10th' },
  { value: '12th', label: '12th' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Graduation', label: 'Graduation' },
  { value: 'Post Graduation', label: 'Post Graduation' },
  { value: 'PhD', label: 'PhD' }
];

const courseTypeOptions = [
  { value: '', label: 'Select type' },
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Part Time', label: 'Part Time' },
  { value: 'Distance / Correspondence', label: 'Distance / Correspondence' }
];

const gradingSystemOptions = [
  { value: '', label: 'Select grading system' },
  { value: 'Percentage', label: 'Percentage' },
  { value: 'CGPA / GPA', label: 'CGPA / GPA' }
];

const educationStatusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'pursuing', label: 'Pursuing' }
];

const mediumOptions = [
  { value: '', label: 'Select medium (optional)' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Other', label: 'Other' }
];

const profileFormSections = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'education', label: 'Education Details' },
  { key: 'skills', label: 'Skills, Projects & Experience' },
  { key: 'resume', label: 'Resume & Preferences' }
];

const sectionPayloadKeys = {
  personal: [
    'name',
    'email',
    'mobile',
    'dateOfBirth',
    'gender',
    'maritalStatus',
    'caste',
    'religion',
    'avatarUrl',
    'headline',
    'targetRole',
    'profileSummary',
    'careerObjective',
    'currentAddress',
    'location',
    'currentPincode',
    'preferredWorkLocation',
    'permanentPincode'
  ],
  education: [
    'educationEntries',
    'education',
    'class10Details',
    'class12Details',
    'graduationDetails',
    'postGraduationDetails',
    'educationScore'
  ],
  skills: [
    'skills',
    'technicalSkills',
    'softSkills',
    'toolsTechnologies',
    'projects',
    'internships',
    'experience',
    'certifications',
    'achievements',
    'languagesKnown'
  ],
  resume: [
    'resumeUrl',
    'resumeText',
    'portfolioUrl',
    'githubUrl',
    'linkedinUrl',
    'facebookUrl',
    'instagramUrl',
    'eimagerId',
    'preferredSalaryMin',
    'preferredSalaryMax',
    'expectedSalary',
    'preferredJobType',
    'availabilityToJoin',
    'willingToRelocate',
    'noticePeriodDays'
  ]
};

const createEducationEntry = () => ({
  educationLevel: '',
  isHighestQualification: false,
  courseName: '',
  specialization: '',
  universityBoard: '',
  instituteName: '',
  startYear: '',
  endYear: '',
  courseType: '',
  gradingSystem: '',
  marksValue: '',
  maxCgpa: '',
  educationStatus: 'completed',
  expectedCompletionYear: '',
  currentSemester: '',
  mediumOfEducation: '',
  backlogs: '',
  educationGap: ''
});

const toCommaArray = (value = '') =>
  String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toLineArray = (value = '') =>
  String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const cleanLine = (value = '') => String(value || '').replace(/\s+/g, ' ').trim();

const toPrintableList = (items = []) =>
  items
    .map((item) => cleanLine(item))
    .filter(Boolean);

const buildAutoResumeText = ({
  form,
  technicalSkillsInput,
  softSkillsInput,
  toolsInput,
  languagesInput,
  educationEntries,
  projectsInput,
  internshipsInput,
  experienceInput,
  certificationsInput,
  achievementsInput
}) => {
  const lines = [];
  const pushSection = (title) => {
    lines.push('');
    lines.push(title);
    lines.push('-'.repeat(title.length));
  };

  const fullName = cleanLine(form.name) || 'Candidate Name';
  lines.push(fullName);
  lines.push(cleanLine(form.targetRole) || cleanLine(form.headline) || 'Professional Profile');
  lines.push([
    cleanLine(form.email),
    cleanLine(form.mobile),
    cleanLine(form.location)
  ].filter(Boolean).join(' | '));

  const links = [
    cleanLine(form.linkedinUrl) ? `LinkedIn: ${cleanLine(form.linkedinUrl)}` : '',
    cleanLine(form.githubUrl) ? `GitHub: ${cleanLine(form.githubUrl)}` : '',
    cleanLine(form.portfolioUrl) ? `Portfolio: ${cleanLine(form.portfolioUrl)}` : '',
    cleanLine(form.facebookUrl) ? `Facebook: ${cleanLine(form.facebookUrl)}` : '',
    cleanLine(form.instagramUrl) ? `Instagram: ${cleanLine(form.instagramUrl)}` : '',
    cleanLine(form.eimagerId) ? `Eimager ID: ${cleanLine(form.eimagerId)}` : ''
  ].filter(Boolean);
  if (links.length > 0) lines.push(links.join(' | '));

  pushSection('Professional Summary');
  lines.push(cleanLine(form.profileSummary) || cleanLine(form.careerObjective) || 'Add your profile summary and career objective.');

  pushSection('Skills');
  const combinedSkills = toPrintableList([
    ...toCommaArray(technicalSkillsInput),
    ...toCommaArray(softSkillsInput),
    ...toCommaArray(toolsInput)
  ]);
  lines.push(combinedSkills.length > 0 ? combinedSkills.join(', ') : 'Add technical, soft and tools skills.');

  pushSection('Education');
  if (educationEntries.length > 0) {
    educationEntries.forEach((entry) => {
      const segment = [
        cleanLine(entry.educationLevel),
        cleanLine(entry.courseName),
        cleanLine(entry.specialization),
        cleanLine(entry.instituteName),
        cleanLine(entry.universityBoard)
      ].filter(Boolean).join(' | ');
      const year = entry.educationStatus === 'completed'
        ? cleanLine(entry.endYear)
        : cleanLine(entry.expectedCompletionYear);
      const score = cleanLine(entry.marksValue);
      lines.push(`- ${segment}${year ? ` | ${year}` : ''}${score ? ` | Score: ${score}` : ''}`);
    });
  } else {
    lines.push('- Add your education details.');
  }

  pushSection('Projects');
  const projects = toPrintableList(toLineArray(projectsInput));
  lines.push(...(projects.length > 0 ? projects.map((item) => `- ${item}`) : ['- Add project details.']));

  pushSection('Internships / Training');
  const internships = toPrintableList(toLineArray(internshipsInput));
  lines.push(...(internships.length > 0 ? internships.map((item) => `- ${item}`) : ['- Add internship details.']));

  pushSection('Work Experience');
  const experiences = toPrintableList(toLineArray(experienceInput));
  lines.push(...(experiences.length > 0 ? experiences.map((item) => `- ${item}`) : ['- Add experience details.']));

  pushSection('Certifications');
  const certifications = toPrintableList(toLineArray(certificationsInput));
  lines.push(...(certifications.length > 0 ? certifications.map((item) => `- ${item}`) : ['- Add certifications.']));

  pushSection('Achievements');
  const achievements = toPrintableList(toLineArray(achievementsInput));
  lines.push(...(achievements.length > 0 ? achievements.map((item) => `- ${item}`) : ['- Add achievements.']));

  pushSection('Languages');
  const languages = toPrintableList(toCommaArray(languagesInput));
  lines.push(languages.length > 0 ? languages.join(', ') : 'Add languages known.');

  pushSection('Preferences');
  const preferences = [
    cleanLine(form.preferredJobType) ? `Preferred Job Type: ${cleanLine(form.preferredJobType)}` : '',
    cleanLine(form.expectedSalary) ? `Expected Salary: ${cleanLine(form.expectedSalary)}` : '',
    cleanLine(form.availabilityToJoin) ? `Availability: ${cleanLine(form.availabilityToJoin)}` : '',
    String(form.willingToRelocate) === 'true' ? 'Willing to Relocate: Yes' : String(form.willingToRelocate) === 'false' ? 'Willing to Relocate: No' : '',
    cleanLine(form.noticePeriodDays) ? `Notice Period (days): ${cleanLine(form.noticePeriodDays)}` : ''
  ].filter(Boolean);
  lines.push(...(preferences.length > 0 ? preferences.map((item) => `- ${item}`) : ['- Add your job preferences.']));

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const parseGeneratedResumeText = (value = '') => {
  const lines = String(value || '')
    .split('\n')
    .map((line) => line.trimEnd());

  if (lines.length === 0) {
    return null;
  }

  let index = 0;
  while (index < lines.length && !lines[index].trim()) index += 1;
  const name = lines[index] || '';
  index += 1;
  while (index < lines.length && !lines[index].trim()) index += 1;
  const role = lines[index] || '';
  index += 1;
  while (index < lines.length && !lines[index].trim()) index += 1;
  const contact = lines[index] || '';
  index += 1;

  const sections = [];
  while (index < lines.length) {
    while (index < lines.length && !lines[index].trim()) index += 1;
    if (index >= lines.length) break;

    const title = lines[index].trim();
    const underline = lines[index + 1] ? lines[index + 1].trim() : '';
    if (!title || !/^[-_]{3,}$/.test(underline)) {
      index += 1;
      continue;
    }
    index += 2;

    const content = [];
    while (index < lines.length) {
      const current = lines[index];
      const next = lines[index + 1] ? lines[index + 1].trim() : '';

      if (!current.trim()) {
        index += 1;
        if (lines[index] && lines[index].trim() && /^[-_]{3,}$/.test(next)) {
          break;
        }
        continue;
      }

      if (current.trim() && /^[-_]{3,}$/.test(next)) break;
      content.push(current.trim());
      index += 1;
    }

    sections.push({ title, content });
  }

  return {
    name: name.trim(),
    role: role.trim(),
    contact: contact.trim(),
    sections
  };
};

const buildStudentProfilePayload = ({
  form,
  technicalSkillsInput,
  softSkillsInput,
  toolsInput,
  languagesInput,
  educationEntries,
  projectsInput,
  internshipsInput,
  experienceInput,
  certificationsInput,
  achievementsInput
}) => {
  const class10Entry = educationEntries.find((entry) => entry.educationLevel === '10th');
  const class12Entry = educationEntries.find((entry) => entry.educationLevel === '12th');
  const graduationEntry = educationEntries.find((entry) => entry.educationLevel === 'Graduation');
  const postGraduationEntry = educationEntries.find((entry) => entry.educationLevel === 'Post Graduation');
  const highestQualification = educationEntries.find((entry) => entry.isHighestQualification) || educationEntries[0];

  return {
    ...form,
    technicalSkills: toCommaArray(technicalSkillsInput),
    softSkills: toCommaArray(softSkillsInput),
    toolsTechnologies: toCommaArray(toolsInput),
    languagesKnown: toCommaArray(languagesInput),
    educationEntries,
    projects: toLineArray(projectsInput),
    internships: toLineArray(internshipsInput),
    experience: toLineArray(experienceInput),
    certifications: toLineArray(certificationsInput),
    achievements: toLineArray(achievementsInput),
    class10Details: class10Entry
      ? `${class10Entry.universityBoard}, ${class10Entry.instituteName}, ${class10Entry.endYear || class10Entry.expectedCompletionYear}`
      : '',
    class12Details: class12Entry
      ? `${class12Entry.universityBoard}, ${class12Entry.instituteName}, ${class12Entry.endYear || class12Entry.expectedCompletionYear}`
      : '',
    graduationDetails: graduationEntry
      ? `${graduationEntry.courseName}, ${graduationEntry.specialization}, ${graduationEntry.instituteName}, ${graduationEntry.endYear || graduationEntry.expectedCompletionYear}`
      : '',
    postGraduationDetails: postGraduationEntry
      ? `${postGraduationEntry.courseName}, ${postGraduationEntry.specialization}, ${postGraduationEntry.instituteName}, ${postGraduationEntry.endYear || postGraduationEntry.expectedCompletionYear}`
      : '',
    educationScore: highestQualification?.marksValue || '',
    education: educationEntries.map((entry) =>
      [
        entry.educationLevel,
        entry.courseName,
        entry.specialization,
        entry.universityBoard,
        entry.instituteName,
        entry.educationStatus === 'completed'
          ? `Passed ${entry.endYear || '-'}`
          : `Expected ${entry.expectedCompletionYear || '-'}`
      ]
        .filter(Boolean)
        .join(' | '))
  };
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to process image.'));
    image.src = src;
  });

const compressImageToDataUrl = async (file) => {
  const sourceDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);

  const maxDimension = 720;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return sourceDataUrl;

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.82);
};

const StudentProfilePage = () => {
  const [form, setForm] = useState(initialFormState);
  const [technicalSkillsInput, setTechnicalSkillsInput] = useState('');
  const [softSkillsInput, setSoftSkillsInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [technicalSkillDraft, setTechnicalSkillDraft] = useState('');
  const [softSkillDraft, setSoftSkillDraft] = useState('');
  const [toolsDraft, setToolsDraft] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [educationEntries, setEducationEntries] = useState([]);
  const [educationDraft, setEducationDraft] = useState(createEducationEntry());
  const [editingEducationIndex, setEditingEducationIndex] = useState(-1);
  const [educationDraftError, setEducationDraftError] = useState('');
  const [projectsInput, setProjectsInput] = useState('');
  const [projectDraft, setProjectDraft] = useState('');
  const [internshipsInput, setInternshipsInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');
  const [preferredLocationDraft, setPreferredLocationDraft] = useState('');
  const [preferredPincodeDraft, setPreferredPincodeDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [resumeBuilderSaving, setResumeBuilderSaving] = useState(false);
  const [generatedResumeText, setGeneratedResumeText] = useState('');
  const [activeProfileSection, setActiveProfileSection] = useState('personal');
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const lastSavedSnapshotRef = useRef('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      const response = await getStudentProfile();
      if (!mounted) return;

      const nextForm = { ...initialFormState, ...(response.data || {}) };
      hydrateProfileState(nextForm);
      setIsDemo(response.isDemo);
      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isEditingName) return;
    nameInputRef.current?.focus();
    nameInputRef.current?.select();
  }, [isEditingName]);

  useEffect(() => () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, []);

  const buildPayload = (formState = form) =>
    buildStudentProfilePayload({
      form: formState,
      technicalSkillsInput,
      softSkillsInput,
      toolsInput,
      languagesInput,
      educationEntries,
      projectsInput,
      internshipsInput,
      experienceInput,
      certificationsInput,
      achievementsInput
    });

  const buildSectionPayload = (sectionKey) => {
    const payload = buildPayload();
    const keys = sectionPayloadKeys[sectionKey] || [];
    return keys.reduce((accumulator, key) => {
      if (key in payload) accumulator[key] = payload[key];
      return accumulator;
    }, {});
  };

  const syncSessionUser = (profile) => {
    const token = getToken();
    const currentUser = getCurrentUser();
    if (!token || !currentUser) return;

    const mergedUser = {
      ...currentUser,
      name: profile.name || currentUser.name || '',
      avatarUrl: profile.avatarUrl || profile.avatar_url || '',
      avatar_url: profile.avatarUrl || profile.avatar_url || '',
      headline: profile.headline || currentUser.headline || '',
      targetRole: profile.targetRole || profile.target_role || currentUser.targetRole || ''
    };
    setAuthSession(token, mergedUser);
  };

  const hydrateProfileState = (updated) => {
    setForm(updated);
    setTechnicalSkillsInput((updated.technicalSkills || []).join(', '));
    setSoftSkillsInput((updated.softSkills || []).join(', '));
    setToolsInput((updated.toolsTechnologies || []).join(', '));
    setLanguagesInput((updated.languagesKnown || []).join(', '));
    setEducationEntries(Array.isArray(updated.educationEntries) ? updated.educationEntries : []);
    setProjectsInput((updated.projects || []).join('\n'));
    setInternshipsInput((updated.internships || []).join('\n'));
    setExperienceInput((updated.experience || []).join('\n'));
    setCertificationsInput((updated.certifications || []).join('\n'));
    setAchievementsInput((updated.achievements || []).join('\n'));
    syncSessionUser(updated);

    const nextSnapshot = JSON.stringify(buildStudentProfilePayload({
      form: updated,
      technicalSkillsInput: (updated.technicalSkills || []).join(', '),
      softSkillsInput: (updated.softSkills || []).join(', '),
      toolsInput: (updated.toolsTechnologies || []).join(', '),
      languagesInput: (updated.languagesKnown || []).join(', '),
      educationEntries: Array.isArray(updated.educationEntries) ? updated.educationEntries : [],
      projectsInput: (updated.projects || []).join('\n'),
      internshipsInput: (updated.internships || []).join('\n'),
      experienceInput: (updated.experience || []).join('\n'),
      certificationsInput: (updated.certifications || []).join('\n'),
      achievementsInput: (updated.achievements || []).join('\n')
    }));
    lastSavedSnapshotRef.current = nextSnapshot;
  };

  const scheduleAutoSave = (waitMs = 700) => {
    if (loading || saving || avatarSaving) return;
    const snapshot = JSON.stringify(buildPayload());
    if (snapshot === lastSavedSnapshotRef.current) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        setAutoSaving(true);
        setError('');
        const updated = await updateStudentProfile(buildPayload(), { prebuiltPayload: true });
        hydrateProfileState(updated);
      } catch (saveError) {
        setError(saveError.message || 'Failed to auto-save profile changes.');
      } finally {
        setAutoSaving(false);
      }
    }, waitMs);
  };

  const handleFormBlurCapture = (event) => {
    const target = event.target;
    const tagName = String(target?.tagName || '').toLowerCase();
    if (!['input', 'select', 'textarea'].includes(tagName)) return;
    if (tagName === 'input' && String(target.type || '').toLowerCase() === 'file') return;
    if (target?.disabled) return;
    scheduleAutoSave();
  };

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateEducationDraft = (key, value) => {
    setEducationDraft((current) => ({ ...current, [key]: value }));
  };

  const validateEducationEntry = (entry) => {
    const requiredFields = [
      ['educationLevel', 'Education level is required.'],
      ['courseName', 'Course / degree name is required.'],
      ['specialization', 'Specialization is required.'],
      ['universityBoard', 'University / board is required.'],
      ['instituteName', 'Institute name is required.'],
      ['startYear', 'Course start year is required.'],
      ['courseType', 'Course type is required.'],
      ['gradingSystem', 'Grading system is required.'],
      ['marksValue', 'Marks / CGPA value is required.']
    ];

    for (const [key, message] of requiredFields) {
      if (!String(entry?.[key] || '').trim()) return message;
    }

    if (entry.educationStatus === 'completed' && !String(entry.endYear || '').trim()) {
      return 'Passing year is required for completed education.';
    }

    if (entry.educationStatus === 'pursuing' && !String(entry.expectedCompletionYear || '').trim()) {
      return 'Expected completion year is required for pursuing education.';
    }

    const startYear = Number(entry.startYear);
    const endOrExpectedYear = Number(
      entry.educationStatus === 'completed' ? entry.endYear : entry.expectedCompletionYear
    );
    if (Number.isFinite(startYear) && Number.isFinite(endOrExpectedYear) && endOrExpectedYear < startYear) {
      return 'End / expected year cannot be before start year.';
    }

    return '';
  };

  const educationCompletion = useMemo(() => {
    if (!educationEntries.length) return 0;
    const requiredKeys = [
      'educationLevel',
      'courseName',
      'specialization',
      'universityBoard',
      'instituteName',
      'startYear',
      'courseType',
      'gradingSystem',
      'marksValue',
      'educationStatus'
    ];

    let total = 0;
    let filled = 0;

    educationEntries.forEach((entry) => {
      requiredKeys.forEach((key) => {
        total += 1;
        if (String(entry?.[key] || '').trim()) filled += 1;
      });

      total += 1;
      if (
        (entry.educationStatus === 'completed' && String(entry.endYear || '').trim())
        || (entry.educationStatus === 'pursuing' && String(entry.expectedCompletionYear || '').trim())
      ) {
        filled += 1;
      }
    });

    return Math.round((filled / Math.max(total, 1)) * 100);
  }, [educationEntries]);

  const parsedProjects = useMemo(
    () => projectsInput.split('\n').map((item) => item.trim()).filter(Boolean),
    [projectsInput]
  );
  const parsedTechnicalSkills = useMemo(
    () => toCommaArray(technicalSkillsInput),
    [technicalSkillsInput]
  );
  const parsedSoftSkills = useMemo(
    () => toCommaArray(softSkillsInput),
    [softSkillsInput]
  );
  const parsedTools = useMemo(
    () => toCommaArray(toolsInput),
    [toolsInput]
  );
  const parsedInternships = useMemo(
    () => internshipsInput.split('\n').map((item) => item.trim()).filter(Boolean),
    [internshipsInput]
  );
  const parsedCertifications = useMemo(
    () => certificationsInput.split('\n').map((item) => item.trim()).filter(Boolean),
    [certificationsInput]
  );
  const parsedPreferredWorkLocations = useMemo(
    () => toCommaArray(form.preferredWorkLocation),
    [form.preferredWorkLocation]
  );
  const generatedResumeLineCount = useMemo(
    () => (generatedResumeText ? generatedResumeText.split('\n').filter((line) => String(line).trim()).length : 0),
    [generatedResumeText]
  );
  const generatedResumePreview = useMemo(
    () => parseGeneratedResumeText(generatedResumeText),
    [generatedResumeText]
  );

  const profileChecks = useMemo(
    () => [
      Boolean(String(form.name || '').trim()),
      Boolean(String(form.mobile || '').trim()),
      Boolean(String(form.email || '').trim()),
      Boolean(String(form.dateOfBirth || '').trim()),
      Boolean(String(form.gender || '').trim()),
      Boolean(String(form.location || '').trim()),
      Boolean(String(form.targetRole || '').trim()),
      Boolean(String(form.profileSummary || '').trim()),
      parsedProjects.length > 0,
      parsedInternships.length > 0,
      parsedCertifications.length > 0,
      educationEntries.length > 0
    ],
    [educationEntries.length, form, parsedCertifications.length, parsedInternships.length, parsedProjects.length]
  );

  const missingDetailsCount = useMemo(
    () => profileChecks.filter((item) => !item).length,
    [profileChecks]
  );
  const profileCompletion = useMemo(() => {
    const doneCount = profileChecks.filter(Boolean).length;
    return Math.round((doneCount / Math.max(profileChecks.length, 1)) * 100);
  }, [profileChecks]);

  const profileActions = useMemo(
    () => [
      {
        key: 'exam',
        label: 'Add competitive exam',
        boost: '6%',
        done: parsedCertifications.length > 0,
        icon: FiAward
      },
      {
        key: 'internship',
        label: 'Add internship',
        boost: '8%',
        done: parsedInternships.length > 0,
        icon: FiBarChart2
      },
      {
        key: 'project',
        label: 'Add project',
        boost: '7%',
        done: parsedProjects.length > 0,
        icon: FiFolder
      }
    ],
    [parsedCertifications.length, parsedInternships.length, parsedProjects.length]
  );

  const profileName = String(form.name || 'Student').trim() || 'Student';
  const profileInitial = profileName.slice(0, 1).toUpperCase();
  const profileDob = form.dateOfBirth
    ? new Date(form.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Add date of birth';

  const handleAddEducation = () => {
    setEducationDraft(createEducationEntry());
    setEditingEducationIndex(-1);
    setEducationDraftError('');
  };

  const addCommaListItem = (draftValue, setDraftValue, listInput, setListInput) => {
    const nextValue = cleanLine(draftValue);
    if (!nextValue) return;
    const nextList = Array.from(new Set([...toCommaArray(listInput), nextValue]));
    setListInput(nextList.join(', '));
    setDraftValue('');
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const removeCommaListItem = (itemIndex, listInput, setListInput) => {
    const nextList = toCommaArray(listInput).filter((_, index) => index !== itemIndex);
    setListInput(nextList.join(', '));
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleAddProject = () => {
    const nextValue = cleanLine(projectDraft);
    if (!nextValue) return;
    const nextProjects = [...toLineArray(projectsInput), nextValue];
    setProjectsInput(nextProjects.join('\n'));
    setProjectDraft('');
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleRemoveProject = (itemIndex) => {
    const nextProjects = toLineArray(projectsInput).filter((_, index) => index !== itemIndex);
    setProjectsInput(nextProjects.join('\n'));
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleAddPreferredWorkLocation = () => {
    const location = cleanLine(preferredLocationDraft);
    const pincode = cleanLine(preferredPincodeDraft);
    if (!location || !pincode) return;

    const nextEntry = `${location} (${pincode})`;
    const nextList = Array.from(new Set([...toCommaArray(form.preferredWorkLocation), nextEntry]));
    updateField('preferredWorkLocation', nextList.join(', '));
    setPreferredLocationDraft('');
    setPreferredPincodeDraft('');
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleRemovePreferredWorkLocation = (itemIndex) => {
    const nextList = toCommaArray(form.preferredWorkLocation).filter((_, index) => index !== itemIndex);
    updateField('preferredWorkLocation', nextList.join(', '));
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleEditEducation = (index) => {
    const target = educationEntries[index];
    if (!target) return;
    setEducationDraft({ ...createEducationEntry(), ...target });
    setEditingEducationIndex(index);
    setEducationDraftError('');
  };

  const handleDeleteEducation = (index) => {
    setEducationEntries((current) => current.filter((_, itemIndex) => itemIndex !== index));
    if (editingEducationIndex === index) {
      handleAddEducation();
    }
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleSaveEducationEntry = () => {
    const validationMessage = validateEducationEntry(educationDraft);
    if (validationMessage) {
      setEducationDraftError(validationMessage);
      return;
    }

    const nextEntry = { ...educationDraft };
    setEducationEntries((current) => {
      if (editingEducationIndex >= 0) {
        return current.map((item, index) => (index === editingEducationIndex ? nextEntry : item));
      }
      return [...current, nextEntry];
    });
    handleAddEducation();
    setTimeout(() => scheduleAutoSave(250), 0);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previousAvatarUrl = form.avatarUrl;
    setAvatarMessage('');
    setSuccess('');

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setAvatarMessage('Please select a valid image file.');
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be 10MB or less.');
      setAvatarMessage('Image size must be 10MB or less.');
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    const persistAvatar = async () => {
      setAvatarSaving(true);
      setAvatarMessage('Uploading photo...');

      try {
        const nextAvatarUrl = await compressImageToDataUrl(file);
        updateField('avatarUrl', nextAvatarUrl);
        setError('');

        const updatedProfile = await updateStudentAvatar(nextAvatarUrl);
        const merged = { ...form, ...updatedProfile, avatarUrl: updatedProfile.avatarUrl || nextAvatarUrl };
        hydrateProfileState(merged);
        setSuccess('Profile photo updated.');
        setAvatarMessage('Profile photo updated.');
      } catch (avatarError) {
        updateField('avatarUrl', previousAvatarUrl || '');
        setError(avatarError.message || 'Failed to update profile photo.');
        setAvatarMessage(avatarError.message || 'Failed to update profile photo.');
      } finally {
        setAvatarSaving(false);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
      }
    };

    persistAvatar();
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = String(file.type || '').toLowerCase();
    const fileName = String(file.name || '').toLowerCase();
    const isAllowed = (
      fileType.includes('pdf')
      || fileType.includes('msword')
      || fileType.includes('officedocument.wordprocessingml')
      || fileName.endsWith('.pdf')
      || fileName.endsWith('.doc')
      || fileName.endsWith('.docx')
    );

    if (!isAllowed) {
      setError('Please upload PDF or DOC/DOCX resume file.');
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be 5MB or less.');
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('resumeUrl', reader.result);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read resume file. Try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event, sectionKey = activeProfileSection) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (sectionKey === 'education') {
      const invalidEntry = educationEntries.find((entry) => validateEducationEntry(entry));
      if (invalidEntry) {
        setSaving(false);
        setError('Please fix Education Details validation before saving this section.');
        return;
      }
    }

    const payload = buildSectionPayload(sectionKey);
    const sectionLabel = profileFormSections.find((section) => section.key === sectionKey)?.label || 'Profile';

    try {
      const updated = await updateStudentProfile(payload, { prebuiltPayload: true });
      hydrateProfileState(updated);
      setSuccess(`${sectionLabel} saved successfully.`);
    } catch (saveError) {
      setError(saveError.message || `Failed to save ${sectionLabel}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleBuildResumeFromProfile = () => {
    const generated = buildAutoResumeText({
      form,
      technicalSkillsInput,
      softSkillsInput,
      toolsInput,
      languagesInput,
      educationEntries,
      projectsInput,
      internshipsInput,
      experienceInput,
      certificationsInput,
      achievementsInput
    });
    setGeneratedResumeText(generated);
    setSuccess('Resume draft generated from your profile.');
  };

  const handleUseGeneratedResume = () => {
    if (!generatedResumeText) return;
    updateField('resumeText', generatedResumeText);
    setSuccess('Generated resume added to Resume Text.');
  };

  const handleDownloadGeneratedResume = () => {
    if (!generatedResumeText || typeof document === 'undefined') return;
    const blob = new Blob([generatedResumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${(cleanLine(form.name) || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-resume.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleSaveGeneratedResumeToProfile = async () => {
    if (!generatedResumeText) return;
    setResumeBuilderSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...buildPayload(),
        resumeText: generatedResumeText
      };
      const updated = await updateStudentProfile(payload, { prebuiltPayload: true });
      hydrateProfileState(updated);
      setGeneratedResumeText(updated.resumeText || generatedResumeText);
      setSuccess('Generated resume saved to profile.');
    } catch (saveError) {
      setError(saveError.message || 'Failed to save generated resume.');
    } finally {
      setResumeBuilderSaving(false);
    }
  };

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Student Profile"
        title="Manage Resume and Profile Details"
        subtitle="These details are used for job applications and ATS checks."
      />

      <section className="profile-overview-card">
        <div className="profile-overview-main">
          <div className="profile-overview-avatar-col">
            <div
              className={`profile-overview-avatar-ring ${avatarSaving ? 'is-uploading' : ''} ${isAvatarExpanded ? 'is-expanded' : ''}`}
              style={{ '--profile-progress': `${profileCompletion}%` }}
              role="button"
              tabIndex={avatarSaving ? -1 : 0}
              onClick={() => {
                if (!avatarSaving) avatarInputRef.current?.click();
              }}
              onKeyDown={(event) => {
                if (avatarSaving) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  avatarInputRef.current?.click();
                }
              }}
              aria-label={avatarSaving ? 'Uploading profile photo' : 'Upload profile photo'}
              >
              <div
                className={`profile-overview-avatar ${form.avatarUrl ? 'is-zoomable' : ''}`}
                onClick={(event) => {
                  if (!form.avatarUrl) return;
                  event.stopPropagation();
                  setIsAvatarExpanded((current) => !current);
                }}
              >
                {form.avatarUrl ? <img src={form.avatarUrl} alt={`${profileName} profile`} /> : <span>{profileInitial}</span>}
              </div>
              <button
                type="button"
                className="profile-overview-avatar-upload-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  if (!avatarSaving) avatarInputRef.current?.click();
                }}
                aria-label="Upload profile photo"
                title={avatarSaving ? 'Uploading...' : 'Upload Photo'}
                disabled={avatarSaving}
              >
                <FiCamera size={14} />
              </button>
              <span className="profile-overview-progress">{profileCompletion}%</span>
            </div>
          </div>

          <div className="profile-overview-details">
            <div className="profile-overview-title-row">
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  className="profile-overview-name-input"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setIsEditingName(false);
                    if (event.key === 'Escape') setIsEditingName(false);
                  }}
                  placeholder="Enter your name"
                />
              ) : (
                <h2>{profileName}</h2>
              )}
              <button
                type="button"
                className="profile-overview-name-edit-btn"
                onClick={() => setIsEditingName((current) => !current)}
                aria-label={isEditingName ? 'Done editing name' : 'Edit name'}
                title={isEditingName ? 'Done' : 'Edit name'}
              >
                {isEditingName ? <FiCheck size={18} /> : <FiEdit2 size={18} />}
              </button>
            </div>
            <p className="profile-overview-headline">
              {form.graduationDetails || form.headline || form.targetRole || 'Add your headline and qualification'}
            </p>
            <p className="profile-overview-subtitle">
              {form.currentAddress || form.preferredWorkLocation || 'Add institute/current location details'}
            </p>

            <div className="profile-overview-meta-grid">
              <p><FiMapPin size={17} /> <span>{form.location || 'Add location'}</span></p>
              <p><FiPhone size={17} /> <span>{form.mobile || 'Add phone number'}</span> {form.mobile ? <FiCheckCircle size={15} className="profile-overview-verified" /> : null}</p>
              <p><FiCalendar size={17} /> <span>{profileDob}</span></p>
              <p><FiMail size={17} /> <span>{form.email || 'Add email'}</span> {form.email ? <FiCheckCircle size={15} className="profile-overview-verified" /> : null}</p>
            </div>
          </div>
        </div>

        <aside className="profile-overview-actions">
          {profileActions.map((item) => {
            const Icon = item.icon;
            return (
              <div className="profile-overview-action-row" key={item.key}>
                <span className="profile-overview-action-icon"><Icon size={18} /></span>
                <strong>{item.label}</strong>
                <span className={`profile-overview-gain ${item.done ? 'profile-overview-gain--done' : ''}`}>
                  {item.done ? 'Done' : <><FiTrendingUp size={16} /> {item.boost}</>}
                </span>
              </div>
            );
          })}

          <button type="button" className="profile-overview-cta">
            {missingDetailsCount > 0 ? `Add ${missingDetailsCount} missing details` : 'Profile is complete'}
          </button>
        </aside>
      </section>
      {avatarMessage ? <p className="module-note">{avatarMessage}</p> : null}
      {autoSaving ? <p className="module-note">Saving latest changes...</p> : null}

      {isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {loading ? <p className="module-note">Loading profile...</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={(event) => handleSave(event, activeProfileSection)} onBlurCapture={handleFormBlurCapture}>
          <div className="full-row profile-form-tabs" role="tablist" aria-label="Student profile sections">
            {profileFormSections.map((section) => (
              <button
                key={section.key}
                type="button"
                role="tab"
                className={`profile-form-tab ${activeProfileSection === section.key ? 'is-active' : ''}`}
                aria-selected={activeProfileSection === section.key}
                onClick={() => setActiveProfileSection(section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>

          {activeProfileSection === 'personal' ? (
            <>
              <h3 className="full-row profile-form-main-title">Section 1: Personal Details</h3>

              <label className="full-row">
                Full Name
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Your full name"
                />
              </label>

          <label className="full-row">
            Email
            <input value={form.email} disabled />
          </label>

          <label className="full-row">
            Mobile
            <input
              value={form.mobile}
              onChange={(event) => updateField('mobile', event.target.value)}
              placeholder="9876543210"
            />
          </label>

          <label className="full-row">
            Date of Birth
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
            />
          </label>

          <label className="full-row">
            Gender
            <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)}>
              {genderOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="full-row">
            Caste
            <select value={form.caste} onChange={(event) => updateField('caste', event.target.value)}>
              {casteOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="full-row">
            Religion
            <select value={form.religion} onChange={(event) => updateField('religion', event.target.value)}>
              {religionOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="full-row split-grid">
            <label>
              Current Location
              <input
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
                placeholder="Bengaluru"
              />
            </label>
            <label>
              Pin Code
              <input
                value={form.currentPincode}
                onChange={(event) => updateField('currentPincode', event.target.value)}
                placeholder="560001"
              />
            </label>
          </div>

          <div className="full-row profile-input-card">
            <div className="profile-field-title">
              Preferred Work Location + Pin Code
              <div className="profile-list-add-row profile-location-add-row">
                <label className="profile-inline-field">
                  Work Location
                  <input
                    value={preferredLocationDraft}
                    onChange={(event) => setPreferredLocationDraft(event.target.value)}
                    placeholder="Mumbai"
                  />
                </label>
                <label className="profile-inline-field">
                  Pin Code
                  <input
                    value={preferredPincodeDraft}
                    onChange={(event) => setPreferredPincodeDraft(event.target.value)}
                    placeholder="400001"
                  />
                </label>
                <button type="button" className="btn-primary profile-list-add-btn" onClick={handleAddPreferredWorkLocation}>
                  Add Preferred Location
                </button>
              </div>
            </div>
            {parsedPreferredWorkLocations.length > 0 ? (
              <div className="student-chip-row profile-chip-row">
                {parsedPreferredWorkLocations.map((item, index) => (
                  <span key={`${item}-${index}`} className="student-chip profile-edit-chip">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemovePreferredWorkLocation(index)}
                      aria-label={`Remove ${item}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="full-row split-grid">
            <label>
              Permanent Address
              <input
                value={form.currentAddress}
                onChange={(event) => updateField('currentAddress', event.target.value)}
                placeholder="Permanent address"
              />
            </label>
            <label>
              Pin Code
              <input
                value={form.permanentPincode}
                onChange={(event) => updateField('permanentPincode', event.target.value)}
                placeholder="110001"
              />
            </label>
          </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="profile-photo-preview__input"
                onChange={handleAvatarUpload}
              />

              <h3 className="full-row profile-form-section-title">Profile Summary</h3>

          <label className="full-row">
            Headline
            <input
              value={form.headline}
              onChange={(event) => updateField('headline', event.target.value)}
              placeholder="Frontend Developer | React | TypeScript"
            />
          </label>

          <label>
            Target Role
            <input
              value={form.targetRole}
              onChange={(event) => updateField('targetRole', event.target.value)}
              placeholder="Software Engineer"
            />
          </label>

          <label className="full-row">
            Profile Summary
            <textarea
              rows={4}
              value={form.profileSummary}
              onChange={(event) => updateField('profileSummary', event.target.value)}
              placeholder="Write a concise summary of your profile."
            />
          </label>

              <label className="full-row">
                Career Objective
                <textarea
                  rows={3}
                  value={form.careerObjective}
                  onChange={(event) => updateField('careerObjective', event.target.value)}
                  placeholder="Write your career objective."
                />
              </label>
            </>
          ) : null}

          {activeProfileSection === 'education' ? (
            <>
              <h3 className="full-row profile-form-main-title">Section 2: Education Details</h3>

              <div className="full-row education-summary-card">
                <p>Profile completeness from education: <strong>{educationCompletion}%</strong></p>
                <button type="button" className="btn-link" onClick={handleAddEducation}>Add Education</button>
              </div>

          {educationEntries.length > 0 ? (
            <div className="full-row education-entry-list">
              {educationEntries.map((entry, index) => (
                <article key={`${entry.educationLevel}-${entry.courseName}-${index}`} className="education-entry-card">
                  <div>
                    <h4>{entry.educationLevel || 'Education Entry'} - {entry.courseName || 'Untitled'}</h4>
                    <p>
                      {entry.specialization || 'No specialization'} | {entry.instituteName || 'No institute'} |{' '}
                      {entry.educationStatus === 'completed'
                        ? `Passed: ${entry.endYear || '-'}`
                        : `Pursuing: ${entry.expectedCompletionYear || '-'}`}
                    </p>
                  </div>
                  <div className="education-entry-actions">
                    <button type="button" className="btn-link" onClick={() => handleEditEducation(index)}>Edit</button>
                    <button type="button" className="btn-link btn-link--danger" onClick={() => handleDeleteEducation(index)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <div className="full-row education-editor-grid">
            <label>
              Education Level
              <select
                value={educationDraft.educationLevel}
                onChange={(event) => updateEducationDraft('educationLevel', event.target.value)}
              >
                {educationLevelOptions.map((option) => (
                  <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="education-checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(educationDraft.isHighestQualification)}
                onChange={(event) => updateEducationDraft('isHighestQualification', event.target.checked)}
              />
              Is this your highest qualification?
            </label>

            <label>
              Course / Degree Name
              <input
                value={educationDraft.courseName}
                onChange={(event) => updateEducationDraft('courseName', event.target.value)}
                placeholder="B.Tech, BCA, MBA"
              />
            </label>

            <label>
              Specialization / Stream
              <input
                value={educationDraft.specialization}
                onChange={(event) => updateEducationDraft('specialization', event.target.value)}
                placeholder="Computer Science, Commerce"
              />
            </label>

            <label>
              University / Board
              <input
                value={educationDraft.universityBoard}
                onChange={(event) => updateEducationDraft('universityBoard', event.target.value)}
                placeholder="CBSE, Delhi University"
              />
            </label>

            <label>
              College / Institute
              <input
                value={educationDraft.instituteName}
                onChange={(event) => updateEducationDraft('instituteName', event.target.value)}
                placeholder="Institute name"
              />
            </label>

            <label>
              Start Year
              <input
                type="number"
                value={educationDraft.startYear}
                onChange={(event) => updateEducationDraft('startYear', event.target.value)}
                placeholder="2022"
              />
            </label>

            <label>
              End / Passing Year
              <input
                type="number"
                value={educationDraft.endYear}
                onChange={(event) => updateEducationDraft('endYear', event.target.value)}
                placeholder="2026"
                disabled={educationDraft.educationStatus === 'pursuing'}
              />
            </label>

            <label>
              Course Type
              <select
                value={educationDraft.courseType}
                onChange={(event) => updateEducationDraft('courseType', event.target.value)}
              >
                {courseTypeOptions.map((option) => (
                  <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              Grading System
              <select
                value={educationDraft.gradingSystem}
                onChange={(event) => updateEducationDraft('gradingSystem', event.target.value)}
              >
                {gradingSystemOptions.map((option) => (
                  <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              Marks / CGPA Value
              <input
                value={educationDraft.marksValue}
                onChange={(event) => updateEducationDraft('marksValue', event.target.value)}
                placeholder="74 or 8.2"
              />
            </label>

            <label>
              Max CGPA (optional)
              <input
                value={educationDraft.maxCgpa}
                onChange={(event) => updateEducationDraft('maxCgpa', event.target.value)}
                placeholder="10 / 4"
              />
            </label>

            <label>
              Education Status
              <select
                value={educationDraft.educationStatus}
                onChange={(event) => updateEducationDraft('educationStatus', event.target.value)}
              >
                {educationStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              Expected Completion Year
              <input
                type="number"
                value={educationDraft.expectedCompletionYear}
                onChange={(event) => updateEducationDraft('expectedCompletionYear', event.target.value)}
                placeholder="2027"
                disabled={educationDraft.educationStatus !== 'pursuing'}
              />
            </label>

            <label>
              Current Semester / Year (optional)
              <input
                value={educationDraft.currentSemester}
                onChange={(event) => updateEducationDraft('currentSemester', event.target.value)}
                placeholder="Semester 6"
              />
            </label>

            <label>
              Medium of Education (optional)
              <select
                value={educationDraft.mediumOfEducation}
                onChange={(event) => updateEducationDraft('mediumOfEducation', event.target.value)}
              >
                {mediumOptions.map((option) => (
                  <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              Backlogs (optional)
              <input
                type="number"
                value={educationDraft.backlogs}
                onChange={(event) => updateEducationDraft('backlogs', event.target.value)}
                placeholder="0"
              />
            </label>

            <label>
              Education Gap (optional)
              <input
                value={educationDraft.educationGap}
                onChange={(event) => updateEducationDraft('educationGap', event.target.value)}
                placeholder="If any gap, mention reason"
              />
            </label>
          </div>

              {educationDraftError ? <p className="form-error full-row">{educationDraftError}</p> : null}
              <div className="full-row education-editor-actions">
                <button type="button" className="btn-primary" onClick={handleSaveEducationEntry}>
                  {editingEducationIndex >= 0 ? 'Update Education' : 'Add Education'}
                </button>
                {editingEducationIndex >= 0 ? (
                  <button type="button" className="btn-link" onClick={handleAddEducation}>Cancel Edit</button>
                ) : null}
              </div>
            </>
          ) : null}

          {activeProfileSection === 'skills' ? (
            <>
              <h3 className="full-row profile-form-main-title">Section 3: Skills, Projects & Experience</h3>

              <h3 className="full-row profile-form-section-title">Key Skills</h3>

              <div className="full-row profile-input-card">
                <label>
                  Technical Skills (comma separated)
                  <input
                    value={technicalSkillsInput}
                    onChange={(event) => setTechnicalSkillsInput(event.target.value)}
                    placeholder="C, C++, Java, Python, Excel"
                  />
                </label>
                <div className="profile-list-add-row">
                  <input
                    value={technicalSkillDraft}
                    onChange={(event) => setTechnicalSkillDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCommaListItem(
                          technicalSkillDraft,
                          setTechnicalSkillDraft,
                          technicalSkillsInput,
                          setTechnicalSkillsInput
                        );
                      }
                    }}
                    placeholder="Add one technical skill"
                  />
                  <button
                    type="button"
                    className="btn-primary profile-list-add-btn"
                    onClick={() =>
                      addCommaListItem(
                        technicalSkillDraft,
                        setTechnicalSkillDraft,
                        technicalSkillsInput,
                        setTechnicalSkillsInput
                      )}
                  >
                    Add
                  </button>
                </div>
                {parsedTechnicalSkills.length > 0 ? (
                  <div className="student-chip-row profile-chip-row">
                    {parsedTechnicalSkills.map((item, index) => (
                      <span key={`${item}-${index}`} className="student-chip profile-edit-chip">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeCommaListItem(index, technicalSkillsInput, setTechnicalSkillsInput)}
                          aria-label={`Remove ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="full-row profile-input-card">
                <label>
                  Soft Skills (comma separated)
                  <input
                    value={softSkillsInput}
                    onChange={(event) => setSoftSkillsInput(event.target.value)}
                    placeholder="Communication, Teamwork, Leadership"
                  />
                </label>
                <div className="profile-list-add-row">
                  <input
                    value={softSkillDraft}
                    onChange={(event) => setSoftSkillDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCommaListItem(
                          softSkillDraft,
                          setSoftSkillDraft,
                          softSkillsInput,
                          setSoftSkillsInput
                        );
                      }
                    }}
                    placeholder="Add one soft skill"
                  />
                  <button
                    type="button"
                    className="btn-primary profile-list-add-btn"
                    onClick={() =>
                      addCommaListItem(
                        softSkillDraft,
                        setSoftSkillDraft,
                        softSkillsInput,
                        setSoftSkillsInput
                      )}
                  >
                    Add
                  </button>
                </div>
                {parsedSoftSkills.length > 0 ? (
                  <div className="student-chip-row profile-chip-row">
                    {parsedSoftSkills.map((item, index) => (
                      <span key={`${item}-${index}`} className="student-chip profile-edit-chip">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeCommaListItem(index, softSkillsInput, setSoftSkillsInput)}
                          aria-label={`Remove ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="full-row profile-input-card">
                <label>
                  Tools & Technologies (comma separated)
                  <input
                    value={toolsInput}
                    onChange={(event) => setToolsInput(event.target.value)}
                    placeholder="MS Office, AutoCAD, Tally"
                  />
                </label>
                <div className="profile-list-add-row">
                  <input
                    value={toolsDraft}
                    onChange={(event) => setToolsDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCommaListItem(
                          toolsDraft,
                          setToolsDraft,
                          toolsInput,
                          setToolsInput
                        );
                      }
                    }}
                    placeholder="Add one tool/technology"
                  />
                  <button
                    type="button"
                    className="btn-primary profile-list-add-btn"
                    onClick={() =>
                      addCommaListItem(
                        toolsDraft,
                        setToolsDraft,
                        toolsInput,
                        setToolsInput
                      )}
                  >
                    Add
                  </button>
                </div>
                {parsedTools.length > 0 ? (
                  <div className="student-chip-row profile-chip-row">
                    {parsedTools.map((item, index) => (
                      <span key={`${item}-${index}`} className="student-chip profile-edit-chip">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeCommaListItem(index, toolsInput, setToolsInput)}
                          aria-label={`Remove ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <h3 className="full-row profile-form-section-title">Projects</h3>

              <div className="full-row profile-input-card">
                <label>
                  Projects (one line per entry)
                  <textarea
                    rows={4}
                    value={projectsInput}
                    onChange={(event) => setProjectsInput(event.target.value)}
                    placeholder="Final Year Project | Description | Technologies Used"
                  />
                </label>
                <div className="profile-list-add-row">
                  <input
                    value={projectDraft}
                    onChange={(event) => setProjectDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleAddProject();
                      }
                    }}
                    placeholder="Add one project and click Add"
                  />
                  <button type="button" className="btn-primary profile-list-add-btn" onClick={handleAddProject}>
                    Add
                  </button>
                </div>
                {parsedProjects.length > 0 ? (
                  <ul className="student-list profile-edit-list">
                    {parsedProjects.map((item, index) => (
                      <li key={`${item}-${index}`}>
                        <span>{item}</span>
                        <button type="button" className="btn-link btn-link--danger" onClick={() => handleRemoveProject(index)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

          <h3 className="full-row profile-form-section-title">Internship / Training</h3>

          <label className="full-row">
            Internship / Training (one line per entry)
            <textarea
              rows={4}
              value={internshipsInput}
              onChange={(event) => setInternshipsInput(event.target.value)}
              placeholder="Company | Duration | Role / Responsibilities | Certificate"
            />
          </label>

          <h3 className="full-row profile-form-section-title">Work Experience</h3>

          <label className="full-row">
            Experience (one line per entry)
            <textarea
              rows={4}
              value={experienceInput}
              onChange={(event) => setExperienceInput(event.target.value)}
              placeholder="Company | Designation | Duration | Responsibilities"
            />
          </label>

          <h3 className="full-row profile-form-section-title">Certifications</h3>

          <label className="full-row">
            Certifications (one line per entry)
            <textarea
              rows={4}
              value={certificationsInput}
              onChange={(event) => setCertificationsInput(event.target.value)}
              placeholder="Coursera/Udemy/NPTEL | Certificate name | Year"
            />
          </label>

          <h3 className="full-row profile-form-section-title">Achievements</h3>

          <label className="full-row">
            Achievements (one line per entry)
            <textarea
              rows={4}
              value={achievementsInput}
              onChange={(event) => setAchievementsInput(event.target.value)}
              placeholder="Awards, competitions, scholarships, hackathons"
            />
          </label>

          <h3 className="full-row profile-form-section-title">Languages Known</h3>

              <label className="full-row">
                Languages (comma separated)
                <input
                  value={languagesInput}
                  onChange={(event) => setLanguagesInput(event.target.value)}
                  placeholder="Hindi, English, Other"
                />
              </label>
            </>
          ) : null}

          {activeProfileSection === 'resume' ? (
            <>
              <h3 className="full-row profile-form-main-title">Section 4: Resume & Preferences</h3>

          <h3 className="full-row profile-form-section-title">Resume Upload</h3>

          <label className="full-row">
            Upload Resume (PDF/DOC/DOCX)
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResumeUpload}
            />
          </label>

          <label>
            Resume URL
            <input
              value={form.resumeUrl}
              onChange={(event) => updateField('resumeUrl', event.target.value)}
              placeholder="https://example.com/resume.pdf"
            />
          </label>

          <label>
            Portfolio URL
            <input
              value={form.portfolioUrl}
              onChange={(event) => updateField('portfolioUrl', event.target.value)}
              placeholder="https://portfolio.example"
            />
          </label>

          <label>
            GitHub URL
            <input
              value={form.githubUrl}
              onChange={(event) => updateField('githubUrl', event.target.value)}
              placeholder="https://github.com/username"
            />
          </label>

          <label>
            LinkedIn URL
            <input
              value={form.linkedinUrl}
              onChange={(event) => updateField('linkedinUrl', event.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </label>

          <label>
            Facebook URL
            <input
              value={form.facebookUrl}
              onChange={(event) => updateField('facebookUrl', event.target.value)}
              placeholder="https://facebook.com/username"
            />
          </label>

          <label>
            Instagram URL
            <input
              value={form.instagramUrl}
              onChange={(event) => updateField('instagramUrl', event.target.value)}
              placeholder="https://instagram.com/username"
            />
          </label>

          <label>
            Eimager ID
            <input
              value={form.eimagerId}
              onChange={(event) => updateField('eimagerId', event.target.value)}
              placeholder="Enter your Eimager ID"
            />
          </label>

          <label className="full-row">
            Resume Text
            <textarea
              rows={8}
              value={form.resumeText}
              onChange={(event) => updateField('resumeText', event.target.value)}
              placeholder="Paste parsed resume text for ATS analysis"
            />
          </label>

          <div className="full-row resume-builder-card">
            <div className="resume-builder-head">
              <div className="resume-builder-head-row">
                <h4>Auto Resume Builder</h4>
                <span className="resume-builder-chip">Profile Powered</span>
              </div>
              <p>Generate a full resume draft directly from your profile details.</p>
            </div>
            <div className="resume-builder-actions">
              <button type="button" className="btn-primary resume-builder-btn" onClick={handleBuildResumeFromProfile} disabled={resumeBuilderSaving}>
                Build Resume From Profile
              </button>
              <button
                type="button"
                className="resume-builder-btn resume-builder-btn--ghost"
                onClick={handleUseGeneratedResume}
                disabled={!generatedResumeText || resumeBuilderSaving}
              >
                Use in Resume Text
              </button>
              <button
                type="button"
                className="btn-primary resume-builder-btn"
                onClick={handleSaveGeneratedResumeToProfile}
                disabled={!generatedResumeText || resumeBuilderSaving}
              >
                {resumeBuilderSaving ? 'Saving...' : 'Save to Profile'}
              </button>
              <button
                type="button"
                className="resume-builder-btn resume-builder-btn--ghost"
                onClick={handleDownloadGeneratedResume}
                disabled={!generatedResumeText || resumeBuilderSaving}
              >
                Download .txt
              </button>
            </div>
            {generatedResumeText ? (
              <div className="resume-builder-preview-wrap">
                <div className="resume-builder-preview-head">
                  <strong>Generated Resume Draft</strong>
                  <span>{generatedResumeLineCount} lines</span>
                </div>
                {generatedResumePreview ? (
                  <div className="resume-builder-preview">
                    <header className="resume-preview-header">
                      <h5>{generatedResumePreview.name || 'Candidate Name'}</h5>
                      {generatedResumePreview.role ? <p>{generatedResumePreview.role}</p> : null}
                      {generatedResumePreview.contact ? <small>{generatedResumePreview.contact}</small> : null}
                    </header>
                    <div className="resume-preview-sections">
                      {generatedResumePreview.sections.map((section) => (
                        <section key={section.title} className="resume-preview-section">
                          <h6>{section.title}</h6>
                          {section.content.some((item) => item.startsWith('- ')) ? (
                            <ul>
                              {section.content.map((item, itemIndex) => (
                                <li key={`${section.title}-${itemIndex}`}>{item.replace(/^- /, '')}</li>
                              ))}
                            </ul>
                          ) : (
                            section.content.map((item, itemIndex) => (
                              <p key={`${section.title}-${itemIndex}`}>{item}</p>
                            ))
                          )}
                        </section>
                      ))}
                    </div>
                  </div>
                ) : (
                  <pre className="resume-builder-preview">{generatedResumeText}</pre>
                )}
              </div>
            ) : (
              <p className="module-note">Click "Build Resume From Profile" to preview your generated resume.</p>
            )}
          </div>

          <h3 className="full-row profile-form-section-title">Additional Details</h3>

          <label>
            Expected Salary
            <input
              type="number"
              value={form.expectedSalary}
              onChange={(event) => updateField('expectedSalary', event.target.value)}
            />
          </label>

          <label>
            Preferred Job Type
            <select value={form.preferredJobType} onChange={(event) => updateField('preferredJobType', event.target.value)}>
              {preferredJobTypeOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label>
            Availability to Join
            <input
              value={form.availabilityToJoin}
              onChange={(event) => updateField('availabilityToJoin', event.target.value)}
              placeholder="Immediate / 15 days / 30 days"
            />
          </label>

          <label>
            Willing to Relocate
            <select value={String(form.willingToRelocate)} onChange={(event) => updateField('willingToRelocate', event.target.value)}>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <label>
            Preferred Salary Min
            <input
              type="number"
              value={form.preferredSalaryMin}
              onChange={(event) => updateField('preferredSalaryMin', event.target.value)}
            />
          </label>

          <label>
            Preferred Salary Max
            <input
              type="number"
              value={form.preferredSalaryMax}
              onChange={(event) => updateField('preferredSalaryMax', event.target.value)}
            />
          </label>

              <label>
                Notice Period (days)
                <input
                  type="number"
                  value={form.noticePeriodDays}
                  onChange={(event) => updateField('noticePeriodDays', event.target.value)}
                />
              </label>
            </>
          ) : null}

          {error ? <p className="form-error full-row">{error}</p> : null}
          {success ? <p className="form-success full-row">{success}</p> : null}

          <div className="full-row profile-save-row">
            <button type="submit" className="btn-primary profile-save-btn" disabled={saving}>
              {saving
                ? 'Saving...'
                : `Save ${profileFormSections.find((section) => section.key === activeProfileSection)?.label || 'Section'}`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default StudentProfilePage;

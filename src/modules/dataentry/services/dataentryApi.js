import { apiFetch } from '../../../utils/api';

const DATA_ENTRY_BASE = '/dataentry';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const clone = (value) => {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
};

const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

const safeRequest = async ({ path, options, emptyData, extract = (payload) => payload, fallbackData }) => {
  try {
    const data = await strictRequest({ path, options, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    const resolvedFallback = typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    return {
      data: clone(resolvedFallback !== undefined ? resolvedFallback : emptyData),
      isDemo: true,
      error: error.message || 'Request failed.'
    };
  }
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

const readCollection = async ({ path, key, params = {}, emptyData = [], fallbackData }) => {
  const query = buildQueryString(params);

  return safeRequest({
    path: `${path}${query ? `?${query}` : ''}`,
    emptyData,
    fallbackData,
    extract: (payload) => payload?.[key] || emptyData
  });
};

const createItem = async ({ path, key, body, fallbackFactory }) => {
  try {
    return await strictRequest({
      path,
      options: { method: 'POST', body: JSON.stringify(body) },
      extract: (payload) => payload?.[key] || payload
    });
  } catch (error) {
    if (!fallbackFactory) throw error;
    return fallbackFactory(body);
  }
};

const updateItem = async ({ path, key, body, fallbackFactory }) => {
  try {
    return await strictRequest({
      path,
      options: { method: 'PATCH', body: JSON.stringify(body) },
      extract: (payload) => payload?.[key] || payload
    });
  } catch (error) {
    if (!fallbackFactory) throw error;
    return fallbackFactory(body);
  }
};

const uploadFormData = async ({ path, key, formData, fallbackFactory }) => {
  try {
    return await strictRequest({
      path,
      options: { method: 'POST', body: formData },
      extract: (payload) => payload?.[key] || payload
    });
  } catch (error) {
    if (!fallbackFactory) throw error;
    return fallbackFactory(formData);
  }
};

export const defaultEntryFilters = {
  search: '',
  type: '',
  status: '',
  assignedTo: ''
};

export const defaultJobEntryDraft = {
  title: '',
  companyName: '',
  location: '',
  salaryMin: '',
  salaryMax: '',
  employmentType: 'Full-Time',
  experienceLevel: 'Entry',
  description: '',
  skillsInput: ''
};

export const defaultPropertyEntryDraft = {
  title: '',
  propertyType: 'Office',
  location: '',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  description: ''
};

export const defaultProfileDraft = {
  name: 'Data Entry Operator',
  email: 'operator@hhh-jobs.com',
  mobile: '9876543210',
  employeeId: 'DE-1007',
  shift: 'Morning',
  location: 'Gurugram',
  headline: 'Data quality and employer onboarding operations',
  dailyTarget: '25',
  notes: 'Focus on duplicate control and employer job posting hygiene.'
};

const parseListInput = (value = '') =>
  String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const formatJobEntryPayload = (draft = {}) => ({
  type: 'job',
  title: draft.title,
  companyName: draft.companyName,
  location: draft.location,
  salaryMin: draft.salaryMin ? Number(draft.salaryMin) : null,
  salaryMax: draft.salaryMax ? Number(draft.salaryMax) : null,
  employmentType: draft.employmentType,
  experienceLevel: draft.experienceLevel,
  description: draft.description,
  skills: parseListInput(draft.skillsInput)
});

export const formatPropertyEntryPayload = (draft = {}) => ({
  type: 'property',
  title: draft.title,
  propertyType: draft.propertyType,
  location: draft.location,
  price: draft.price ? Number(draft.price) : null,
  area: draft.area ? Number(draft.area) : null,
  bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
  bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
  description: draft.description
});

export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const today = new Date('2026-03-10T11:30:00');
const dayMs = 24 * 60 * 60 * 1000;
const isoDaysAgo = (days, hour = 10) => {
  const date = new Date(today.getTime() - dayMs * days);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

const demoEntries = [
  {
    id: 'DE-ENT-1001',
    type: 'job',
    title: 'Field Sales Executive',
    companyName: 'Metro Build Infra',
    location: 'Noida',
    status: 'draft',
    assignedTo: 'Priya',
    candidateName: 'Aman Verma',
    candidateId: 'CAND-2101',
    companyDetailsAdded: true,
    hrContactAdded: true,
    jobOpeningAdded: true,
    resumeUploaded: true,
    detailsUpdated: true,
    duplicateFlag: false,
    errorCount: 0,
    createdAt: isoDaysAgo(0, 9),
    updatedAt: isoDaysAgo(0, 11),
    description: 'Sales hiring entry for NCR field operations.',
    salaryMin: 250000,
    salaryMax: 420000,
    employmentType: 'Full-Time',
    experienceLevel: 'Entry',
    skills: ['Sales', 'Lead generation', 'Field work'],
    imageCount: 2
  },
  {
    id: 'DE-ENT-1002',
    type: 'job',
    title: 'Backend Support Engineer',
    companyName: 'Prime Skill Labs',
    location: 'Gurugram',
    status: 'pending',
    assignedTo: 'Priya',
    candidateName: 'Nikhil Joshi',
    candidateId: 'CAND-2102',
    companyDetailsAdded: true,
    hrContactAdded: true,
    jobOpeningAdded: true,
    resumeUploaded: true,
    detailsUpdated: true,
    duplicateFlag: false,
    errorCount: 1,
    createdAt: isoDaysAgo(1, 13),
    updatedAt: isoDaysAgo(0, 15),
    description: 'Job entry awaiting QA review for employer publication.',
    salaryMin: 380000,
    salaryMax: 640000,
    employmentType: 'Full-Time',
    experienceLevel: 'Mid',
    skills: ['Node.js', 'SQL', 'Support'],
    imageCount: 0
  },
  {
    id: 'DE-ENT-1003',
    type: 'property',
    title: 'Commercial Office Space',
    companyName: 'Northstar Services',
    location: 'Delhi',
    status: 'approved',
    assignedTo: 'Arjun',
    candidateName: '',
    candidateId: '',
    companyDetailsAdded: true,
    hrContactAdded: false,
    jobOpeningAdded: false,
    resumeUploaded: false,
    detailsUpdated: true,
    duplicateFlag: false,
    errorCount: 0,
    createdAt: isoDaysAgo(2, 10),
    updatedAt: isoDaysAgo(1, 12),
    description: 'Property listing approved after review.',
    propertyType: 'Office',
    price: 15000000,
    area: 2800,
    bedrooms: 0,
    bathrooms: 2,
    imageCount: 6
  },
  {
    id: 'DE-ENT-1004',
    type: 'job',
    title: 'District Coordinator',
    companyName: 'Gov Hiring Cell',
    location: 'Rohtak',
    status: 'rejected',
    assignedTo: 'Arjun',
    candidateName: 'Sanya Malik',
    candidateId: 'CAND-2104',
    companyDetailsAdded: true,
    hrContactAdded: true,
    jobOpeningAdded: true,
    resumeUploaded: true,
    detailsUpdated: false,
    duplicateFlag: true,
    errorCount: 2,
    createdAt: isoDaysAgo(3, 9),
    updatedAt: isoDaysAgo(2, 17),
    description: 'Rejected because of duplicate employer data and missing contact validation.',
    salaryMin: 300000,
    salaryMax: 500000,
    employmentType: 'Contract',
    experienceLevel: 'Mid',
    skills: ['Coordination', 'Field operations'],
    imageCount: 1
  },
  {
    id: 'DE-ENT-1005',
    type: 'job',
    title: 'HR Associate',
    companyName: 'Zenith Careers',
    location: 'Faridabad',
    status: 'approved',
    assignedTo: 'Priya',
    candidateName: 'Kriti Arora',
    candidateId: 'CAND-2105',
    companyDetailsAdded: true,
    hrContactAdded: true,
    jobOpeningAdded: true,
    resumeUploaded: true,
    detailsUpdated: true,
    duplicateFlag: false,
    errorCount: 0,
    createdAt: isoDaysAgo(4, 14),
    updatedAt: isoDaysAgo(2, 10),
    description: 'Employer job entry completed and approved.',
    salaryMin: 320000,
    salaryMax: 550000,
    employmentType: 'Full-Time',
    experienceLevel: 'Entry',
    skills: ['Recruitment', 'Excel', 'Coordination'],
    imageCount: 0
  }
];

const demoTasks = [
  {
    id: 'TASK-301',
    title: 'Validate duplicate employer profiles',
    priority: 'high',
    status: 'pending',
    dueAt: isoDaysAgo(-1, 16),
    queue: 'Quality review',
    owner: 'Priya'
  },
  {
    id: 'TASK-302',
    title: 'Upload property gallery images',
    priority: 'medium',
    status: 'scheduled',
    dueAt: isoDaysAgo(0, 18),
    queue: 'Media',
    owner: 'Priya'
  },
  {
    id: 'TASK-303',
    title: 'Correct salary range mismatch',
    priority: 'critical',
    status: 'pending',
    dueAt: isoDaysAgo(0, 14),
    queue: 'Job QA',
    owner: 'Arjun'
  }
];

const demoNotifications = [
  {
    id: 'NOTE-501',
    title: 'Duplicate risk detected',
    message: 'District Coordinator entry needs employer merge review.',
    status: 'unread',
    createdAt: isoDaysAgo(0, 13)
  },
  {
    id: 'NOTE-502',
    title: 'Entry approved',
    message: 'Commercial Office Space listing passed final review.',
    status: 'read',
    createdAt: isoDaysAgo(1, 11)
  },
  {
    id: 'NOTE-503',
    title: 'Resume parsing complete',
    message: 'Candidate records are ready for ID generation.',
    status: 'unread',
    createdAt: isoDaysAgo(0, 10)
  }
];

const demoProfile = {
  ...defaultProfileDraft,
  name: 'Priya Sharma',
  email: 'priya.sharma@hhh-jobs.com',
  employeeId: 'DE-1107',
  location: 'Noida',
  shift: 'Morning',
  dailyTarget: '30',
  notes: 'Prioritize pending job entries and duplicate cleanup before end-of-day QA.'
};

const buildDashboardFromEntries = () => {
  const entries = demoEntries;
  const candidatesAdded = entries.filter((item) => item.candidateId).length;
  const jobsPosted = entries.filter((item) => item.type === 'job').length;
  const companiesAdded = new Set(entries.map((item) => item.companyName).filter(Boolean)).size;
  const hrContactsAdded = entries.filter((item) => item.hrContactAdded).length;

  return {
    totals: {
      candidatesAdded,
      jobsPosted,
      companiesAdded,
      hrContactsAdded,
      totalEntries: entries.length
    },
    candidateWorkflow: {
      profileCreated: candidatesAdded,
      resumeUploaded: entries.filter((item) => item.resumeUploaded).length,
      detailsUpdated: entries.filter((item) => item.detailsUpdated).length,
      candidateIdsGenerated: candidatesAdded
    },
    companyWorkflow: {
      companyDetailsAdded: entries.filter((item) => item.companyDetailsAdded).length,
      hrContactsAdded,
      jobOpeningsAdded: entries.filter((item) => item.jobOpeningAdded).length
    },
    pipeline: {
      applied: 18,
      shortlisted: 9,
      interview: 5,
      selected: 3,
      rejected: 2
    },
    quality: {
      errors: entries.reduce((sum, item) => sum + Number(item.errorCount || 0), 0),
      duplicateEntries: entries.filter((item) => item.duplicateFlag).length,
      pendingReview: entries.filter((item) => item.status === 'pending').length,
      approved: entries.filter((item) => item.status === 'approved').length,
      drafts: entries.filter((item) => item.status === 'draft').length
    },
    activityFeed: [
      {
        id: 'ACT-701',
        title: 'Candidate profile created',
        description: 'Aman Verma profile entered and candidate ID generated.',
        time: formatDateTime(isoDaysAgo(0, 9)),
        status: 'approved'
      },
      {
        id: 'ACT-702',
        title: 'Job entry moved to pending',
        description: 'Backend Support Engineer record sent for QA review.',
        time: formatDateTime(isoDaysAgo(0, 15)),
        status: 'pending'
      },
      {
        id: 'ACT-703',
        title: 'Duplicate issue flagged',
        description: 'District Coordinator entry needs correction before approval.',
        time: formatDateTime(isoDaysAgo(2, 17)),
        status: 'rejected'
      }
    ]
  };
};

const buildPortalRecords = () => {
  const jobEntries = demoEntries.filter((item) => item.type === 'job');
  const candidates = demoEntries
    .filter((item) => item.candidateId)
    .map((item) => ({
      id: item.candidateId,
      name: item.candidateName || 'Candidate',
      sourceEntryId: item.id,
      jobTitle: item.title,
      companyName: item.companyName,
      location: item.location,
      resumeUploaded: item.resumeUploaded,
      detailsUpdated: item.detailsUpdated,
      status: item.status,
      createdAt: item.createdAt
    }));

  const companies = Array.from(
    new Map(
      demoEntries
        .filter((item) => item.companyName)
        .map((item) => [
          item.companyName,
          {
            id: `CMP-${item.companyName.replace(/\s+/g, '-').toUpperCase()}`,
            companyName: item.companyName,
            location: item.location,
            totalEntries: demoEntries.filter((entry) => entry.companyName === item.companyName).length,
            hrContactAdded: Boolean(item.hrContactAdded),
            latestStatus: item.status
          }
        ])
    ).values()
  );

  return {
    summary: {
      totalJobs: jobEntries.length,
      totalCandidates: candidates.length,
      totalCompanies: companies.length,
      totalNotifications: demoNotifications.length
    },
    jobs: jobEntries,
    candidates,
    companies,
    notifications: demoNotifications,
    queue: {
      drafts: demoEntries.filter((item) => item.status === 'draft'),
      pending: demoEntries.filter((item) => item.status === 'pending'),
      approved: demoEntries.filter((item) => item.status === 'approved'),
      rejected: demoEntries.filter((item) => item.status === 'rejected')
    }
  };
};

const filterEntries = (entries, filters = {}) => {
  const search = String(filters.search || '').trim().toLowerCase();
  const type = String(filters.type || '').trim().toLowerCase();
  const status = String(filters.status || '').trim().toLowerCase();
  const assignedTo = String(filters.assignedTo || '').trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesSearch = !search || `${entry.id} ${entry.title} ${entry.companyName} ${entry.location} ${entry.candidateName} ${entry.candidateId}`.toLowerCase().includes(search);
    const matchesType = !type || String(entry.type || '').toLowerCase() === type;
    const matchesStatus = !status || String(entry.status || '').toLowerCase() === status;
    const matchesAssigned = !assignedTo || String(entry.assignedTo || '').toLowerCase().includes(assignedTo);
    return matchesSearch && matchesType && matchesStatus && matchesAssigned;
  });
};

export const getDataEntryDashboard = async () =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/dashboard`,
    emptyData: buildDashboardFromEntries(),
    fallbackData: buildDashboardFromEntries,
    extract: (payload) => payload?.dashboard || payload || {}
  });

export const getDataEntryEntries = async (filters = {}) =>
  readCollection({
    path: `${DATA_ENTRY_BASE}/entries`,
    key: 'entries',
    params: filters,
    emptyData: [],
    fallbackData: () => filterEntries(demoEntries, filters)
  });

export const getDataEntryEntryById = async (entryId) =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/entries/${entryId}`,
    emptyData: {},
    fallbackData: () => demoEntries.find((item) => item.id === entryId) || demoEntries[0] || {},
    extract: (payload) => payload?.entry || payload || {}
  });

export const createJobEntry = async (draft) =>
  createItem({
    path: `${DATA_ENTRY_BASE}/jobs`,
    key: 'entry',
    body: formatJobEntryPayload(draft),
    fallbackFactory: (payload) => ({
      id: `DE-ENT-${Date.now()}`,
      status: 'draft',
      assignedTo: demoProfile.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      errorCount: 0,
      duplicateFlag: false,
      imageCount: 0,
      ...payload
    })
  });

export const createPropertyEntry = async (draft) =>
  createItem({
    path: `${DATA_ENTRY_BASE}/properties`,
    key: 'entry',
    body: formatPropertyEntryPayload(draft),
    fallbackFactory: (payload) => ({
      id: `DE-ENT-${Date.now()}`,
      status: 'draft',
      assignedTo: demoProfile.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      errorCount: 0,
      duplicateFlag: false,
      imageCount: 0,
      ...payload
    })
  });

export const updateDataEntry = async (entryId, payload) =>
  updateItem({
    path: `${DATA_ENTRY_BASE}/entries/${entryId}`,
    key: 'entry',
    body: payload,
    fallbackFactory: (patch) => ({
      ...(demoEntries.find((item) => item.id === entryId) || {}),
      ...patch,
      id: entryId,
      updatedAt: new Date().toISOString()
    })
  });

export const uploadEntryImages = async (entryId, files = []) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  return uploadFormData({
    path: `${DATA_ENTRY_BASE}/entries/${entryId}/images`,
    key: 'images',
    formData,
    fallbackFactory: (input) => Array.from(input.getAll('images')).map((file, index) => ({
      id: `${entryId}-IMG-${index + 1}`,
      name: file?.name || `upload-${index + 1}.jpg`
    }))
  });
};

export const getDraftEntries = async (filters = {}) =>
  readCollection({
    path: `${DATA_ENTRY_BASE}/entries/drafts`,
    key: 'entries',
    params: filters,
    emptyData: [],
    fallbackData: () => filterEntries(demoEntries, { ...filters, status: 'draft' })
  });

export const getPendingEntries = async (filters = {}) =>
  readCollection({
    path: `${DATA_ENTRY_BASE}/entries/pending`,
    key: 'entries',
    params: filters,
    emptyData: [],
    fallbackData: () => filterEntries(demoEntries, { ...filters, status: 'pending' })
  });

export const getApprovedEntries = async (filters = {}) =>
  readCollection({
    path: `${DATA_ENTRY_BASE}/entries/approved`,
    key: 'entries',
    params: filters,
    emptyData: [],
    fallbackData: () => filterEntries(demoEntries, { ...filters, status: 'approved' })
  });

export const getRejectedEntries = async (filters = {}) =>
  readCollection({
    path: `${DATA_ENTRY_BASE}/entries/rejected`,
    key: 'entries',
    params: filters,
    emptyData: [],
    fallbackData: () => filterEntries(demoEntries, { ...filters, status: 'rejected' })
  });

export const getAssignedTasks = async () =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/tasks/assigned`,
    emptyData: [],
    fallbackData: demoTasks,
    extract: (payload) => payload?.tasks || []
  });

export const getDataEntryNotifications = async () =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/notifications`,
    emptyData: [],
    fallbackData: demoNotifications,
    extract: (payload) => payload?.notifications || []
  });

export const markDataEntryNotificationRead = async (notificationId) =>
  updateItem({
    path: `${DATA_ENTRY_BASE}/notifications/${notificationId}/read`,
    key: 'notification',
    body: { status: 'read' },
    fallbackFactory: () => ({
      ...(demoNotifications.find((item) => item.id === notificationId) || {}),
      id: notificationId,
      status: 'read'
    })
  });

export const getDataEntryProfile = async () =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/profile`,
    emptyData: defaultProfileDraft,
    fallbackData: demoProfile,
    extract: (payload) => payload?.profile || payload || {}
  });

export const getDataEntryPortalRecords = async () =>
  safeRequest({
    path: `${DATA_ENTRY_BASE}/records`,
    emptyData: buildPortalRecords(),
    fallbackData: buildPortalRecords,
    extract: (payload) => payload?.records || payload || {}
  });

export const updateDataEntryProfile = async (profilePayload) =>
  updateItem({
    path: `${DATA_ENTRY_BASE}/profile`,
    key: 'profile',
    body: profilePayload,
    fallbackFactory: (payload) => ({ ...demoProfile, ...payload })
  });

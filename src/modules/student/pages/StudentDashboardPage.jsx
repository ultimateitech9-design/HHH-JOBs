import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import { generateRetiredEmployeeId, generateStudentCandidateId } from '../../../utils/hrIdentity';
import {
  applyToJob,
  getStudentApplications,
  getStudentDashboardOverview,
  getStudentJobs,
  getStudentSavedJobs,
  removeSavedJobForStudent,
  saveJobForStudent
} from '../services/studentApi';

const defaultOverview = {
  loading: true,
  error: '',
  isDemo: false,
  profile: null,
  profileCompletion: 0,
  counters: {
    totalApplications: 0,
    savedJobs: 0,
    upcomingInterviews: 0,
    unreadNotifications: 0,
    atsChecks: 0
  },
  pipeline: {
    applied: 0,
    shortlisted: 0,
    interviewed: 0,
    offered: 0,
    rejected: 0,
    hired: 0,
    moved: 0
  },
  interviews: [],
  notifications: []
};

const defaultFilters = {
  search: '',
  location: '',
  employmentType: '',
  experienceLevel: '',
  workMode: '',
  department: '',
  salaryRange: '',
  education: '',
  audience: '',
  page: 1,
  limit: 6
};

const departmentOptions = [
  { value: 'engineering-hardware', label: 'Engineering - Hardware & Networks', count: 2149, keywords: ['hardware', 'network', 'embedded', 'electrical', 'electronics'] },
  { value: 'engineering-software', label: 'Engineering - Software & QA', count: 24606, keywords: ['software', 'developer', 'qa', 'testing', 'engineer'] },
  { value: 'it-security', label: 'IT & Information Security', count: 5041, keywords: ['it', 'information security', 'cyber', 'security', 'infrastructure'] },
  { value: 'sales-business', label: 'Sales & Business Development', count: 17324, keywords: ['sales', 'business development', 'bde', 'lead generation'] },
  { value: 'customer-success', label: 'Customer Success, Service & Operations', count: 11423, keywords: ['customer success', 'customer support', 'service', 'operations', 'client support'] },
  { value: 'finance-accounting', label: 'Finance & Accounting', count: 7734, keywords: ['finance', 'accounting', 'accounts', 'auditor', 'tax'] },
  { value: 'bfsi', label: 'BFSI, Investments & Trading', count: 7361, keywords: ['bfsi', 'banking', 'investment', 'trading', 'insurance'] },
  { value: 'production', label: 'Production, Manufacturing & Engineering', count: 6635, keywords: ['production', 'manufacturing', 'plant', 'industrial', 'machine'] },
  { value: 'human-resources', label: 'Human Resources', count: 5562, keywords: ['human resources', 'hr', 'talent acquisition', 'recruitment'] },
  { value: 'other', label: 'Other', count: 5223, keywords: ['associate', 'executive', 'coordinator'] },
  { value: 'marketing', label: 'Marketing & Communication', count: 4514, keywords: ['marketing', 'communication', 'brand', 'digital marketing', 'seo'] },
  { value: 'healthcare', label: 'Healthcare & Life Sciences', count: 4168, keywords: ['healthcare', 'medical', 'life sciences', 'pharma', 'clinical'] },
  { value: 'data-science', label: 'Data Science & Analytics', count: 3814, keywords: ['data science', 'data analyst', 'analytics', 'machine learning', 'bi'] },
  { value: 'teaching', label: 'Teaching & Training', count: 3420, keywords: ['teaching', 'trainer', 'faculty', 'education', 'instructor'] },
  { value: 'consulting', label: 'Consulting', count: 3242, keywords: ['consulting', 'consultant', 'advisory', 'strategy'] },
  { value: 'procurement', label: 'Procurement & Supply Chain', count: 2965, keywords: ['procurement', 'supply chain', 'warehouse', 'inventory', 'logistics'] },
  { value: 'construction', label: 'Construction & Site Engineering', count: 2722, keywords: ['construction', 'site engineer', 'civil', 'site', 'project engineer'] },
  { value: 'project-program', label: 'Project & Program Management', count: 2480, keywords: ['project management', 'program management', 'pmo', 'delivery manager'] },
  { value: 'administration', label: 'Administration & Facilities', count: 2080, keywords: ['administration', 'facilities', 'office admin', 'admin executive'] },
  { value: 'ux-design', label: 'UX, Design & Architecture', count: 2051, keywords: ['ux', 'ui', 'design', 'architect', 'graphics'] },
  { value: 'food-beverage', label: 'Food, Beverage & Hospitality', count: 2016, keywords: ['food', 'beverage', 'hospitality', 'hotel', 'restaurant'] },
  { value: 'quality-assurance', label: 'Quality Assurance', count: 1677, keywords: ['quality assurance', 'quality control', 'qa', 'compliance'] },
  { value: 'research-development', label: 'Research & Development', count: 1360, keywords: ['research', 'r&d', 'development lab', 'innovation'] },
  { value: 'legal', label: 'Legal & Regulatory', count: 805, keywords: ['legal', 'regulatory', 'compliance', 'law'] },
  { value: 'merchandising', label: 'Merchandising, Retail & eCommerce', count: 749, keywords: ['merchandising', 'retail', 'ecommerce', 'category manager'] },
  { value: 'product-management', label: 'Product Management', count: 700, keywords: ['product management', 'product manager', 'product owner'] },
  { value: 'content-editorial', label: 'Content, Editorial & Journalism', count: 587, keywords: ['content', 'editorial', 'journalism', 'writer', 'copywriter'] },
  { value: 'risk-management', label: 'Risk Management & Compliance', count: 507, keywords: ['risk', 'compliance', 'governance', 'audit'] },
  { value: 'strategic-management', label: 'Strategic & Top Management', count: 424, keywords: ['strategy', 'top management', 'business head', 'director'] },
  { value: 'environment', label: 'Environment Health & Safety', count: 344, keywords: ['environment', 'health and safety', 'ehs', 'safety officer'] },
  { value: 'media-production', label: 'Media Production & Entertainment', count: 322, keywords: ['media', 'production', 'entertainment', 'video', 'creative producer'] },
  { value: 'security-services', label: 'Security Services', count: 242, keywords: ['security guard', 'security services', 'surveillance'] },
  { value: 'sports-fitness', label: 'Sports, Fitness & Personal Care', count: 188, keywords: ['sports', 'fitness', 'gym', 'wellness', 'personal care'] },
  { value: 'energy-mining', label: 'Energy & Mining', count: 151, keywords: ['energy', 'mining', 'oil', 'gas', 'power plant'] },
  { value: 'aviation', label: 'Aviation & Aerospace', count: 89, keywords: ['aviation', 'aerospace', 'aircraft', 'airport'] },
  { value: 'csr', label: 'CSR & Social Service', count: 88, keywords: ['csr', 'social service', 'ngo', 'community'] },
  { value: 'shipping', label: 'Shipping & Maritime', count: 37, keywords: ['shipping', 'maritime', 'marine', 'port'] }
];

const salaryOptions = [
  { value: '0-3', label: '0-3 Lakhs', count: 3270 },
  { value: '3-6', label: '3-6 Lakhs', count: 10953 },
  { value: '6-10', label: '6-10 Lakhs', count: 15287 },
  { value: '10-15', label: '10-15 Lakhs', count: 11965 },
  { value: '15-25', label: '15-25 Lakhs', count: 10987 },
  { value: '25-50', label: '25-50 Lakhs', count: 6099 },
  { value: '50-75', label: '50-75 Lakhs', count: 667 },
  { value: '75-100', label: '75-100 Lakhs', count: 136 },
  { value: '100-500', label: '1-5 Cr', count: 46 },
  { value: '500-plus', label: '5+ Cr', count: 3 }
];

const educationOptions = [
  { value: 'any-postgraduate', label: 'Any Postgraduate', count: 18362, keywords: ['postgraduate', 'post graduate', 'master', 'm.tech', 'mba', 'mca', 'm.com', 'mcm'] },
  { value: 'mtech', label: 'M.Tech', count: 1367, keywords: ['m.tech', 'mtech', 'master of technology'] },
  { value: 'mca', label: 'MCA', count: 1331, keywords: ['mca', 'master of computer applications'] },
  { value: 'ms-msc', label: 'MS/M.Sc (Science)', count: 848, keywords: ['ms', 'm.sc', 'msc', 'master of science'] },
  { value: 'mba-pgdm', label: 'MBA/PGDM', count: 290, keywords: ['mba', 'pgdm'] },
  { value: 'llm', label: 'LLM', count: 268, keywords: ['llm', 'master of law'] },
  { value: 'pg-diploma', label: 'PG Diploma', count: 66, keywords: ['pg diploma', 'post graduate diploma'] },
  { value: 'ca', label: 'CA', count: 50, keywords: ['ca', 'chartered accountant'] },
  { value: 'pgd-international-business', label: 'Post Graduate Diploma in International Business', count: 34, keywords: ['international business', 'pg diploma in international business'] },
  { value: 'master-it-management', label: 'Master in IT Management', count: 32, keywords: ['it management', 'master in it management'] },
  { value: 'mcom', label: 'M.Com', count: 30, keywords: ['m.com', 'master of commerce'] },
  { value: 'mcm', label: 'MCM', count: 25, keywords: ['mcm'] },
  { value: 'any-graduate', label: 'Any Graduate', count: 18590, keywords: ['graduate', 'bachelor', "bachelor's", 'undergraduate'] },
  { value: 'btech-be', label: 'B.Tech/B.E. - Bachelor of Technology/Engineering', count: 12735, keywords: ['b.tech', 'btech', 'b.e', 'be ', 'bachelor of engineering', "bachelor's in engineering"] },
  { value: 'bca', label: 'BCA - Bachelor of Computer Applications', count: 1394, keywords: ['bca', 'bachelor of computer applications'] },
  { value: 'bsc', label: 'B.Sc - Bachelor of Science', count: 1326, keywords: ['b.sc', 'bsc', 'bachelor of science'] },
  { value: 'pg-not-required', label: 'Graduation Not Required', count: 477, keywords: ['graduation not required', 'graduate not required', 'degree not required'] },
  { value: 'diploma', label: 'Diploma', count: 326, keywords: ['diploma', 'polytechnic'] },
  { value: 'bcom', label: 'B.Com - Bachelor of Commerce', count: 129, keywords: ['b.com', 'bcom', 'bachelor of commerce'] },
  { value: 'bs', label: 'BS - Bachelor of Science', count: 127, keywords: ['bs ', 'b.s', 'bachelor of science'] },
  { value: 'ba', label: 'B.A - Bachelor of Arts', count: 100, keywords: ['b.a', 'ba ', 'bachelor of arts'] },
  { value: 'bsc-bachelor', label: 'B.Sc. - Bachelor of Science', count: 91, keywords: ['b.sc', 'bsc', 'bachelor of science'] },
  { value: 'bba-bms', label: 'B.B.A/B.M.S - Bachelor of Business Administration/Management Studies', count: 65, keywords: ['bba', 'b.m.s', 'bms', 'business administration'] },
  { value: 'bachelor-ai', label: 'Bachelor of Artificial Intelligence', count: 46, keywords: ['artificial intelligence', 'ai degree'] },
  { value: 'iti', label: 'ITI Certification', count: 25, keywords: ['iti', 'industrial training institute'] }
];

const toDisplayLabel = (value = '') =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const sortJobs = (jobs = [], sortBy = 'newest') => {
  const list = [...jobs];

  if (sortBy === 'salary') {
    return list.sort((a, b) => Number(b.maxPrice || 0) - Number(a.maxPrice || 0));
  }

  return list.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.created_at || 0).getTime();
    const bTime = new Date(b.createdAt || b.created_at || 0).getTime();
    return Number.isFinite(bTime - aTime) ? bTime - aTime : 0;
  });
};

const normalizeSalaryToLakh = (value) => {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return number > 1000 ? number / 100000 : number;
};

const matchesWorkMode = (job, workMode) => {
  if (!workMode) return true;
  const text = `${job?.jobLocation || ''} ${job?.jobTitle || ''} ${job?.description || ''}`.toLowerCase();

  if (workMode === 'office') return text.includes('office') || text.includes('onsite') || text.includes('on-site');
  if (workMode === 'hybrid') return text.includes('hybrid');
  if (workMode === 'remote') return text.includes('remote') || text.includes('work from home') || text.includes('wfh');

  return true;
};

const matchesDepartment = (job, department) => {
  if (!department) return true;
  const text = `${job?.category || ''} ${job?.jobTitle || ''} ${job?.description || ''}`.toLowerCase();
  const selectedDepartment = departmentOptions.find((item) => item.value === department);
  if (!selectedDepartment) return true;
  return selectedDepartment.keywords.some((keyword) => text.includes(keyword));
};

const matchesSalaryRange = (job, salaryRange) => {
  if (!salaryRange) return true;
  const max = normalizeSalaryToLakh(job?.maxPrice || 0);
  const min = normalizeSalaryToLakh(job?.minPrice || 0);
  const salary = max || min;
  if (!salary) return false;

  if (salaryRange === '0-3') return salary >= 0 && salary <= 3;
  if (salaryRange === '3-6') return salary > 3 && salary <= 6;
  if (salaryRange === '6-10') return salary > 6 && salary <= 10;
  if (salaryRange === '10-15') return salary > 10 && salary <= 15;
  if (salaryRange === '15-25') return salary > 15 && salary <= 25;
  if (salaryRange === '25-50') return salary > 25 && salary <= 50;
  if (salaryRange === '50-75') return salary > 50 && salary <= 75;
  if (salaryRange === '75-100') return salary > 75 && salary <= 100;
  if (salaryRange === '100-500') return salary > 100 && salary <= 500;
  if (salaryRange === '500-plus') return salary > 500;

  return true;
};

const matchesEducation = (job, education) => {
  if (!education) return true;

  const text = `${job?.jobTitle || ''} ${job?.description || ''} ${job?.jobDescription || ''} ${job?.category || ''}`.toLowerCase();
  const selectedEducation = educationOptions.find((item) => item.value === education);
  if (!selectedEducation) return true;
  return selectedEducation.keywords.some((keyword) => text.includes(keyword));
};

const StudentDashboardPage = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const isRetiredUser = currentUser?.role === 'retired_employee';
  const retiredLockedFilters = useMemo(
    () => (isRetiredUser ? { ...defaultFilters, audience: 'retired_employee' } : defaultFilters),
    [isRetiredUser]
  );
  const [overview, setOverview] = useState(defaultOverview);
  const [filters, setFilters] = useState(retiredLockedFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [jobsState, setJobsState] = useState({ jobs: [], pagination: null, loading: true, error: '' });
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [actionMessage, setActionMessage] = useState('');
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllSalaryRanges, setShowAllSalaryRanges] = useState(false);
  const [showAllEducationOptions, setShowAllEducationOptions] = useState(false);
  const profileIdentity = useMemo(() => {
    if (isRetiredUser) {
      const retiredEmployeeId = currentUser?.retiredEmployeeId || generateRetiredEmployeeId({
        name: currentUser?.name || overview?.profile?.name || '',
        mobile: currentUser?.mobile || overview?.profile?.mobile || ''
      });
      return { label: 'Retired Employee ID', value: retiredEmployeeId };
    }

    const studentCandidateId = currentUser?.studentCandidateId || generateStudentCandidateId({
      name: currentUser?.name || overview?.profile?.name || '',
      mobile: currentUser?.mobile || overview?.profile?.mobile || ''
    });
    return { label: 'Student ID', value: studentCandidateId };
  }, [currentUser, isRetiredUser, overview?.profile?.mobile, overview?.profile?.name]);

  useEffect(() => {
    setFilters(retiredLockedFilters);
  }, [retiredLockedFilters]);

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      setOverview((current) => ({ ...current, loading: true, error: '' }));
      const response = await getStudentDashboardOverview();
      if (!mounted) return;

      const payload = response.data || {};
      setOverview({
        loading: false,
        error: response.error || '',
        isDemo: response.isDemo,
        profile: payload.profile || null,
        profileCompletion: Number(payload.profileCompletion || 0),
        counters: payload.counters || defaultOverview.counters,
        pipeline: payload.pipeline || defaultOverview.pipeline,
        interviews: payload.upcomingInterviews || [],
        notifications: payload.recentNotifications || []
      });
    };

    loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      setJobsState((current) => ({ ...current, loading: true, error: '' }));
      const response = await getStudentJobs(filters);
      if (!mounted) return;

      setJobsState({
        jobs: sortJobs(response.data.jobs || [], sortBy),
        pagination: response.data.pagination,
        loading: false,
        error: response.error || ''
      });
    };

    loadJobs();

    return () => {
      mounted = false;
    };
  }, [filters, sortBy]);

  useEffect(() => {
    let mounted = true;

    const primeData = async () => {
      const [savedResponse, applicationResponse] = await Promise.all([
        getStudentSavedJobs(),
        getStudentApplications()
      ]);

      if (!mounted) return;

      setSavedIds(new Set((savedResponse.data || []).map((item) => item.jobId || item.job_id)));
      setAppliedIds(new Set((applicationResponse.data || []).map((item) => item.jobId || item.job_id)));
    };

    primeData();

    return () => {
      mounted = false;
    };
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(retiredLockedFilters);
    setSortBy('newest');
  };

  const handleSaveToggle = async (jobId) => {
    setActionMessage('');

    if (savedIds.has(jobId)) {
      try {
        await removeSavedJobForStudent(jobId);
      } catch (error) {
        setActionMessage(error.message || 'Unable to remove saved job.');
        return;
      }

      setSavedIds((current) => {
        const copy = new Set(current);
        copy.delete(jobId);
        return copy;
      });
      setActionMessage('Removed from saved jobs.');
      return;
    }

    try {
      await saveJobForStudent(jobId);
      setSavedIds((current) => new Set([...current, jobId]));
      setActionMessage('Job saved successfully.');
    } catch (error) {
      if (/already saved/i.test(String(error.message || ''))) {
        setSavedIds((current) => new Set([...current, jobId]));
        setActionMessage('Job saved successfully.');
        return;
      }

      setActionMessage(error.message || 'Unable to save job.');
    }
  };

  const handleApply = async (jobId) => {
    setActionMessage('');

    if (appliedIds.has(jobId)) {
      setActionMessage('You already applied for this job.');
      return;
    }

    try {
      await applyToJob({ jobId, coverLetter: '' });
      setAppliedIds((current) => new Set([...current, jobId]));
      setActionMessage('Application submitted successfully.');
    } catch (error) {
      if (/already applied/i.test(String(error.message || ''))) {
        setAppliedIds((current) => new Set([...current, jobId]));
        setActionMessage('You already applied for this job.');
        return;
      }

      setActionMessage(error.message || 'Unable to apply right now.');
    }
  };

  const filteredJobs = useMemo(
    () =>
      (jobsState.jobs || []).filter(
        (job) =>
          matchesWorkMode(job, filters.workMode)
          && matchesDepartment(job, filters.department)
          && matchesSalaryRange(job, filters.salaryRange)
          && matchesEducation(job, filters.education)
      ),
    [jobsState.jobs, filters.workMode, filters.department, filters.salaryRange, filters.education]
  );

  const primaryDepartmentOptions = useMemo(() => departmentOptions.slice(0, 4), []);
  const secondaryDepartmentOptions = useMemo(() => departmentOptions.slice(4), []);
  const primarySalaryOptions = useMemo(() => salaryOptions.slice(0, 4), []);
  const secondarySalaryOptions = useMemo(() => salaryOptions.slice(4), []);
  const primaryEducationOptions = useMemo(() => educationOptions.slice(0, 4), []);
  const secondaryEducationOptions = useMemo(() => educationOptions.slice(4), []);

  const hasFilters = Boolean(
    filters.search
    || filters.location
    || filters.employmentType
    || filters.experienceLevel
    || filters.workMode
    || filters.department
    || filters.salaryRange
    || filters.education
  );
  const activeFilterCount = [
    filters.search,
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
    filters.workMode,
    filters.department,
    filters.salaryRange,
    filters.education
  ].filter((value) => String(value || '').trim() !== '').length;
  const activeJobCount = filteredJobs.length;

  return (
    <div className="dashboard-page dashboard-page--student student-marketplace-page">
      {overview.error ? <p className="form-error">{overview.error}</p> : null}
      {jobsState.error ? <p className="form-error">{jobsState.error}</p> : null}
      {overview.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {actionMessage ? <p className="form-success">{actionMessage}</p> : null}
      <section className="dash-card hr-panel" aria-label="Profile identifier">
        <div className="dash-card-head">
          <h3>{profileIdentity.label}</h3>
        </div>
        <p className="module-note">{profileIdentity.value}</p>
      </section>

      <section className="student-marketplace-grid">
        <main className="student-marketplace-center">
          <section className="student-market-card student-market-search-card">
            <div className="student-market-search-head">
              <h2>Search Jobs</h2>
              <button type="button" className="btn-link" onClick={clearFilters}>Clear all</button>
            </div>
            <div className="student-market-search-inputs">
              <input
                value={filters.search}
                placeholder="Search by role, skill, company"
                onChange={(event) => updateFilter('search', event.target.value)}
              />
              <input
                value={filters.location}
                placeholder="Search by location"
                onChange={(event) => updateFilter('location', event.target.value)}
              />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
            <p className="student-market-search-meta">{jobsState.loading || overview.loading ? 'Loading jobs...' : `${activeJobCount} jobs found`}</p>
          </section>

          <div className="student-market-job-list">
            {filteredJobs.map((job) => {
              const jobId = job.id || job._id;
              const isApplied = appliedIds.has(jobId);
              const isSaved = savedIds.has(jobId);
              const jobTags = [job.employmentType, job.experienceLevel, job.jobLocation].filter(Boolean);

              return (
                <article className="student-market-job-card" key={jobId}>
                  <div className="student-market-job-head">
                    <div>
                      <h3>{job.jobTitle || 'Untitled role'}</h3>
                      <p>{job.companyName || 'Unknown company'}</p>
                    </div>
                    <button type="button" className="btn-link" onClick={() => handleSaveToggle(jobId)}>
                      {isSaved ? 'Saved' : 'Save job'}
                    </button>
                  </div>

                  <p className="student-market-job-summary">{job.jobDescription || job.description || 'No job summary available.'}</p>

                  <div className="student-market-pill-wrap">
                    {jobTags.map((tag) => <span key={`${jobId}-${tag}`}>{toDisplayLabel(tag)}</span>)}
                  </div>

                  <div className="student-market-job-foot">
                    <div>
                      <strong>
                        ₹{job.minPrice || '-'} - ₹{job.maxPrice || '-'}
                      </strong>
                      <span>{job.salaryType || 'per month'}</span>
                    </div>
                    <div className="student-market-job-actions">
                      <Link to={`/portal/student/jobs/${jobId}`} className="btn-link">Details</Link>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={isApplied}
                        onClick={() => handleApply(jobId)}
                      >
                        {isApplied ? 'Applied' : 'Apply now'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!jobsState.loading && filteredJobs.length === 0 ? (
            <section className="student-market-card">
              <p className="module-note">No jobs found for current filters.</p>
            </section>
          ) : null}

          {jobsState.pagination ? (
            <section className="student-market-card student-pagination">
              <button
                type="button"
                className="btn-link"
                disabled={jobsState.pagination.page <= 1}
                onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
              >
                Previous
              </button>
              <span>Page {jobsState.pagination.page} of {jobsState.pagination.totalPages}</span>
              <button
                type="button"
                className="btn-link"
                disabled={jobsState.pagination.page >= jobsState.pagination.totalPages}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
              >
                Next
              </button>
            </section>
          ) : null}
        </main>

        <aside className="student-marketplace-right">
          <article className="student-market-card student-market-filter-card">
            <div className="student-market-card-head">
              <h4>
                Job Filters
                {activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}
              </h4>
            </div>

            <div className="student-market-filter-group">
              <h5>Work Mode</h5>
              <label>
                <input
                  type="radio"
                  name="workMode"
                  checked={filters.workMode === ''}
                  onChange={() => updateFilter('workMode', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="workMode"
                  checked={filters.workMode === 'office'}
                  onChange={() => updateFilter('workMode', 'office')}
                />
                Work from office
              </label>
              <label>
                <input
                  type="radio"
                  name="workMode"
                  checked={filters.workMode === 'hybrid'}
                  onChange={() => updateFilter('workMode', 'hybrid')}
                />
                Hybrid
              </label>
              <label>
                <input
                  type="radio"
                  name="workMode"
                  checked={filters.workMode === 'remote'}
                  onChange={() => updateFilter('workMode', 'remote')}
                />
                Remote
              </label>
            </div>

            <div className="student-market-filter-group">
              <h5>Department</h5>
              <div className="student-market-department-layout">
                <div className="student-market-department-main">
                  <label>
                    <input
                      type="radio"
                      name="department"
                      checked={filters.department === ''}
                      onChange={() => updateFilter('department', '')}
                    />
                    Any
                  </label>
                  {primaryDepartmentOptions.map((department) => (
                    <label key={department.value}>
                      <input
                        type="radio"
                        name="department"
                        checked={filters.department === department.value}
                        onChange={() => updateFilter('department', department.value)}
                      />
                      {department.label} ({department.count})
                    </label>
                  ))}
                  <button
                    type="button"
                    className="student-market-view-more-btn"
                    onClick={() => setShowAllDepartments((current) => !current)}
                  >
                    {showAllDepartments ? 'Hide More' : 'View More'}
                  </button>
                </div>
                {showAllDepartments ? (
                  <div className="student-market-department-side">
                    {secondaryDepartmentOptions.map((department) => (
                      <label key={department.value}>
                        <input
                          type="radio"
                          name="department"
                          checked={filters.department === department.value}
                          onChange={() => updateFilter('department', department.value)}
                        />
                        {department.label} ({department.count})
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="student-market-filter-group">
              <h5>Salary</h5>
              <div className="student-market-department-layout">
                <div className="student-market-department-main">
                  <label>
                    <input
                      type="radio"
                      name="salaryRange"
                      checked={filters.salaryRange === ''}
                      onChange={() => updateFilter('salaryRange', '')}
                    />
                    Any
                  </label>
                  {primarySalaryOptions.map((salary) => (
                    <label key={salary.value}>
                      <input
                        type="radio"
                        name="salaryRange"
                        checked={filters.salaryRange === salary.value}
                        onChange={() => updateFilter('salaryRange', salary.value)}
                      />
                      {salary.label} ({salary.count})
                    </label>
                  ))}
                  <button
                    type="button"
                    className="student-market-view-more-btn"
                    onClick={() => setShowAllSalaryRanges((current) => !current)}
                  >
                    {showAllSalaryRanges ? 'Hide More' : 'View More'}
                  </button>
                </div>
                {showAllSalaryRanges ? (
                  <div className="student-market-department-side">
                    {secondarySalaryOptions.map((salary) => (
                      <label key={salary.value}>
                        <input
                          type="radio"
                          name="salaryRange"
                          checked={filters.salaryRange === salary.value}
                          onChange={() => updateFilter('salaryRange', salary.value)}
                        />
                        {salary.label} ({salary.count})
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="student-market-filter-group">
              <h5>Education</h5>
              <div className="student-market-department-layout">
                <div className="student-market-department-main">
                  <label>
                    <input
                      type="radio"
                      name="education"
                      checked={filters.education === ''}
                      onChange={() => updateFilter('education', '')}
                    />
                    Any
                  </label>
                  {primaryEducationOptions.map((education) => (
                    <label key={education.value}>
                      <input
                        type="radio"
                        name="education"
                        checked={filters.education === education.value}
                        onChange={() => updateFilter('education', education.value)}
                      />
                      {education.label} ({education.count})
                    </label>
                  ))}
                  <button
                    type="button"
                    className="student-market-view-more-btn"
                    onClick={() => setShowAllEducationOptions((current) => !current)}
                  >
                    {showAllEducationOptions ? 'Hide More' : 'View More'}
                  </button>
                </div>
                {showAllEducationOptions ? (
                  <div className="student-market-department-side">
                    {secondaryEducationOptions.map((education) => (
                      <label key={education.value}>
                        <input
                          type="radio"
                          name="education"
                          checked={filters.education === education.value}
                          onChange={() => updateFilter('education', education.value)}
                        />
                        {education.label} ({education.count})
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="student-market-filter-group">
              <h5>Experience Level</h5>
              <label>
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={filters.experienceLevel === ''}
                  onChange={() => updateFilter('experienceLevel', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={filters.experienceLevel === 'entry-level'}
                  onChange={() => updateFilter('experienceLevel', 'entry-level')}
                />
                Entry Level
              </label>
              <label>
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={filters.experienceLevel === 'intermediate'}
                  onChange={() => updateFilter('experienceLevel', 'intermediate')}
                />
                Intermediate
              </label>
              <label>
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={filters.experienceLevel === 'expert'}
                  onChange={() => updateFilter('experienceLevel', 'expert')}
                />
                Expert
              </label>
            </div>

            <div className="student-market-filter-group">
              <h5>Job Type</h5>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  checked={filters.employmentType === ''}
                  onChange={() => updateFilter('employmentType', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  checked={filters.employmentType === 'fulltime'}
                  onChange={() => updateFilter('employmentType', 'fulltime')}
                />
                Full Time
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  checked={filters.employmentType === 'freelance'}
                  onChange={() => updateFilter('employmentType', 'freelance')}
                />
                Freelance
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  checked={filters.employmentType === 'part-time'}
                  onChange={() => updateFilter('employmentType', 'part-time')}
                />
                Part Time
              </label>
            </div>

            <div className="student-market-filter-group">
              <h5>Quick Links</h5>
              <div className="student-market-filter-links">
                <Link to="/portal/student/saved-jobs" className="btn-link">Saved Jobs</Link>
                <Link to="/portal/student/interviews" className="btn-link">Interviews</Link>
                <Link to="/portal/student/notifications" className="btn-link">Notifications</Link>
                <Link to="/portal/student/company-reviews" className="btn-link">Company Reviews</Link>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default StudentDashboardPage;

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  page: 1,
  limit: 6
};

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

  if (department === 'engineering') return text.includes('engineering') || text.includes('software') || text.includes('developer');
  if (department === 'data-science') return text.includes('data science') || text.includes('data analyst') || text.includes('analytics');
  if (department === 'customer-success') return text.includes('customer success') || text.includes('customer support') || text.includes('client support');
  if (department === 'it-security') return text.includes('it') || text.includes('information security') || text.includes('cyber');

  return true;
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

  return true;
};

const matchesEducation = (job, education) => {
  if (!education) return true;

  const text = `${job?.jobTitle || ''} ${job?.description || ''} ${job?.jobDescription || ''} ${job?.category || ''}`.toLowerCase();

  if (education === 'any-postgraduate') {
    return text.includes('postgraduate')
      || text.includes('post graduate')
      || text.includes('master')
      || text.includes('m.tech')
      || text.includes('mba')
      || text.includes('mca');
  }

  if (education === 'pg-not-required') {
    return text.includes('post graduation not required')
      || text.includes('pg not required')
      || text.includes('postgraduate not required');
  }

  if (education === 'btech-be') {
    return text.includes('b.tech')
      || text.includes('btech')
      || text.includes('b.e')
      || text.includes('be ')
      || text.includes("bachelor's in engineering")
      || text.includes('bachelor of engineering');
  }

  if (education === 'any-graduate') {
    return text.includes('graduate')
      || text.includes("bachelor's")
      || text.includes('bachelor')
      || text.includes('undergraduate');
  }

  return true;
};

const StudentDashboardPage = () => {
  const [overview, setOverview] = useState(defaultOverview);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [jobsState, setJobsState] = useState({ jobs: [], pagination: null, loading: true, error: '' });
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [actionMessage, setActionMessage] = useState('');

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
    setFilters(defaultFilters);
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

  const educationCounts = useMemo(() => {
    const source = jobsState.jobs || [];
    return {
      anyPostgraduate: source.filter((job) => matchesEducation(job, 'any-postgraduate')).length,
      pgNotRequired: source.filter((job) => matchesEducation(job, 'pg-not-required')).length,
      btechBe: source.filter((job) => matchesEducation(job, 'btech-be')).length,
      anyGraduate: source.filter((job) => matchesEducation(job, 'any-graduate')).length
    };
  }, [jobsState.jobs]);

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
              <label>
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === ''}
                  onChange={() => updateFilter('department', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === 'engineering'}
                  onChange={() => updateFilter('department', 'engineering')}
                />
                Engineering - Software
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === 'data-science'}
                  onChange={() => updateFilter('department', 'data-science')}
                />
                Data Science & Analytics
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === 'customer-success'}
                  onChange={() => updateFilter('department', 'customer-success')}
                />
                Customer Success
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === 'it-security'}
                  onChange={() => updateFilter('department', 'it-security')}
                />
                IT & Information Security
              </label>
            </div>

            <div className="student-market-filter-group">
              <h5>Salary</h5>
              <label>
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange === ''}
                  onChange={() => updateFilter('salaryRange', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange === '0-3'}
                  onChange={() => updateFilter('salaryRange', '0-3')}
                />
                0-3 Lakhs
              </label>
              <label>
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange === '3-6'}
                  onChange={() => updateFilter('salaryRange', '3-6')}
                />
                3-6 Lakhs
              </label>
              <label>
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange === '6-10'}
                  onChange={() => updateFilter('salaryRange', '6-10')}
                />
                6-10 Lakhs
              </label>
              <label>
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange === '10-15'}
                  onChange={() => updateFilter('salaryRange', '10-15')}
                />
                10-15 Lakhs
              </label>
            </div>

            <div className="student-market-filter-group">
              <h5>Education</h5>
              <label>
                <input
                  type="radio"
                  name="education"
                  checked={filters.education === ''}
                  onChange={() => updateFilter('education', '')}
                />
                Any
              </label>
              <label>
                <input
                  type="radio"
                  name="education"
                  checked={filters.education === 'any-postgraduate'}
                  onChange={() => updateFilter('education', 'any-postgraduate')}
                />
                Any Postgraduate ({educationCounts.anyPostgraduate})
              </label>
              <label>
                <input
                  type="radio"
                  name="education"
                  checked={filters.education === 'pg-not-required'}
                  onChange={() => updateFilter('education', 'pg-not-required')}
                />
                Post Graduation Not Required ({educationCounts.pgNotRequired})
              </label>
              <label>
                <input
                  type="radio"
                  name="education"
                  checked={filters.education === 'btech-be'}
                  onChange={() => updateFilter('education', 'btech-be')}
                />
                B.Tech/B.E. - Bachelor's ({educationCounts.btechBe})
              </label>
              <label>
                <input
                  type="radio"
                  name="education"
                  checked={filters.education === 'any-graduate'}
                  onChange={() => updateFilter('education', 'any-graduate')}
                />
                Any Graduate ({educationCounts.anyGraduate})
              </label>
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

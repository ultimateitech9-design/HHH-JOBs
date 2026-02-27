import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  applyToJob,
  getStudentApplications,
  getStudentJobs,
  getStudentSavedJobs,
  removeSavedJobForStudent,
  saveJobForStudent
} from '../services/studentApi';

const defaultFilters = {
  search: '',
  location: '',
  employmentType: '',
  experienceLevel: '',
  category: '',
  page: 1,
  limit: 8
};

const StudentJobsPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [jobsState, setJobsState] = useState({ jobs: [], pagination: null, loading: true, error: '' });
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      setJobsState((current) => ({ ...current, loading: true, error: '' }));

      const response = await getStudentJobs(filters);
      if (!mounted) return;

      setJobsState({
        jobs: response.data.jobs || [],
        pagination: response.data.pagination,
        loading: false,
        error: response.error || ''
      });
    };

    loadJobs();

    return () => {
      mounted = false;
    };
  }, [filters]);

  useEffect(() => {
    let mounted = true;

    const primeData = async () => {
      const [savedResponse, applicationResponse] = await Promise.all([
        getStudentSavedJobs(),
        getStudentApplications()
      ]);

      if (!mounted) return;

      const nextSaved = new Set((savedResponse.data || []).map((item) => item.jobId || item.job_id));
      const nextApplied = new Set((applicationResponse.data || []).map((item) => item.jobId || item.job_id));

      setSavedIds(nextSaved);
      setAppliedIds(nextApplied);
    };

    primeData();

    return () => {
      mounted = false;
    };
  }, []);

  const hasFilters = useMemo(
    () => Boolean(filters.search || filters.location || filters.employmentType || filters.experienceLevel || filters.category),
    [filters]
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
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
    } catch (error) {
      if (/already saved/i.test(String(error.message || ''))) {
        setSavedIds((current) => new Set([...current, jobId]));
        setActionMessage('Job saved successfully.');
        return;
      }
      setActionMessage(error.message || 'Unable to save job.');
      return;
    }

    setSavedIds((current) => new Set([...current, jobId]));
    setActionMessage('Job saved successfully.');
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

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Student Jobs"
        title="Search and Apply Jobs"
        subtitle="Filter jobs, save opportunities, and apply directly with profile resume."
      />

      {jobsState.error ? <p className="form-error">{jobsState.error}</p> : null}
      {actionMessage ? <p className="form-success">{actionMessage}</p> : null}

      <section className="panel-card">
        <div className="student-filters">
          <input
            placeholder="Search by title, company, skill"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
          />
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
          />
          <input
            placeholder="Employment Type"
            value={filters.employmentType}
            onChange={(event) => updateFilter('employmentType', event.target.value)}
          />
          <input
            placeholder="Experience"
            value={filters.experienceLevel}
            onChange={(event) => updateFilter('experienceLevel', event.target.value)}
          />
          <input
            placeholder="Category"
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value)}
          />
          {hasFilters ? (
            <button type="button" className="btn-link" onClick={() => setFilters(defaultFilters)}>
              Reset Filters
            </button>
          ) : null}
        </div>
      </section>

      {jobsState.loading ? <p className="module-note">Loading jobs...</p> : null}

      <div className="student-job-grid">
        {jobsState.jobs.map((job) => {
          const jobId = job.id || job._id;
          const isSaved = savedIds.has(jobId);
          const isApplied = appliedIds.has(jobId);

          return (
            <article className="student-job-card" key={jobId}>
              <div className="student-job-card-header">
                <h3>{job.jobTitle}</h3>
                <StatusPill value={job.status || 'open'} />
              </div>

              <p>{job.companyName}</p>
              <p>{job.jobLocation} • {job.experienceLevel || 'Experience not specified'}</p>
              <p>
                Salary: {job.minPrice || '-'} - {job.maxPrice || '-'} {job.salaryType || ''}
              </p>

              <div className="student-chip-row">
                {(job.skills || []).slice(0, 5).map((skill) => (
                  <span key={skill} className="student-chip">{skill}</span>
                ))}
              </div>

              <div className="student-job-actions">
                <Link to={`/portal/student/jobs/${jobId}`} className="btn-link">Details</Link>
                <button type="button" className="btn-link" onClick={() => handleSaveToggle(jobId)}>
                  {isSaved ? 'Unsave' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleApply(jobId)}
                  disabled={isApplied}
                >
                  {isApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {(!jobsState.loading && jobsState.jobs.length === 0) ? (
        <section className="panel-card">
          <p className="module-note">No jobs found for current filters.</p>
        </section>
      ) : null}

      {jobsState.pagination ? (
        <section className="panel-card student-pagination">
          <button
            type="button"
            className="btn-link"
            disabled={jobsState.pagination.page <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
          >
            Previous
          </button>
          <span>
            Page {jobsState.pagination.page} of {jobsState.pagination.totalPages}
          </span>
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
    </div>
  );
};

export default StudentJobsPage;

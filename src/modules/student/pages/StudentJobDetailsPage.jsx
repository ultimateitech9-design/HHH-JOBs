import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  applyToJob,
  getCompanyReviews,
  getStudentJobById,
  getStudentSavedJobs,
  removeSavedJobForStudent,
  runAtsCheck,
  saveJobForStudent
} from '../services/studentApi';

const StudentJobDetailsPage = () => {
  const { jobId } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: '',
    job: null,
    isSaved: false
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [atsResult, setAtsResult] = useState(null);
  const [reviews, setReviews] = useState({ summary: null, rows: [] });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const [jobResponse, savedResponse] = await Promise.all([
          getStudentJobById(jobId),
          getStudentSavedJobs()
        ]);

        if (!mounted) return;

        const job = jobResponse.data;
        const savedSet = new Set((savedResponse.data || []).map((item) => item.jobId || item.job_id));

        setState({
          loading: false,
          error: job ? '' : 'Job not found.',
          job,
          isSaved: savedSet.has(jobId)
        });

        if (job?.companyName) {
          const reviewResponse = await getCompanyReviews(job.companyName);
          if (!mounted) return;
          setReviews({ summary: reviewResponse.data.summary, rows: reviewResponse.data.reviews || [] });
        }
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load job details.'
        }));
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const salaryLabel = useMemo(() => {
    if (!state.job) return '-';
    return `${state.job.minPrice || '-'} - ${state.job.maxPrice || '-'} ${state.job.salaryType || ''}`;
  }, [state.job]);

  const handleSaveToggle = async () => {
    if (!state.job) return;
    setActionMessage('');

    if (state.isSaved) {
      try {
        await removeSavedJobForStudent(jobId);
      } catch (error) {
        setActionMessage(error.message || 'Unable to unsave job.');
        return;
      }
      setState((current) => ({ ...current, isSaved: false }));
      setActionMessage('Job removed from saved list.');
      return;
    }

    try {
      await saveJobForStudent(jobId);
    } catch (error) {
      if (/already saved/i.test(String(error.message || ''))) {
        setState((current) => ({ ...current, isSaved: true }));
        setActionMessage('Job saved successfully.');
        return;
      }
      setActionMessage(error.message || 'Unable to save job.');
      return;
    }

    setState((current) => ({ ...current, isSaved: true }));
    setActionMessage('Job saved successfully.');
  };

  const handleApply = async () => {
    setActionMessage('');

    try {
      await applyToJob({ jobId, coverLetter });
      setActionMessage('Application submitted successfully.');
    } catch (error) {
      setActionMessage(error.message || 'Unable to apply right now.');
    }
  };

  const handleAtsCheck = async () => {
    setActionMessage('');

    try {
      const result = await runAtsCheck({ jobId, source: 'profile_resume' });
      setAtsResult(result);
      setActionMessage('ATS check completed.');
    } catch (error) {
      setActionMessage(error.message || 'Unable to run ATS check.');
    }
  };

  if (state.loading) {
    return <p className="module-note">Loading job details...</p>;
  }

  if (!state.job) {
    return (
      <section className="panel-card">
        <p className="form-error">{state.error || 'Job not found.'}</p>
        <Link to="/portal/student/jobs" className="inline-link">Back to jobs</Link>
      </section>
    );
  }

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Job Details"
        title={state.job.jobTitle}
        subtitle={`${state.job.companyName} • ${state.job.jobLocation}`}
      />

      {actionMessage ? <p className="form-success">{actionMessage}</p> : null}

      <section className="panel-card">
        <div className="student-job-card-header">
          <h3>{state.job.companyName}</h3>
          <StatusPill value={state.job.status || 'open'} />
        </div>

        <p className="module-note">Experience: {state.job.experienceLevel || '-'}</p>
        <p className="module-note">Employment Type: {state.job.employmentType || '-'}</p>
        <p className="module-note">Salary: {salaryLabel}</p>

        <div className="student-chip-row">
          {(state.job.skills || []).map((skill) => (
            <span key={skill} className="student-chip">{skill}</span>
          ))}
        </div>

        <p className="student-long-text">{state.job.description}</p>

        <label className="full-row">
          Cover Letter (optional)
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            placeholder="Write a short cover note for recruiter."
          />
        </label>

        <div className="student-job-actions">
          <button type="button" className="btn-primary" onClick={handleApply}>Apply with Profile Resume</button>
          <button type="button" className="btn-link" onClick={handleSaveToggle}>
            {state.isSaved ? 'Unsave Job' : 'Save Job'}
          </button>
          <button type="button" className="btn-link" onClick={handleAtsCheck}>Run ATS Check</button>
        </div>
      </section>

      {atsResult ? (
        <section className="panel-card">
          <SectionHeader eyebrow="ATS Result" title={`Score: ${atsResult.score}%`} />
          <div className="split-grid">
            <div>
              <p className="module-note">Keyword Score: {atsResult.keywordScore}</p>
              <p className="module-note">Similarity Score: {atsResult.similarityScore}</p>
              <p className="module-note">Format Score: {atsResult.formatScore}</p>
            </div>
            <div>
              <p className="module-note">Matched Keywords: {(atsResult.matchedKeywords || []).join(', ') || '-'}</p>
              <p className="module-note">Missing Keywords: {(atsResult.missingKeywords || []).join(', ') || '-'}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel-card">
        <SectionHeader
          eyebrow="Company Reviews"
          title={`Average Rating: ${reviews.summary?.averageRating || 0}`}
          subtitle={`${reviews.summary?.count || 0} review(s)`}
        />

        <ul className="student-list">
          {reviews.rows.map((review) => (
            <li key={review.id}>
              <div>
                <h4>{review.title || 'Review'}</h4>
                <p>{review.review}</p>
              </div>
              <StatusPill value={`${review.rating}/5`} />
            </li>
          ))}
          {reviews.rows.length === 0 ? <li>No reviews for this company yet.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default StudentJobDetailsPage;

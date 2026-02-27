import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  createHrInterview,
  formatDateTime,
  getApplicantsForJob,
  getHrInterviews,
  getHrJobs,
  updateHrInterview
} from '../services/hrApi';

const defaultInterviewForm = {
  jobId: '',
  applicationId: '',
  scheduledAt: '',
  mode: 'virtual',
  meetingLink: '',
  location: '',
  note: ''
};

const HrInterviewsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const [form, setForm] = useState(defaultInterviewForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      const [jobsRes, interviewsRes] = await Promise.all([
        getHrJobs(),
        getHrInterviews()
      ]);

      if (!mounted) return;

      const jobsList = jobsRes.data || [];
      setJobs(jobsList);
      setInterviews(interviewsRes.data || []);

      setState({
        loading: false,
        error: jobsRes.error || interviewsRes.error || ''
      });

      if (jobsList.length > 0) {
        const firstJobId = jobsList[0].id || jobsList[0]._id;
        setForm((current) => ({ ...current, jobId: firstJobId }));
      }
    };

    loadInitial();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadApplicants = async () => {
      if (!form.jobId) {
        setJobApplicants([]);
        return;
      }

      const response = await getApplicantsForJob(form.jobId);
      if (!mounted) return;

      setJobApplicants(response.data || []);
      if ((response.data || []).length > 0) {
        setForm((current) => ({ ...current, applicationId: current.applicationId || response.data[0].id }));
      } else {
        setForm((current) => ({ ...current, applicationId: '' }));
      }
    };

    loadApplicants();

    return () => {
      mounted = false;
    };
  }, [form.jobId]);

  const applicationOptions = useMemo(() => {
    return jobApplicants.map((item) => ({
      value: item.id,
      label: `${item.applicant?.name || item.applicantEmail || item.applicant_id} (${item.status || 'applied'})`
    }));
  }, [jobApplicants]);

  const handleCreateInterview = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!form.applicationId || !form.scheduledAt) {
      setMessage('Application and scheduled datetime are required.');
      return;
    }

    setSaving(true);

    try {
      const created = await createHrInterview(form);
      setInterviews((current) => [created, ...current]);
      setMessage('Interview scheduled successfully.');
      setForm((current) => ({ ...current, scheduledAt: '', meetingLink: '', location: '', note: '' }));
    } catch (error) {
      setMessage(String(error.message || 'Unable to schedule interview.'));
    } finally {
      setSaving(false);
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    setMessage('');

    try {
      const updated = await updateHrInterview(interviewId, { status });
      setInterviews((current) => current.map((item) => (item.id === interviewId ? { ...item, ...updated } : item)));
      setMessage('Interview updated successfully.');
    } catch (error) {
      setMessage(String(error.message || 'Unable to update interview.'));
    }
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Interviews"
        title="Interview Scheduling and Tracking"
        subtitle="Create interview schedules from applications and update interview status."
      />

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {state.loading ? <p className="module-note">Loading interviews...</p> : null}

      <section className="panel-card">
        <SectionHeader eyebrow="Schedule Interview" title="Create New Interview" />

        <form className="form-grid" onSubmit={handleCreateInterview}>
          <label>
            Job
            <select value={form.jobId} onChange={(event) => setForm((current) => ({ ...current, jobId: event.target.value }))}>
              {jobs.map((job) => (
                <option key={job.id || job._id} value={job.id || job._id}>
                  {job.jobTitle} - {job.companyName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Application
            <select
              value={form.applicationId}
              onChange={(event) => setForm((current) => ({ ...current, applicationId: event.target.value }))}
            >
              {applicationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label>
            Scheduled At
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
            />
          </label>

          <label>
            Mode
            <select value={form.mode} onChange={(event) => setForm((current) => ({ ...current, mode: event.target.value }))}>
              <option value="virtual">Virtual</option>
              <option value="onsite">Onsite</option>
              <option value="phone">Phone</option>
            </select>
          </label>

          <label>
            Meeting Link
            <input
              value={form.meetingLink}
              onChange={(event) => setForm((current) => ({ ...current, meetingLink: event.target.value }))}
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            />
          </label>

          <label className="full-row">
            Note
            <textarea rows={4} value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </form>
      </section>

      <section className="panel-card">
        <SectionHeader eyebrow="Interview List" title="Manage Scheduled Interviews" />

        <ul className="student-list">
          {interviews.map((interview) => (
            <li key={interview.id}>
              <div>
                <h4>{interview.mode || 'interview'} • {formatDateTime(interview.scheduled_at || interview.scheduledAt)}</h4>
                <p>Application: {interview.application_id || interview.applicationId || '-'}</p>
                <p>Job: {interview.job_id || interview.jobId || '-'}</p>
                <p>Location: {interview.location || '-'}</p>
                {interview.meeting_link || interview.meetingLink ? (
                  <a
                    href={interview.meeting_link || interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-link"
                  >
                    Open meeting link
                  </a>
                ) : null}
              </div>

              <div className="student-list-actions">
                <StatusPill value={interview.status || 'scheduled'} />
                <button type="button" className="btn-link" onClick={() => updateInterviewStatus(interview.id, 'scheduled')}>Set Scheduled</button>
                <button type="button" className="btn-link" onClick={() => updateInterviewStatus(interview.id, 'completed')}>Set Completed</button>
                <button type="button" className="btn-link" onClick={() => updateInterviewStatus(interview.id, 'cancelled')}>Set Cancelled</button>
              </div>
            </li>
          ))}
          {interviews.length === 0 ? <li>No interviews scheduled.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default HrInterviewsPage;

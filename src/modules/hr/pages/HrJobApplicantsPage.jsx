import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  createHrInterview,
  getApplicantsForJob,
  getHrJobs,
  updateApplicationStatus
} from '../services/hrApi';

const APPLICATION_STATUS_OPTIONS = ['applied', 'shortlisted', 'interviewed', 'offered', 'rejected', 'hired'];

const defaultInterviewDraft = {
  scheduledAt: '',
  mode: 'virtual',
  meetingLink: '',
  location: '',
  note: ''
};

const HrJobApplicantsPage = () => {
  const { jobId } = useParams();
  const [state, setState] = useState({ loading: true, error: '', applicants: [], jobs: [] });
  const [message, setMessage] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});
  const [notesDrafts, setNotesDrafts] = useState({});
  const [interviewDrafts, setInterviewDrafts] = useState({});

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [applicantsRes, jobsRes] = await Promise.all([
        getApplicantsForJob(jobId),
        getHrJobs()
      ]);

      if (!mounted) return;

      const applicants = applicantsRes.data || [];

      setState({
        loading: false,
        error: applicantsRes.error || jobsRes.error || '',
        applicants,
        jobs: jobsRes.data || []
      });

      const nextStatus = {};
      const nextNotes = {};
      const nextInterview = {};

      applicants.forEach((item) => {
        nextStatus[item.id] = item.status || 'applied';
        nextNotes[item.id] = item.hrNotes || '';
        nextInterview[item.id] = { ...defaultInterviewDraft };
      });

      setStatusDrafts(nextStatus);
      setNotesDrafts(nextNotes);
      setInterviewDrafts(nextInterview);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const targetJob = useMemo(() => state.jobs.find((job) => (job.id || job._id) === jobId), [state.jobs, jobId]);

  const updateStatus = async (applicationId) => {
    setMessage('');

    const status = statusDrafts[applicationId] || 'applied';
    const hrNotes = notesDrafts[applicationId] || '';

    try {
      const updated = await updateApplicationStatus({ applicationId, status, hrNotes });
      setState((current) => ({
        ...current,
        applicants: current.applicants.map((item) =>
          item.id === applicationId
            ? { ...item, ...updated, status, hrNotes }
            : item
        )
      }));
      setMessage('Application status updated.');
    } catch (error) {
      setMessage(String(error.message || 'Unable to update status.'));
    }
  };

  const scheduleInterview = async (applicationId) => {
    setMessage('');

    const interview = interviewDrafts[applicationId] || defaultInterviewDraft;

    if (!interview.scheduledAt) {
      setMessage('Please choose interview date and time.');
      return;
    }

    try {
      await createHrInterview({ applicationId, ...interview });
      setInterviewDrafts((current) => ({
        ...current,
        [applicationId]: { ...defaultInterviewDraft }
      }));
      setMessage('Interview scheduled successfully.');
    } catch (error) {
      setMessage(String(error.message || 'Unable to schedule interview.'));
    }
  };

  const setInterviewField = (applicationId, key, value) => {
    setInterviewDrafts((current) => ({
      ...current,
      [applicationId]: {
        ...(current[applicationId] || defaultInterviewDraft),
        [key]: value
      }
    }));
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Applicants"
        title={targetJob ? `${targetJob.jobTitle} - Applicant Pipeline` : 'Applicant Pipeline'}
        subtitle="Shortlist/reject/hire applications and schedule interviews directly."
      />

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <Link to="/portal/hr/jobs" className="inline-link">Back to jobs</Link>
      </section>

      {state.loading ? <p className="module-note">Loading applicants...</p> : null}

      <div className="module-page">
        {state.applicants.map((application) => {
          const applicant = application.applicant || {};
          const interview = interviewDrafts[application.id] || defaultInterviewDraft;

          return (
            <section className="panel-card" key={application.id}>
              <div className="student-job-card-header">
                <h3>{applicant.name || application.applicantEmail || 'Candidate'}</h3>
                <StatusPill value={application.status || 'applied'} />
              </div>

              <p className="module-note">Email: {applicant.email || application.applicantEmail || '-'}</p>
              <p className="module-note">Phone: {applicant.mobile || '-'}</p>

              <div className="split-grid">
                <div className="panel-card">
                  <SectionHeader eyebrow="Application Status" title="Update candidate decision" />

                  <div className="form-grid">
                    <label>
                      Status
                      <select
                        value={statusDrafts[application.id] || 'applied'}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [application.id]: event.target.value
                          }))
                        }
                      >
                        {APPLICATION_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </label>

                    <label className="full-row">
                      HR Notes
                      <textarea
                        rows={4}
                        value={notesDrafts[application.id] || ''}
                        onChange={(event) =>
                          setNotesDrafts((current) => ({
                            ...current,
                            [application.id]: event.target.value
                          }))
                        }
                      />
                    </label>

                    <button type="button" className="btn-primary" onClick={() => updateStatus(application.id)}>
                      Save Status
                    </button>
                  </div>
                </div>

                <div className="panel-card">
                  <SectionHeader eyebrow="Interview" title="Schedule candidate round" />

                  <div className="form-grid">
                    <label>
                      Scheduled At
                      <input
                        type="datetime-local"
                        value={interview.scheduledAt}
                        onChange={(event) => setInterviewField(application.id, 'scheduledAt', event.target.value)}
                      />
                    </label>

                    <label>
                      Mode
                      <select
                        value={interview.mode}
                        onChange={(event) => setInterviewField(application.id, 'mode', event.target.value)}
                      >
                        <option value="virtual">Virtual</option>
                        <option value="onsite">Onsite</option>
                        <option value="phone">Phone</option>
                      </select>
                    </label>

                    <label>
                      Meeting Link
                      <input
                        value={interview.meetingLink}
                        onChange={(event) => setInterviewField(application.id, 'meetingLink', event.target.value)}
                      />
                    </label>

                    <label>
                      Location
                      <input
                        value={interview.location}
                        onChange={(event) => setInterviewField(application.id, 'location', event.target.value)}
                      />
                    </label>

                    <label className="full-row">
                      Note
                      <textarea
                        rows={3}
                        value={interview.note}
                        onChange={(event) => setInterviewField(application.id, 'note', event.target.value)}
                      />
                    </label>

                    <button type="button" className="btn-primary" onClick={() => scheduleInterview(application.id)}>
                      Schedule Interview
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {(!state.loading && state.applicants.length === 0) ? (
          <section className="panel-card">
            <p className="module-note">No applicants found for this job.</p>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default HrJobApplicantsPage;

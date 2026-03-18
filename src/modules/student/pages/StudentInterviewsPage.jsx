import { useEffect, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getStudentInterviews } from '../services/studentApi';

const StudentInterviewsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, interviews: [] });

  useEffect(() => {
    let mounted = true;

    const loadInterviews = async () => {
      const response = await getStudentInterviews();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error && !response.isDemo ? response.error : '',
        isDemo: response.isDemo,
        interviews: response.data || []
      });
    };

    loadInterviews();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Interviews"
        title="Interview Schedule"
        subtitle="Track upcoming interviews with meeting details and preparation notes."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="panel-card">
        {state.loading ? <p className="module-note">Loading interviews...</p> : null}

        <ul className="student-list">
          {state.interviews.map((interview) => (
            <li key={interview.id}>
              <div>
                <h4>{interview.company_name || interview.companyName || 'Hiring Team'}</h4>
                <p>{formatDateTime(interview.scheduled_at || interview.scheduledAt)}</p>
                <p>
                  Mode: {interview.mode || '-'}
                  {interview.meeting_link || interview.meetingLink ? (
                    <>
                      {' '}•
                      {' '}
                      <a
                        href={interview.meeting_link || interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-link"
                      >
                        Meeting Link
                      </a>
                    </>
                  ) : null}
                </p>
                <p>{interview.note || interview.notes || interview.description || ''}</p>
              </div>

              <StatusPill value={interview.status || 'scheduled'} />
            </li>
          ))}
          {(!state.loading && state.interviews.length === 0) ? <li>No interviews scheduled.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default StudentInterviewsPage;


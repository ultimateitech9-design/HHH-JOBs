import { useEffect, useState } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiVideo, 
  FiMapPin, 
  FiLink, 
  FiCheckCircle,
  FiFileText,
  FiXCircle
} from 'react-icons/fi';
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

  const getStatusConfig = (status) => {
    const s = String(status || 'scheduled').toLowerCase();
    switch (s) {
      case 'scheduled': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: FiClock, label: 'Scheduled' };
      case 'completed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle, label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: FiXCircle, label: 'Cancelled' };
      default: return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', icon: FiClock, label: s };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-primary tracking-tight mb-2">Interview Schedule</h1>
          <p className="text-neutral-500 text-lg">Track upcoming interviews, find meeting links, and view notes.</p>
        </div>
      </header>

      {state.isDemo && (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-center gap-3 border border-amber-200 shadow-sm">
          <span className="font-semibold">Demo Mode: Showing sample interview data.</span>
        </div>
      )}
      
      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-200 shadow-sm">
          <FiXCircle size={20} /> <span className="font-semibold">{state.error}</span>
        </div>
      )}

      {state.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-neutral-100 animate-pulse"></div>
          ))}
        </div>
      ) : state.interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.interviews.map(interview => {
            const statusConfig = getStatusConfig(interview.status);
            const isVirtual = String(interview.mode || '').toLowerCase().includes('virtual') || String(interview.mode || '').toLowerCase().includes('video');
            const link = interview.meeting_link || interview.meetingLink;
            
            return (
              <article key={interview.id || Math.random().toString()} className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group flex flex-col h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full pointer-events-none -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                      <FiCalendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{interview.company_name || interview.companyName || 'Hiring Team'}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        <statusConfig.icon size={12} /> {statusConfig.label.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6 relative z-10 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-neutral-400"><FiClock size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-neutral-700">Scheduled Time</p>
                      <p className="text-sm text-neutral-600">{formatDateTime(interview.scheduled_at || interview.scheduledAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-neutral-400">{isVirtual ? <FiVideo size={18} /> : <FiMapPin size={18} />}</div>
                    <div>
                      <p className="text-sm font-bold text-neutral-700">Mode / Location</p>
                      <p className="text-sm text-neutral-600 capitalize">{interview.mode || 'Not specified'}</p>
                    </div>
                  </div>

                  {(interview.note || interview.notes || interview.description) && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-neutral-400"><FiFileText size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-neutral-700">Notes & Description</p>
                        <p className="text-sm text-neutral-600 line-clamp-2" title={interview.note || interview.notes || interview.description}>
                          {interview.note || interview.notes || interview.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {link && (
                  <div className="pt-4 border-t border-neutral-100 relative z-10 mt-auto">
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-brand-50 text-brand-700 border border-brand-100 font-bold rounded-xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                    >
                      <FiLink /> Join Meeting
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm max-w-2xl mx-auto mt-12">
          <div className="w-24 h-24 bg-neutral-50 text-neutral-300 rounded-full flex flex-items-center justify-center mx-auto mb-6">
            <FiCalendar size={40} className="m-auto" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">No Upcoming Interviews</h3>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">You don&apos;t have any interviews scheduled at the moment. Keep applying to land your dream job!</p>
        </div>
      )}
    </div>
  );
};

export default StudentInterviewsPage;

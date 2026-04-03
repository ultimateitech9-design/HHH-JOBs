import { useEffect, useMemo, useState } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiVideo, 
  FiMapPin, 
  FiPhone,
  FiLink,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiMonitor,
  FiChevronDown
} from 'react-icons/fi';
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

const getStatusColor = (status) => {
  const s = String(status || '').toLowerCase();
  switch (s) {
    case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
    case 'rescheduled': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
  }
};

const getModeIcon = (mode) => {
  switch(String(mode).toLowerCase()) {
    case 'virtual': return <FiVideo />;
    case 'onsite': return <FiMapPin />;
    case 'phone': return <FiPhone />;
    default: return <FiMonitor />;
  }
};

const HrInterviewsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const [form, setForm] = useState(defaultInterviewForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled

  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      const [jobsRes, interviewsRes] = await Promise.all([
        getHrJobs(),
        getHrInterviews()
      ]);

      if (!mounted) return;

      const jobsList = jobsRes.data || [];
      const fetchedInterviews = interviewsRes.data || [];
      
      // Sort interviews by date (newest first)
      fetchedInterviews.sort((a, b) => new Date(b.scheduled_at || b.scheduledAt) - new Date(a.scheduled_at || a.scheduledAt));

      setJobs(jobsList);
      setInterviews(fetchedInterviews);

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
      setTimeout(() => setMessage(''), 3000);
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
      setMessage(`Interview marked as ${status}.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(String(error.message || 'Unable to update interview.'));
    }
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter(inv => {
      const status = String(inv.status || 'scheduled').toLowerCase();
      if (activeTab === 'upcoming') return status === 'scheduled' || status === 'rescheduled';
      if (activeTab === 'completed') return status === 'completed';
      if (activeTab === 'cancelled') return status === 'cancelled';
      return true;
    });
  }, [interviews, activeTab]);

  return (
    <div className="space-y-8 pb-10 flex flex-col min-h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-primary tracking-tight mb-2 flex items-center gap-3">
            Interview Calendar
          </h1>
          <p className="text-neutral-500 text-lg">Schedule, track, and manage all candidate interview rounds.</p>
        </div>
      </header>

      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-200 shadow-sm animate-fade-in">
          <FiXCircle size={20} className="shrink-0" /> <span className="font-semibold">{state.error}</span>
        </div>
      )}
      {message && !state.error && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 border border-emerald-200 shadow-sm animate-fade-in">
          {message.includes('Unable') || message.includes('required') ? <FiXCircle size={20} className="shrink-0 text-amber-600" /> : <FiCheckCircle size={20} className="shrink-0" />} 
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start flex-1 min-h-0">
        
        {/* Left Panel: Scheduling Form */}
        <div className="xl:col-span-1 bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-6 md:p-8 xl:sticky xl:top-6 shrink-0">
          <div className="mb-6 flex flex-col border-b border-neutral-100 pb-6">
             <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 border border-brand-100">
               <FiPlus size={24} />
             </div>
             <h2 className="text-xl font-extrabold text-primary">Schedule Invite</h2>
             <p className="text-neutral-500 text-sm mt-1">Book a new interview slot</p>
          </div>

          <form onSubmit={handleCreateInterview} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5"><FiBriefcase className="text-neutral-400"/> Select Job</label>
              <div className="relative">
                <select 
                  value={form.jobId} 
                  onChange={(e) => setForm({ ...form, jobId: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium appearance-none"
                >
                  <option value="" disabled>Choose a role...</option>
                  {jobs.map((job) => (
                    <option key={job.id || job._id} value={job.id || job._id}>
                      {job.jobTitle}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5"><FiUser className="text-neutral-400"/> Select Candidate</label>
              <div className="relative">
                <select
                  value={form.applicationId}
                  onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium appearance-none"
                  disabled={!form.jobId || applicationOptions.length === 0}
                >
                  {applicationOptions.length === 0 ? (
                    <option value="" disabled>No applicants found</option>
                  ) : (
                    applicationOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  )}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-sm font-bold text-neutral-700">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full px-3 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium text-sm"
                />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-sm font-bold text-neutral-700">Format</label>
                <div className="relative">
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value, meetingLink: '', location: '' })}
                    className="w-full pl-3 pr-8 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium text-sm appearance-none"
                  >
                    <option value="virtual">Virtual</option>
                    <option value="onsite">On-Site</option>
                    <option value="phone">Phone</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {(form.mode === 'virtual' || form.mode === 'phone') && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">{form.mode === 'virtual' ? 'Meeting Link' : 'Contact Number'}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    {form.mode === 'virtual' ? <FiLink /> : <FiPhone />}
                  </span>
                  <input
                    value={form.meetingLink}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    placeholder={form.mode === 'virtual' ? "https://meet.google.com/..." : "+91..."}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>
            )}

            {form.mode === 'onsite' && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Office Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Full address"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">Interview Notes</label>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Instructions for the candidate..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Interview Invite'}
            </button>
          </form>
        </div>

        {/* Right Panel: Interview Directory */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
          
          <div className="p-4 md:p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
            <h3 className="text-xl font-extrabold text-primary flex items-center gap-2">
              <FiCalendar className="text-brand-500" /> Directory
            </h3>
            
            <div className="flex bg-neutral-100 rounded-xl p-1 overflow-x-auto hide-scrollbar">
              {['upcoming', 'completed', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-neutral-50/20">
            {state.loading ? (
              <div className="space-y-4">
                 {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white border border-neutral-100 rounded-2xl animate-pulse"></div>)}
              </div>
            ) : filteredInterviews.length > 0 ? (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <div key={interview.id} className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group flex flex-col sm:flex-row sm:items-start gap-5">
                    
                    <div className="flex-1 min-w-0 flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {getModeIcon(interview.mode)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-primary text-lg truncate pr-2">
                            {interview.mode ? String(interview.mode).charAt(0).toUpperCase() + String(interview.mode).slice(1) : 'Interview'} Round
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider border ${getStatusColor(interview.status)}`}>
                            {interview.status || 'Scheduled'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-neutral-500 mb-3 line-clamp-1">Job ID: <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-600">{interview.job_id || interview.jobId || 'Unknown'}</span></p>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-bold text-neutral-500">
                          <span className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
                            <FiClock className="text-neutral-400"/> {formatDateTime(interview.scheduled_at || interview.scheduledAt)}
                          </span>
                          {(interview.location || interview.meetingLink || interview.meeting_link) && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 text-brand-700 bg-brand-50 rounded-lg border border-brand-100 line-clamp-1 max-w-[200px]">
                              {interview.mode === 'virtual' ? <FiVideo className="shrink-0" /> : <FiMapPin className="shrink-0" />} 
                              <span className="truncate">{interview.location || interview.meetingLink || interview.meeting_link}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-100 pt-4 sm:pt-0 sm:pl-5">
                      {(interview.meeting_link || interview.meetingLink) && (
                        <a
                          href={interview.meeting_link || interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold rounded-xl transition-colors text-xs border border-indigo-100"
                        >
                          <FiLink /> Join Space
                        </a>
                      )}
                      
                      {String(interview.status).toLowerCase() === 'scheduled' || String(interview.status).toLowerCase() === 'rescheduled' ? (
                        <>
                           <button 
                             onClick={() => updateInterviewStatus(interview.id, 'completed')}
                             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 font-bold rounded-xl transition-colors text-xs"
                           >
                             <FiCheckCircle /> Mark Complete
                           </button>
                           <button 
                             onClick={() => updateInterviewStatus(interview.id, 'cancelled')}
                             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 font-bold rounded-xl transition-colors text-xs"
                           >
                             <FiXCircle /> Cancel
                           </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => updateInterviewStatus(interview.id, 'scheduled')}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 font-bold rounded-xl transition-colors text-xs"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <FiCalendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-neutral-700 mb-2">No Interviews Found</h3>
                <p>There are no {activeTab} interviews in the system.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HrInterviewsPage;

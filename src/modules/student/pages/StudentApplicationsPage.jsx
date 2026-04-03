import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { 
  FiBriefcase, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiCalendar, 
  FiChevronRight,
  FiFilter
} from 'react-icons/fi';
import { formatDateTime, getStudentApplications } from '../services/studentApi';

const STATUS_STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'interviewed', label: 'Interviewed' },
  { id: 'offered', label: 'Offered' },
  { id: 'hired', label: 'Hired' }
];

const StudentApplicationsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, applications: [] });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      setState(prev => ({ ...prev, loading: true }));
      const response = await getStudentApplications();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error && !response.isDemo ? response.error : '',
        isDemo: response.isDemo,
        applications: response.data || []
      });
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return state.applications;
    return state.applications.filter((item) => String(item.status || '').toLowerCase() === statusFilter);
  }, [state.applications, statusFilter]);

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'interviewed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'offered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'hired': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getTimelineProgress = (currentStatus) => {
    if (currentStatus === 'rejected') return -1;
    const index = STATUS_STAGES.findIndex(s => s.id === currentStatus);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-primary tracking-tight mb-2">My Applications</h1>
        <p className="text-neutral-500 text-lg">Track your application status and interview pipeline.</p>
      </header>

      {state.isDemo && (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-center gap-3 border border-amber-200">
          <span className="font-semibold">Demo Mode: Showing sample application data.</span>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-200">
          <FiXCircle size={20} /> <span className="font-semibold">{state.error}</span>
        </div>
      )}

      {/* Filter Section */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
            <FiFilter size={18} />
          </div>
          <span className="font-bold text-primary">Filter Status</span>
        </div>
        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar flex gap-2">
          {['all', ...STATUS_STAGES.map(s => s.id), 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                statusFilter === status 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Applications List */}
      {state.loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-neutral-100"></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((app) => {
            const targetId = app.jobId || app.job_id || app.job?.id;
            const currentStatus = String(app.status || 'applied').toLowerCase();
            const progressIndex = getTimelineProgress(currentStatus);
            const isRejected = currentStatus === 'rejected';

            return (
              <article key={app.id || app._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between mb-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 border border-brand-100">
                      <FiBriefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">
                        {app.jobTitle || app.job?.jobTitle || 'Untitled Role'}
                      </h3>
                      <p className="text-neutral-500 font-medium mb-3">
                        {app.companyName || app.job?.companyName || 'Unknown Company'}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(currentStatus)}`}>
                          {currentStatus.toUpperCase()}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                          <FiClock /> Updated {formatDateTime(app.statusUpdatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {targetId && (
                    <Link 
                      to={`/portal/student/jobs/${targetId}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-50 text-primary font-bold rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors shrink-0"
                    >
                      View Job <FiChevronRight />
                    </Link>
                  )}
                </div>

                {/* Timeline Visualizer */}
                <div className="relative pt-4 px-2 md:px-8">
                  <div className="absolute top-7 left-8 right-8 h-1 bg-neutral-100 rounded-full z-0"></div>
                  <div 
                    className={`absolute top-7 left-8 h-1 rounded-full z-0 transition-all duration-1000 ${isRejected ? 'bg-red-500' : 'bg-brand-500'}`} 
                    style={{ width: isRejected ? '100%' : `${(progressIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
                  ></div>

                  <div className="relative z-10 flex justify-between">
                    {STATUS_STAGES.map((stage, idx) => {
                      const isActive = !isRejected && progressIndex >= idx;
                      const isCurrent = !isRejected && progressIndex === idx;
                      
                      return (
                        <div key={stage.id} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 shadow-sm border-2 ${
                            isActive 
                              ? 'bg-brand-500 border-brand-500 text-white' 
                              : isRejected
                                ? 'bg-neutral-100 border-neutral-200 text-neutral-300'
                                : 'bg-white border-neutral-200 text-neutral-300'
                          }`}>
                            {isActive ? <FiCheckCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>}
                          </div>
                          <span className={`text-xs font-bold ${
                            isCurrent ? 'text-brand-600' : isActive ? 'text-primary' : 'text-neutral-400'
                          }`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {isRejected && (
                    <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                      <FiXCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-bold text-red-800">Application Unsuccessful</p>
                        <p className="text-xs text-red-600 mt-1">Don&apos;t be discouraged! Continue applying to similar roles to increase your chances.</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm">
          <div className="w-20 h-20 bg-neutral-50 text-neutral-300 rounded-full flex flex-items-center justify-center mx-auto mb-4">
            <FiBriefcase size={32} className="m-auto" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">No Applications Found</h3>
          <p className="text-neutral-500 mb-6">You haven&apos;t applied to any jobs with the selected status.</p>
          <Link to="/portal/student/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors">
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;

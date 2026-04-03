import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiUser, 
  FiBook, 
  FiBriefcase, 
  FiFileText, 
  FiCheckCircle, 
  FiCamera, 
  FiEdit2, 
  FiDownload, 
  FiRefreshCw, 
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';
import { getCurrentUser } from '../../../utils/auth';
import { getStudentProfile, updateStudentAvatar, updateStudentProfile, getResumeScore } from '../services/studentApi';

const TABS = [
  { id: 'personal', label: 'Personal Details', icon: FiUser },
  { id: 'education', label: 'Education', icon: FiBook },
  { id: 'skills', label: 'Skills & Exp', icon: FiBriefcase },
  { id: 'resume', label: 'Resume', icon: FiFileText },
  { id: 'score', label: 'Resume Score', icon: FiAward }
];

const StudentProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [scoreData, setScoreData] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', headline: '', targetRole: '', location: '', dateOfBirth: '', gender: '', profileSummary: '',
    technicalSkills: '', softSkills: '', projects: '', experience: '', resumeText: '', linkedinUrl: '', githubUrl: '', avatarUrl: ''
  });

  const currentUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      const response = await getStudentProfile();
      if (!mounted) return;
      
      const data = response.data || {};
      setForm({
        name: data.name || currentUser?.name || '',
        email: data.email || currentUser?.email || '',
        mobile: data.mobile || currentUser?.mobile || '',
        headline: data.headline || '',
        targetRole: data.targetRole || '',
        location: data.location || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        profileSummary: data.profileSummary || '',
        technicalSkills: (data.technicalSkills || []).join(', '),
        softSkills: (data.softSkills || []).join(', '),
        projects: (data.projects || []).join('\\n'),
        experience: (data.experience || []).join('\\n'),
        resumeText: data.resumeText || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        avatarUrl: data.avatarUrl || currentUser?.avatarUrl || ''
      });
      calculateCompletion(data);
      setLoading(false);
    };
    loadProfile();
    return () => { mounted = false; };
  // calculateCompletion intentionally closes over local form state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (activeTab !== 'score') return;
    if (scoreData) return;
    setScoreLoading(true);
    getResumeScore().then((res) => {
      setScoreData(res.data || null);
      setScoreLoading(false);
    });
  }, [activeTab, scoreData]);

  const calculateCompletion = (data) => {
    const fields = ['name', 'email', 'mobile', 'headline', 'location', 'profileSummary'];
    let filled = 0;
    fields.forEach(f => { if (data[f] || form[f]) filled++; });
    if (data.technicalSkills?.length || form.technicalSkills) filled++;
    if (data.experience?.length || form.experience) filled++;
    if (data.resumeText || form.resumeText) filled++;
    setProfileCompletion(Math.round((filled / (fields.length + 3)) * 100));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      calculateCompletion(updated);
      return updated;
    });
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        technicalSkills: form.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
        softSkills: form.softSkills.split(',').map(s => s.trim()).filter(Boolean),
        projects: form.projects.split('\\n').map(s => s.trim()).filter(Boolean),
        experience: form.experience.split('\\n').map(s => s.trim()).filter(Boolean),
      };
      await updateStudentProfile(payload, { prebuiltPayload: true });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateResume = () => {
    const generated = `${form.name || 'Student Name'}
${form.headline || form.targetRole || 'Professional Title'}
${form.email} | ${form.mobile} | ${form.location}
${form.linkedinUrl ? `LinkedIn: ${form.linkedinUrl}` : ''}

SUMMARY
-----------------
${form.profileSummary || 'Add a summary.'}

SKILLS
-----------------
Technical: ${form.technicalSkills || 'None added'}
Soft Skills: ${form.softSkills || 'None added'}

EXPERIENCE
-----------------
${form.experience ? form.experience.split('\\n').map(l => `- ${l}`).join('\\n') : 'Add experience details.'}

PROJECTS
-----------------
${form.projects ? form.projects.split('\\n').map(l => `- ${l}`).join('\\n') : 'Add projects.'}
`;
    setForm(prev => ({ ...prev, resumeText: generated.trim() }));
    setSuccess('Resume generated based on your profile inputs!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      
      {/* Header & Avatar Section */}
      <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-neutral-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-bl-full pointer-events-none -z-10"></div>
        
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-brand-100 flex items-center justify-center text-brand-600 text-4xl font-bold relative z-10">
            {form.avatarUrl ? <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : form.name.charAt(0) || 'U'}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 text-white">
            <FiCamera size={24} />
          </div>
          {/* Progress Ring */}
          <svg className="absolute -top-2 -left-2 w-36 h-36 -z-0 rotate-[-90deg]">
            <circle cx="72" cy="72" r="68" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-neutral-100" />
            <circle cx="72" cy="72" r="68" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="427" strokeDashoffset={427 - (427 * profileCompletion) / 100} className="text-emerald-500 transition-all duration-1000" />
          </svg>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-primary">{form.name || 'Your Name'}</h1>
            <button className="text-neutral-400 hover:text-brand-600 transition-colors"><FiEdit2 /></button>
          </div>
          <p className="text-lg text-neutral-500 mb-4">{form.headline || form.targetRole || 'Add your professional headline'}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
              <FiTrendingUp /> Profile Completion: {profileCompletion}%
            </div>
            {profileCompletion < 100 && (
              <span className="text-sm text-brand-600 font-medium">Add missing details to rank higher.</span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-600 text-white shadow-md' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
          
          <button onClick={handleSave} disabled={saving} className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-70">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiCheckCircle /> Save Profile</>}
          </button>

          {success && <p className="text-emerald-600 text-sm font-bold text-center mt-4 animate-fade-in">{success}</p>}
          {error && <p className="text-red-500 text-sm font-bold text-center mt-4">{error}</p>}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-neutral-100 h-full">
            
            {activeTab === 'personal' && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-2xl font-extrabold mb-6 text-primary">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700">Email Address</label>
                    <input name="email" value={form.email} disabled className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700">Mobile Number</label>
                    <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="9876543210" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="Mumbai, India" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-neutral-700">Professional Headline</label>
                    <input name="headline" value={form.headline} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="Frontend Developer | React Enthusiast" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-neutral-700">Profile Summary</label>
                    <textarea name="profileSummary" value={form.profileSummary} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="A brief summary of your background, goals, and passions..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-extrabold text-primary">Education</h3>
                </div>
                <div className="p-8 border-2 border-dashed border-neutral-200 rounded-2xl text-center flex flex-col items-center justify-center bg-neutral-50/50">
                  <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-4"><FiBook size={28} /></div>
                  <h4 className="text-lg font-bold text-primary mb-1">Add Education History</h4>
                  <p className="text-sm text-neutral-500 mb-4 max-w-sm">Include your high school, college, and any relevant bootcamps or certifications.</p>
                  <button className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors">Add Education</button>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="animate-fade-in space-y-8">
                <h3 className="text-2xl font-extrabold mb-6 text-primary">Skills & Experience</h3>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">Technical Skills (comma separated)</label>
                  <input name="technicalSkills" value={form.technicalSkills} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="React, Node.js, Python, SQL" />
                  {form.technicalSkills && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.technicalSkills.split(',').filter(Boolean).map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100">{s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">Work Experience (one per line)</label>
                  <textarea name="experience" value={form.experience} onChange={handleChange} rows="5" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="Frontend Developer Intern at TechCorp (2025)\nFreelance Web Designer (2024)"></textarea>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">Projects (one per line)</label>
                  <textarea name="projects" value={form.projects} onChange={handleChange} rows="5" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="E-commerce Website (React, Stripe)\nPortfolio Builder (Vue, Firebase)"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'score' && (
              <div className="animate-fade-in space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-primary">Resume Score</h3>
                    <p className="text-neutral-500 text-sm">AI-driven profile completeness and quality analysis.</p>
                  </div>
                  <button
                    onClick={() => { setScoreData(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-bold rounded-xl hover:bg-brand-100 transition-colors text-sm border border-brand-100"
                  >
                    <FiRefreshCw size={14} /> Refresh Score
                  </button>
                </div>

                {scoreLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                  </div>
                ) : scoreData ? (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="relative w-44 h-44 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                          <circle
                            cx="50" cy="50" r="42" fill="transparent"
                            stroke={scoreData.score >= 70 ? '#10b981' : scoreData.score >= 50 ? '#e59b17' : '#ef4444'}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - scoreData.score / 100)}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-extrabold text-primary">{scoreData.score}</span>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">/ {scoreData.maxScore || 100}</span>
                          <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${scoreData.score >= 90 ? 'bg-emerald-100 text-emerald-700' : scoreData.score >= 70 ? 'bg-green-100 text-green-700' : scoreData.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {scoreData.grade}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        {(scoreData.breakdown || []).map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-primary flex items-center gap-2">
                                {item.filled ? <FiCheckCircle size={13} className="text-emerald-500" /> : <FiAward size={13} className="text-neutral-300" />}
                                {item.label}
                              </span>
                              <span className="text-xs font-extrabold text-neutral-500">{item.earned}/{item.weight} pts</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${item.filled ? 'bg-emerald-500' : 'bg-neutral-200'}`}
                                style={{ width: item.filled ? '100%' : '0%' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {scoreData.tips && scoreData.tips.length > 0 && (
                      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
                        <h4 className="text-base font-extrabold text-primary mb-3 flex items-center gap-2">
                          <FiTrendingUp className="text-brand-600" /> Improvement Tips
                        </h4>
                        <ul className="space-y-2">
                          {scoreData.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="mt-0.5 w-5 h-5 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-400 py-8 text-center">Score could not be loaded. Complete your profile first.</p>
                )}
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="animate-fade-in space-y-6 flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-2xl font-extrabold text-primary">Resume Builder</h3>
                    <p className="text-neutral-500 text-sm">Hiring managers and ATS scanners parse this text.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleGenerateResume} className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-bold rounded-xl hover:bg-brand-100 transition-colors text-sm border border-brand-100">
                      <FiRefreshCw /> Auto-Generate
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors text-sm">
                      <FiDownload /> Download
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-[400px]">
                  <textarea 
                    name="resumeText" 
                    value={form.resumeText} 
                    onChange={handleChange} 
                    className="w-full h-full min-h-[400px] p-6 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none resize-y" 
                    placeholder="Click Auto-Generate to create a resume from your profile, or paste your text resume here..."
                  ></textarea>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;

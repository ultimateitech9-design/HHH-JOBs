import { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiAward, 
  FiFileText, 
  FiUser, 
  FiX, 
  FiFilter,
  FiMail
} from 'react-icons/fi';
import { searchHrCandidates } from '../services/hrApi';

const initialFilters = {
  search: '',
  skills: '',
  location: '',
  experience: ''
};

const HrCandidatesPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, candidates: [] });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const runSearch = async (nextFilters = filters) => {
    setState((current) => ({ ...current, loading: true, error: '' }));

    const response = await searchHrCandidates(nextFilters);
    setState({
      loading: false,
      error: response.error && !response.isDemo ? response.error : '',
      isDemo: response.isDemo,
      candidates: response.data || []
    });
  };

  useEffect(() => {
    runSearch(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(filters);
    setIsFilterOpen(false); // Close mobile filter after search
  };

  const handleReset = () => {
    setFilters(initialFilters);
    runSearch(initialFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => String(v).trim() !== '').length;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-primary tracking-tight mb-2 flex items-center gap-3">
            Candidate Database
            <span className="bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1 rounded-full">
              {state.candidates.length} Found
            </span>
          </h1>
          <p className="text-neutral-500 text-lg">Search the platform database to source talent by keywords, skills, and experience.</p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-xl font-bold text-primary shadow-sm hover:bg-neutral-50 transition-colors w-full"
        >
          <FiFilter /> Filters {activeFilterCount > 0 && <span className="bg-brand-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </header>

      {state.isDemo && (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl border border-amber-200 shadow-sm font-semibold">
          Demo Mode: Search is operating on mock candidate data.
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 shadow-sm font-semibold">
          {state.error}
        </div>
      )}

      {/* Main Layout: Filters (Left/Top) + Results (Right/Bottom) */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Filter Sidebar */}
        <aside className={`w-full md:w-80 shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 p-6 md:p-8 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-primary flex items-center gap-2">
                <FiFilter className="text-brand-500" /> Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={handleReset} className="text-sm font-bold text-neutral-400 hover:text-brand-600 transition-colors">
                  Clear All
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Keyword Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    value={filters.search} 
                    onChange={(e) => updateFilter('search', e.target.value)} 
                    placeholder="Name, role, keyword..." 
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Skills</label>
                <div className="relative">
                  <FiAward className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    value={filters.skills} 
                    onChange={(e) => updateFilter('skills', e.target.value)} 
                    placeholder="React, Node.js, Design..." 
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    value={filters.location} 
                    onChange={(e) => updateFilter('location', e.target.value)} 
                    placeholder="City, State, Remote..." 
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Experience Level</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    value={filters.experience} 
                    onChange={(e) => updateFilter('experience', e.target.value)} 
                    placeholder="Eg. 2 Years, Fresher..." 
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors shadow-sm">
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
          
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <span className="text-sm font-bold text-neutral-500 pt-1">Active:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value.trim()) return null;
                return (
                  <span key={key} className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold capitalize border border-brand-100">
                    {key}: {value}
                    <button onClick={() => { updateFilter(key, ''); runSearch({...filters, [key]: ''}); }} className="hover:text-brand-900 ml-1">
                      <FiX />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {state.loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] border border-neutral-100 animate-pulse"></div>)}
            </div>
          ) : state.candidates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {state.candidates.map((entry, idx) => {
                const user = entry.user || {};
                const profile = entry.profile || {};
                const nameStr = user.name || `Candidate ${idx + 1}`;
                const initials = nameStr.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
                
                return (
                  <article key={user.id || user.email || idx} className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 border border-brand-200 rounded-2xl flex items-center justify-center text-lg font-black shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-extrabold text-primary truncate group-hover:text-brand-600 transition-colors">{nameStr}</h3>
                        <p className="text-sm font-medium text-neutral-500 truncate mb-1">{profile.headline || 'Professional'}</p>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold truncate">
                          <FiMapPin /> {profile.location || 'Location Not Specified'}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <p className="text-sm text-neutral-600 font-medium line-clamp-2 mb-4">
                        {profile.about || 'No summary provided by the candidate.'}
                      </p>
                      
                      {profile.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold uppercase tracking-wide">
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 5 && (
                            <span className="px-2 py-1 bg-neutral-50 text-neutral-400 rounded-md text-[10px] font-bold border border-neutral-200">
                              +{profile.skills.length - 5}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-400 italic">No skills listed</div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-auto">
                      <a 
                        href={`mailto:${user.email}`} 
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-neutral-50 text-neutral-600 font-bold rounded-xl hover:bg-neutral-100 transition-colors text-sm border border-neutral-200"
                        title="Contact Candidate"
                      >
                        <FiMail /> Contact
                      </a>
                      
                      {profile.resume_url ? (
                        <a 
                          href={profile.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-50 text-brand-700 font-bold rounded-xl hover:bg-brand-600 hover:text-white transition-colors text-sm"
                        >
                          <FiFileText /> View Resume
                        </a>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-neutral-50 text-neutral-400 font-bold rounded-xl text-sm border border-neutral-100 cursor-not-allowed" title="Resume not provided">
                          <FiFileText /> No Resume
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-16 text-center border border-neutral-100 shadow-sm max-w-2xl mx-auto h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-brand-50 text-brand-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser size={40} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">No Candidates Found</h3>
              <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                We couldn&apos;t find any candidate profiles matching your current filters. Try broadening your search terms.
              </p>
              {activeFilterCount > 0 && (
                <button onClick={handleReset} className="bg-white border border-neutral-200 text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrCandidatesPage;

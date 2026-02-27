import { useEffect, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
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
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Candidate Search"
        title="Find Candidate Profiles"
        subtitle="Search candidate database by keywords, skills, location, and experience."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Search
            <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Name, headline, keyword" />
          </label>

          <label>
            Skills
            <input value={filters.skills} onChange={(event) => updateFilter('skills', event.target.value)} placeholder="React, Node.js" />
          </label>

          <label>
            Location
            <input value={filters.location} onChange={(event) => updateFilter('location', event.target.value)} placeholder="Bengaluru" />
          </label>

          <label>
            Experience
            <input value={filters.experience} onChange={(event) => updateFilter('experience', event.target.value)} placeholder="2 years" />
          </label>

          <div className="student-job-actions full-row">
            <button type="submit" className="btn-primary">Search Candidates</button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setFilters(initialFilters);
                runSearch(initialFilters);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {state.loading ? <p className="module-note">Loading candidates...</p> : null}

      <div className="student-job-grid">
        {state.candidates.map((entry) => {
          const user = entry.user || {};
          const profile = entry.profile || {};
          return (
            <article className="student-job-card" key={user.id || user.email}>
              <h3>{user.name || 'Candidate'}</h3>
              <p>{user.email || '-'}</p>
              <p>{profile.headline || '-'}</p>
              <p>{profile.location || '-'}</p>

              <div className="student-chip-row">
                {(profile.skills || []).slice(0, 8).map((skill) => (
                  <span key={skill} className="student-chip">{skill}</span>
                ))}
              </div>

              {profile.resume_url ? (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="inline-link">
                  Open Resume
                </a>
              ) : (
                <p className="module-note">Resume URL not available</p>
              )}
            </article>
          );
        })}
      </div>

      {(!state.loading && state.candidates.length === 0) ? (
        <section className="panel-card">
          <p className="module-note">No candidates found for current filters.</p>
        </section>
      ) : null}
    </div>
  );
};

export default HrCandidatesPage;


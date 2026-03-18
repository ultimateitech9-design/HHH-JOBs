import React from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';

const Banner = ({
  query,
  location,
  experienceLevel,
  jobsCount,
  isDemoMode,
  handleInputChange,
  onLocationChange,
  onExperienceChange
}) => {
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4 pt-[110px] pb-8'>
      <div className='naukri-hero-wrap reveal-up'>
        <p className='naukri-hero-tag'>HHH Job - India Job Platform</p>
        <h1 className='naukri-hero-title'>Find your dream job now</h1>
        <p className='naukri-hero-subtitle'>
          {jobsCount}
          {' '}
          active jobs ready to explore
        </p>

        <form onSubmit={(event) => event.preventDefault()} className='naukri-search-bar'>
          <div className='naukri-search-field'>
            <FiSearch />
            <input
              type='text'
              id='job-search'
              name='job-search'
              placeholder='Enter skills / designation / companies'
              onChange={handleInputChange}
              value={query}
            />
          </div>
          <div className='naukri-search-field'>
            <select value={experienceLevel} onChange={(event) => onExperienceChange(event.target.value)}>
              <option value='all'>Select experience</option>
              <option value='fresher/no experience'>Fresher</option>
              <option value='internship'>Internship</option>
              <option value='1-3 years'>1-3 years</option>
              <option value='2-4 years'>2-4 years</option>
              <option value='2-5 years'>2-5 years</option>
            </select>
          </div>
          <div className='naukri-search-field'>
            <FiMapPin />
            <input
              type='text'
              id='location-search'
              name='location-search'
              placeholder='Enter location'
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
            />
          </div>
          <a href='#jobs' className='naukri-search-button'>
            Search
          </a>
        </form>

        {isDemoMode && <span className='demo-badge mt-4 inline-flex'>Demo Data Enabled</span>}
      </div>
    </div>
  );
};

export default Banner;

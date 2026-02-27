import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';

const Card = ({ data, index = 0 }) => {
  const {
    _id,
    id,
    status,
    companyName,
    jobTitle,
    companyLogo,
    minPrice,
    maxPrice,
    jobLocation,
    employmentType,
    postingDate,
    description
  } = data;

  return (
    <section className='card card-stagger' style={{ animationDelay: `${index * 90}ms` }}>
      <Link to={`/job/${_id || id}`} className='flex gap-4 flex-col sm:flex-row items-start'>
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className='card-logo' />
        ) : (
          <div className='card-logo-placeholder'>
            {(companyName || 'H').slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <div className='flex flex-wrap gap-2 items-center mb-1'>
            <h4 className='text-primary font-semibold'>{companyName}</h4>
            <span className='cinematic-chip capitalize'>{status || 'open'}</span>
          </div>
          <h3 className='text-lg font-semibold mb-2'>{jobTitle}</h3>

          <div className='text-primary/75 text-sm md:text-base flex flex-wrap gap-3 mb-2'>
            <span className='flex items-center gap-2'>
              <FiMapPin /> {jobLocation}
            </span>
            <span className='flex items-center gap-2'>
              <FiClock /> {employmentType}
            </span>
            <span className='flex items-center gap-2'>
              <FiDollarSign /> {minPrice}-{maxPrice}
            </span>
            <span className='flex items-center gap-2'>
              <FiCalendar /> {postingDate}
            </span>
          </div>

          <p className='text-base text-primary/75'>{String(description || '').slice(0, 180)}...</p>
        </div>
      </Link>
    </section>
  );
};

export default Card;

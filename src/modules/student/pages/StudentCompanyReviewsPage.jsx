// import { useState } from 'react';
// import SectionHeader from '../../../shared/components/SectionHeader';
// import StatusPill from '../../../shared/components/StatusPill';
// import {
//   addCompanyReview,
//   formatDateTime,
//   getCompanyReviews
// } from '../services/studentApi';

// const initialReviewForm = {
//   companyName: '',
//   rating: 5,
//   title: '',
//   review: '',
//   jobId: ''
// };

// const StudentCompanyReviewsPage = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [reviewState, setReviewState] = useState({ summary: { count: 0, averageRating: 0 }, reviews: [] });
//   const [form, setForm] = useState(initialReviewForm);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const searchReviews = async () => {
//     setMessage('');
//     setError('');

//     if (!companyName.trim()) {
//       setError('Enter company name to search reviews.');
//       return;
//     }

//     setLoading(true);
//     const response = await getCompanyReviews(companyName.trim());
//     setLoading(false);

//     setReviewState({
//       summary: response.data.summary,
//       reviews: response.data.reviews
//     });

//     if (response.error) {
//       setError(response.error);
//     }
//   };

//   const submitReview = async (event) => {
//     event.preventDefault();
//     setMessage('');
//     setError('');

//     if (!form.companyName || !form.review) {
//       setError('Company name and review text are required.');
//       return;
//     }

//     try {
//       const created = await addCompanyReview({
//         companyName: form.companyName,
//         rating: Number(form.rating),
//         title: form.title,
//         review: form.review,
//         jobId: form.jobId || null
//       });

//       if (companyName.trim().toLowerCase() === form.companyName.trim().toLowerCase()) {
//         const nextReviews = [created, ...reviewState.reviews];
//         const avg = nextReviews.length
//           ? Number((nextReviews.reduce((acc, item) => acc + Number(item.rating || 0), 0) / nextReviews.length).toFixed(2))
//           : 0;
//         setReviewState((current) => ({
//           ...current,
//           summary: { count: nextReviews.length, averageRating: avg },
//           reviews: nextReviews
//         }));
//       }

//       setForm(initialReviewForm);
//       setMessage('Review submitted successfully.');
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to submit review.');
//     }
//   };

//   return (
//     <div className="module-page module-page--student">
//       <SectionHeader
//         eyebrow="Company Reviews"
//         title="Search and Submit Company Feedback"
//         subtitle="Review company experience and help candidates make better decisions."
//       />

//       {message ? <p className="form-success">{message}</p> : null}
//       {error ? <p className="form-error">{error}</p> : null}

//       <section className="panel-card">
//         <div className="student-inline-controls">
//           <label className="full-width-control">
//             Company Name
//             <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="NovaStack Labs" />
//           </label>
//           <button type="button" className="btn-primary" onClick={searchReviews}>Search Reviews</button>
//         </div>
//       </section>

//       <section className="panel-card">
//         <SectionHeader
//           eyebrow="Summary"
//           title={`Average Rating: ${reviewState.summary.averageRating || 0}`}
//           subtitle={`${reviewState.summary.count || 0} review(s) found`}
//         />

//         {loading ? <p className="module-note">Loading reviews...</p> : null}

//         <ul className="student-list">
//           {reviewState.reviews.map((item) => (
//             <li key={item.id}>
//               <div>
//                 <h4>{item.title || 'Candidate review'}</h4>
//                 <p>{item.review}</p>
//                 <p>{formatDateTime(item.created_at || item.createdAt)}</p>
//               </div>
//               <StatusPill value={`${item.rating}/5`} />
//             </li>
//           ))}
//           {(!loading && reviewState.reviews.length === 0) ? <li>No reviews found for this company.</li> : null}
//         </ul>
//       </section>

//       <section className="panel-card">
//         <SectionHeader eyebrow="Write Review" title="Submit Your Experience" />

//         <form className="form-grid" onSubmit={submitReview}>
//           <label>
//             Company Name
//             <input
//               value={form.companyName}
//               onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
//             />
//           </label>

//           <label>
//             Rating
//             <select
//               value={form.rating}
//               onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
//             >
//               <option value={5}>5</option>
//               <option value={4}>4</option>
//               <option value={3}>3</option>
//               <option value={2}>2</option>
//               <option value={1}>1</option>
//             </select>
//           </label>

//           <label className="full-row">
//             Title
//             <input
//               value={form.title}
//               onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
//             />
//           </label>

//           <label className="full-row">
//             Review
//             <textarea
//               rows={5}
//               value={form.review}
//               onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))}
//             />
//           </label>

//           <label>
//             Job ID (optional)
//             <input
//               value={form.jobId}
//               onChange={(event) => setForm((current) => ({ ...current, jobId: event.target.value }))}
//             />
//           </label>

//           <button type="submit" className="btn-primary">Submit Review</button>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default StudentCompanyReviewsPage;






// import { useState } from 'react';
// import SectionHeader from '../../../shared/components/SectionHeader';
// import StatusPill from '../../../shared/components/StatusPill';
// import {
//   addCompanyReview,
//   formatDateTime,
//   getCompanyReviews
// } from '../services/studentApi';

// const initialReviewForm = {
//   companyName: '',
//   rating: 5,
//   title: '',
//   review: '',
//   jobId: ''
// };

// const reviewIssues = [
//   'App Crashed & Freezing',
//   'Poor Photo Quality',
//   'GPS Tracking Issues',
//   'Slow Performance',
//   'Other'
// ];

// const StudentCompanyReviewsPage = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [reviewState, setReviewState] = useState({
//     summary: { count: 0, averageRating: 0 },
//     reviews: []
//   });
//   const [form, setForm] = useState(initialReviewForm);
//   const [selectedIssue, setSelectedIssue] = useState('Other');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const searchReviews = async () => {
//     setMessage('');
//     setError('');

//     if (!companyName.trim()) {
//       setError('Enter company name to search reviews.');
//       return;
//     }

//     setLoading(true);
//     const response = await getCompanyReviews(companyName.trim());
//     setLoading(false);

//     setReviewState({
//       summary: response?.data?.summary || { count: 0, averageRating: 0 },
//       reviews: response?.data?.reviews || []
//     });

//     if (response?.error) {
//       setError(response.error);
//     }
//   };

//   const handleStarClick = (ratingValue) => {
//     setForm((current) => ({
//       ...current,
//       rating: ratingValue
//     }));
//   };

//   const submitReview = async (event) => {
//     event.preventDefault();
//     setMessage('');
//     setError('');

//     if (!form.companyName.trim() || !form.review.trim()) {
//       setError('Company name and review text are required.');
//       return;
//     }

//     try {
//       const created = await addCompanyReview({
//         companyName: form.companyName.trim(),
//         rating: Number(form.rating),
//         title: selectedIssue,
//         review: form.review.trim(),
//         jobId: form.jobId || null
//       });

//       if (
//         companyName.trim().toLowerCase() ===
//         form.companyName.trim().toLowerCase()
//       ) {
//         const nextReviews = [created, ...reviewState.reviews];
//         const avg = nextReviews.length
//           ? Number(
//               (
//                 nextReviews.reduce(
//                   (acc, item) => acc + Number(item.rating || 0),
//                   0
//                 ) / nextReviews.length
//               ).toFixed(2)
//             )
//           : 0;

//         setReviewState((current) => ({
//           ...current,
//           summary: { count: nextReviews.length, averageRating: avg },
//           reviews: nextReviews
//         }));
//       }

//       setForm(initialReviewForm);
//       setSelectedIssue('Other');
//       setMessage('Review submitted successfully.');
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to submit review.');
//     }
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       <SectionHeader
//         eyebrow="Company Reviews"
//         title="Search and Submit Company Feedback"
//         subtitle="Review company experience and help candidates make better decisions."
//       />

//       {message ? (
//         <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
//           {message}
//         </p>
//       ) : null}

//       {error ? (
//         <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </p>
//       ) : null}

//       <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
//         <div className="flex flex-col gap-4 md:flex-row md:items-end">
//           <label className="flex-1">
//             <span className="mb-2 block text-sm font-semibold text-slate-700">
//               Company Name
//             </span>
//             <input
//               value={companyName}
//               onChange={(event) => setCompanyName(event.target.value)}
//               placeholder="NovaStack Labs"
//               className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
//             />
//           </label>

//           <button
//             type="button"
//             className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
//             onClick={searchReviews}
//           >
//             Search Reviews
//           </button>
//         </div>
//       </section>

//       <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
//         <SectionHeader
//           eyebrow="Summary"
//           title={`Average Rating: ${reviewState.summary.averageRating || 0}`}
//           subtitle={`${reviewState.summary.count || 0} review(s) found`}
//         />

//         {loading ? (
//           <p className="mt-4 text-sm text-slate-500">Loading reviews...</p>
//         ) : null}

//         <ul className="mt-4 space-y-3">
//           {reviewState.reviews.map((item) => (
//             <li
//               key={item.id}
//               className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-start md:justify-between"
//             >
//               <div className="space-y-1">
//                 <h4 className="text-base font-semibold text-slate-800">
//                   {item.title || 'Candidate review'}
//                 </h4>
//                 <p className="text-sm leading-6 text-slate-600">{item.review}</p>
//                 <p className="text-xs text-slate-400">
//                   {formatDateTime(item.created_at || item.createdAt)}
//                 </p>
//               </div>

//               <div className="shrink-0">
//                 <StatusPill value={`${item.rating}/5`} />
//               </div>
//             </li>
//           ))}

//           {!loading && reviewState.reviews.length === 0 ? (
//             <li className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
//               No reviews found for this company.
//             </li>
//           ) : null}
//         </ul>
//       </section>

//       <section className="mx-auto w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
//         <div className="mb-5">
//           <h3 className="text-2xl font-bold tracking-tight text-slate-800">
//             Share Your Feedback
//           </h3>
//           <p className="mt-1 text-sm text-slate-400">Rate your experience</p>
//         </div>

//         <form onSubmit={submitReview} className="space-y-5">
//           <label className="block">
//             <span className="mb-2 block text-sm font-semibold text-slate-700">
//               Company Name
//             </span>
//             <input
//               type="text"
//               value={form.companyName}
//               onChange={(event) =>
//                 setForm((current) => ({
//                   ...current,
//                   companyName: event.target.value
//                 }))
//               }
//               placeholder="Enter company name"
//               className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
//             />
//           </label>

//           <div>
//             <div className="mb-3 text-sm font-semibold text-slate-700">
//               Rating
//             </div>

//             <div className="flex items-center gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => handleStarClick(star)}
//                   aria-label={`Rate ${star} star`}
//                   className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl transition ${
//                     form.rating >= star
//                       ? 'border-sky-400 bg-sky-50 text-amber-400 shadow-sm'
//                       : 'border-slate-200 bg-slate-50 text-slate-300 hover:border-sky-300'
//                   }`}
//                 >
//                   ★
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
//               Select the issues you,ve experienced
//             </p>

//             <div className="space-y-3">
//               {reviewIssues.map((issue) => (
//                 <button
//                   key={issue}
//                   type="button"
//                   onClick={() => setSelectedIssue(issue)}
//                   className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
//                     selectedIssue === issue
//                       ? 'border-sky-400 bg-sky-50 text-slate-700'
//                       : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/40'
//                   }`}
//                 >
//                   <span
//                     className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
//                       selectedIssue === issue
//                         ? 'border-sky-500'
//                         : 'border-slate-300'
//                     }`}
//                   >
//                     {selectedIssue === issue ? (
//                       <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
//                     ) : null}
//                   </span>
//                   <span>{issue}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="text-sm font-semibold text-slate-700">
//               Your Comment
//             </span>
//             <small className="text-xs font-semibold text-sky-500">
//               Need Quick Support?
//             </small>
//           </div>

//           <textarea
//             rows={5}
//             value={form.review}
//             onChange={(event) =>
//               setForm((current) => ({
//                 ...current,
//                 review: event.target.value
//               }))
//             }
//             placeholder="Describe your experience here"
//             className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
//           />

//           <label className="block">
//             <span className="mb-2 block text-sm font-semibold text-slate-700">
//               Job ID (optional)
//             </span>
//             <input
//               type="text"
//               value={form.jobId}
//               onChange={(event) =>
//                 setForm((current) => ({
//                   ...current,
//                   jobId: event.target.value
//                 }))
//               }
//               placeholder="Enter related job ID"
//               className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
//             />
//           </label>

//           <button
//             type="submit"
//             className="w-full rounded-full bg-sky-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-sky-600"
//           >
//             Submit Feedback
//           </button>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default StudentCompanyReviewsPage;








// import { useState } from 'react';
// import {
//   addCompanyReview
// } from '../services/studentApi';

// const initialReviewForm = {
//   companyName: '',
//   rating: 3.5,
//   title: '',
//   review: '',
//   jobId: ''
// };

// const ratingOptions = [1, 2, 3.5, 4.5, 5];

// const getRatingLabel = (rating) => {
//   return String(rating);
// };

// const StudentCompanyReviewsPage = () => {
//   const [form, setForm] = useState(initialReviewForm);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleStarClick = (ratingValue) => {
//     setForm((current) => ({
//       ...current,
//       rating: ratingValue
//     }));
//   };

//   const submitReview = async (event) => {
//     event.preventDefault();
//     setMessage('');
//     setError('');

//     if (!form.companyName.trim() || !form.review.trim()) {
//       setError('Company name and review text are required.');
//       return;
//     }

//     try {
//       await addCompanyReview({
//         companyName: form.companyName.trim(),
//         rating: Number(form.rating),
//         title: getRatingLabel(form.rating),
//         review: form.review.trim(),
//         jobId: form.jobId || null
//       });

//       setForm(initialReviewForm);
//       setMessage('Review submitted successfully.');
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to submit review.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {message && (
//           <p className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
//             {message}
//           </p>
//         )}

//         {error && (
//           <p className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
//             {error}
//           </p>
//         )}

//         <section className="rounded-2xl bg-white p-6 shadow-lg">
//           <h2 className="text-center text-xl font-bold text-gray-800">
//             Share Your Feedback
//           </h2>

//           <p className="mb-4 text-center text-sm text-gray-500">
//             Rate your experience
//           </p>

//           <form onSubmit={submitReview} className="space-y-5">
//             <input
//               type="text"
//               value={form.companyName}
//               onChange={(e) =>
//                 setForm((c) => ({ ...c, companyName: e.target.value }))
//               }
//               placeholder="Enter company name"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500"
//             />

//             <div className="flex justify-center gap-2">
//               {ratingOptions.map((value, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => handleStarClick(value)}
//                   className="text-4xl"
//                 >
//                   <span
//                     className={
//                       form.rating >= value
//                         ? 'text-yellow-400'
//                         : 'text-gray-300'
//                     }
//                   >
//                     ★
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="text-center text-lg font-semibold text-gray-700">
//               {getRatingLabel(form.rating)}
//             </div>

//             <textarea
//               rows={4}
//               value={form.review}
//               onChange={(e) =>
//                 setForm((c) => ({ ...c, review: e.target.value }))
//               }
//               placeholder="Describe your experience..."
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500"
//             />

//             <button
//               type="submit"
//               className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
//             >
//               Submit Feedback
//             </button>
//           </form>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default StudentCompanyReviewsPage;







import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  reviewForm: 'student_company_review_form',
  reviews: 'student_company_reviews'
};

const initialReviewForm = {
  companyName: '',
  jobRole: '',
  jobId: '',
  rating: 0,
  title: '',
  review: '',
  pros: '',
  cons: '',
  recommend: 'yes',
  anonymous: false
};

const mockReviews = [
  {
    id: 1,
    companyName: 'TechNova Pvt Ltd',
    jobRole: 'Frontend Developer',
    jobId: 'JOB-101',
    rating: 5,
    title: 'Great Place to Start a Career',
    review:
      'The team was supportive, learning was fast, and I got good projects.',
    pros: 'Good culture, supportive seniors, flexible timings',
    cons: 'The salary could have been a little better',
    recommend: 'yes',
    anonymous: false,
    author: 'Rahul S.',
    createdAt: '2026-03-15',
    helpfulCount: 12,
    reported: false
  },
  {
    id: 2,
    companyName: 'Skyline Infosystems',
    jobRole: 'Backend Intern',
    jobId: 'JOB-205',
    rating: 3,
    title: 'Average Experience',
    review:
      'The work was fine, but sometimes the workload became too heavy.',
    pros: 'Learning opportunities',
    cons: 'Weak work-life balance',
    recommend: 'no',
    anonymous: true,
    author: 'Anonymous',
    createdAt: '2026-03-13',
    helpfulCount: 5,
    reported: false
  },
  {
    id: 3,
    companyName: 'NextHire Solutions',
    jobRole: 'UI Designer',
    jobId: 'JOB-301',
    rating: 4,
    title: 'Creative Environment',
    review:
      'The design team was good, and there was a lot of creative freedom.',
    pros: 'Creative work, good team',
    cons: 'Deadlines are tight',
    recommend: 'yes',
    anonymous: false,
    author: 'Priya M.',
    createdAt: '2026-03-12',
    helpfulCount: 8,
    reported: false
  }
];

const getStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return date;
  }
};

const getSavedForm = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.reviewForm);
    return saved ? JSON.parse(saved) : initialReviewForm;
  } catch {
    return initialReviewForm;
  }
};

const getSavedReviews = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.reviews);
    return saved ? JSON.parse(saved) : mockReviews;
  } catch {
    return mockReviews;
  }
};

const StarRatingInput = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition ${
            star <= value ? 'text-yellow-500' : 'text-slate-300'
          }`}
        >
          ★
        </button>
      ))}
      <span className="text-sm font-medium text-slate-600">
        {value ? `${value}/5` : 'Select rating'}
      </span>
    </div>
  );
};

const StudentCompanyReviewsPage = () => {
  const [form, setForm] = useState(getSavedForm);
  const [reviews, setReviews] = useState(getSavedReviews);

  const [filters, setFilters] = useState({
    company: 'all',
    role: 'all',
    rating: 'all'
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.reviewForm, JSON.stringify(form));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [form]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  }, [reviews]);

  const companies = useMemo(() => {
    return ['all', ...new Set(reviews.map((item) => item.companyName))];
  }, [reviews]);

  const roles = useMemo(() => {
    return ['all', ...new Set(reviews.map((item) => item.jobRole))];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const companyMatch =
        filters.company === 'all' || item.companyName === filters.company;
      const roleMatch =
        filters.role === 'all' || item.jobRole === filters.role;
      const ratingMatch =
        filters.rating === 'all' || item.rating === Number(filters.rating);

      return companyMatch && roleMatch && ratingMatch;
    });
  }, [reviews, filters]);

  const averageRating = useMemo(() => {
    if (!filteredReviews.length) return 0;
    const total = filteredReviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / filteredReviews.length).toFixed(1);
  }, [filteredReviews]);

  const ratingBreakdown = useMemo(() => {
    const total = filteredReviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = filteredReviews.filter((item) => item.rating === star).length;
      return {
        star,
        count,
        percent: Math.round((count / total) * 100)
      };
    });
  }, [filteredReviews]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.companyName.trim() ||
      !form.jobRole.trim() ||
      !form.rating ||
      !form.title.trim() ||
      !form.review.trim()
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newReview = {
      id: Date.now(),
      companyName: form.companyName.trim(),
      jobRole: form.jobRole.trim(),
      jobId: form.jobId.trim(),
      rating: Number(form.rating),
      title: form.title.trim(),
      review: form.review.trim(),
      pros: form.pros.trim(),
      cons: form.cons.trim(),
      recommend: form.recommend,
      anonymous: form.anonymous,
      author: form.anonymous ? 'Anonymous' : 'Current User',
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      reported: false
    };

    setReviews((prev) => [newReview, ...prev]);
    setForm(initialReviewForm);
    localStorage.removeItem(STORAGE_KEYS.reviewForm);
  };

  const handleHelpful = (reviewId) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? { ...item, helpfulCount: item.helpfulCount + 1 }
          : item
      )
    );
  };

  const handleReport = (reviewId) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId ? { ...item, reported: true } : item
      )
    );
  };

  const handleClearDraft = () => {
    setForm(initialReviewForm);
    localStorage.removeItem(STORAGE_KEYS.reviewForm);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Company Reviews
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Job portal users can share their company experience here.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Write a Review</h2>

              <button
                type="button"
                onClick={handleClearDraft}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear Draft
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    value={form.jobRole}
                    onChange={(e) => handleChange('jobRole', e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Job ID
                </label>
                <input
                  type="text"
                  value={form.jobId}
                  onChange={(e) => handleChange('jobId', e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Overall Rating *
                </label>
                <StarRatingInput
                  value={form.rating}
                  onChange={(value) => handleChange('rating', value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Short summary"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Review *
                </label>
                <textarea
                  rows={4}
                  value={form.review}
                  onChange={(e) => handleChange('review', e.target.value)}
                  placeholder="Write your experience..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-green-700">
                    Pros
                  </label>
                  <textarea
                    rows={3}
                    value={form.pros}
                    onChange={(e) => handleChange('pros', e.target.value)}
                    placeholder="Good points"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-red-700">
                    Cons
                  </label>
                  <textarea
                    rows={3}
                    value={form.cons}
                    onChange={(e) => handleChange('cons', e.target.value)}
                    placeholder="Bad points"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Would you recommend it?
                  </label>
                  <select
                    value={form.recommend}
                    onChange={(e) => handleChange('recommend', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.anonymous}
                      onChange={(e) => handleChange('anonymous', e.target.checked)}
                    />
                    Post anonymously
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[280px,1fr]">
                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Average Rating
                  </p>
                  <div className="mt-2 text-5xl font-extrabold text-slate-900">
                    {averageRating}
                  </div>
                  <div className="mt-2 text-xl text-yellow-500">
                    {getStars(Math.round(Number(averageRating) || 0))}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Based on {filteredReviews.length} reviews
                  </p>
                </div>

                <div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <select
                      value={filters.company}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {companies.map((item) => (
                        <option key={item} value={item}>
                          {item === 'all' ? 'All Companies' : item}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.role}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {roles.map((item) => (
                        <option key={item} value={item}>
                          {item === 'all' ? 'All Job Roles' : item}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.rating}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, rating: e.target.value }))
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Star</option>
                      <option value="4">4 Star</option>
                      <option value="3">3 Star</option>
                      <option value="2">2 Star</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div className="mt-5 space-y-3">
                    {ratingBreakdown.map((item) => (
                      <div key={item.star}>
                        <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                          <span>{item.star} Star</span>
                          <span>{item.percent}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-yellow-400"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                  No reviews found.
                </div>
              ) : (
                filteredReviews.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                          {item.rating}.0
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">
                              {item.companyName}
                            </span>{' '}
                            • {item.jobRole} • {formatDate(item.createdAt)}
                          </p>
                          <p className="mt-1 text-sm text-yellow-500">
                            {getStars(item.rating)}
                          </p>
                        </div>
                      </div>

                      <div>
                        {item.recommend === 'yes' ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            Recommended
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                            Not Recommended
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-sm leading-6 text-slate-700">
                        {item.review}
                      </p>

                      {item.pros ? (
                        <p className="mt-3 text-sm text-slate-700">
                          <span className="font-semibold text-green-700">Pros: </span>
                          {item.pros}
                        </p>
                      ) : null}

                      {item.cons ? (
                        <p className="mt-2 text-sm text-slate-700">
                          <span className="font-semibold text-red-700">Cons: </span>
                          {item.cons}
                        </p>
                      ) : null}

                      <p className="mt-3 text-xs text-slate-500">
                        By {item.anonymous ? 'Anonymous User' : item.author}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleHelpful(item.id)}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          👍 Helpful ({item.helpfulCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReport(item.id)}
                          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                            item.reported
                              ? 'border-red-200 bg-red-50 text-red-600'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          🚩 {item.reported ? 'Reported' : 'Report'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCompanyReviewsPage;



















// import { useMemo, useState } from 'react';
// import {
//   addCompanyReview,
//   formatDateTime,
//   getCompanyReviews
// } from '../services/studentApi';

// const initialReviewForm = {
//   companyName: '',
//   jobRole: '',
//   jobId: '',
//   rating: 0,
//   title: '',
//   review: '',
//   pros: '',
//   cons: '',
//   recommend: 'yes',
//   anonymous: false
// };

// const getStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

// const formatDisplayDate = (date) => {
//   if (!date) return '';
//   try {
//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   } catch {
//     return formatDateTime?.(date) || date;
//   }
// };

// const StarRatingInput = ({ value, onChange }) => {
//   return (
//     <div className="flex flex-wrap items-center gap-2">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           onClick={() => onChange(star)}
//           className={`text-2xl transition ${
//             star <= value ? 'text-yellow-500' : 'text-slate-300'
//           }`}
//         >
//           ★
//         </button>
//       ))}
//       <span className="text-sm font-medium text-slate-600">
//         {value ? `${value}/5` : 'Select rating'}
//       </span>
//     </div>
//   );
// };

// const StudentCompanyReviewsPage = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [reviewState, setReviewState] = useState({
//     summary: { count: 0, averageRating: 0 },
//     reviews: []
//   });
//   const [form, setForm] = useState(initialReviewForm);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const [filters, setFilters] = useState({
//     company: 'all',
//     role: 'all',
//     rating: 'all'
//   });

//   const searchReviews = async () => {
//     setMessage('');
//     setError('');

//     if (!companyName.trim()) {
//       setError('Enter company name to search reviews.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await getCompanyReviews(companyName.trim());

//       const apiReviews = Array.isArray(response?.data?.reviews)
//         ? response.data.reviews.map((item) => ({
//             ...item,
//             helpfulCount: Number(item.helpfulCount || 0),
//             reported: Boolean(item.reported),
//             companyName: item.companyName || item.company_name || companyName.trim(),
//             jobRole: item.jobRole || item.job_role || 'Not specified',
//             jobId: item.jobId || item.job_id || '',
//             pros: item.pros || '',
//             cons: item.cons || '',
//             recommend: item.recommend || 'yes',
//             anonymous: Boolean(item.anonymous),
//             author: item.author || 'Candidate'
//           }))
//         : [];

//       setReviewState({
//         summary: response?.data?.summary || {
//           count: apiReviews.length,
//           averageRating: apiReviews.length
//             ? Number(
//                 (
//                   apiReviews.reduce(
//                     (acc, item) => acc + Number(item.rating || 0),
//                     0
//                   ) / apiReviews.length
//                 ).toFixed(2)
//               )
//             : 0
//         },
//         reviews: apiReviews
//       });

//       if (response?.error) {
//         setError(response.error);
//       }
//     } catch (searchError) {
//       setError(searchError.message || 'Unable to load reviews.');
//       setReviewState({
//         summary: { count: 0, averageRating: 0 },
//         reviews: []
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (
//       !form.companyName ||
//       !form.jobRole ||
//       !form.rating ||
//       !form.title ||
//       !form.review
//     ) {
//       setError('Please fill in all required fields.');
//       return;
//     }

//     try {
//       const created = await addCompanyReview({
//         companyName: form.companyName,
//         jobRole: form.jobRole,
//         jobId: form.jobId || null,
//         rating: Number(form.rating),
//         title: form.title,
//         review: form.review,
//         pros: form.pros || '',
//         cons: form.cons || '',
//         recommend: form.recommend,
//         anonymous: form.anonymous
//       });

//       const newReview = {
//         ...created,
//         companyName: created.companyName || created.company_name || form.companyName,
//         jobRole: created.jobRole || created.job_role || form.jobRole,
//         jobId: created.jobId || created.job_id || form.jobId,
//         rating: Number(created.rating || form.rating),
//         title: created.title || form.title,
//         review: created.review || form.review,
//         pros: created.pros || form.pros,
//         cons: created.cons || form.cons,
//         recommend: created.recommend || form.recommend,
//         anonymous:
//           typeof created.anonymous === 'boolean'
//             ? created.anonymous
//             : form.anonymous,
//         author:
//           created.author || (form.anonymous ? 'Anonymous User' : 'Current User'),
//         createdAt: created.created_at || created.createdAt || new Date().toISOString(),
//         helpfulCount: Number(created.helpfulCount || 0),
//         reported: Boolean(created.reported)
//       };

//       if (
//         companyName.trim() &&
//         companyName.trim().toLowerCase() === form.companyName.trim().toLowerCase()
//       ) {
//         const nextReviews = [newReview, ...reviewState.reviews];
//         const avg = nextReviews.length
//           ? Number(
//               (
//                 nextReviews.reduce(
//                   (acc, item) => acc + Number(item.rating || 0),
//                   0
//                 ) / nextReviews.length
//               ).toFixed(2)
//             )
//           : 0;

//         setReviewState({
//           summary: {
//             count: nextReviews.length,
//             averageRating: avg
//           },
//           reviews: nextReviews
//         });
//       }

//       setForm(initialReviewForm);
//       setMessage('Review submitted successfully.');
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to submit review.');
//     }
//   };

//   const handleHelpful = (reviewId) => {
//     setReviewState((prev) => ({
//       ...prev,
//       reviews: prev.reviews.map((item) =>
//         item.id === reviewId
//           ? { ...item, helpfulCount: Number(item.helpfulCount || 0) + 1 }
//           : item
//       )
//     }));
//   };

//   const handleReport = (reviewId) => {
//     setReviewState((prev) => ({
//       ...prev,
//       reviews: prev.reviews.map((item) =>
//         item.id === reviewId ? { ...item, reported: true } : item
//       )
//     }));
//   };

//   const companies = useMemo(() => {
//     return [
//       'all',
//       ...new Set(
//         reviewState.reviews
//           .map((item) => item.companyName)
//           .filter(Boolean)
//       )
//     ];
//   }, [reviewState.reviews]);

//   const roles = useMemo(() => {
//     return [
//       'all',
//       ...new Set(
//         reviewState.reviews
//           .map((item) => item.jobRole)
//           .filter(Boolean)
//       )
//     ];
//   }, [reviewState.reviews]);

//   const filteredReviews = useMemo(() => {
//     return reviewState.reviews.filter((item) => {
//       const companyMatch =
//         filters.company === 'all' || item.companyName === filters.company;
//       const roleMatch =
//         filters.role === 'all' || item.jobRole === filters.role;
//       const ratingMatch =
//         filters.rating === 'all' || Number(item.rating) === Number(filters.rating);

//       return companyMatch && roleMatch && ratingMatch;
//     });
//   }, [reviewState.reviews, filters]);

//   const averageRating = useMemo(() => {
//     if (!filteredReviews.length) {
//       return Number(reviewState.summary.averageRating || 0).toFixed(1);
//     }

//     const total = filteredReviews.reduce(
//       (sum, item) => sum + Number(item.rating || 0),
//       0
//     );
//     return (total / filteredReviews.length).toFixed(1);
//   }, [filteredReviews, reviewState.summary.averageRating]);

//   const ratingBreakdown = useMemo(() => {
//     const total = filteredReviews.length || 1;

//     return [5, 4, 3, 2, 1].map((star) => {
//       const count = filteredReviews.filter(
//         (item) => Number(item.rating) === star
//       ).length;

//       return {
//         star,
//         count,
//         percent: Math.round((count / total) * 100)
//       };
//     });
//   }, [filteredReviews]);

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">
//       <div className="mx-auto max-w-7xl space-y-6">
//         <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
//             Company Reviews
//           </h1>
//           <p className="mt-2 text-sm text-slate-600">
//             Search company feedback, read candidate experiences, and submit your own review.
//           </p>
//         </div>

//         {message ? (
//           <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             {message}
//           </div>
//         ) : null}

//         {error ? (
//           <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             {error}
//           </div>
//         ) : null}

//         <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex flex-col gap-4 md:flex-row md:items-end">
//             <div className="w-full">
//               <label className="mb-1 block text-sm font-medium text-slate-700">
//                 Company Name
//               </label>
//               <input
//                 value={companyName}
//                 onChange={(event) => setCompanyName(event.target.value)}
//                 placeholder="Enter company name to search reviews"
//                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={searchReviews}
//               className="flex h-[50px] w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 md:w-auto"
//             >
//               {loading ? 'Searching...' : 'Search Reviews'}
//             </button>
//           </div>
//         </section>

//         <div className="grid gap-6 lg:grid-cols-[1.1fr,1.9fr]">
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">Write a Review</h2>

//             <form onSubmit={handleSubmit} className="mt-5 space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Company Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={form.companyName}
//                     onChange={(e) => handleChange('companyName', e.target.value)}
//                     placeholder="Enter company name"
//                     className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Job Role *
//                   </label>
//                   <input
//                     type="text"
//                     value={form.jobRole}
//                     onChange={(e) => handleChange('jobRole', e.target.value)}
//                     placeholder="e.g. Frontend Developer"
//                     className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">
//                   Job ID
//                 </label>
//                 <input
//                   type="text"
//                   value={form.jobId}
//                   onChange={(e) => handleChange('jobId', e.target.value)}
//                   placeholder="Optional"
//                   className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-slate-700">
//                   Overall Rating *
//                 </label>
//                 <StarRatingInput
//                   value={form.rating}
//                   onChange={(value) => handleChange('rating', value)}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">
//                   Review Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={form.title}
//                   onChange={(e) => handleChange('title', e.target.value)}
//                   placeholder="Short summary"
//                   className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">
//                   Full Review *
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={form.review}
//                   onChange={(e) => handleChange('review', e.target.value)}
//                   placeholder="Write your experience..."
//                   className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-green-700">
//                     Pros
//                   </label>
//                   <textarea
//                     rows={3}
//                     value={form.pros}
//                     onChange={(e) => handleChange('pros', e.target.value)}
//                     placeholder="Good points"
//                     className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-red-700">
//                     Cons
//                   </label>
//                   <textarea
//                     rows={3}
//                     value={form.cons}
//                     onChange={(e) => handleChange('cons', e.target.value)}
//                     placeholder="Bad points"
//                     className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Would you recommend it?
//                   </label>
//                   <select
//                     value={form.recommend}
//                     onChange={(e) => handleChange('recommend', e.target.value)}
//                     className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                   >
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center pt-2 md:pt-8">
//                   <label className="flex items-center gap-2 text-sm text-slate-700">
//                     <input
//                       type="checkbox"
//                       checked={form.anonymous}
//                       onChange={(e) => handleChange('anonymous', e.target.checked)}
//                     />
//                     Post anonymously
//                   </label>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
//                 >
//                   <span>Submit Review</span>
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="space-y-6">
//             <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="grid gap-5 lg:grid-cols-[280px,1fr]">
//                 <div className="rounded-2xl bg-slate-100 p-5 text-center">
//                   <p className="text-sm font-medium text-slate-500">
//                     Average Rating
//                   </p>
//                   <div className="mt-2 text-5xl font-extrabold text-slate-900">
//                     {averageRating}
//                   </div>
//                   <div className="mt-2 text-xl text-yellow-500">
//                     {getStars(Math.round(Number(averageRating) || 0))}
//                   </div>
//                   <p className="mt-2 text-sm text-slate-600">
//                     Based on {filteredReviews.length} review(s)
//                   </p>
//                 </div>

//                 <div>
//                   <div className="grid gap-3 md:grid-cols-3">
//                     <select
//                       value={filters.company}
//                       onChange={(e) =>
//                         setFilters((prev) => ({ ...prev, company: e.target.value }))
//                       }
//                       className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                     >
//                       {companies.map((item) => (
//                         <option key={item} value={item}>
//                           {item === 'all' ? 'All Companies' : item}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={filters.role}
//                       onChange={(e) =>
//                         setFilters((prev) => ({ ...prev, role: e.target.value }))
//                       }
//                       className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                     >
//                       {roles.map((item) => (
//                         <option key={item} value={item}>
//                           {item === 'all' ? 'All Job Roles' : item}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={filters.rating}
//                       onChange={(e) =>
//                         setFilters((prev) => ({ ...prev, rating: e.target.value }))
//                       }
//                       className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                     >
//                       <option value="all">All Ratings</option>
//                       <option value="5">5 Star</option>
//                       <option value="4">4 Star</option>
//                       <option value="3">3 Star</option>
//                       <option value="2">2 Star</option>
//                       <option value="1">1 Star</option>
//                     </select>
//                   </div>

//                   <div className="mt-5 space-y-3">
//                     {ratingBreakdown.map((item) => (
//                       <div key={item.star}>
//                         <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
//                           <span>{item.star} Star</span>
//                           <span>{item.percent}%</span>
//                         </div>
//                         <div className="h-3 overflow-hidden rounded-full bg-slate-200">
//                           <div
//                             className="h-full rounded-full bg-yellow-400"
//                             style={{ width: `${item.percent}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {loading ? (
//                 <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
//                   Loading reviews...
//                 </div>
//               ) : null}

//               {!loading && filteredReviews.length === 0 ? (
//                 <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
//                   No reviews found for this company.
//                 </div>
//               ) : null}

//               {!loading &&
//                 filteredReviews.map((item) => (
//                   <div
//                     key={item.id}
//                     className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
//                   >
//                     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//                       <div className="flex gap-4">
//                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
//                           {Number(item.rating || 0).toFixed(1)}
//                         </div>

//                         <div>
//                           <h3 className="text-xl font-bold text-slate-900">
//                             {item.title || 'Candidate Review'}
//                           </h3>
//                           <p className="mt-1 text-sm text-slate-600">
//                             <span className="font-semibold text-slate-800">
//                               {item.companyName || 'Unknown Company'}
//                             </span>{' '}
//                             {item.jobRole ? `• ${item.jobRole}` : ''}
//                             {' • '}
//                             {formatDisplayDate(item.created_at || item.createdAt)}
//                           </p>
//                           <p className="mt-1 text-sm text-yellow-500">
//                             {getStars(Number(item.rating || 0))}
//                           </p>
//                         </div>
//                       </div>

//                       <div>
//                         {(item.recommend || 'yes') === 'yes' ? (
//                           <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
//                             Recommended
//                           </span>
//                         ) : (
//                           <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
//                             Not Recommended
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mt-4 border-t border-slate-200 pt-4">
//                       <p className="text-sm leading-6 text-slate-700">
//                         {item.review}
//                       </p>

//                       {item.pros ? (
//                         <p className="mt-3 text-sm text-slate-700">
//                           <span className="font-semibold text-green-700">Pros: </span>
//                           {item.pros}
//                         </p>
//                       ) : null}

//                       {item.cons ? (
//                         <p className="mt-2 text-sm text-slate-700">
//                           <span className="font-semibold text-red-700">Cons: </span>
//                           {item.cons}
//                         </p>
//                       ) : null}

//                       <p className="mt-3 text-xs text-slate-500">
//                         By {item.anonymous ? 'Anonymous User' : item.author || 'Candidate'}
//                       </p>

//                       <div className="mt-4 flex flex-wrap gap-3">
//                         <button
//                           type="button"
//                           onClick={() => handleHelpful(item.id)}
//                           className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
//                         >
//                           👍 Helpful ({Number(item.helpfulCount || 0)})
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => handleReport(item.id)}
//                           className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
//                             item.reported
//                               ? 'border-red-200 bg-red-50 text-red-600'
//                               : 'border-slate-300 text-slate-700 hover:bg-slate-100'
//                           }`}
//                         >
//                           🚩 {item.reported ? 'Reported' : 'Report'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   ); 
// };

// export default StudentCompanyReviewsPage;
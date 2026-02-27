import { useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  addCompanyReview,
  formatDateTime,
  getCompanyReviews
} from '../services/studentApi';

const initialReviewForm = {
  companyName: '',
  rating: 5,
  title: '',
  review: '',
  jobId: ''
};

const StudentCompanyReviewsPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [reviewState, setReviewState] = useState({ summary: { count: 0, averageRating: 0 }, reviews: [] });
  const [form, setForm] = useState(initialReviewForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const searchReviews = async () => {
    setMessage('');
    setError('');

    if (!companyName.trim()) {
      setError('Enter company name to search reviews.');
      return;
    }

    setLoading(true);
    const response = await getCompanyReviews(companyName.trim());
    setLoading(false);

    setReviewState({
      summary: response.data.summary,
      reviews: response.data.reviews
    });

    if (response.error) {
      setError(response.error);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.companyName || !form.review) {
      setError('Company name and review text are required.');
      return;
    }

    try {
      const created = await addCompanyReview({
        companyName: form.companyName,
        rating: Number(form.rating),
        title: form.title,
        review: form.review,
        jobId: form.jobId || null
      });

      if (companyName.trim().toLowerCase() === form.companyName.trim().toLowerCase()) {
        const nextReviews = [created, ...reviewState.reviews];
        const avg = nextReviews.length
          ? Number((nextReviews.reduce((acc, item) => acc + Number(item.rating || 0), 0) / nextReviews.length).toFixed(2))
          : 0;
        setReviewState((current) => ({
          ...current,
          summary: { count: nextReviews.length, averageRating: avg },
          reviews: nextReviews
        }));
      }

      setForm(initialReviewForm);
      setMessage('Review submitted successfully.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit review.');
    }
  };

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Company Reviews"
        title="Search and Submit Company Feedback"
        subtitle="Review company experience and help candidates make better decisions."
      />

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <section className="panel-card">
        <div className="student-inline-controls">
          <label className="full-width-control">
            Company Name
            <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="NovaStack Labs" />
          </label>
          <button type="button" className="btn-primary" onClick={searchReviews}>Search Reviews</button>
        </div>
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Summary"
          title={`Average Rating: ${reviewState.summary.averageRating || 0}`}
          subtitle={`${reviewState.summary.count || 0} review(s) found`}
        />

        {loading ? <p className="module-note">Loading reviews...</p> : null}

        <ul className="student-list">
          {reviewState.reviews.map((item) => (
            <li key={item.id}>
              <div>
                <h4>{item.title || 'Candidate review'}</h4>
                <p>{item.review}</p>
                <p>{formatDateTime(item.created_at || item.createdAt)}</p>
              </div>
              <StatusPill value={`${item.rating}/5`} />
            </li>
          ))}
          {(!loading && reviewState.reviews.length === 0) ? <li>No reviews found for this company.</li> : null}
        </ul>
      </section>

      <section className="panel-card">
        <SectionHeader eyebrow="Write Review" title="Submit Your Experience" />

        <form className="form-grid" onSubmit={submitReview}>
          <label>
            Company Name
            <input
              value={form.companyName}
              onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
            />
          </label>

          <label>
            Rating
            <select
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </label>

          <label className="full-row">
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <label className="full-row">
            Review
            <textarea
              rows={5}
              value={form.review}
              onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))}
            />
          </label>

          <label>
            Job ID (optional)
            <input
              value={form.jobId}
              onChange={(event) => setForm((current) => ({ ...current, jobId: event.target.value }))}
            />
          </label>

          <button type="submit" className="btn-primary">Submit Review</button>
        </form>
      </section>
    </div>
  );
};

export default StudentCompanyReviewsPage;

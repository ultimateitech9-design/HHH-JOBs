import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  checkoutPlanCredits,
  closeHrJob,
  createHrJob,
  deleteHrJob,
  formatDateTime,
  getEmptyJobDraft,
  getHrJobs,
  getHrPricingCredits,
  getHrPricingPurchases,
  getJobDraftFromJob,
  getPricingPlanQuote,
  getPricingPlans,
  updateHrJob
} from '../services/hrApi';

const initialCheckoutForm = {
  planSlug: '',
  quantity: 1,
  provider: 'manual',
  referenceId: '',
  note: '',
  paymentStatus: 'pending'
};

const toSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isFreePlan = (plan = {}) => {
  if (plan.isFree === true) return true;
  if (String(plan.slug || '').toLowerCase() === 'free') return true;
  return toSafeNumber(plan.price, 0) <= 0;
};

const HrJobsPage = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [draft, setDraft] = useState(getEmptyJobDraft());
  const [editingJobId, setEditingJobId] = useState('');
  const [saving, setSaving] = useState(false);

  const [plans, setPlans] = useState([]);
  const [creditsSummary, setCreditsSummary] = useState({ credits: [], byPlan: {}, totals: { total: 0, used: 0, remaining: 0 } });
  const [purchases, setPurchases] = useState([]);
  const [pricingError, setPricingError] = useState('');
  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
  const [checkoutSaving, setCheckoutSaving] = useState(false);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const normalizedPlans = useMemo(
    () => plans.map((plan) => ({
      ...plan,
      slug: String(plan.slug || '').trim(),
      currency: plan.currency || 'INR',
      isFreeNormalized: isFreePlan(plan)
    })),
    [plans]
  );

  const paidPlans = useMemo(() => normalizedPlans.filter((plan) => !plan.isFreeNormalized), [normalizedPlans]);

  const selectedPlan = useMemo(
    () =>
      normalizedPlans.find((plan) => plan.slug === draft.planSlug)
      || normalizedPlans.find((plan) => plan.slug === 'free')
      || normalizedPlans[0]
      || null,
    [normalizedPlans, draft.planSlug]
  );

  const checkoutPlan = useMemo(
    () => normalizedPlans.find((plan) => plan.slug === checkoutForm.planSlug) || paidPlans[0] || null,
    [normalizedPlans, paidPlans, checkoutForm.planSlug]
  );

  const selectedPlanCredits = useMemo(() => {
    if (!selectedPlan) return 0;
    return Number(creditsSummary?.byPlan?.[selectedPlan.slug]?.remaining || 0);
  }, [selectedPlan, creditsSummary]);

  const checkoutQuantity = useMemo(() => {
    const parsed = Number(checkoutForm.quantity);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.floor(parsed);
  }, [checkoutForm.quantity]);

  const planNameBySlug = useMemo(
    () => Object.fromEntries(normalizedPlans.map((plan) => [plan.slug, plan.name || plan.slug])),
    [normalizedPlans]
  );

  const requestedAudience = useMemo(() => {
    const value = new URLSearchParams(location.search).get('audience');
    return value === 'retired_employee' || value === 'all' || value === 'student' ? value : '';
  }, [location.search]);

  const resolveDraftLocations = (jobDraft = draft) => {
    const locations = [
      ...String(jobDraft.jobLocationsInput || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      String(jobDraft.jobLocation || '').trim()
    ].filter(Boolean);

    return [...new Set(locations)];
  };

  const loadPricingState = async () => {
    const [plansRes, creditsRes, purchasesRes] = await Promise.all([
      getPricingPlans(),
      getHrPricingCredits(),
      getHrPricingPurchases({ status: '' })
    ]);

    const nextPlans = plansRes.data || [];

    setPlans(nextPlans);
    setCreditsSummary(creditsRes.data || { credits: [], byPlan: {}, totals: { total: 0, used: 0, remaining: 0 } });
    setPurchases(purchasesRes.data || []);
    setPricingError([plansRes.error, creditsRes.error, purchasesRes.error].filter(Boolean).join(' | '));

    const firstPaidPlan = nextPlans.find((plan) => !isFreePlan(plan));

    setCheckoutForm((current) => {
      const currentPlanIsValidPaid = nextPlans.some((plan) => plan.slug === current.planSlug && !isFreePlan(plan));
      return {
        ...current,
        planSlug: currentPlanIsValidPaid ? current.planSlug : (firstPaidPlan?.slug || '')
      };
    });

    const freePlan = nextPlans.find((plan) => plan.slug === 'free') || nextPlans[0];
    if (freePlan) {
      setDraft((current) => ({
        ...current,
        planSlug: nextPlans.some((plan) => plan.slug === current.planSlug) ? current.planSlug : freePlan.slug
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      const jobsRes = await getHrJobs();
      if (!mounted) return;

      setJobs(jobsRes.data || []);
      setError(jobsRes.error || '');
      setLoading(false);

      await loadPricingState();
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadQuote = async () => {
      if (!checkoutPlan || checkoutPlan.isFreeNormalized) {
        setQuote(null);
        setQuoteError('');
        return;
      }

      setQuoteLoading(true);
      setQuoteError('');

      try {
        const response = await getPricingPlanQuote({
          planSlug: checkoutPlan.slug,
          quantity: checkoutQuantity
        });

        if (!active) return;
        setQuote(response);
      } catch (quoteRequestError) {
        if (!active) return;
        setQuote(null);
        setQuoteError(String(quoteRequestError.message || 'Unable to fetch quote from backend.'));
      } finally {
        if (active) setQuoteLoading(false);
      }
    };

    loadQuote();

    return () => {
      active = false;
    };
  }, [checkoutPlan, checkoutQuantity]);

  useEffect(() => {
    if (!requestedAudience || editingJobId) return;

    setDraft((current) => ({ ...current, targetAudience: requestedAudience }));
  }, [requestedAudience, editingJobId]);

  const filteredJobs = useMemo(() => {
    if (statusFilter === 'all') return jobs;
    if (statusFilter === 'pending') {
      return jobs.filter((job) => String(job.approvalStatus || '').toLowerCase() === 'pending');
    }
    return jobs.filter((job) => String(job.status || '').toLowerCase() === statusFilter);
  }, [jobs, statusFilter]);

  const updateDraftField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setEditingJobId('');
    setDraft({ ...getEmptyJobDraft(), planSlug: selectedPlan?.slug || 'free' });
  };

  const validateDraft = () => {
    const requiredFields = ['jobTitle', 'companyName', 'maxPrice', 'salaryType', 'experienceLevel', 'employmentType', 'description'];
    const missing = requiredFields.filter((key) => !String(draft[key] || '').trim());

    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }

    const resolvedLocations = resolveDraftLocations();
    if (resolvedLocations.length === 0) {
      return 'At least one job location is required.';
    }

    if (selectedPlan) {
      const descriptionLimit = Number(selectedPlan.maxDescriptionChars || 0);
      if (descriptionLimit > 0 && String(draft.description || '').length > descriptionLimit) {
        return `Description exceeds ${selectedPlan.maxDescriptionChars} characters for ${selectedPlan.name}.`;
      }

      const locationsLimit = Number(selectedPlan.maxLocations || 0);
      if (locationsLimit > 0 && resolvedLocations.length > locationsLimit) {
        return `${selectedPlan.name} allows maximum ${selectedPlan.maxLocations} location(s).`;
      }

      if (!editingJobId && !selectedPlan.isFreeNormalized && selectedPlanCredits <= 0) {
        return `No remaining ${selectedPlan.name} credits. Purchase credits before posting.`;
      }
    }

    return '';
  };

  const handleSubmitJob = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const validationError = validateDraft();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      if (editingJobId) {
        const updated = await updateHrJob(editingJobId, draft);
        setJobs((current) => current.map((job) => ((job.id || job._id) === editingJobId ? { ...job, ...updated } : job)));
        setMessage('Job updated successfully.');
      } else {
        const created = await createHrJob(draft);
        setJobs((current) => [created, ...current]);
        setMessage(`Job created successfully on ${selectedPlan?.name || 'selected'} plan.`);
        await loadPricingState();
      }

      resetForm();
    } catch (submitError) {
      setError(String(submitError.message || 'Failed to save job.'));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job.id || job._id);
    setDraft(getJobDraftFromJob(job));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseJob = async (jobId) => {
    setMessage('');
    setError('');

    try {
      const updated = await closeHrJob(jobId);
      setJobs((current) => current.map((job) => ((job.id || job._id) === jobId ? { ...job, ...updated } : job)));
      setMessage('Job closed successfully.');
    } catch (closeError) {
      setError(String(closeError.message || 'Unable to close job.'));
    }
  };

  const handleDeleteJob = async (jobId) => {
    setMessage('');
    setError('');

    try {
      await deleteHrJob(jobId);
      setJobs((current) => current.filter((job) => (job.id || job._id) !== jobId));
      setMessage('Job deleted successfully.');
    } catch (deleteError) {
      setError(String(deleteError.message || 'Unable to delete job.'));
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!paidPlans.length) {
      setError('No paid plans available right now. Contact admin to configure pricing plans.');
      return;
    }

    if (!checkoutPlan || checkoutPlan.isFreeNormalized) {
      setError('Select a paid plan to purchase credits.');
      return;
    }

    if (!Number.isFinite(checkoutQuantity) || checkoutQuantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setCheckoutSaving(true);

    try {
      const response = await checkoutPlanCredits({
        planSlug: checkoutPlan.slug,
        quantity: checkoutQuantity,
        provider: checkoutForm.provider,
        referenceId: checkoutForm.referenceId,
        note: checkoutForm.note,
        paymentStatus: checkoutForm.paymentStatus
      });

      await loadPricingState();
      setMessage(
        response?.purchase?.status === 'paid'
          ? 'Credits purchased and activated successfully.'
          : 'Purchase created in pending state. Admin approval is required to activate credits.'
      );
      setCheckoutForm((current) => ({
        ...current,
        quantity: 1,
        referenceId: '',
        note: ''
      }));
    } catch (checkoutError) {
      const errText = String(checkoutError.message || 'Unable to create purchase.');
      setError(errText);
    } finally {
      setCheckoutSaving(false);
    }
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Jobs"
        title="Create and Manage Jobs"
        subtitle="Post jobs on selected pricing plans, track credits, and manage applicants."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {pricingError ? <p className="module-note">{pricingError}</p> : null}

      <section className="panel-card">
        <SectionHeader
          eyebrow={editingJobId ? 'Edit Job' : 'Create Job'}
          title={editingJobId ? 'Update existing posting' : 'Publish new job'}
        />

        <form className="form-grid" onSubmit={handleSubmitJob}>
          <label>
            Pricing Plan
            <select
              value={draft.planSlug}
              disabled={Boolean(editingJobId)}
              onChange={(event) => updateDraftField('planSlug', event.target.value)}
            >
              {plans.map((plan) => (
                <option key={plan.slug} value={plan.slug}>
                  {plan.name} ({plan.currency || 'INR'} {plan.price})
                </option>
              ))}
            </select>
          </label>

          <label>
            Target Candidate Group
            <select value={draft.targetAudience} onChange={(event) => updateDraftField('targetAudience', event.target.value)}>
              <option value="all">All Candidates</option>
              <option value="student">Only Student / Candidate</option>
              <option value="retired_employee">Only Retired Employee</option>
            </select>
          </label>

          <p className="module-note full-row">
            Select the candidate group for this job post to ensure applications come from the right audience.
          </p>

          <label>
            Job Title
            <input value={draft.jobTitle} onChange={(event) => updateDraftField('jobTitle', event.target.value)} />
          </label>

          <label>
            Company Name
            <input value={draft.companyName} onChange={(event) => updateDraftField('companyName', event.target.value)} />
          </label>

          <label>
            Min Salary
            <input value={draft.minPrice} onChange={(event) => updateDraftField('minPrice', event.target.value)} />
          </label>

          <label>
            Max Salary
            <input value={draft.maxPrice} onChange={(event) => updateDraftField('maxPrice', event.target.value)} />
          </label>

          <label>
            Salary Type
            <input value={draft.salaryType} onChange={(event) => updateDraftField('salaryType', event.target.value)} />
          </label>

          <label>
            Primary Location
            <input value={draft.jobLocation} onChange={(event) => updateDraftField('jobLocation', event.target.value)} />
          </label>

          <label>
            Experience Level
            <input value={draft.experienceLevel} onChange={(event) => updateDraftField('experienceLevel', event.target.value)} />
          </label>

          <label>
            Employment Type
            <select value={draft.employmentType} onChange={(event) => updateDraftField('employmentType', event.target.value)}>
              <option value="">Select employment type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </label>

          <label>
            Category
            <input value={draft.category} onChange={(event) => updateDraftField('category', event.target.value)} />
          </label>

          <label>
            Posting Date
            <input type="date" value={draft.postingDate} onChange={(event) => updateDraftField('postingDate', event.target.value)} />
          </label>

          <label className="full-row">
            Additional Locations (comma separated)
            <input value={draft.jobLocationsInput} onChange={(event) => updateDraftField('jobLocationsInput', event.target.value)} />
          </label>

          <label className="full-row">
            Skills (comma separated)
            <input value={draft.skillsInput} onChange={(event) => updateDraftField('skillsInput', event.target.value)} />
          </label>

          <label className="full-row">
            Company Logo URL
            <input value={draft.companyLogo} onChange={(event) => updateDraftField('companyLogo', event.target.value)} />
          </label>

          <label className="full-row">
            Description
            <textarea rows={5} value={draft.description} onChange={(event) => updateDraftField('description', event.target.value)} />
          </label>

          {selectedPlan ? (
            <div className="full-row module-note">
              <strong>{selectedPlan.name} Rules:</strong>
              {' '}Max locations: {selectedPlan.maxLocations}
              {' '}| Max applications: {selectedPlan.maxApplications ?? 'Unlimited'}
              {' '}| Contact visibility: {selectedPlan.contactDetailsVisible ? 'Visible' : 'Hidden'}
              {' '}| Remaining credits: {selectedPlan.isFreeNormalized ? 'Unlimited' : selectedPlanCredits}
            </div>
          ) : null}

          <div className="student-job-actions full-row">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingJobId ? 'Update Job' : 'Create Job'}
            </button>
            {editingJobId ? (
              <button type="button" className="btn-link" onClick={resetForm}>Cancel Edit</button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="panel-card">
        <SectionHeader eyebrow="Credits" title="Plan Credits and Checkout" />

        <div className="student-job-grid">
          {plans.map((plan) => {
            const planCredits = creditsSummary?.byPlan?.[plan.slug] || { total: 0, used: 0, remaining: 0 };
            return (
              <article className="student-job-card" key={plan.slug}>
                <div className="student-job-card-header">
                  <h3>{plan.name}</h3>
                  <StatusPill value={isFreePlan(plan) ? 'free' : 'paid'} />
                </div>
                <p>{plan.currency} {plan.price} • Validity {plan.jobValidityDays} days</p>
                <p>Remaining Credits: {isFreePlan(plan) ? 'Unlimited' : planCredits.remaining}</p>
                <p>Used: {isFreePlan(plan) ? '-' : planCredits.used} • Total: {isFreePlan(plan) ? '-' : planCredits.total}</p>
              </article>
            );
          })}
        </div>

        <form className="form-grid" onSubmit={handleCheckout}>
          <label>
            Paid Plan
            <select
              value={checkoutForm.planSlug}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, planSlug: event.target.value }))}
              disabled={paidPlans.length === 0}
            >
              {paidPlans.length === 0 ? <option value="">No paid plans available</option> : null}
              {paidPlans.map((plan) => (
                <option key={plan.slug} value={plan.slug}>{plan.name}</option>
              ))}
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="1"
              step="1"
              value={checkoutForm.quantity}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, quantity: event.target.value }))}
            />
          </label>

          <label>
            Provider
            <input
              value={checkoutForm.provider}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, provider: event.target.value }))}
            />
          </label>

          <label>
            Payment Status
            <select
              value={checkoutForm.paymentStatus}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, paymentStatus: event.target.value }))}
            >
              <option value="paid">Paid (Instant credits)</option>
              <option value="pending">Pending (Admin approval)</option>
            </select>
          </label>

          <label>
            Reference ID
            <input
              value={checkoutForm.referenceId}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, referenceId: event.target.value }))}
            />
          </label>

          <label className="full-row">
            Note
            <input
              value={checkoutForm.note}
              onChange={(event) => setCheckoutForm((current) => ({ ...current, note: event.target.value }))}
            />
          </label>

          {quoteLoading ? <p className="module-note full-row">Calculating quote...</p> : null}
          {quoteError ? <p className="module-note full-row">{quoteError}</p> : null}

          {quote ? (
            <div className="full-row module-note">
              <strong>Quote:</strong>
              {' '}Subtotal {quote.currency || 'INR'} {Number(quote.subtotal || 0).toFixed(2)}
              {' '}| Discount {Number(quote.discountAmount || 0).toFixed(2)}
              {' '}| GST {Number(quote.gstAmount || 0).toFixed(2)}
              {' '}| Total {Number(quote.totalAmount || 0).toFixed(2)}
              {' '}| Credits {quote.credits}
            </div>
          ) : null}

          <div className="student-job-actions full-row">
            <button type="submit" className="btn-primary" disabled={checkoutSaving || paidPlans.length === 0}>
              {checkoutSaving ? 'Creating Purchase...' : 'Buy Credits'}
            </button>
          </div>
        </form>

        <h3 style={{ marginTop: 18 }}>Recent Purchases</h3>
        <div className="student-job-grid">
          {purchases.slice(0, 8).map((purchase, index) => (
            <article className="student-job-card" key={purchase.id || `${purchase.plan_slug}-${purchase.created_at || index}`}>
              <div className="student-job-card-header">
                <h3>{planNameBySlug[purchase.plan_slug] || purchase.plan_slug}</h3>
                <StatusPill value={purchase.status} />
              </div>
              <p>Qty: {purchase.quantity} • Credits: {purchase.credits}</p>
              <p>Total: {purchase.currency || 'INR'} {purchase.total_amount}</p>
              <p>{formatDateTime(purchase.created_at || purchase.createdAt)}</p>
            </article>
          ))}
        </div>

        {purchases.length === 0 ? <p className="module-note">No purchases yet.</p> : null}
      </section>

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Status Filter
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending approval</option>
            </select>
          </label>
        </div>

        {loading ? <p className="module-note">Loading jobs...</p> : null}

        <div className="student-job-grid">
          {filteredJobs.map((job) => {
            const jobId = job.id || job._id;

            return (
              <article className="student-job-card" key={jobId}>
                <div className="student-job-card-header">
                  <h3>{job.jobTitle}</h3>
                  <StatusPill value={job.status || 'open'} />
                </div>

                <p>{job.companyName} • {job.jobLocation}</p>
                <p>{job.experienceLevel || '-'} • {job.employmentType || '-'}</p>
                <p>
                  For: {(job.targetAudience || job.audience) === 'retired_employee'
                    ? 'Retired Employee'
                    : (job.targetAudience || job.audience) === 'student'
                      ? 'Student / Candidate'
                      : 'All Candidates'}
                </p>
                <p>Applications: {job.applicationsCount || 0} • Views: {job.viewsCount || 0}</p>
                <p>
                  Plan: <strong>{job.planSnapshot?.name || job.planSlug || 'free'}</strong>
                  {' '}• Payment: <StatusPill value={job.isPaid ? 'paid' : 'pending'} />
                </p>
                <p>
                  Approval: <StatusPill value={job.approvalStatus || 'pending'} />
                  {' '}• Valid Till: {formatDateTime(job.validTill)}
                </p>

                <div className="student-chip-row">
                  {(job.skills || []).slice(0, 5).map((skill) => (
                    <span key={skill} className="student-chip">{skill}</span>
                  ))}
                </div>

                <div className="student-job-actions">
                  <button type="button" className="btn-link" onClick={() => startEdit(job)}>Edit</button>
                  <button type="button" className="btn-link" onClick={() => handleCloseJob(jobId)}>Close</button>
                  <button type="button" className="btn-link" onClick={() => handleDeleteJob(jobId)}>Delete</button>
                  <Link to={`/portal/hr/jobs/${jobId}/applicants`} className="btn-primary">Applicants</Link>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && filteredJobs.length === 0 ? <p className="module-note">No jobs found.</p> : null}
      </section>
    </div>
  );
};

export default HrJobsPage;

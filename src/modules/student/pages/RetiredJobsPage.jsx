import StudentJobsPage from './StudentJobsPage';

const RetiredJobsPage = () => (
  <StudentJobsPage
    forcedAudience="retired_employee"
    eyebrow="Retired Jobs"
    title="Jobs For Retired Professionals"
    subtitle="Only roles marked for retired employees are shown here."
    detailsPathBase="/portal/retired/jobs"
  />
);

export default RetiredJobsPage;

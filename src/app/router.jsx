import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import HomePage from '../modules/common/pages/HomePage';
import PublicAtsPage from '../modules/common/pages/PublicAtsPage';
import ServicesPage from '../modules/common/pages/ServicesPage';
import AdminModuleLayout from '../modules/admin/components/AdminModuleLayout';
import AdminControlPage from '../modules/admin/pages/AdminControlPage';
import AdminDashboardPage from '../modules/admin/pages/AdminDashboardPage';
import AdminUsersPage from '../modules/admin/pages/AdminUsersPage';
import AdminJobsPage from '../modules/admin/pages/AdminJobsPage';
import AdminReportsPage from '../modules/admin/pages/AdminReportsPage';
import AdminApplicationsPage from '../modules/admin/pages/AdminApplicationsPage';
import AdminMasterDataPage from '../modules/admin/pages/AdminMasterDataPage';
import AdminPaymentsPage from '../modules/admin/pages/AdminPaymentsPage';
import AdminAuditLogsPage from '../modules/admin/pages/AdminAuditLogsPage';
import AdminSettingsPage from '../modules/admin/pages/AdminSettingsPage';
import HrModuleLayout from '../modules/hr/components/HrModuleLayout';
import HrDashboardPage from '../modules/hr/pages/HrDashboardPage';
import HrProfilePage from '../modules/hr/pages/HrProfilePage';
import HrJobsPage from '../modules/hr/pages/HrJobsPage';
import HrJobApplicantsPage from '../modules/hr/pages/HrJobApplicantsPage';
import HrCandidatesPage from '../modules/hr/pages/HrCandidatesPage';
import HrInterviewsPage from '../modules/hr/pages/HrInterviewsPage';
import HrAnalyticsPage from '../modules/hr/pages/HrAnalyticsPage';
import HrNotificationsPage from '../modules/hr/pages/HrNotificationsPage';
import HrAtsPage from '../modules/hr/pages/HrAtsPage';
import StudentModuleLayout from '../modules/student/components/StudentModuleLayout';
import StudentDashboardPage from '../modules/student/pages/StudentDashboardPage';
import StudentProfilePage from '../modules/student/pages/StudentProfilePage';
import StudentJobsPage from '../modules/student/pages/StudentJobsPage';
import StudentJobDetailsPage from '../modules/student/pages/StudentJobDetailsPage';
import StudentApplicationsPage from '../modules/student/pages/StudentApplicationsPage';
import StudentSavedJobsPage from '../modules/student/pages/StudentSavedJobsPage';
import StudentAlertsPage from '../modules/student/pages/StudentAlertsPage';
import StudentInterviewsPage from '../modules/student/pages/StudentInterviewsPage';
import StudentAnalyticsPage from '../modules/student/pages/StudentAnalyticsPage';
import StudentAtsPage from '../modules/student/pages/StudentAtsPage';
import StudentNotificationsPage from '../modules/student/pages/StudentNotificationsPage';
import StudentCompanyReviewsPage from '../modules/student/pages/StudentCompanyReviewsPage';
import PlatformModuleLayout from '../modules/platform/components/PlatformModuleLayout';
import PlatformOperationsPage from '../modules/platform/pages/PlatformOperationsPage';
import PlatformDashboardPage from '../modules/platform/pages/PlatformDashboardPage';
import PlatformTenantsPage from '../modules/platform/pages/PlatformTenantsPage';
import PlatformBillingPage from '../modules/platform/pages/PlatformBillingPage';
import PlatformCustomizationPage from '../modules/platform/pages/PlatformCustomizationPage';
import PlatformIntegrationsPage from '../modules/platform/pages/PlatformIntegrationsPage';
import PlatformSecurityPage from '../modules/platform/pages/PlatformSecurityPage';
import PlatformSupportPage from '../modules/platform/pages/PlatformSupportPage';
import AuditModuleLayout from '../modules/audit/components/AuditModuleLayout';
import AuditLogsPage from '../modules/audit/pages/AuditLogsPage';
import AuditDashboardPage from '../modules/audit/pages/AuditDashboardPage';
import AuditEventsPage from '../modules/audit/pages/AuditEventsPage';
import AuditAlertsPage from '../modules/audit/pages/AuditAlertsPage';
import LoginPage from '../modules/auth/pages/LoginPage';
import SignupPage from '../modules/auth/pages/SignupPage';
import OtpVerificationPage from '../modules/auth/pages/OtpVerificationPage';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage';
import OAuthCallbackPage from '../modules/auth/pages/OAuthCallbackPage';
import ForbiddenPage from '../modules/common/pages/ForbiddenPage';
import NotFoundPage from '../modules/common/pages/NotFoundPage';
import AboutUsPage from '../modules/common/pages/footer/AboutUsPage';
import BlogPage from '../modules/common/pages/footer/BlogPage';
import BlogArticlePage from '../modules/common/pages/footer/BlogArticlePage';
import CareersPage from '../modules/common/pages/footer/CareersPage';
import ContactUsPage from '../modules/common/pages/footer/ContactUsPage';
import EmployerHomePage from '../modules/common/pages/footer/EmployerHomePage';
import SitemapPage from '../modules/common/pages/footer/SitemapPage';
import CreditsPage from '../modules/common/pages/footer/CreditsPage';
import HelpCenterPage from '../modules/common/pages/footer/HelpCenterPage';
import SummonsNoticesPage from '../modules/common/pages/footer/SummonsNoticesPage';
import GrievancesPage from '../modules/common/pages/footer/GrievancesPage';
import ReportIssuePage from '../modules/common/pages/footer/ReportIssuePage';
import PrivacyPolicyPage from '../modules/common/pages/footer/PrivacyPolicyPage';
import TermsAndConditionsPage from '../modules/common/pages/footer/TermsAndConditionsPage';
import FraudAlertPage from '../modules/common/pages/footer/FraudAlertPage';
import TrustAndSafetyPage from '../modules/common/pages/footer/TrustAndSafetyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ats', element: <PublicAtsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'workflow', element: <Navigate to="/" replace /> },
      {
        path: 'portal/admin',
        element: (
          <RoleProtectedRoute roles={['admin']}>
            <AdminModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'jobs', element: <AdminJobsPage /> },
          { path: 'reports', element: <AdminReportsPage /> },
          { path: 'applications', element: <AdminApplicationsPage /> },
          { path: 'master-data', element: <AdminMasterDataPage /> },
          { path: 'payments', element: <AdminPaymentsPage /> },
          { path: 'audit', element: <AdminAuditLogsPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'control', element: <AdminControlPage /> }
        ]
      },
      {
        path: 'portal/hr',
        element: (
          <RoleProtectedRoute roles={['hr', 'admin']}>
            <HrModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <HrDashboardPage /> },
          { path: 'profile', element: <HrProfilePage /> },
          { path: 'jobs', element: <HrJobsPage /> },
          { path: 'jobs/:jobId/applicants', element: <HrJobApplicantsPage /> },
          { path: 'candidates', element: <HrCandidatesPage /> },
          { path: 'interviews', element: <HrInterviewsPage /> },
          { path: 'analytics', element: <HrAnalyticsPage /> },
          { path: 'ats', element: <HrAtsPage /> },
          { path: 'notifications', element: <HrNotificationsPage /> }
        ]
      },
      {
        path: 'portal/student',
        element: (
          <RoleProtectedRoute roles={['student', 'admin']}>
            <StudentModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <StudentDashboardPage /> },
          { path: 'profile', element: <StudentProfilePage /> },
          { path: 'jobs', element: <StudentJobsPage /> },
          { path: 'jobs/:jobId', element: <StudentJobDetailsPage /> },
          { path: 'applications', element: <StudentApplicationsPage /> },
          { path: 'saved-jobs', element: <StudentSavedJobsPage /> },
          { path: 'alerts', element: <StudentAlertsPage /> },
          { path: 'interviews', element: <StudentInterviewsPage /> },
          { path: 'analytics', element: <StudentAnalyticsPage /> },
          { path: 'ats', element: <StudentAtsPage /> },
          { path: 'notifications', element: <StudentNotificationsPage /> },
          { path: 'company-reviews', element: <StudentCompanyReviewsPage /> }
        ]
      },
      {
        path: 'portal/platform',
        element: (
          <RoleProtectedRoute roles={['admin']}>
            <PlatformModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <PlatformDashboardPage /> },
          { path: 'tenants', element: <PlatformTenantsPage /> },
          { path: 'billing', element: <PlatformBillingPage /> },
          { path: 'customization', element: <PlatformCustomizationPage /> },
          { path: 'integrations', element: <PlatformIntegrationsPage /> },
          { path: 'security', element: <PlatformSecurityPage /> },
          { path: 'support', element: <PlatformSupportPage /> },
          { path: 'operations', element: <PlatformOperationsPage /> }
        ]
      },
      {
        path: 'portal/audit',
        element: (
          <RoleProtectedRoute roles={['admin', 'hr']}>
            <AuditModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AuditDashboardPage /> },
          { path: 'events', element: <AuditEventsPage /> },
          { path: 'alerts', element: <AuditAlertsPage /> },
          { path: 'logs', element: <AuditLogsPage /> }
        ]
      },
      { path: 'admin', element: <Navigate to="/portal/admin/dashboard" replace /> },
      { path: 'hr', element: <Navigate to="/portal/hr/dashboard" replace /> },
      { path: 'student', element: <Navigate to="/portal/student/dashboard" replace /> },
      { path: 'platform', element: <Navigate to="/portal/platform/dashboard" replace /> },
      { path: 'audit', element: <Navigate to="/portal/audit/dashboard" replace /> },
      { path: 'forbidden', element: <ForbiddenPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'sign-up', element: <SignupPage /> },
      { path: 'verify-otp', element: <OtpVerificationPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'oauth/callback', element: <OAuthCallbackPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogArticlePage /> },
      { path: 'about-us', element: <AboutUsPage /> },
      { path: 'contact-us', element: <ContactUsPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'employer-home', element: <EmployerHomePage /> },
      { path: 'sitemap', element: <SitemapPage /> },
      { path: 'credits', element: <CreditsPage /> },
      { path: 'help-center', element: <HelpCenterPage /> },
      { path: 'summons-notices', element: <SummonsNoticesPage /> },
      { path: 'grievances', element: <GrievancesPage /> },
      { path: 'report-issue', element: <ReportIssuePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-and-conditions', element: <TermsAndConditionsPage /> },
      { path: 'fraud-alert', element: <FraudAlertPage /> },
      { path: 'trust-and-safety', element: <TrustAndSafetyPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);

export default router;

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import AppShell from './AppShell';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import HomePage from '../modules/common/pages/HomePage';
import PublicAtsPage from '../modules/common/pages/PublicAtsPage';
import ServicesPage from '../modules/common/pages/ServicesPage';
import EmpVerifyPage from '../modules/common/pages/EmpVerifyPage';
import RetiredEmployeePage from '../modules/common/pages/RetiredEmployeePage';
import ManagementPortalPage from '../modules/common/pages/ManagementPortalPage';
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
import RetiredJobsPage from '../modules/student/pages/RetiredJobsPage';
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
import DataEntryModuleLayout from '../modules/dataentry/components/dataentryModuleLayout';
import AddJob from '../modules/dataentry/pages/AddJob';
import ApprovedEntries from '../modules/dataentry/pages/ApprovedEntries';
import DataEntryDashboard from '../modules/dataentry/pages/DataEntryDashboard';
import DataEntryRecords from '../modules/dataentry/pages/DataEntryRecords';
import DraftEntries from '../modules/dataentry/pages/DraftEntries';
import ManageEntries from '../modules/dataentry/pages/ManageEntries';
import Notifications from '../modules/dataentry/pages/Notifications';
import PendingEntries from '../modules/dataentry/pages/PendingEntries';
import Profile from '../modules/dataentry/pages/Profile';
import RejectedEntries from '../modules/dataentry/pages/RejectedEntries';
import AccountsModuleLayout from '../modules/accounts-dashboard/components/AccountsModuleLayout';
import AccountsOverview from '../modules/accounts-dashboard/pages/AccountsOverview';
import Transactions from '../modules/accounts-dashboard/pages/Transactions';
import Invoices from '../modules/accounts-dashboard/pages/Invoices';
import Subscriptions from '../modules/accounts-dashboard/pages/Subscriptions';
import Expenses from '../modules/accounts-dashboard/pages/Expenses';
import Payouts from '../modules/accounts-dashboard/pages/Payouts';
import Refunds from '../modules/accounts-dashboard/pages/Refunds';
import Reports from '../modules/accounts-dashboard/pages/Reports';
import PaymentSettings from '../modules/accounts-dashboard/pages/PaymentSettings';
import SalesModuleLayout from '../modules/sales-dashboard/components/SalesModuleLayout';
import SalesOverview from '../modules/sales-dashboard/pages/SalesOverview';
import Orders from '../modules/sales-dashboard/pages/Orders';
import OrderDetails from '../modules/sales-dashboard/pages/OrderDetails';
import Leads from '../modules/sales-dashboard/pages/Leads';
import LeadDetails from '../modules/sales-dashboard/pages/LeadDetails';
import Customers from '../modules/sales-dashboard/pages/Customers';
import CustomerDetails from '../modules/sales-dashboard/pages/CustomerDetails';
import SalesTeam from '../modules/sales-dashboard/pages/SalesTeam';
import Products from '../modules/sales-dashboard/pages/Products';
import Coupons from '../modules/sales-dashboard/pages/Coupons';
import SalesRefunds from '../modules/sales-dashboard/pages/Refunds';
import SalesReports from '../modules/sales-dashboard/pages/Reports';
import SupportModuleLayout from '../modules/support/layouts/SupportModuleLayout';
import SupportDashboard from '../modules/support/pages/SupportDashboard';
import Tickets from '../modules/support/pages/Tickets';
import TicketDetails from '../modules/support/pages/TicketDetails';
import CreateTicket from '../modules/support/pages/CreateTicket';
import LiveChat from '../modules/support/pages/LiveChat';
import FAQ from '../modules/support/pages/FAQ';
import Complaints from '../modules/support/pages/Complaints';
import Feedback from '../modules/support/pages/Feedback';
import KnowledgeBase from '../modules/support/pages/KnowledgeBase';
import SupportReports from '../modules/support/pages/SupportReports';
import SuperAdminLayout from '../modules/super-admin/layouts/SuperAdminLayout';
import SuperAdminDashboard from '../modules/super-admin/pages/SuperAdminDashboard';
import UsersManagement from '../modules/super-admin/pages/UsersManagement';
import CompaniesManagement from '../modules/super-admin/pages/CompaniesManagement';
import JobsManagement from '../modules/super-admin/pages/JobsManagement';
import ApplicationsManagement from '../modules/super-admin/pages/ApplicationsManagement';
import PaymentsManagement from '../modules/super-admin/pages/PaymentsManagement';
import SubscriptionsManagement from '../modules/super-admin/pages/SubscriptionsManagement';
import ReportsAnalytics from '../modules/super-admin/pages/ReportsAnalytics';
import SupportTickets from '../modules/super-admin/pages/SupportTickets';
import SystemLogs from '../modules/super-admin/pages/SystemLogs';
import RolesPermissions from '../modules/super-admin/pages/RolesPermissions';
import SystemSettings from '../modules/super-admin/pages/SystemSettings';
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
    path: '/management',
    element: <ManagementPortalPage />
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ats', element: <PublicAtsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'emp-verify', element: <EmpVerifyPage /> },
      { path: 'retired-employee', element: <RetiredEmployeePage /> },
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
          <RoleProtectedRoute roles={['hr']}>
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
          <RoleProtectedRoute roles={['student', 'retired_employee']}>
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
        path: 'portal/retired',
        element: (
          <RoleProtectedRoute roles={['retired_employee']}>
            <Outlet />
          </RoleProtectedRoute>
        ),
        children: [
          {
            path: 'jobs',
            element: <RetiredJobsPage />
          },
          {
            path: 'jobs/:jobId',
            element: <StudentJobDetailsPage />
          }
        ]
      },
      {
        path: 'portal/dataentry',
        element: (
          <RoleProtectedRoute roles={['dataentry']}>
            <DataEntryModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <DataEntryDashboard /> },
          { path: 'add-job', element: <AddJob /> },
          { path: 'records', element: <DataEntryRecords /> },
          { path: 'manage-entries', element: <ManageEntries /> },
          { path: 'drafts', element: <DraftEntries /> },
          { path: 'pending', element: <PendingEntries /> },
          { path: 'approved', element: <ApprovedEntries /> },
          { path: 'rejected', element: <RejectedEntries /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'profile', element: <Profile /> }
        ]
      },
      {
        path: 'portal/accounts',
        element: (
          <RoleProtectedRoute roles={['accounts']}>
            <AccountsModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: 'overview', element: <AccountsOverview /> },
          { path: 'transactions', element: <Transactions /> },
          { path: 'invoices', element: <Invoices /> },
          { path: 'subscriptions', element: <Subscriptions /> },
          { path: 'expenses', element: <Expenses /> },
          { path: 'payouts', element: <Payouts /> },
          { path: 'refunds', element: <Refunds /> },
          { path: 'reports', element: <Reports /> },
          { path: 'payment-settings', element: <PaymentSettings /> }
        ]
      },
      {
        path: 'portal/sales',
        element: (
          <RoleProtectedRoute roles={['sales']}>
            <SalesModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: 'overview', element: <SalesOverview /> },
          { path: 'orders', element: <Orders /> },
          { path: 'order-details', element: <OrderDetails /> },
          { path: 'leads', element: <Leads /> },
          { path: 'lead-details', element: <LeadDetails /> },
          { path: 'customers', element: <Customers /> },
          { path: 'customer-details', element: <CustomerDetails /> },
          { path: 'team', element: <SalesTeam /> },
          { path: 'products', element: <Products /> },
          { path: 'coupons', element: <Coupons /> },
          { path: 'refunds', element: <SalesRefunds /> },
          { path: 'reports', element: <SalesReports /> }
        ]
      },
      {
        path: 'portal/support',
        element: (
          <RoleProtectedRoute roles={['support']}>
            <SupportModuleLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <SupportDashboard /> },
          { path: 'tickets', element: <Tickets /> },
          { path: 'ticket-details', element: <TicketDetails /> },
          { path: 'create-ticket', element: <CreateTicket /> },
          { path: 'live-chat', element: <LiveChat /> },
          { path: 'faq', element: <FAQ /> },
          { path: 'complaints', element: <Complaints /> },
          { path: 'feedback', element: <Feedback /> },
          { path: 'knowledge-base', element: <KnowledgeBase /> },
          { path: 'reports', element: <SupportReports /> }
        ]
      },
      {
        path: 'portal/super-admin',
        element: (
          <RoleProtectedRoute roles={['super_admin']}>
            <SuperAdminLayout />
          </RoleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <SuperAdminDashboard /> },
          { path: 'users', element: <UsersManagement /> },
          { path: 'companies', element: <CompaniesManagement /> },
          { path: 'jobs', element: <JobsManagement /> },
          { path: 'applications', element: <ApplicationsManagement /> },
          { path: 'payments', element: <PaymentsManagement /> },
          { path: 'subscriptions', element: <SubscriptionsManagement /> },
          { path: 'reports', element: <ReportsAnalytics /> },
          { path: 'support-tickets', element: <SupportTickets /> },
          { path: 'system-logs', element: <SystemLogs /> },
          { path: 'roles-permissions', element: <RolesPermissions /> },
          { path: 'system-settings', element: <SystemSettings /> }
        ]
      },
      {
        path: 'portal/platform',
        element: (
          <RoleProtectedRoute roles={['platform']}>
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
          <RoleProtectedRoute roles={['audit']}>
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
      { path: 'retired', element: <Navigate to="/portal/student/dashboard" replace /> },
      { path: 'dataentry', element: <Navigate to="/portal/dataentry/dashboard" replace /> },
      { path: 'accounts', element: <Navigate to="/portal/accounts/overview" replace /> },
      { path: 'sales', element: <Navigate to="/portal/sales/overview" replace /> },
      { path: 'support', element: <Navigate to="/portal/support/dashboard" replace /> },
      { path: 'super-admin', element: <Navigate to="/portal/super-admin/dashboard" replace /> },
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

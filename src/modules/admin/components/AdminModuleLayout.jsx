import {
  FiBarChart2,
  FiBriefcase,
  FiCreditCard,
  FiDatabase,
  FiFileText,
  FiFlag,
  FiSettings,
  FiShield,
  FiUsers
} from 'react-icons/fi';
import PortalWorkbenchLayout from '../../../shared/components/PortalWorkbenchLayout';

const adminNavItems = [
  { to: '/portal/admin/dashboard', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/portal/admin/users', label: 'Users & HR', icon: FiUsers },
  { to: '/portal/admin/jobs', label: 'Jobs', icon: FiBriefcase },
  { to: '/portal/admin/reports', label: 'Reports', icon: FiFlag },
  { to: '/portal/admin/applications', label: 'Applications', icon: FiFileText },
  { to: '/portal/admin/master-data', label: 'Master Data', icon: FiDatabase },
  { to: '/portal/admin/payments', label: 'Payments', icon: FiCreditCard },
  { to: '/portal/admin/audit', label: 'Audit Logs', icon: FiShield },
  { to: '/portal/admin/settings', label: 'Settings', icon: FiSettings }
];

const AdminModuleLayout = () => {
  return (
    <PortalWorkbenchLayout
      portalKey="admin"
      portalLabel="Admin Console"
      subtitle="Governance, moderation, billing, and control workflows in one command surface."
      navItems={adminNavItems}
      support={{
        title: 'Control Room',
        text: 'Prioritize HR approvals and job moderation first to keep marketplace quality stable.',
        to: '/portal/admin/control',
        cta: 'Open command brief',
        searchPlaceholder: 'Search users, jobs, reports, and audit logs'
      }}
    />
  );
};

export default AdminModuleLayout;

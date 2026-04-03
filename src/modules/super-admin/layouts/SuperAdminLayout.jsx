import PortalWorkbenchLayout from '../../../shared/components/PortalWorkbenchLayout';
import { superAdminNavItems } from '../components/AdminSidebar';

const SuperAdminLayout = () => {
  return (
    <PortalWorkbenchLayout
      portalKey="super-admin"
      portalLabel="Super Admin"
      subtitle="Full platform control over users, companies, jobs, billing, support, reporting, permissions, and system policies."
      navItems={superAdminNavItems}
      support={{
        title: 'Global Control',
        text: 'Start with critical logs, pending approvals, support escalations, and billing risk before lower-priority cleanup.',
        to: '/portal/super-admin/dashboard',
        cta: 'Open command center'
      }}
    />
  );
};

export default SuperAdminLayout;

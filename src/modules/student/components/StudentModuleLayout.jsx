import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiHome,
  FiMessageCircle,
  FiStar,
  FiUser
} from 'react-icons/fi';
import PortalWorkbenchLayout from '../../../shared/components/PortalWorkbenchLayout';

const studentNavItems = [
  { to: '/portal/student/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/portal/student/profile', label: 'Profile', icon: FiUser },
  { to: '/portal/student/jobs', label: 'Jobs', icon: FiBriefcase },
  { to: '/portal/student/applications', label: 'Applications', icon: FiFileText },
  { to: '/portal/student/saved-jobs', label: 'Saved Jobs', icon: FiBookmark },
  { to: '/portal/student/alerts', label: 'Alerts', icon: FiBell },
  { to: '/portal/student/interviews', label: 'Interviews', icon: FiCalendar },
  { to: '/portal/student/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/portal/student/ats', label: 'ATS', icon: FiActivity },
  { to: '/portal/student/notifications', label: 'Notifications', icon: FiMessageCircle },
  { to: '/portal/student/company-reviews', label: 'Company Reviews', icon: FiStar }
];

const StudentModuleLayout = () => {
  return (
    <PortalWorkbenchLayout
      portalKey="student"
      portalLabel="Student Workspace"
      subtitle="Build profile strength, discover jobs, and manage applications with clear daily momentum."
      navItems={studentNavItems}
      support={{
        title: 'Career Tips',
        text: 'Keep profile, applications, and interview prep updated to improve recruiter replies.',
        to: '/portal/student/profile',
        cta: 'Open profile',
        searchPlaceholder: 'Search jobs, applications, interview notes'
      }}
    />
  );
};

export default StudentModuleLayout;

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
import { getCurrentUser } from '../../../utils/auth';

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
  const currentUser = getCurrentUser();
  const isRetiredUser = currentUser?.role === 'retired_employee';

  return (
    <PortalWorkbenchLayout
      portalKey="student"
      portalLabel={isRetiredUser ? 'Retired Professional Workspace' : 'Student Workspace'}
      subtitle={isRetiredUser
        ? 'Complete your professional profile and explore jobs curated for retired professionals.'
        : 'Build profile strength, discover jobs, and manage applications with clear daily momentum.'}
      navItems={studentNavItems}
      support={{
        title: isRetiredUser ? 'Profile Tips' : 'Career Tips',
        text: isRetiredUser
          ? 'Add your experience highlights and preferred role details to improve matching for retired job openings.'
          : 'Keep profile, applications, and interview prep updated to improve recruiter replies.',
        to: '/portal/student/profile',
        cta: isRetiredUser ? 'Update profile' : 'Open profile',
        searchPlaceholder: 'Search jobs, applications, interview notes'
      }}
    />
  );
};

export default StudentModuleLayout;

import { FiBriefcase, FiMail, FiMessageCircle, FiTwitter } from 'react-icons/fi';
import { BLOG_BASE_URL } from '../../../../utils/externalLinks.js';

export const footerSocialLinks = [
  { label: 'Support', href: '/contact-us', icon: FiMessageCircle },
  { label: 'Careers', href: '/careers', icon: FiBriefcase },
  { label: 'Updates', href: BLOG_BASE_URL, icon: FiTwitter, newTab: false },
  { label: 'Email', href: 'mailto:support@hhh-jobs.com', icon: FiMail }
];

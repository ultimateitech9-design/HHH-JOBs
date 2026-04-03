export const socialRoleOptions = [
  { value: 'student', label: 'Student / Candidate', description: 'Candidate login for jobs and applications.' },
  { value: 'retired_employee', label: 'Retired Employee', description: 'Opportunity flow for retired professionals.' }
];

export const signupRoleOptions = [
  { value: 'student', label: 'Student / Candidate', description: 'Candidate login for jobs and applications.' },
  { value: 'hr', label: 'HR / Recruiter', description: 'Recruiter flows for jobs and hiring.' },
  { value: 'retired_employee', label: 'Retired Employee', description: 'Opportunity flow for retired professionals.' }
];

export const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' }
];

export const casteOptions = [
  { value: '', label: 'Select caste category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' }
];

export const religionOptions = [
  { value: '', label: 'Select religion' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'christian', label: 'Christian' },
  { value: 'jain', label: 'Jain' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'other', label: 'Other' }
];

export const countryCodeOptions = [
  { code: '+91', label: 'India (+91)', digits: 10 },
  { code: '+1', label: 'USA/Canada (+1)', digits: 10 },
  { code: '+44', label: 'UK (+44)', digits: 10 },
  { code: '+61', label: 'Australia (+61)', digits: 9 },
  { code: '+971', label: 'UAE (+971)', digits: 9 }
];

export const loginShellBenefits = [
  {
    title: 'Dashboard continuity',
    description: 'Shared shells keep sign-in aligned with the rest of the product.'
  },
  {
    title: 'Role-aware access',
    description: 'Managed accounts and role redirects remain intact.'
  },
  {
    title: 'Social login support',
    description: 'Google and LinkedIn stay available only for student and retired accounts.'
  }
];

export const signupShellBenefits = [
  {
    title: 'Role-based onboarding',
    description: 'Candidate, recruiter, and retired-employee registrations each expose only the fields they need.'
  },
  {
    title: 'Identity previews',
    description: 'Generated IDs remain visible during signup so users understand the account structure.'
  },
  {
    title: 'Fallback ready',
    description: 'HR keeps manual onboarding while student and retired flows can still use social auth.'
  }
];

export const forgotPasswordBenefits = [
  {
    title: 'Secure reset flow',
    description: 'Password recovery stays split into OTP request and reset confirmation for a cleaner path.'
  },
  {
    title: 'Minimal friction',
    description: 'The page surfaces only the current step while preserving existing API behavior.'
  }
];

export const otpBenefits = [
  {
    title: 'Single-purpose verification',
    description: 'OTP entry now sits inside the same auth shell as the rest of the public onboarding stack.'
  },
  {
    title: 'Fallback compatible',
    description: 'Manual resend and local fallback verification continue to behave as before.'
  }
];

export const oauthBenefits = [
  {
    title: 'Callback handoff',
    description: 'Social login responses are processed and redirected into the correct dashboard flow.'
  },
  {
    title: 'Session continuity',
    description: 'Generated IDs and role-based session data remain normalized before navigation.'
  }
];

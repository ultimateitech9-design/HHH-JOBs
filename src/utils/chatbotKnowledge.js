const HINDI_HINT_RE = /\b(kya|kaise|kyun|nahi|hain|hai|mera|meri|mujhe|aap|kripya|samjhao|madad|issue|problem)\b/i;
const DEVA_RE = /[\u0900-\u097F]/;

const isHindi = (text = '') => DEVA_RE.test(text) || HINDI_HINT_RE.test(String(text || ''));

export const WEBSITE_KNOWLEDGE_CONTEXT = {
  routes: [
    '/login',
    '/sign-up',
    '/verify-otp',
    '/forgot-password',
    '/portal/student/*',
    '/portal/hr/*',
    '/portal/admin/*',
    '/portal/platform/*',
    '/portal/audit/*'
  ],
  keyEndpoints: [
    'POST /auth/signup',
    'POST /auth/login',
    'POST /auth/send-otp',
    'POST /auth/verify-otp',
    'POST /auth/forgot-password',
    'GET /student/profile',
    'PUT /student/profile',
    'GET /jobs',
    'POST /jobs/:id/apply',
    'POST /ats/check/:jobId',
    'GET /ats/history',
    'GET /hr/jobs',
    'POST /hr/jobs',
    'GET /admin/analytics',
    'POST /ai/chatbot'
  ],
  authRules: [
    'Portal routes require login.',
    'Role based access is enforced with RoleProtectedRoute.',
    'Unauthorized role should redirect to /forbidden.'
  ]
};

const includesAny = (text, words) => words.some((word) => text.includes(word));

export const buildLocalSupportReply = ({ message = '', pageContext = '/', role = 'guest' }) => {
  const raw = String(message || '').trim();
  if (!raw) return '';

  const lower = raw.toLowerCase();
  const hindi = isHindi(raw);

  const replies = {
    login: hindi
      ? [
        'Login issue fix checklist:',
        '1. Mobile/email aur password dobara check karein.',
        '2. Agar OTP flow hai to pehle OTP verify karein (`/verify-otp`).',
        '3. Token/session clear karke dubara login karein.',
        '4. Agar still fail ho to backend endpoint `POST /auth/login` response status check karein.'
      ]
      : [
        'Login issue checklist:',
        '1. Re-check email/mobile and password.',
        '2. If OTP is required, complete verification on `/verify-otp` first.',
        '3. Clear stale session/token and sign in again.',
        '4. If it still fails, inspect `POST /auth/login` response status and message.'
      ],
    otp: hindi
      ? [
        'OTP issue ke liye:',
        '1. Sahi email/mobile use ho raha hai verify karein.',
        '2. OTP expire ho gaya ho to resend karein.',
        '3. `POST /auth/send-otp` aur `POST /auth/verify-otp` API response check karein.',
        '4. Server time mismatch ho to OTP validation fail ho sakta hai.'
      ]
      : [
        'For OTP issues:',
        '1. Confirm the correct email/mobile is used.',
        '2. Resend OTP if it is expired.',
        '3. Check `POST /auth/send-otp` and `POST /auth/verify-otp` responses.',
        '4. Server time mismatch can break OTP validation.'
      ],
    access: hindi
      ? [
        'Access/forbidden issue usually role mismatch hota hai.',
        `Current context: role=${role}, page=${pageContext}.`,
        '1. Sahi role se login karein (student/hr/admin).',
        '2. Protected route pe bina login redirect `/login` aana chahiye.',
        '3. Agar `/forbidden` aa raha hai to role authorization verify karein.'
      ]
      : [
        'Access/forbidden issues are usually role mismatches.',
        `Current context: role=${role}, page=${pageContext}.`,
        '1. Sign in with the correct role (student/hr/admin).',
        '2. Unauthenticated access should redirect to `/login`.',
        '3. If `/forbidden` appears, verify role authorization for that route.'
      ],
    jobs: hindi
      ? [
        'Jobs/apply issue ke liye quick checks:',
        '1. Jobs list load: `GET /jobs`.',
        '2. Job details load: `GET /jobs/:id`.',
        '3. Apply action: `POST /jobs/:id/apply` (login required).',
        '4. Duplicate apply par backend conflict message aa sakta hai.'
      ]
      : [
        'Quick checks for jobs/apply issues:',
        '1. Job list load: `GET /jobs`.',
        '2. Job details load: `GET /jobs/:id`.',
        '3. Apply action: `POST /jobs/:id/apply` (requires login).',
        '4. Duplicate applications may return a conflict message from backend.'
      ],
    ats: hindi
      ? [
        'ATS issue troubleshoot:',
        '1. Job select karke resume data complete rakhein.',
        '2. Score check API: `POST /ats/check/:jobId`.',
        '3. History API: `GET /ats/history`.',
        '4. Empty history ho to pehle ek ATS check run karein.'
      ]
      : [
        'ATS troubleshooting:',
        '1. Select a target job and keep resume/profile data complete.',
        '2. Score API: `POST /ats/check/:jobId`.',
        '3. History API: `GET /ats/history`.',
        '4. If history is empty, run one ATS check first.'
      ],
    hr: hindi
      ? [
        'HR dashboard/job posting issue:',
        '1. Jobs list: `GET /hr/jobs`.',
        '2. Create posting: `POST /hr/jobs`.',
        '3. Applicants: `GET /hr/jobs/:id/applicants`.',
        '4. Candidate search: `GET /hr/candidates/search`.',
        '5. Role `hr` ya `admin` hona chahiye.'
      ]
      : [
        'HR dashboard/job posting issue:',
        '1. Jobs list: `GET /hr/jobs`.',
        '2. Create posting: `POST /hr/jobs`.',
        '3. Applicants: `GET /hr/jobs/:id/applicants`.',
        '4. Candidate search: `GET /hr/candidates/search`.',
        '5. Role must be `hr` or `admin`.'
      ],
    profile: hindi
      ? [
        'Profile update issue:',
        '1. Student profile APIs: `GET /student/profile`, `PUT /student/profile`.',
        '2. Required fields missing hone par save fail ho sakta hai.',
        '3. Network tab me request payload aur error message check karein.'
      ]
      : [
        'Profile update issue:',
        '1. Student profile APIs: `GET /student/profile`, `PUT /student/profile`.',
        '2. Saves can fail when required fields are missing.',
        '3. Inspect request payload and backend error in Network tab.'
      ],
    network: hindi
      ? [
        'Agar page data load nahi ho raha:',
        '1. `VITE_API_BASE_URL` sahi set hai ya nahi check karein.',
        '2. Backend server run hona chahiye.',
        '3. 401 aaye to session expire ho sakta hai, dubara login karein.',
        '4. CORS ya 5xx errors ho to backend logs check karein.'
      ]
      : [
        'If data is not loading:',
        '1. Verify `VITE_API_BASE_URL` configuration.',
        '2. Ensure backend server is running.',
        '3. A `401` means session/token may be expired; sign in again.',
        '4. Check backend logs for CORS or 5xx errors.'
      ],
    generic: hindi
      ? [
        'Main website support me help kar sakta hoon: login, signup, OTP, dashboard access, jobs/apply, ATS, HR posting, profile save, notifications.',
        `Aapka context: role=${role}, page=${pageContext}.`,
        'Problem ka exact error text share karein, tab main precise fix steps dunga.'
      ]
      : [
        'I can help with website issues: login, signup, OTP, dashboard access, jobs/apply, ATS, HR posting, profile save, notifications.',
        `Your context: role=${role}, page=${pageContext}.`,
        'Share the exact error text for a precise fix path.'
      ]
  };

  if (includesAny(lower, ['login', 'sign in', 'signin', 'password'])) return replies.login.join('\n');
  if (includesAny(lower, ['otp', 'verify', 'verification'])) return replies.otp.join('\n');
  if (includesAny(lower, ['forbidden', 'unauthorized', 'access', 'bypass', 'role'])) return replies.access.join('\n');
  if (includesAny(lower, ['job', 'apply', 'application', 'saved jobs'])) return replies.jobs.join('\n');
  if (includesAny(lower, ['ats', 'resume score', 'match rate'])) return replies.ats.join('\n');
  if (includesAny(lower, ['hr', 'recruiter', 'candidate', 'applicant', 'posting'])) return replies.hr.join('\n');
  if (includesAny(lower, ['profile', 'update', 'save'])) return replies.profile.join('\n');
  if (includesAny(lower, ['network', 'api', 'server', 'fetch', 'cors', '500', 'timeout', 'load'])) return replies.network.join('\n');

  return replies.generic.join('\n');
};

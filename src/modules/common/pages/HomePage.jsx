import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiCircle,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiHeart,
  FiHeadphones,
  FiLayers,
  FiPlay,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { FaGem, FaMedal } from 'react-icons/fa';
import { apiFetch } from '../../../utils/api';
import { blogCardItems } from './blogArticles';
import './HomePage.css';
import heroImage from '../../../assets/hero.jpeg';

const popularKeywords = [
  'Frontend Developer',
  'Android Developer',
  'React Developer',
  'Node.js Developer',
  'Data Analyst',
  'Digital Marketing',
  'Business Development',
  'HR Executive',
  'Accountant',
  'Customer Support',
  'Sales Executive',
  'UI/UX Designer',
  'DevOps Engineer',
  'Nurse',
  'Operations Manager'
];
const locationOptions = ['Any Location', 'Bengaluru', 'Noida', 'Pune', 'Hyderabad', 'Remote', 'Mumbai'];
const experienceOptions = ['Any Experience', '0-2 Years', '0-5 Years', '5+ Years'];
const heroExperienceOptions = [
  'Any Experience',
  'Student',
  'Internship',
  '0-2 Years',
  '0-5 Years',
  '5+ Years'
];

const categoryCards = [
  { title: 'Technical Support', count: '2K+ jobs', icon: FiHeadphones, searchTerm: 'Technical Support', keywords: ['technical support', 'customer support', 'helpdesk', 'support engineer'] },
  { title: 'Business Development', count: '4K+ jobs', icon: FiTrendingUp, searchTerm: 'Business Development', keywords: ['business development', 'bde', 'sales executive', 'inside sales'] },
  { title: 'Real Estate Business', count: '1K+ jobs', icon: FiLayers, searchTerm: 'Real Estate Business', keywords: ['real estate', 'property consultant', 'channel partner'] },
  { title: 'Share Market Analyst', count: '900+ jobs', icon: FiActivity, searchTerm: 'Share Market Analyst', keywords: ['market analyst', 'equity analyst', 'stock market', 'research analyst'] },
  { title: 'Finance & Banking', count: '3K+ jobs', icon: FiDollarSign, searchTerm: 'Finance & Banking', keywords: ['finance', 'banking', 'accountant', 'credit analyst'] },
  { title: 'IT & Networking', count: '6K+ jobs', icon: FiBriefcase, searchTerm: 'IT & Networking', keywords: ['it', 'network', 'system admin', 'network engineer', 'software'] },
  { title: 'Restaurant Services', count: '2K+ jobs', icon: FiUsers, searchTerm: 'Restaurant Services', keywords: ['restaurant', 'hospitality', 'kitchen', 'food service'] },
  { title: 'Defence & Fire Service', count: '1.2K+ jobs', icon: FiShield, searchTerm: 'Defence & Fire Service', keywords: ['defence', 'fire service', 'security guard', 'safety officer'] }
];

const helpHighlights = [
  {
    title: 'All jobs in one place',
    description: 'View every matching job with fresh filters and clear requirements.'
  },
  {
    title: 'Seamless searching',
    description: 'Use role, experience, and location filters without switching pages.'
  },
  {
    title: 'Hired in top companies',
    description: 'Recruiters from leading companies can shortlist straight from your profile.'
  }
];

const sponsoredCompanies = [
  {
    name: 'Eimager',
    website: 'https://www.google.com/search?q=Eimager',
    logo: 'https://www.eimager.com/images/logo.png',
    rating: '4.6',
    reviews: '120+ reviews',
    tags: ['IT Services', 'Technology']
  },
  {
    name: 'Ultimate ITech',
    website: 'https://www.google.com/search?q=Ultimate+ITech',
    logo: 'https://eimager.com/images/ultimate-new.png',
    rating: '4.4',
    reviews: '95+ reviews',
    tags: ['IT Services', 'Engineering']
  },
  {
    name: 'Indian Trade Mart',
    website: 'https://www.google.com/search?q=Indian+Trade+Mart',
    logo: 'https://indiantrademart.com/itm-logo.png',
    rating: '4.2',
    reviews: '70+ reviews',
    tags: ['B2B', 'Marketplace']
  },
  {
    name: 'Sristech Designers',
    website: 'https://www.google.com/search?q=Sristech+Designers',
    logo: 'https://sristechdesigners.com/images/sris/black-website-logo.png',
    rating: '4.5',
    reviews: '88+ reviews',
    tags: ['Design', 'Consultant']
  },
  {
    name: 'Startup N Business',
    website: 'https://www.google.com/search?q=Startup+N+Business',
    logo: 'https://startupnbusiness.com/wp-content/uploads/2026/01/1000110635-removebg-preview.png',
    rating: '4.3',
    reviews: '64+ reviews',
    tags: ['Startups', 'Business']
  },
  {
    name: 'PDSS Lab',
    website: 'https://www.google.com/search?q=PDSS+Lab',
    logo: 'https://pdsslab.com/wp-content/uploads/2024/09/pdss-logo.png',
    rating: '4.1',
    reviews: '58+ reviews',
    tags: ['Research', 'laboratory']
  },
  {
    name: 'PDCE Group',
    website: 'https://www.google.com/search?q=PDCE+Group',
    logo: 'https://www.pdcegroup.com/images/logo.jpg',
    rating: '4.0',
    reviews: '49+ reviews',
    tags: ['Infrastructure', 'Consultant']
  },
  {
    name: 'BSH Infra',
    website: 'https://www.google.com/search?q=BSH+Infra',
    logo: 'https://eimager.com/images/bsh.png',
    rating: '4.2',
    reviews: '54+ reviews',
    tags: ['Construction', 'Builder']
  },
  {
    name: 'Sristech Movies',
    website: 'https://www.google.com/search?q=Sristech+Movies',
    logo: 'https://eimager.com/images/movie-image.png',
    rating: '4.0',
    reviews: '39+ reviews',
    tags: ['Movies', 'Album Song']
  },
  {
    name: 'BSH Reality',
    website: 'https://www.google.com/search?q=BSH+Reality',
    logo: 'https://eimager.com/images/bshrealty.png',
    rating: '4.3',
    reviews: '66+ reviews',
    tags: ['Real Estate', 'Property Dealer']
  }
];

const sponsoredCompanyNames = sponsoredCompanies.map((company) => company.name);
const sponsoredCompanyLogoByName = Object.fromEntries(
  sponsoredCompanies.map((company) => [company.name, company.logo])
);
const sponsoredCompanyWebsiteByName = Object.fromEntries(
  sponsoredCompanies.map((company) => [company.name, company.website])
);

const hiringPartnerLogos = [
  { name: 'Eimager', logo: 'https://www.eimager.com/images/logo.png' },
  { name: 'Ultimate ITech', logo: 'https://eimager.com/images/ultimate-new.png' },
  { name: 'Indian Trade Mart', logo: 'https://indiantrademart.com/itm-logo.png' },
  { name: 'Startup N Business', logo: 'https://startupnbusiness.com/wp-content/uploads/2026/01/1000110635-removebg-preview.png' },
  { name: 'PDCE Group', logo: 'https://www.pdcegroup.com/images/logo.jpg' },
  { name: 'BSH Realty', logo: 'https://eimager.com/images/bshrealty.png' },
  { name: 'HCLTech', logo: 'https://www.hcltech.com/themes/custom/hcltech/images/hcl-logo.svg' },
  { name: 'Wipro', logo: 'https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg' },
  { name: 'Coforge', logo: 'https://www.coforge.com/hubfs/website-assets/coforge-logo.svg' },
  { name: 'Tata Motors', logo: 'https://www.tatamotors.com/wp-content/themes/TataMotors/images/logo-tata-motors.svg' },
  { name: 'Maruti Suzuki', logo: 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:791b5601-4cfa-4b0f-a77b-ec588eba84ad/as/Maruti-suzuki_logo_v1.svg' }
];

const pricingPlans = [
  {
    title: 'Premium',
    tone: 'hot-vacancy',
    headlinePrice: '₹1,200',
    previousPrice: '₹2,000',
    topDiscount: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Detailed job description', included: true },
      { label: '20 job locations', included: true },
      { label: 'Unlimited applies', included: true },
      { label: 'Applies expiry 90 days', included: true },
      { label: 'Jobseeker contact details visible', included: true },
      { label: 'Boost on Job Search Page', included: true },
      { label: 'Job Branding', included: true }
    ],
    validity: 'Job validity 30 days',
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Premium'
  },
  {
    title: 'Pro',
    tone: 'classified',
    headlinePrice: '₹600',
    previousPrice: '₹1000',
    topDiscount: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '8 job locations', included: true },
      { label: 'Unlimited applies', included: true },
      { label: 'Applies expiry 60 days', included: true },
      { label: 'Jobseeker contact details visible', included: true },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    validity: 'Job validity 30 days',
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Pro'
  },
  {
    title: 'Standard',
    tone: 'standard',
    headlinePrice: '₹300',
    previousPrice: '₹500',
    topDiscount: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '3 job locations', included: true },
      { label: '200 applies', included: true },
      { label: 'Applies expiry 30 days', included: true },
      { label: 'Jobseeker contact details visible', included: false },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    validity: 'Job validity 15 days',
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Standard'
  },
  {
    title: 'Free',
    tone: 'free',
    headlinePrice: 'Free',
    subTitle: 'Job Posting',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '1 job location', included: true },
      { label: '50 applies', included: true },
      { label: 'Applies expiry 15 days', included: true },
      { label: 'Jobseeker contact details visible', included: false },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    validity: 'Job validity 7 days',
    ctaLabel: 'Post a free job',
    ctaTo: '/sign-up?plan=Free',
    hideQuantity: true
  }
];

const resumeDatabasePlans = [
  {
    title: 'Gold',
    icon: FaMedal,
    subTitle: 'Best for small and medium businesses with focused hiring needs',
    price: '₹3,600',
    taxNote: '*GST as applicable',
    offerText: 'Flat ₹1,500 OFF on purchasing 3 requirements',
    features: [
      '150 CV views per requirement',
      'Up to 600 search results',
      'Candidates active in last 6 months',
      '10+ advanced filters',
      'Single user access',
      '1 search query (role, location) per requirement'
    ],
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Gold',
    validity: 'Database validity 15 days',
    withQuantity: true
  },
  {
    title: 'Dimond',
    icon: FaGem,
    subTitle: 'Get customised solutions and dedicated support for bigger hiring needs',
    price: "Let's customize",
    taxNote: 'Based on your plan',
    features: [
      'CV views as per plan',
      'Unlimited search results',
      'All available candidates',
      '20+ advanced filters',
      'Multiple user access',
      'Email multiple candidates together',
      'Boolean keyword search',
      'Download CVs in bulk'
    ],
    ctaLabel: 'Contact sales',
    ctaTo: '/contact-us?source=dimond-plan',
    validity: 'Database validity as per the plan',
    withQuantity: false
  }
];

const brandPartnerCompanies = [
  ...sponsoredCompanyNames,
  'TCS',
  'Infosys',
  'Wipro',
  'HCLTech',
  'Cognizant',
  'Tech Mahindra',
  'Accenture',
  'Microsoft',
  'IBM',
  'Capgemini',
  'Oracle',
  'Google',
  'Skyline Realty',
  'Apex Manufacturing',
  'FreshMart Retail',
  'PureHarvest FMCG',
  'TrustAxis Bank',
  'HavenStay Hotels',
  'WellSpring Health',
  'UrbanNest Realty',
  'ForgeWorks Manufacturing',
  'CityKart Retail',
  'DailyBasket FMCG',
  'PrimeLedger Finance',
  'BlueOrbit Hospitality',
  'CareBridge Hospitals',
  'HarvestBite Foods'
];
const appStoreUrl = 'https://www.apple.com/app-store/';
const playStoreUrl = 'https://play.google.com/store';
const companySliderPalettes = [
  { bg: 'linear-gradient(135deg, #e9f2ff, #dceaff)', border: '#c4d8ff', ink: '#173b73' },
  { bg: 'linear-gradient(135deg, #e7fff5, #d4f9eb)', border: '#b7eed6', ink: '#0e5b44' },
  { bg: 'linear-gradient(135deg, #fff1e5, #ffe7d2)', border: '#f3d2b4', ink: '#6d3a12' },
  { bg: 'linear-gradient(135deg, #f4edff, #e7dcff)', border: '#d8c7ff', ink: '#47297f' },
  { bg: 'linear-gradient(135deg, #ecf8ff, #ddf1ff)', border: '#c4e5ff', ink: '#114d79' },
  { bg: 'linear-gradient(135deg, #fff8e8, #ffefc9)', border: '#f2deac', ink: '#6d4b0a' }
];
const fallbackFeaturedListings = [
  { id: 'f1', companyName: 'Star Health', jobTitle: 'Web Designer / Developer', jobLocation: 'Mumbai' },
  { id: 'f2', companyName: 'BubblyBlog', jobTitle: 'Marketing Director', jobLocation: 'New Delhi' },
  { id: 'f3', companyName: 'Altes Bank', jobTitle: 'App Developer For Android', jobLocation: 'Gurgaon' },
  { id: 'f4', companyName: 'TixDog', jobTitle: 'Marketing Manager', jobLocation: 'Gurgaon' },
  { id: 'f5', companyName: 'MediaLab', jobTitle: 'Sales Executive', jobLocation: 'Bangalore' },
  { id: 'f6', companyName: 'Star Health', jobTitle: 'Account Manager', jobLocation: 'Mumbai' },
  { id: 'f7', companyName: 'MediaLab', jobTitle: 'Content Writer', jobLocation: 'Bangalore' },
  { id: 'f8', companyName: 'MediaLab', jobTitle: 'Director of Sales', jobLocation: 'Bangalore' }
];
const companyLogoByName = {
  ...sponsoredCompanyLogoByName,
  TCS: '/company-logos/tcs.svg',
  Infosys: '/company-logos/infosys.svg',
  Wipro: '/company-logos/wipro.svg',
  HCLTech: '/company-logos/hcltech.svg',
  Cognizant: '/company-logos/cognizant.svg',
  'Tech Mahindra': '/company-logos/tech-mahindra.svg',
  Accenture: '/company-logos/accenture.svg',
  Microsoft: '/company-logos/microsoft.svg',
  IBM: '/company-logos/ibm.svg',
  Capgemini: '/company-logos/capgemini.svg',
  Oracle: '/company-logos/oracle.svg',
  Google: '/company-logos/google.svg',
  'Skyline Realty': '/company-logos/skyline-realty.svg',
  'Apex Manufacturing': '/company-logos/apex-manufacturing.svg',
  'FreshMart Retail': '/company-logos/freshmart-retail.svg',
  'PureHarvest FMCG': '/company-logos/pureharvest-fmcg.svg',
  'TrustAxis Bank': '/company-logos/trustaxis-bank.svg',
  'HavenStay Hotels': '/company-logos/havenstay-hotels.svg',
  'WellSpring Health': '/company-logos/wellspring-health.svg',
  'UrbanNest Realty': '/company-logos/urbannest-realty.svg',
  'ForgeWorks Manufacturing': '/company-logos/forgeworks-manufacturing.svg',
  'CityKart Retail': '/company-logos/citykart-retail.svg',
  'DailyBasket FMCG': '/company-logos/dailybasket-fmcg.svg',
  'PrimeLedger Finance': '/company-logos/primeledger-finance.svg',
  'BlueOrbit Hospitality': '/company-logos/blueorbit-hospitality.svg',
  'CareBridge Hospitals': '/company-logos/carebridge-hospitals.svg',
  'HarvestBite Foods': '/company-logos/harvestbite-foods.svg',
  Deloitte: 'https://logo.clearbit.com/deloitte.com',
  Figma: 'https://logo.clearbit.com/figma.com',
  'Google Fonts': 'https://logo.clearbit.com/google.com',
  Amazon: 'https://logo.clearbit.com/amazon.com',
  'Help Scout': 'https://logo.clearbit.com/helpscout.com',
  Optimizely: 'https://logo.clearbit.com/optimizely.com',
  Breezy: 'https://logo.clearbit.com/breezy.hr',
  Attio: 'https://logo.clearbit.com/attio.com',
  PayPal: 'https://logo.clearbit.com/paypal.com',
  mparticle: 'https://logo.clearbit.com/mparticle.com',
  HubSpot: 'https://logo.clearbit.com/hubspot.com',
  Miro: 'https://logo.clearbit.com/miro.com',
  Jeevansathi: 'https://logo.clearbit.com/jeevansathi.com',
  NaukriGulf: 'https://logo.clearbit.com/naukrigulf.com',
  Shiksha: 'https://logo.clearbit.com/shiksha.com',
  Naukri: 'https://logo.clearbit.com/naukri.com',
  '99acres': 'https://logo.clearbit.com/99acres.com',
  AmbitionBox: 'https://logo.clearbit.com/ambitionbox.com',
  iimjobs: 'https://logo.clearbit.com/iimjobs.com',
  Hirist: 'https://logo.clearbit.com/hirist.com',
  Firstnaukri: 'https://logo.clearbit.com/firstnaukri.com',
  Meritnation: 'https://logo.clearbit.com/meritnation.com',
  Policybazaar: 'https://logo.clearbit.com/policybazaar.com',
  PaisaBazaar: 'https://logo.clearbit.com/paisabazaar.com'
};
const companyWebsiteByName = {
  ...sponsoredCompanyWebsiteByName,
  TCS: 'https://www.tcs.com',
  Infosys: 'https://www.infosys.com',
  Wipro: 'https://www.wipro.com',
  HCLTech: 'https://www.hcltech.com',
  Cognizant: 'https://www.cognizant.com',
  'Tech Mahindra': 'https://www.techmahindra.com',
  Accenture: 'https://www.accenture.com',
  Microsoft: 'https://www.microsoft.com',
  IBM: 'https://www.ibm.com',
  Capgemini: 'https://www.capgemini.com',
  Oracle: 'https://www.oracle.com',
  Google: 'https://www.google.com',
  'Skyline Realty': 'https://www.google.com/search?q=Skyline+Realty',
  'Apex Manufacturing': 'https://www.google.com/search?q=Apex+Manufacturing',
  'FreshMart Retail': 'https://www.google.com/search?q=FreshMart+Retail',
  'PureHarvest FMCG': 'https://www.google.com/search?q=PureHarvest+FMCG',
  'TrustAxis Bank': 'https://www.google.com/search?q=TrustAxis+Bank',
  'HavenStay Hotels': 'https://www.google.com/search?q=HavenStay+Hotels',
  'WellSpring Health': 'https://www.google.com/search?q=WellSpring+Health',
  'UrbanNest Realty': 'https://www.google.com/search?q=UrbanNest+Realty',
  'ForgeWorks Manufacturing': 'https://www.google.com/search?q=ForgeWorks+Manufacturing',
  'CityKart Retail': 'https://www.google.com/search?q=CityKart+Retail',
  'DailyBasket FMCG': 'https://www.google.com/search?q=DailyBasket+FMCG',
  'PrimeLedger Finance': 'https://www.google.com/search?q=PrimeLedger+Finance',
  'BlueOrbit Hospitality': 'https://www.google.com/search?q=BlueOrbit+Hospitality',
  'CareBridge Hospitals': 'https://www.google.com/search?q=CareBridge+Hospitals',
  'HarvestBite Foods': 'https://www.google.com/search?q=HarvestBite+Foods'
};

const getJobImage = (index) => `https://picsum.photos/seed/hhh-job-${index + 1}/640/420`;
const includesTerm = (value, keyword) => String(value || '').toLowerCase().includes(String(keyword || '').toLowerCase());
const JOBS_PER_PAGE = 6;
const getCompanyMark = (name = '') =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CO';

const toInt = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatSalary = (job = {}) => {
  const min = toInt(job.minPrice);
  const max = toInt(job.maxPrice);
  const type = String(job.salaryType || '').trim();

  if (!min && !max) return 'Salary not disclosed';
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${type}`.trim();
  if (min) return `${min.toLocaleString()} ${type}`.trim();
  return `${max.toLocaleString()} ${type}`.trim();
};

const matchesCategory = (job = {}, category = null) => {
  if (!category) return true;
  const haystack = [
    job.jobTitle,
    job.companyName,
    job.description,
    job.jobLocation,
    job.category,
    Array.isArray(job.skills) ? job.skills.join(' ') : ''
  ].join(' ').toLowerCase();
  return (category.keywords || []).some((keyword) => haystack.includes(String(keyword).toLowerCase()));
};

const HomePage = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: 'Any Location',
    experience: 'Any Experience'
  });
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [reloadSeed, setReloadSeed] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [logoLoadFailed, setLogoLoadFailed] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brandStartIndex, setBrandStartIndex] = useState(0);
  const [isBrandSliding, setIsBrandSliding] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      setLoadingJobs(true);
      setJobsError('');

      try {
        const response = await apiFetch('/jobs?page=1&limit=120&status=open');
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          if (!mounted) return;
          setJobs([]);
          setJobsError(payload?.message || 'Unable to load featured jobs right now.');
          setLoadingJobs(false);
          return;
        }

        if (!mounted) return;
        setJobs(payload?.jobs || []);
        setLoadingJobs(false);
      } catch (error) {
        if (!mounted) return;
        setJobs([]);
        setJobsError('Unable to load featured jobs right now.');
        setLoadingJobs(false);
      }
    };

    loadJobs();
    return () => {
      mounted = false;
    };
  }, [reloadSeed]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const keywordMatch = !keyword
        || includesTerm(job.jobTitle, keyword)
        || includesTerm(job.companyName, keyword)
        || includesTerm(job.description, keyword)
        || (Array.isArray(job.skills) && job.skills.some((skill) => includesTerm(skill, keyword)));

      const locationMatch = filters.location === 'Any Location' || includesTerm(job.jobLocation, filters.location);
      const experienceMatch = filters.experience === 'Any Experience'
        || includesTerm(job.experienceLevel, filters.experience.replace('+', ''));
      const categoryMatch = matchesCategory(job, selectedCategory);

      return keywordMatch && locationMatch && experienceMatch && categoryMatch;
    });
  }, [filters, jobs, selectedCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));

  const featuredJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.keyword, filters.location, filters.experience]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  const pagination = useMemo(() => {
    const pages = [];
    const maxSlots = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(pageCount, start + maxSlots - 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, pageCount]);

  const topCompanies = useMemo(() => brandPartnerCompanies, []);
  const displayedCompanies = useMemo(
    () => (showAllCompanies ? topCompanies : topCompanies.slice(0, 12)),
    [showAllCompanies, topCompanies]
  );
  const brandVisibleCount = Math.min(6, brandPartnerCompanies.length || 0);
  const brandSliderCompanies = useMemo(() => {
    if (!brandPartnerCompanies.length) return [];
    return Array.from({ length: brandVisibleCount }, (_, offset) => {
      const index = (brandStartIndex + offset) % brandPartnerCompanies.length;
      return brandPartnerCompanies[index];
    });
  }, [brandStartIndex, brandVisibleCount]);
  const brandTrackCompanies = useMemo(() => {
    if (!brandPartnerCompanies.length) return [];
    const nextIndex = (brandStartIndex + brandVisibleCount) % brandPartnerCompanies.length;
    return [...brandSliderCompanies, brandPartnerCompanies[nextIndex]];
  }, [brandSliderCompanies, brandStartIndex, brandVisibleCount]);

  useEffect(() => {
    if (brandPartnerCompanies.length <= 1 || isBrandSliding) return undefined;
    const timer = window.setTimeout(() => setIsBrandSliding(true), 5000);
    return () => window.clearTimeout(timer);
  }, [isBrandSliding]);

  useEffect(() => {
    if (!isBrandSliding || brandPartnerCompanies.length <= 1) return undefined;
    const timer = window.setTimeout(() => {
      setBrandStartIndex((current) => (current + 1) % brandPartnerCompanies.length);
      setIsBrandSliding(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [isBrandSliding]);

  useEffect(() => {
    if (!brandPartnerCompanies.length) return;
    setBrandStartIndex((current) => current % brandPartnerCompanies.length);
  }, []);

  const featuredListingCards = useMemo(() => {
    const live = filteredJobs.slice(0, 8).map((job) => ({
      id: job.id || job._id,
      companyName: job.companyName || 'Hiring Company',
      jobTitle: job.jobTitle || 'Open Role',
      jobLocation: job.jobLocation || 'India'
    }));
    return live.length ? live : fallbackFeaturedListings;
  }, [filteredJobs]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleCategorySelect = (searchTerm, category) => {
    setSelectedCategory(category);
    setFilters((current) => ({ ...current, keyword: searchTerm }));
    setCurrentPage(1);
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="jg-home">
      <section className="jg-hero">
        <div className="jg-hero-copy">
          <p className="jg-kicker">Find Your Career</p>
          <h1>To Make a Better Future</h1>
          <p className="jg-hero-subtitle">
            Creating a powerful job journey should be simple. Find relevant opportunities, filter smartly, and apply
            with confidence from one clean workspace.
          </p>

          <form className="jg-search-row" onSubmit={handleSearchSubmit}>
            <label>
              What
              <input
                placeholder="What job you want?"
                value={filters.keyword}
                onChange={(event) => {
                  setSelectedCategory(null);
                  setFilters((current) => ({ ...current, keyword: event.target.value }));
                }}
              />
            </label>
            <label>
              Where
              <input
                list="location-options"
                value={filters.location}
                onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
                placeholder="Any Location"
              />
              <datalist id="location-options">
                {locationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </datalist>
            </label>
            <label>
              Experience
              <select
                value={filters.experience}
                onChange={(event) => setFilters((current) => ({ ...current, experience: event.target.value }))}
              >
                {heroExperienceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="jg-search-btn">
              <FiSearch size={15} />
              Search
            </button>
          </form>

          <div className="jg-chip-row">
            <span>Popular Keywords:</span>
            {popularKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setFilters((current) => ({ ...current, keyword }));
                }}
              >
                {keyword}
              </button>
            ))}
          </div>

          <div className="jg-hero-actions">
            <Link to="/sign-up" className="jg-cta-primary">Register Now</Link>
            <a href="#jobs" className="jg-cta-secondary">Browse Jobs</a>
          </div>
        </div>

        <div className="jg-hero-media">
          <img src={heroImage} alt="Career success" loading="lazy" />
          <button type="button" className="jg-play-btn" aria-label="Play overview video">
            <FiPlay size={20} />
          </button>
        </div>
      </section>

      <section className="jg-service-strip">
        <Link to="/sign-up" className="jg-service-link">
          <FiUsers size={18} />
          <div>
            <h3>Register Your Account</h3>
            <p>Start your journey with a complete profile and verified contact details.</p>
          </div>
        </Link>
        <Link to="/portal/student/profile" className="jg-service-link">
          <FiCheckSquare size={18} />
          <div>
            <h3>Upload Your Resume</h3>
            <p>Keep your resume updated and improve matching quality for recruiters.</p>
          </div>
        </Link>
        <Link to="/portal/student/jobs" className="jg-service-link">
          <FiBriefcase size={18} />
          <div>
            <h3>Apply for Dream Job</h3>
            <p>Track each application, shortlist movement, and interview progress.</p>
          </div>
        </Link>
      </section>

      <section id="about" className="jg-block jg-category-panel">
        <p className="jg-section-kicker">Job Category</p>
        <h2>Choose Your Desired Category</h2>
        <p className="jg-section-subtitle">Explore role families and pick the area where you want to grow next.</p>
        <div className="jg-category-grid">
          {categoryCards.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.title}
                role="button"
                tabIndex={0}
                className={selectedCategory?.title === category.title ? 'is-active' : ''}
                onClick={() => handleCategorySelect(category.searchTerm, category)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCategorySelect(category.searchTerm, category);
                  }
                }}
              >
                <span><Icon size={16} /></span>
                <h3>{category.title}</h3>
                <p className="jg-category-count">{category.count}</p>
              </article>
            );
          })}
        </div>
        <div className="jg-category-actions">
          <button
            type="button"
            className="jg-category-more"
            onClick={() => {
              setSelectedCategory(null);
              setFilters((current) => ({ ...current, keyword: '' }));
              const jobsSection = document.getElementById('jobs');
              if (jobsSection) jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Browse All Categories
          </button>
        </div>
      </section>

      <section id="services" className="jg-help-block">
        <div className="jg-help-gallery">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80"
            alt="Candidate preparing resume on laptop"
            loading="lazy"
          />
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
            alt="Interview discussion with hiring team"
            loading="lazy"
          />
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
            alt="Team collaboration in modern office"
            loading="lazy"
          />
          <Link to="/portal/student/jobs" className="jg-help-highlight" aria-label="Go to jobs section">
            <strong>Job alert</strong>
            <p>110 new jobs are available in this week</p>
          </Link>
        </div>

        <div className="jg-help-content">
          <p className="jg-section-kicker">Career Support</p>
          <h2>Help You To Get The Best Job That Fits You</h2>
          <ul>
            {helpHighlights.map((item) => (
              <li key={item.title}>
                <FiArrowRight size={14} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="jobs" className="jg-block jg-featured-jobs-block">
        <div className="jg-featured-jobs-head">
          <h2>Featured Jobs</h2>
          <Link to="/portal/student/jobs" className="jg-featured-jobs-view-all">View All</Link>
        </div>

        {jobsError ? (
          <article className="jg-featured-jobs-notice">
            <h3>{jobsError}</h3>
          </article>
        ) : null}

        {loadingJobs ? (
          <article className="jg-featured-jobs-notice">
            <h3>Loading featured jobs right now...</h3>
          </article>
        ) : null}

        {!loadingJobs && !jobsError && featuredJobs.length > 0 ? (
          <div className="jg-featured-jobs-list">
            {featuredJobs.map((job) => {
              const jobId = job.id || job._id;
              return (
                <article key={jobId} className="jg-featured-job-item">
                  <div className="jg-featured-job-left">
                    <span className="jg-featured-job-avatar" aria-hidden="true">{getCompanyMark(job.companyName)}</span>
                    <div className="jg-featured-job-copy">
                      <h3>{job.jobTitle || 'Open Role'}</h3>
                      <p>{job.companyName || 'Hiring Company'} - {job.jobLocation || 'India'}</p>
                      <Link to={jobId ? `/portal/student/jobs/${jobId}` : '/login'} className="jg-featured-job-link">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <p className="jg-featured-job-type">{job.jobType || job.employmentType || 'Full Time'}</p>
                </article>
              );
            })}
          </div>
        ) : null}

        {!loadingJobs && !jobsError && featuredJobs.length === 0 ? (
          <article className="jg-featured-jobs-notice">
            <h3>No featured jobs available right now.</h3>
          </article>
        ) : null}

        <div className="jg-featured-jobs-footer">
          <button type="button" className="jg-featured-jobs-refresh" onClick={() => setReloadSeed((current) => current + 1)}>
            Refresh
          </button>
          <Link to="/portal/student/jobs" className="jg-featured-jobs-explore">Explore</Link>
        </div>
      </section>

      <section className="jg-featured-panel">
        <h2>Featured Jobs</h2>
        <p>Leading employers already using job and talent.</p>

        <div className="jg-featured-grid">
          {featuredListingCards.map((item) => (
            <article key={item.id || `${item.companyName}-${item.jobTitle}`} className="jg-featured-card">
              <button type="button" className="jg-featured-like" aria-label="Save featured job">
                <FiHeart size={14} />
              </button>
              <div className="jg-featured-logo" aria-hidden="true">{getCompanyMark(item.companyName)}</div>
              <h3>{item.jobTitle}</h3>
              <p className="jg-featured-company">{item.companyName}</p>
              <div className="jg-featured-foot">
                <span>{item.jobLocation}</span>
                <Link to={item.id ? `/portal/student/jobs/${item.id}` : '/login'}>Apply now</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="jg-featured-actions">
          <a href="#jobs" className="jg-featured-more">Load more listings</a>
        </div>
      </section>

      <section id="companies" className="jg-block">
        <p className="jg-section-kicker">Top Employers</p>
        <h2>Companies Actively Hiring Now</h2>
        <div className="jg-company-grid">
          {displayedCompanies.map((company) => (
            <article key={company}>
              <div className="jg-company-head">
                <span className="jg-company-logo" aria-hidden="true">
                  {!logoLoadFailed[company] && companyLogoByName[company] ? (
                    <img
                      src={companyLogoByName[company]}
                      alt={`${company} logo`}
                      loading="lazy"
                      onError={() => setLogoLoadFailed((current) => ({ ...current, [company]: true }))}
                    />
                  ) : (
                    getCompanyMark(company)
                  )}
                </span>
                <h3>{company}</h3>
              </div>
              <p>Open roles in technology, operations, product, and growth teams.</p>
            </article>
          ))}
        </div>
        {topCompanies.length > 12 ? (
          <div className="jg-company-actions">
            <button
              type="button"
              className="jg-company-view-more"
              onClick={() => setShowAllCompanies((current) => !current)}
            >
              <span>{showAllCompanies ? 'View Less' : 'View More'}</span>
              <FiArrowRight size={14} />
            </button>
          </div>
        ) : null}
      </section>

      <section className="jg-testimonial">
        <div>
          <p className="jg-section-kicker">Share Your Experience</p>
          <h2>Our Testimonials</h2>
          <blockquote>
            “I just brought the right roles into focus. Within two weeks I received multiple interview calls and
            converted an offer that matched my profile.”
          </blockquote>
          <p className="jg-testimonial-author">Muharror Chowdhury, CEO - Gridspark</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
          alt="Modern office workspace"
          loading="lazy"
        />
      </section>

      <section className="jg-block jg-block--pricing">
        <p className="jg-section-kicker">Job Posting</p>
        <h2>Attract candidates</h2>
        <p className="jg-section-subtitle">with quick and easy plans on India’s leading job site</p>
        <div className="jg-pricing-grid">
          {pricingPlans.map((plan) => (
            <article key={plan.title} className={`jg-pricing-card jg-pricing-card--${plan.tone}`}>
              <h3>{plan.title}</h3>
              <p className="jg-price">{plan.headlinePrice}</p>
              {plan.previousPrice && plan.topDiscount ? (
                <p className="jg-price-discount-line">
                  <s>{plan.previousPrice}</s>
                  <span>{plan.topDiscount}</span>
                </p>
              ) : null}
              {plan.subTitle ? <p className="jg-price-subtitle">{plan.subTitle}</p> : null}
              {plan.taxNote ? <p className="jg-price-note">{plan.taxNote}</p> : null}
              <div className="jg-pricing-divider" />
              <p className="jg-pricing-feature-title">Key Features</p>
              <ul className="jg-pricing-feature-list">
                {plan.features.map((feature) => (
                  <li key={feature.label} className={feature.included ? '' : 'is-disabled'}>
                    {feature.included ? <FiCheckSquare size={13} /> : <FiCircle size={12} />}
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
              <div className="jg-pricing-divider" />
              <p className="jg-price-validity">{plan.validity}</p>
              {plan.offerText ? <p className="jg-price-offer">{plan.offerText}</p> : null}
              {!plan.hideQuantity ? (
                <div className="jg-pricing-actions">
                  <label className="jg-pricing-qty" aria-label={`${plan.title} quantity`}>
                    <select defaultValue="01">
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                    </select>
                  </label>
                  <Link to={plan.ctaTo} className="jg-pricing-cta">
                    {plan.ctaLabel}
                  </Link>
                </div>
              ) : (
                <Link to={plan.ctaTo} className="jg-pricing-cta jg-pricing-cta--full">
                  {plan.ctaLabel}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="jg-block jg-resdex-block">
        <h2>Search India&apos;s largest resume database</h2>
        <p className="jg-section-subtitle">by location, industry, skills, and more to find the right fit</p>

        <div className="jg-resdex-grid">
          {resumeDatabasePlans.map((plan) => {
            const Icon = plan.icon;
            return (
            <article key={plan.title} className={`jg-resdex-card jg-resdex-card--${plan.title.toLowerCase()}`}>
              <h3 className="jg-resdex-title">
                <span className="jg-resdex-title-icon" aria-hidden="true"><Icon size={19} /></span>
                <span>{plan.title}</span>
              </h3>
              <p className="jg-resdex-subtitle">{plan.subTitle}</p>
              <p className="jg-resdex-price">{plan.price}</p>
              <p className="jg-resdex-tax-note">{plan.taxNote}</p>

              {plan.offerText ? <p className="jg-resdex-offer">{plan.offerText}</p> : null}

              <ul className="jg-resdex-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <FiCheckSquare size={13} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.withQuantity ? (
                <div className="jg-resdex-actions">
                  <label className="jg-resdex-qty" aria-label={`${plan.title} quantity`}>
                    <select defaultValue="01">
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                    </select>
                  </label>
                  <Link to={plan.ctaTo} className="jg-resdex-cta">{plan.ctaLabel}</Link>
                </div>
              ) : (
                <Link to={plan.ctaTo} className="jg-resdex-cta jg-resdex-cta--full">{plan.ctaLabel}</Link>
              )}

              <p className="jg-resdex-validity">{plan.validity}</p>
            </article>
          );
          })}
        </div>
      </section>

      <section className="jg-block jg-sponsored-block">
        <h2 className="jg-sponsored-title">Sponsored companies</h2>
        <div className="jg-sponsored-grid">
          {sponsoredCompanies.map((company) => {
            const logoKey = `sponsored-card-${company.name}`;
            const logoSrc = logoLoadFailed[logoKey] ? 'https://www.eimager.com/images/logo.png' : company.logo;
            return (
              <article key={company.name} className="jg-sponsored-card">
                <a href={company.website} target="_blank" rel="noreferrer" aria-label={`Open ${company.name}`}>
                  <span className="jg-sponsored-logo" aria-hidden="true">
                    <img
                      src={logoSrc}
                      alt={`${company.name} logo`}
                      loading="lazy"
                      onError={() => setLogoLoadFailed((prev) => ({ ...prev, [logoKey]: true }))}
                    />
                  </span>
                </a>
                <h3>
                  <a href={company.website} target="_blank" rel="noreferrer" className="jg-sponsored-name-link">
                    {company.name}
                  </a>
                </h3>
                <p className="jg-sponsored-rating">
                  <span>★</span> {company.rating} | {company.reviews}
                </p>
                <div className="jg-sponsored-tags">
                  {company.tags.map((tag) => (
                    <small key={`${company.name}-${tag}`}>{tag}</small>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="blog" className="jg-block">
        <p className="jg-section-kicker">Latest News</p>
        <h2>Latest News & Blog</h2>
        <div className="jg-blog-grid">
          {blogCardItems.map((post, index) => (
            <Link key={post.title} to={post.to} className="jg-blog-card-link">
              <article>
                <img src={`https://picsum.photos/seed/hhh-blog-${index + 1}/620/420`} alt={post.title} loading="lazy" />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="jg-blog-read-more">Read More</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="jg-brand-strip-wrap">
        <p className="jg-section-kicker">Hiring Partners</p>
        <h2>Companies Hiring on HHH Job</h2>
        <div className="jg-hiring-marquee" aria-label="Hiring partner logos">
          <div className="jg-hiring-marquee-track">
            {[...hiringPartnerLogos, ...hiringPartnerLogos].map((company, index) => {
              const logoKey = `hiring-marquee-${company.name}-${index}`;
              const logoSrc = logoLoadFailed[logoKey] ? 'https://www.eimager.com/images/logo.png' : company.logo;
              return (
                <a
                  key={logoKey}
                  href={company.logo}
                  target="_blank"
                  rel="noreferrer"
                  className={`jg-hiring-marquee-item jg-hiring-marquee-item--${company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  aria-label={`Open ${company.name} logo`}
                >
                  <img
                    src={logoSrc}
                    alt={`${company.name} logo`}
                    loading="lazy"
                    onError={() => setLogoLoadFailed((current) => ({ ...current, [logoKey]: true }))}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="jg-app-promo">
        <div className="jg-app-promo-copy">
          <h2>Download &amp; Enjoy</h2>
          <p>
            Search, find and apply for jobs directly on your mobile device. Manage all your jobs from a
            single dashboard.
          </p>
          <div className="jg-app-promo-actions">
            <a href={appStoreUrl} target="_blank" rel="noreferrer" aria-label="Open App Store">
              <span className="jg-store-icon"><FiCircle size={12} /></span>
              <span className="jg-store-copy">
                <strong>App Store</strong>
                <small>Available now on the</small>
              </span>
            </a>
            <a href={playStoreUrl} target="_blank" rel="noreferrer" aria-label="Open Google Play">
              <span className="jg-store-icon"><FiPlay size={12} /></span>
              <span className="jg-store-copy">
                <strong>Google Play</strong>
                <small>Get it on</small>
              </span>
            </a>
          </div>
        </div>
        <div className="jg-app-promo-phone">
          <div className="jg-app-promo-phone-frame">
            <div className="jg-app-promo-phone-screen">
              <div className="jg-app-promo-status">
                <span>4:31 PM</span>
                <span>LTE</span>
              </div>
              <span className="jg-app-promo-alert" />
              <div className="jg-app-promo-brand">HHH Job</div>
              <strong>User Login</strong>
              <span className="jg-app-promo-chip-row">
                <em>Candidate</em>
                <em>Employer</em>
              </span>
              <input className="jg-app-promo-input" type="text" placeholder="Username" />
              <input className="jg-app-promo-input" type="password" placeholder="Password" />
              <span className="jg-app-promo-row" aria-label="Login options">
                <input type="checkbox" aria-label="Remember me" />
                <small>Remember me</small>
                <small>Forgot password?</small>
              </span>
              <Link to="/login" className="jg-app-promo-login-btn">Login</Link>
              <span className="jg-app-promo-social">
                <i>f</i>
                <i>t</i>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

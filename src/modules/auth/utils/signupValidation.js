import { countryCodeOptions } from '../config/authOptions';

const textOnlyRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthGap = today.getMonth() - dob.getMonth();
  if (monthGap < 0 || (monthGap === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

export const getSelectedCountry = (countryCode) =>
  countryCodeOptions.find((item) => item.code === countryCode) || countryCodeOptions[0];

export const validateSignupField = (key, value, nextForm) => {
  switch (key) {
    case 'name':
      if (!String(value || '').trim()) return 'Name is required.';
      if (!textOnlyRegex.test(String(value || '').trim())) return 'Name should contain only letters and spaces.';
      if (String(value || '').trim().length < 2) return 'Name must be at least 2 characters.';
      return '';

    case 'companyName':
      if (nextForm.role === 'hr') {
        if (!String(value || '').trim()) return 'Company name is required.';
        if (!textOnlyRegex.test(String(value || '').trim())) {
          return 'Company name should contain only letters and spaces.';
        }
      }
      return '';

    case 'email':
      if (!String(value || '').trim()) return 'Email is required.';
      if (!emailRegex.test(String(value || '').trim())) return 'Enter a valid email address.';
      return '';

    case 'mobile': {
      const selectedCountry = getSelectedCountry(nextForm.countryCode);
      const mobileValue = String(value || '').trim();

      if (!mobileValue) return 'Mobile number is required.';
      if (!/^\d+$/.test(mobileValue)) return 'Mobile number should contain only digits.';
      if (mobileValue.length !== selectedCountry.digits) {
        return `Mobile number must be exactly ${selectedCountry.digits} digits for ${selectedCountry.label}.`;
      }
      return '';
    }

    case 'password':
      if (!value) return 'Password is required.';
      if (String(value).length < 6) return 'Password must be at least 6 characters.';
      return '';

    case 'dateOfBirth':
      if (nextForm.role === 'retired_employee') {
        if (!value) return 'Date of birth is required for Retired Employee registration.';
        const age = calculateAge(value);
        if (age === null) return 'Please enter a valid date of birth.';
        if (age < 60) return 'Minimum age for retired employee registration is 60 years.';
      }
      return '';

    default:
      return '';
  }
};

import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const FooterContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AnimatedSection delay={0.1}>
      <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">Contact Form</p>
        <h2 className="mt-4 font-heading text-3xl font-bold text-navy">Get in touch with the right team</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Share your details and context. The HHH Jobs team will route your request appropriately.
        </p>

        {isSubmitted ? (
          <div className="mt-8 rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-7 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <FiCheckCircle size={30} />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold text-emerald-900">Message sent</h3>
            <p className="mt-3 text-sm leading-7 text-emerald-700">
              Thank you for reaching out. Our team will review the request and get back to you.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-0.5"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setIsSubmitted(true);
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Your Name
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Your Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Contact Number
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Enter phone number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Address
                <input
                  type="text"
                  name="address"
                  placeholder="City, State"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Inquiry Type
              <select
                name="inquiryType"
                defaultValue=""
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
              >
                <option value="" disabled>Select inquiry type</option>
                <option value="career">Career Opportunity</option>
                <option value="support">Support</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Your Message
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what you need help with..."
                className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full gradient-gold px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5"
            >
              Send Message
            </button>
          </form>
        )}
      </article>
    </AnimatedSection>
  );
};

export default FooterContactForm;

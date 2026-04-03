import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const FooterReportIssueForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AnimatedSection delay={0.08}>
      <article className="rounded-[2rem] border border-rose-100 bg-white p-8 shadow-sm md:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <FiAlertTriangle size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-rose-600">Issue Form</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy">Tell us what went wrong</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Share the concern in enough detail so the support team can reproduce and investigate it.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="mt-8 rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <FiCheckCircle size={28} />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-emerald-900">Issue submitted</h3>
                <p className="mt-1 text-sm leading-7 text-emerald-700">
                  The report has been captured for review. The support team may reach out for more context.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-0.5"
            >
              Submit another report
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Email Address
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-navy">Contact Numbers</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">Provide at least one contact method.</p>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Mobile
                  <input
                    type="tel"
                    name="mobile"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-rose-300"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Landline
                  <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                    <input
                      type="text"
                      name="landlineStd"
                      placeholder="STD"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-rose-300"
                    />
                    <input
                      type="text"
                      name="landlineNumber"
                      placeholder="Number"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-rose-300"
                    />
                  </div>
                </label>
              </div>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Area of Concern
              <select
                name="areaOfConcern"
                defaultValue=""
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white"
              >
                <option value="" disabled>Select the issue category</option>
                <option value="technical">Technical Glitches</option>
                <option value="content">Incorrect or Suspicious Content</option>
                <option value="policy">Policy Violations</option>
                <option value="communication">Communication Issues</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Subject
              <input
                type="text"
                name="subject"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Details of Concern
              <textarea
                name="details"
                rows={6}
                required
                placeholder="Describe the issue with enough detail to help investigation."
                className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Attach Screenshot
              <input
                type="file"
                name="screenshot"
                accept=".gif,.png,.jpg,.jpeg"
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rose-700"
              />
              <span className="text-xs leading-6 text-slate-500">
                Allowed formats: GIF, PNG, JPG, JPEG. Keep file size concise for faster review.
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5 hover:bg-rose-700"
            >
              Submit Issue
            </button>
          </form>
        )}
      </article>
    </AnimatedSection>
  );
};

export default FooterReportIssueForm;

import { motion } from 'framer-motion';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Stripe'];

export function TrustedBySection() {
  return (
    <section className="overflow-hidden border-b border-slate-200 px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <AnimatedSection>
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
            Trusted by leading companies worldwide
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#fbf8f2] to-transparent" />
            <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#fbf8f2] to-transparent" />
            <motion.div
              className="flex items-center gap-14"
              animate={{ x: [0, -600] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...companies, ...companies].map((company, index) => (
                <motion.span
                  key={`${company}-${index}`}
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="whitespace-nowrap font-heading text-xl font-bold text-slate-300 transition-colors hover:text-slate-500"
                >
                  {company}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

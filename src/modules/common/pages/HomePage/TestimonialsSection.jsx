import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    text: 'The cleaner dashboard and role discovery flow made it much easier to focus on real opportunities.',
    avatar: 'PS'
  },
  {
    name: 'James Wilson',
    role: 'HR Director at TechFlow',
    text: 'This is the kind of recruiter dashboard structure that actually helps teams move faster.',
    avatar: 'JW'
  },
  {
    name: 'Anita Desai',
    role: 'Fresh Graduate',
    text: 'I could finally understand where I was in the application process without digging through clutter.',
    avatar: 'AD'
  },
  {
    name: 'Raj Kapoor',
    role: 'Retired Army Veteran',
    text: 'The platform now feels much more trustworthy and easier to navigate for experienced professionals.',
    avatar: 'RK'
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-secondary-50/50 px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <AnimatedSection className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">
            What Our Users <span className="gradient-text">Say</span>
          </h2>
          <p className="mt-3 text-slate-500">Real stories from real users across your platform roles.</p>
        </AnimatedSection>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <AnimatedSection key={item.name} delay={index * 0.08}>
              <motion.div whileHover={{ y: -5, scale: 1.01 }} className="glass-card group relative overflow-hidden rounded-3xl p-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -right-2 -top-2 text-brand-100 transition-colors group-hover:text-brand-200"
                >
                  <Quote className="h-20 w-20" />
                </motion.div>
                <div className="relative z-10">
                  <div className="mb-4 flex gap-1">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="leading-7 text-slate-700">&ldquo;{item.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary font-heading text-sm font-bold text-white">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

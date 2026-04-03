import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className = '', delay = 0, as = 'div' }) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </Component>
  );
};

export default AnimatedSection;

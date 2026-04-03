import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { footerSocialLinks } from './footerSocialLinks';

const FooterBottomBar = () => {
  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gold/10 pt-5 md:flex-row">
      <div className="text-center md:text-left">
        <p className="text-sm text-white/46">© 2026 HHH Jobs. All rights reserved.</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/30">
          Clarity. Speed. Trust.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-end">
        {footerSocialLinks.map((item) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith('http');
          const isInternal = item.href.startsWith('/');
          const shouldOpenInNewTab = isExternal && item.newTab !== false;

          if (isInternal) {
            return (
              <Link
                key={item.label}
                to={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-white/54 transition-colors hover:border-gold/30 hover:text-gold"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-white/54 transition-colors hover:border-gold/30 hover:text-gold"
              target={shouldOpenInNewTab ? '_blank' : undefined}
              rel={shouldOpenInNewTab ? 'noreferrer' : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default FooterBottomBar;

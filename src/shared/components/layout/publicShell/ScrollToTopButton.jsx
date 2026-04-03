import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => (
  <button
    type="button"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="fixed bottom-20 right-3 z-[95] inline-flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-white shadow-strong sm:bottom-24 sm:right-4 sm:h-12 sm:w-12"
    aria-label="Scroll to top"
  >
    <ArrowUp className="h-4 w-4" />
  </button>
);

export default ScrollToTopButton;

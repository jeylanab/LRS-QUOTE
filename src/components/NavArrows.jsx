// src/components/NavArrows.jsx
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const NavArrows = ({ onBack, onNext, hideNext = false }) => (
  <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
    <button
      onClick={onBack}
      className="w-11 h-11 rounded-xl bg-white border border-sky-mid text-navy/50 flex items-center justify-center shadow-card hover:bg-sky-light hover:text-navy transition-all active:scale-90"
      aria-label="Go back"
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
    {!hideNext && (
      <button
        onClick={onNext}
        className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center shadow-btn hover:bg-navy-light transition-all active:scale-90"
        aria-label="Go forward"
      >
        <ChevronDown size={20} strokeWidth={2.5} />
      </button>
    )}
  </div>
);

export default NavArrows;

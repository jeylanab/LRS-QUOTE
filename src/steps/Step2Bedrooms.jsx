// src/steps/Step2Bedrooms.jsx
import React from 'react';
import { BedDouble } from 'lucide-react';
import { BEDROOM_OPTIONS } from '../data/pricingConfig';

const Step2Bedrooms = ({ propertyType, onSelect }) => {
  const options = BEDROOM_OPTIONS[propertyType] || [];

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Number of bedrooms?*
      </h2>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {options.map((opt, i) => (
          <button key={opt.value} onClick={() => onSelect(opt.value)}
            className={`animate-drop-in delay-${i + 2} group flex items-center gap-4 p-4 rounded-2xl border-2 border-sky-mid bg-white hover:border-navy hover:shadow-active transition-all duration-200 cursor-pointer text-left`}>
            <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg text-[10px] font-black bg-sky-light text-navy border border-sky-mid group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all">
              {String.fromCharCode(65 + i)}
            </span>
            <div className="flex items-center gap-2">
              <BedDouble size={15} className="text-navy/40 group-hover:text-navy transition-colors" />
              <span className="text-sm font-bold text-navy/70 group-hover:text-navy transition-colors">{opt.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step2Bedrooms;
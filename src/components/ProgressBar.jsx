// src/components/ProgressBar.jsx
import React from 'react';

const STAGE_LABELS = ['Your Details', 'Property', 'Windows', 'Extras', 'Your Quote'];

const ProgressBar = ({ currentStage, totalStages = 5 }) => {
  const pct = Math.min(((currentStage) / totalStages) * 100, 100);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-sky-mid/40">
      <div className="max-w-3xl mx-auto px-4 py-3">

        {/* Stage Labels */}
        <div className="flex justify-between mb-2">
          {STAGE_LABELS.map((label, i) => {
            const stageNum = i + 1;
            const isActive    = stageNum === currentStage;
            const isCompleted = stageNum < currentStage;
            return (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-500
                    ${isCompleted ? 'bg-navy text-white' :
                      isActive    ? 'bg-sky text-navy border-2 border-navy' :
                                    'bg-sky-mid/50 text-navy/30'}`}
                >
                  {isCompleted ? (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : stageNum}
                </div>
                <span className={`hidden sm:block text-[8px] font-bold uppercase tracking-wide transition-colors duration-300
                  ${isActive ? 'text-navy' : isCompleted ? 'text-navy/50' : 'text-navy/25'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Track */}
        <div className="relative h-[3px] bg-sky-mid/40 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-navy rounded-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden"
            style={{ width: `${pct}%` }}
          >
            {/* shimmer */}
            <div
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{ animation: 'shimmer 1.6s infinite ease-out' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

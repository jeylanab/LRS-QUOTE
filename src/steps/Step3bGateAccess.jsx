// src/steps/Step3bGateAccess.jsx
import React, { useState } from 'react';
import gate0Img from '../assets/gate0.png';
import gate1Img from '../assets/gate1.png';

const Step3bGateAccess = ({ onSelect }) => {
  const [showNotice, setShowNotice] = useState(false);

  if (showNotice) return (
    <div className="flex flex-col h-full max-w-lg w-full">
      <div className="animate-drop-in delay-0 flex flex-col gap-5 p-6 bg-white rounded-3xl border-2 border-sky-mid shadow-card">
        <div className="w-12 h-12 bg-sky-light rounded-2xl flex items-center justify-center flex-shrink-0">
          <img src={gate0Img} alt="No gate access" className="w-8 h-auto object-contain" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase text-navy mb-2">Front of House Only</h3>
          <p className="text-sm font-medium text-navy/60 leading-relaxed">
            We can only offer you front of house cleaning only due to access issues getting to the rear. Our minimum charge for a front of house only clean is £18.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => onSelect(false)}
            className="w-full bg-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-navy-light transition-all shadow-btn active:scale-[0.98]"
          >
            That's Fine — Continue
          </button>
          <button
            onClick={() => setShowNotice(false)}
            className="w-full bg-white border-2 border-sky-mid text-navy/50 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide hover:border-navy/30 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Do you have side or rear gate access?*
      </h2>
      <p className="animate-drop-in delay-1 text-sm font-medium text-navy/40 mb-2">
        Can we access the rear of your property without coming through your home?
      </p>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">

        <button
          onClick={() => onSelect(true)}
          className="animate-drop-in delay-2 group flex flex-col items-center p-6 rounded-3xl border-2 border-sky-mid bg-white hover:border-navy hover:shadow-active transition-all duration-200 cursor-pointer"
        >
          <img src={gate1Img} alt="Yes via gate" className="h-28 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200 mb-4" />
          <span className="font-black uppercase text-sm text-navy/70 group-hover:text-navy transition-colors">Yes, via gate</span>
          <span className="text-[10px] font-medium text-navy/40 mt-1 text-center">We can access front and rear</span>
        </button>

        <button
          onClick={() => setShowNotice(true)}
          className="animate-drop-in delay-3 group flex flex-col items-center p-6 rounded-3xl border-2 border-sky-mid bg-white hover:border-navy hover:shadow-active transition-all duration-200 cursor-pointer"
        >
          <img src={gate0Img} alt="No access" className="h-28 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200 mb-4" />
          <span className="font-black uppercase text-sm text-navy/70 group-hover:text-navy transition-colors">No Access</span>
          <span className="text-[10px] font-medium text-navy/40 mt-1 text-center">No side or rear gate</span>
        </button>

      </div>
    </div>
  );
};

export default Step3bGateAccess;
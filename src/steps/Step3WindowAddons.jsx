// src/steps/Step3WindowAddons.jsx
import React from 'react';
import conservatoryImg from '../assets/conservatory.png';
import extentionImg    from '../assets/extention.png';

const YesNoCard = ({ label, sublabel, img, value, onChange, delayClass }) => (
  <div className={`animate-drop-in ${delayClass} flex flex-col gap-3`}>
    {img && (
      <img src={img} alt={label} className="w-32 h-auto object-contain drop-shadow-md" />
    )}
    <p className="text-sm font-black uppercase text-navy">{label}</p>
    {sublabel && <p className="text-[11px] text-navy/40 font-medium -mt-2">{sublabel}</p>}
    <div className="flex gap-3">
      {['Yes', 'No'].map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt === 'Yes')}
          className={`flex-1 flex items-center gap-3 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer
            ${value === (opt === 'Yes')
              ? 'border-navy bg-navy text-white shadow-btn'
              : 'border-sky-mid bg-white text-navy hover:border-navy hover:shadow-card'}`}
        >
          <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md text-[10px] font-black border transition-all
            ${value === (opt === 'Yes')
              ? 'bg-white/20 border-white/40 text-white'
              : 'bg-sky-light border-sky-mid text-navy'}`}>
            {opt === 'Yes' ? 'Y' : 'N'}
          </span>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Step3WindowAddons = ({ formData, onChange, onNext, onBack }) => {
  const { hasConservatory, hasExtension } = formData;
  const canContinue = hasConservatory !== null && hasExtension !== null;

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Any extras on your property?*
      </h2>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-8" />

      <div className="flex flex-col gap-8 max-w-sm w-full">
        <YesNoCard
          label="Conservatory?"
          sublabel="+£5 per clean"
          img={conservatoryImg}
          value={hasConservatory}
          onChange={v => onChange('hasConservatory', v)}
          delayClass="delay-2"
        />
        <YesNoCard
          label="Extension or 3-Storey?"
          sublabel="+£3 per clean"
          img={extentionImg}
          value={hasExtension}
          onChange={v => onChange('hasExtension', v)}
          delayClass="delay-3"
        />
      </div>

      {canContinue && (
        <button
          onClick={onNext}
          className="animate-drop-in delay-4 mt-8 bg-navy text-white py-4 px-10 rounded-2xl font-black uppercase text-sm tracking-wide self-start hover:bg-navy-light transition-all shadow-btn active:scale-[0.98]"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default Step3WindowAddons;

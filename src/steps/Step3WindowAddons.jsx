// src/steps/Step3WindowAddons.jsx
// Addon prices are intentionally hidden from the customer (per client request)
// so they don't skip items to reduce their quote.
import React from 'react';
import { Check } from 'lucide-react';
import conservatoryImg from '../assets/conservatory.png';
import extentionImg    from '../assets/extention.png';
import skylanternImg   from '../assets/skylantern.png';
import veluxImg        from '../assets/velux.png';

const ADDONS = [
  {
    key:   'hasConservatory',
    label: 'Conservatory',
    desc:  'Does your property have a conservatory?',
    img:   conservatoryImg,
  },
  {
    key:   'hasExtension',
    label: 'Extension or 3-Storey',
    desc:  'Does your property have an extension or is it 3 storeys?',
    img:   extentionImg,
  },
  {
    key:   'hasLantern',
    label: 'Roof Lantern',
    desc:  'Does your property have a roof lantern / sky lantern?',
    img:   skylanternImg,
  },
  {
    key:   'hasVelux',
    label: 'Velux Windows',
    desc:  'Does your property have any Velux / roof windows?',
    img:   veluxImg,
  },
];

const YesNoRow = ({ addon, value, onChange, delayClass }) => (
  <div className={`animate-drop-in ${delayClass} flex items-center gap-4 p-4 rounded-2xl border-2 bg-white border-sky-mid`}>
    {addon.img && (
      <img src={addon.img} alt={addon.label} className="w-12 h-12 object-contain flex-shrink-0 drop-shadow-sm" />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-black uppercase text-navy leading-tight">{addon.label}</p>
      <p className="text-[10px] text-navy/40 font-medium mt-0.5">{addon.desc}</p>
    </div>
    <div className="flex gap-2 flex-shrink-0">
      {['Yes', 'No'].map(opt => (
        <button key={opt} onClick={() => onChange(addon.key, opt === 'Yes')}
          className={`w-12 h-9 rounded-xl border-2 text-xs font-black transition-all cursor-pointer
            ${value === (opt === 'Yes')
              ? 'border-navy bg-navy text-white'
              : 'border-sky-mid bg-sky-light text-navy hover:border-navy/40'}`}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Step3WindowAddons = ({ formData, onChange, onNext, onBack }) => {
  const { hasConservatory, hasExtension, hasLantern, hasVelux, veluxCount } = formData;

  const allAnswered = [hasConservatory, hasExtension, hasLantern, hasVelux].every(v => v !== null && v !== undefined);

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        A few questions about your property
      </h2>
      <p className="animate-drop-in delay-1 text-sm font-medium text-navy/40 mb-2">
        Please answer honestly — this helps us give you the most accurate quote.
      </p>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-6" />

      <div className="flex flex-col gap-3 max-w-lg w-full">
        {ADDONS.map((addon, i) => (
          <YesNoRow
            key={addon.key}
            addon={addon}
            value={formData[addon.key]}
            onChange={onChange}
            delayClass={`delay-${i + 2}`}
          />
        ))}

        {/* Velux count — only shows if hasVelux is true */}
        {hasVelux === true && (
          <div className="animate-drop-in delay-0 flex items-center gap-4 p-4 rounded-2xl border-2 border-sky bg-sky-light">
            <div className="flex-1">
              <p className="text-sm font-black uppercase text-navy">How many Velux windows?</p>
              <p className="text-[10px] text-navy/40 font-medium mt-0.5">Enter the number of Velux / roof windows</p>
            </div>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="e.g. 2"
              className="w-20 bg-white border-2 border-sky-mid rounded-xl px-3 py-2 text-navy font-black text-center text-sm outline-none focus:border-navy transition-all"
              value={veluxCount || ''}
              onChange={e => onChange('veluxCount', e.target.value)}
            />
          </div>
        )}
      </div>

      {allAnswered && (
        <button onClick={onNext}
          className="animate-drop-in delay-0 mt-6 bg-navy text-white py-4 px-10 rounded-2xl font-black uppercase text-sm tracking-wide self-start hover:bg-navy-light transition-all shadow-btn active:scale-[0.98]">
          Continue
        </button>
      )}
    </div>
  );
};

export default Step3WindowAddons;
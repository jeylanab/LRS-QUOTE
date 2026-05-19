// src/steps/Step4Extras.jsx
import React from 'react';
import { Check } from 'lucide-react';
import { pricingConfig, getServiceTierKey, getAdditionalServicePrice } from '../data/pricingConfig';

const Step4Extras = ({ formData, selectedExtras, onToggle, onNext, onBack }) => {
  const { propertyType, bedrooms, hasConservatory, hasExtension } = formData;
  const tierKey  = getServiceTierKey(propertyType, bedrooms);
  const hasExtra = hasConservatory || hasExtension;

  const services = [
    {
      key:   'gutterVacuum',
      label: pricingConfig.additionalServices.gutterVacuum.label,
      desc:  pricingConfig.additionalServices.gutterVacuum.description,
      price: getAdditionalServicePrice('gutterVacuum', tierKey, hasExtra),
      icon:  '🪣',
    },
    {
      key:   'gutterWash',
      label: pricingConfig.additionalServices.gutterWash.label,
      desc:  pricingConfig.additionalServices.gutterWash.description,
      price: getAdditionalServicePrice('gutterWash', tierKey, hasExtra),
      icon:  '💧',
    },
    ...(hasConservatory ? [{
      key:   'conservatoryRoof',
      label: pricingConfig.additionalServices.conservatoryRoof.label,
      desc:  pricingConfig.additionalServices.conservatoryRoof.description,
      price: pricingConfig.additionalServices.conservatoryRoof.price,
      icon:  '🏠',
    }] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Would you like any additional services?
      </h2>
      <p className="animate-drop-in delay-1 text-sm font-medium text-navy/40 mb-2">
        Optional — select any extras to add to your quote.
      </p>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-8" />

      <div className="flex flex-col gap-3 max-w-lg w-full">
        {services.map((svc, i) => {
          const selected = selectedExtras.includes(svc.key);
          return (
            <button
              key={svc.key}
              onClick={() => onToggle(svc.key)}
              className={`animate-drop-in delay-${i + 2} group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left
                ${selected
                  ? 'border-navy bg-navy/5 shadow-card'
                  : 'border-sky-mid bg-white hover:border-navy/40 hover:shadow-card'}`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all
                ${selected ? 'bg-navy border-navy' : 'bg-white border-sky-mid group-hover:border-navy/40'}`}>
                {selected && <Check size={13} strokeWidth={3} className="text-white" />}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black uppercase tracking-wide ${selected ? 'text-navy' : 'text-navy/70'}`}>
                  {svc.label}
                </p>
                <p className="text-[11px] text-navy/40 font-medium mt-0.5">{svc.desc}</p>
              </div>

              {/* Price */}
              <div className={`flex-shrink-0 text-right ${selected ? 'text-navy' : 'text-navy/50'}`}>
                <p className="text-lg font-black">£{svc.price}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">one-off</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="animate-drop-in delay-5 mt-8 bg-navy text-white py-4 px-10 rounded-2xl font-black uppercase text-sm tracking-wide self-start hover:bg-navy-light transition-all shadow-btn active:scale-[0.98]"
      >
        {selectedExtras.length > 0 ? 'Add to Quote' : 'Skip — No Extras'}
      </button>
    </div>
  );
};

export default Step4Extras;

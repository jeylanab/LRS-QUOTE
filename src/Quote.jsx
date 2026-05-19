// src/Quote.jsx
import React, { useState } from 'react';
import ProgressBar       from './components/ProgressBar';
import NavArrows         from './components/NavArrows';
import Step0Contact      from './steps/Step0Contact';
import StepCommercial    from './steps/StepCommercial';
import Step1PropertyType from './steps/Step1PropertyType';
import Step2Bedrooms     from './steps/Step2Bedrooms';
import Step3WindowAddons from './steps/Step3WindowAddons';
import Step4Extras       from './steps/Step4Extras';
import Step5Quote        from './steps/Step5Quote';
import Step6Success      from './steps/Step6Success';

// stage shown in progress bar per step
// 1=Details, 2=Property, 3=Windows, 4=Extras, 5=Quote
const STEP_TO_STAGE = {
  0: 1,  // Contact
  1: 2,  // Property type
  2: 2,  // Bedrooms
  3: 3,  // Window add-ons
  4: 4,  // Extras
  5: 5,  // Quote
  6: 5,  // Success
};

const Quote = () => {
  const [step, setStep]         = useState(0);
  const [isCommercial, setIsCommercial] = useState(false);
  const [formData, setFormData] = useState({
    contact:         null,
    propertyType:    '',
    bedrooms:        '',
    hasConservatory: null,
    hasExtension:    null,
  });
  const [selectedExtras, setSelectedExtras] = useState([]);

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));
  const updateForm = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const toggleExtra = key => setSelectedExtras(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const currentStage = STEP_TO_STAGE[step] ?? 1;
  const showNav = step >= 1 && step <= 4 && !isCommercial;

  // Commercial flow — no progress bar needed beyond step 0
  if (isCommercial) return (
    <div className="w-full min-h-screen bg-sky-light flex flex-col font-sans text-navy overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center pt-10 pb-20 px-4">
        <div className="w-full max-w-3xl">
          <StepCommercial contact={formData.contact} onSuccess={next} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-sky-light flex flex-col font-sans text-navy overflow-x-hidden">

      {step < 6 && <ProgressBar currentStage={currentStage} totalStages={5} />}

      <div className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
        <div className="w-full max-w-3xl">

          {/* Step 0: Contact + Residential/Commercial */}
          {step === 0 && (
            <Step0Contact onNext={(contact) => {
              updateForm('contact', contact);
              if (contact.category === 'commercial') {
                setIsCommercial(true);
              } else {
                next();
              }
            }} />
          )}

          {/* Step 1: Property Type */}
          {step === 1 && (
            <Step1PropertyType onSelect={type => { updateForm('propertyType', type); next(); }} />
          )}

          {/* Step 2: Bedrooms */}
          {step === 2 && (
            <Step2Bedrooms
              propertyType={formData.propertyType}
              onSelect={beds => { updateForm('bedrooms', beds); next(); }}
            />
          )}

          {/* Step 3: Window Add-ons */}
          {step === 3 && (
            <Step3WindowAddons
              formData={formData}
              onChange={updateForm}
              onNext={next}
              onBack={prev}
            />
          )}

          {/* Step 4: Additional Extras */}
          {step === 4 && (
            <Step4Extras
              formData={formData}
              selectedExtras={selectedExtras}
              onToggle={toggleExtra}
              onNext={next}
              onBack={prev}
            />
          )}

          {/* Step 5: Quote + Book Now */}
          {step === 5 && (
            <Step5Quote
              formData={formData}
              selectedExtras={selectedExtras}
              onSuccess={next}
            />
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <Step6Success contactName={formData.contact?.name} />
          )}

        </div>
      </div>

      {showNav && <NavArrows onBack={prev} onNext={next} hideNext={step === 4} />}
    </div>
  );
};

export default Quote;
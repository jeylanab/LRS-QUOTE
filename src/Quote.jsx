// src/Quote.jsx
import React, { useState } from 'react';
import ProgressBar        from './components/ProgressBar';
import NavArrows          from './components/NavArrows';
import Step0Contact       from './steps/Step0Contact';
import StepCommercial     from './steps/StepCommercial';
import Step1PropertyType  from './steps/Step1PropertyType';
import Step2Bedrooms      from './steps/Step2Bedrooms';
import Step3WindowAddons  from './steps/Step3WindowAddons';
import Step3bGateAccess   from './steps/Step3bGateAccess';
import Step4Extras        from './steps/Step4Extras';
import Step5Quote         from './steps/Step5Quote';
import Step6Success       from './steps/Step6Success';
import lrsLogo            from './assets/lrslogo.png';

// stage shown in progress bar per step
// 1=Details, 2=Property, 3=Windows, 4=Extras, 5=Quote
const STEP_TO_STAGE = {
  0: 1,   // Contact
  1: 2,   // Property type
  2: 2,   // Bedrooms
  3: 3,   // Window add-ons
  '3b': 3, // Gate access
  4: 4,   // Extras
  5: 5,   // Quote
  6: 5,   // Success
};

const Quote = () => {
  const [step, setStep]               = useState(0);
  const [isCommercial, setIsCommercial] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [formData, setFormData]       = useState({
    contact:         null,
    propertyType:    '',
    bedrooms:        '',
    hasConservatory: null,
    hasExtension:    null,
    hasLantern:      null,
    hasVelux:        null,
    veluxCount:      '',
    hasGateAccess:   null,
  });
  const [selectedExtras, setSelectedExtras] = useState([]);

  const next   = () => setStep(s => {
    if (s === 3) return '3b';
    if (s === '3b') return 4;
    return typeof s === 'number' ? s + 1 : 5;
  });
  const prev   = () => setStep(s => {
    if (s === '3b') return 3;
    if (s === 4) return '3b';
    return typeof s === 'number' ? Math.max(0, s - 1) : 3;
  });

  const updateForm  = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const toggleExtra = key => setSelectedExtras(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const currentStage  = STEP_TO_STAGE[step] ?? 1;
  const showNav       = (step === 1 || step === 2 || step === 4) && !isCommercial;

  // ── Not Interested Screen ─────────────────────────────────────────────────
  if (notInterested) return (
    <div className="w-full min-h-screen bg-sky-light flex items-center justify-center px-4">
      <div className="flex flex-col items-start gap-5 max-w-md w-full py-8">
        <img src={lrsLogo} alt="LRS" className="h-12 w-auto animate-drop-in delay-0" />
        <div className="animate-drop-in delay-1 w-16 h-16 bg-sky-mid rounded-full flex items-center justify-center shadow-card text-3xl">
          👋
        </div>
        <h2 className="animate-drop-in delay-2 text-2xl md:text-3xl font-black uppercase text-navy">No Problem!</h2>
        <p className="animate-drop-in delay-3 text-sm font-medium text-navy/50 leading-relaxed">
          Thanks for taking the time to get a quote. If you change your mind, we're always here — just come back anytime.
        </p>
        <div className="animate-drop-in delay-4 w-full p-5 bg-white rounded-2xl border border-sky-mid">
          <p className="font-black text-sm text-navy mb-1">We'll still be in touch</p>
          <p className="text-sm text-navy/50 font-medium leading-relaxed">
            We've saved your details and may reach out in case you change your mind. Have a great day!
          </p>
        </div>
        <button
          onClick={() => {
            setNotInterested(false);
            setStep(0);
            setFormData({ contact: null, propertyType: '', bedrooms: '', hasConservatory: null, hasExtension: null, hasLantern: null, hasVelux: null, veluxCount: '', hasGateAccess: null });
            setSelectedExtras([]);
          }}
          className="animate-drop-in delay-5 bg-navy text-white py-3 px-8 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-navy-light transition-all shadow-btn"
        >
          Start Again
        </button>
        <p className="animate-drop-in delay-5 text-[10px] text-navy/25 uppercase tracking-widest">LRS Exterior Cleaning</p>
      </div>
    </div>
  );

  // ── Commercial Flow ───────────────────────────────────────────────────────
  if (isCommercial) return (
    <div className="w-full min-h-screen bg-sky-light flex flex-col font-sans text-navy overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center pt-10 pb-20 px-4">
        <div className="w-full max-w-3xl">
          <StepCommercial contact={formData.contact} onSuccess={() => setStep(6)} />
        </div>
      </div>
    </div>
  );

  // ── Residential Flow ──────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-sky-light flex flex-col font-sans text-navy overflow-x-hidden">

      {step !== 6 && <ProgressBar currentStage={currentStage} totalStages={5} />}

      <div className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
        <div className="w-full max-w-3xl">

          {step === 0 && (
            <Step0Contact onNext={(contact) => {
              updateForm('contact', contact);
              contact.category === 'commercial' ? setIsCommercial(true) : next();
            }} />
          )}

          {step === 1 && (
            <Step1PropertyType onSelect={type => { updateForm('propertyType', type); next(); }} />
          )}

          {step === 2 && (
            <Step2Bedrooms
              propertyType={formData.propertyType}
              onSelect={beds => { updateForm('bedrooms', beds); next(); }}
            />
          )}

          {step === 3 && (
            <Step3WindowAddons
              formData={formData}
              onChange={updateForm}
              onNext={next}
              onBack={prev}
            />
          )}

          {step === '3b' && (
            <Step3bGateAccess
              onSelect={(hasAccess) => {
                updateForm('hasGateAccess', hasAccess);
                next();
              }}
            />
          )}

          {step === 4 && (
            <Step4Extras
              formData={formData}
              selectedExtras={selectedExtras}
              onToggle={toggleExtra}
              onNext={next}
              onBack={prev}
            />
          )}

          {step === 5 && (
            <Step5Quote
              formData={formData}
              selectedExtras={selectedExtras}
              onSuccess={() => setStep(6)}
              onNotInterested={() => setNotInterested(true)}
            />
          )}

          {step === 6 && (
            <Step6Success contactName={formData.contact?.name} />
          )}

        </div>
      </div>

      {showNav && <NavArrows onBack={prev} onNext={next} hideNext />}
    </div>
  );
};

export default Quote;
// src/Quote.jsx
import React, { useState } from 'react';
import ProgressBar        from './components/ProgressBar';
import NavArrows          from './components/NavArrows';
import Step0Contact       from './steps/Step0Contact';
import StepCommercial     from './steps/StepCommercial';
import Step1PropertyType  from './steps/Step1PropertyType';
import Step2Bedrooms      from './steps/Step2Bedrooms';
import Step3WindowAddons  from './steps/Step3WindowAddons';
import Step4Extras        from './steps/Step4Extras';
import Step5Quote         from './steps/Step5Quote';
import Step6Success       from './steps/Step6Success';
import lrsLogo            from './assets/lrslogo.png';

const STEP_TO_STAGE = { 0:1, 1:2, 2:2, 3:3, 4:4, 5:5, 6:5, 7:5 };

const Quote = () => {
  const [step, setStep]             = useState(0);
  const [isCommercial, setIsCommercial] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [formData, setFormData]     = useState({
    contact: null, propertyType: '', bedrooms: '',
    hasConservatory: null, hasExtension: null,
    hasLantern: null, hasVelux: null, veluxCount: '',
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
          Thanks for taking the time to get a quote. If you change your mind, we're always here — just come back and start again anytime.
        </p>
        <div className="animate-drop-in delay-4 w-full p-5 bg-white rounded-2xl border border-sky-mid">
          <p className="font-black text-sm text-navy mb-1">We'll still be in touch</p>
          <p className="text-sm text-navy/50 font-medium leading-relaxed">
            We've saved your details and may reach out in case you change your mind. Have a great day!
          </p>
        </div>
        <button onClick={() => { setNotInterested(false); setStep(0); setFormData({ contact: null, propertyType: '', bedrooms: '', hasConservatory: null, hasExtension: null, hasLantern: null, hasVelux: null, veluxCount: '' }); setSelectedExtras([]); }}
          className="animate-drop-in delay-5 bg-navy text-white py-3 px-8 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-navy-light transition-all shadow-btn">
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
          <StepCommercial contact={formData.contact} onSuccess={next} />
        </div>
      </div>
    </div>
  );

  // ── Residential Flow ──────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-sky-light flex flex-col font-sans text-navy overflow-x-hidden">
      {step < 6 && <ProgressBar currentStage={currentStage} totalStages={5} />}

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
            <Step2Bedrooms propertyType={formData.propertyType}
              onSelect={beds => { updateForm('bedrooms', beds); next(); }} />
          )}

          {step === 3 && (
            <Step3WindowAddons formData={formData} onChange={updateForm} onNext={next} onBack={prev} />
          )}

          {step === 4 && (
            <Step4Extras formData={formData} selectedExtras={selectedExtras}
              onToggle={toggleExtra} onNext={next} onBack={prev} />
          )}

          {step === 5 && (
            <Step5Quote formData={formData} selectedExtras={selectedExtras}
              onSuccess={next} onNotInterested={() => setNotInterested(true)} />
          )}

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
// src/steps/Step0Contact.jsx
import React, { useState } from 'react';
import { User, Phone, Mail, ArrowRight, Building2, Home, Check } from 'lucide-react';
import lrsLogo from '../assets/lrslogo.png';
import { sendLeadEmail } from '../utils/sendEmail';

const inputBase = 'w-full bg-white border-2 border-sky-mid rounded-2xl px-4 py-3.5 text-navy font-semibold text-base outline-none transition-all duration-200 placeholder:text-navy/25 focus:border-navy focus:shadow-active';
const inputErr  = 'w-full bg-white border-2 border-error rounded-2xl px-4 py-3.5 text-navy font-semibold text-base outline-none placeholder:text-navy/25';
const errMsg    = 'text-error text-[10px] font-black uppercase tracking-wide mt-1 animate-shake';

const Step0Contact = ({ onNext }) => {
  const [form, setForm]         = useState({ name: '', phone: '+44 ', email: '', category: '' });
  const [consent, setConsent]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [shakeKey, setShakeKey] = useState(0);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleNext = () => {
    const e = {};
    if (!form.name.trim())                                e.name     = 'Full name is required';
    if (!form.phone.trim() || form.phone === '+44 ')     e.phone    = 'Phone number is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email    = 'Valid email is required';
    if (!form.category)                                   e.category = 'Please select residential or commercial';
    if (!consent)                                         e.consent  = 'Please give consent to continue';
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setShakeKey(k => k + 1);
      return;
    }

    // ✅ Fire lead email silently in background — never blocks the user
    sendLeadEmail({
      name:     form.name,
      phone:    form.phone,
      email:    form.email,
      category: form.category,
    });

    onNext({ ...form, consent });
  };

  const CategoryCard = ({ id, label, Icon, description }) => (
    <button
      type="button"
      onClick={() => set('category', id)}
      className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
        ${form.category === id
          ? 'border-navy bg-navy text-white shadow-btn'
          : 'border-sky-mid bg-white text-navy hover:border-navy/40 hover:shadow-card'}`}
    >
      <Icon size={28} strokeWidth={1.8} />
      <span className="font-black text-sm uppercase tracking-wide">{label}</span>
      <span className={`text-[10px] font-medium text-center ${form.category === id ? 'text-white/60' : 'text-navy/40'}`}>
        {description}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col h-full max-w-sm w-full">

      {/* Logo */}
      <div className="animate-drop-in delay-0 mb-6">
        <img src={lrsLogo} alt="LRS Exterior Cleaning" className="h-14 w-auto" />
      </div>

      <h2 className="animate-drop-in delay-1 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Let's get started
      </h2>
      <p className="animate-drop-in delay-2 text-sm font-medium text-navy/50 mb-6">
        Enter your details and we'll build your personalised quote.
      </p>

      <div className="flex flex-col gap-4 w-full">

        {/* Name */}
        <div className="animate-drop-in delay-2">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
            <input type="text" placeholder="Full Name*"
              className={`${errors.name ? inputErr : inputBase} pl-10`}
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          {errors.name && <p key={`n-${shakeKey}`} className={errMsg}>{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="animate-drop-in delay-3">
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
            <input type="tel" placeholder="Phone Number*"
              className={`${errors.phone ? inputErr : inputBase} pl-10`}
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          {errors.phone && <p key={`p-${shakeKey}`} className={errMsg}>{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="animate-drop-in delay-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
            <input type="email" placeholder="Email Address*"
              className={`${errors.email ? inputErr : inputBase} pl-10`}
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          {errors.email && <p key={`e-${shakeKey}`} className={errMsg}>{errors.email}</p>}
        </div>

        {/* Residential / Commercial */}
        <div className="animate-drop-in delay-5">
          <p className="text-[11px] font-black uppercase tracking-widest text-navy/40 mb-2">Quote for*</p>
          <div className="flex gap-3">
            <CategoryCard id="residential" label="Residential" Icon={Home}     description="Houses, flats & bungalows" />
            <CategoryCard id="commercial"  label="Commercial"  Icon={Building2} description="Offices, retail & more"   />
          </div>
          {errors.category && <p key={`c-${shakeKey}`} className={errMsg}>{errors.category}</p>}
        </div>

        {/* GDPR Consent Checkbox */}
        <div className="animate-drop-in delay-6">
          <button
            type="button"
            onClick={() => { setConsent(c => !c); setErrors(e => ({ ...e, consent: '' })); }}
            className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
              ${consent
                ? 'border-navy/30 bg-sky-light'
                : errors.consent
                  ? 'border-error bg-red-50'
                  : 'border-sky-mid bg-white hover:border-navy/30'}`}
          >
            {/* Checkbox */}
            <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all
              ${consent ? 'bg-navy border-navy' : 'bg-white border-sky-mid'}`}>
              {consent && <Check size={11} strokeWidth={3} className="text-white" />}
            </div>
            <span className="text-[11px] font-medium text-navy/60 leading-relaxed">
              I'm happy to receive my quote and information from LRS Exterior Cleaning by phone, WhatsApp, SMS or email.
            </span>
          </button>
          {errors.consent && <p key={`con-${shakeKey}`} className={errMsg}>{errors.consent}</p>}
        </div>

        {/* CTA */}
        <button onClick={handleNext}
          className="animate-drop-in delay-7 mt-1 w-full bg-navy text-white py-4 rounded-2xl font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-navy-light transition-all shadow-btn active:scale-[0.98]">
          Get My Quote <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        <p className="animate-drop-in delay-7 text-[10px] text-navy/30 font-medium text-center">
          Your details are kept private and only used to provide your quote.
        </p>
      </div>
    </div>
  );
};

export default Step0Contact;
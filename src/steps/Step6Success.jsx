// src/steps/Step6Success.jsx
import React from 'react';
import { CheckCircle, Phone, Mail } from 'lucide-react';
import lrsLogo from '../assets/lrslogo.png';

const Step6Success = ({ contactName }) => (
  <div className="flex flex-col items-start justify-center py-8 space-y-5 max-w-md">
    <img src={lrsLogo} alt="LRS Exterior Cleaning" className="h-12 w-auto animate-drop-in delay-0" />

    <div className="animate-drop-in delay-1 w-16 h-16 bg-navy rounded-full flex items-center justify-center shadow-btn"
      style={{ animation: 'bounceSoft 1s infinite' }}>
      <CheckCircle size={32} strokeWidth={2} className="text-white" />
    </div>

    <h2 className="animate-drop-in delay-2 text-2xl md:text-4xl font-black uppercase leading-tight text-navy">
      Booking Confirmed!
    </h2>

    <p className="animate-drop-in delay-3 text-sm font-medium text-navy/50 leading-relaxed">
      Thanks {contactName?.split(' ')[0] || 'there'}! We've received your booking request and we'll be in touch shortly to confirm your first clean date.
    </p>

    <div className="animate-drop-in delay-4 flex flex-col gap-2 w-full mt-2">
      <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-sky-mid">
        <Phone size={15} className="text-navy/40" />
        <span className="text-sm font-bold text-navy/60">We'll call you to arrange your first visit</span>
      </div>
      <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-sky-mid">
        <Mail size={15} className="text-navy/40" />
        <span className="text-sm font-bold text-navy/60">Check your email for your quote summary</span>
      </div>
    </div>

    <p className="animate-drop-in delay-5 text-[10px] text-navy/25 font-medium uppercase tracking-widest">
      LRS Exterior Cleaning — Thank you!
    </p>
  </div>
);

export default Step6Success;

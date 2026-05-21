// src/steps/Step6Success.jsx
import React from 'react';
import { CheckCircle, MessageSquare, Clock } from 'lucide-react';
import lrsLogo from '../assets/lrslogo.png';

const Step6Success = ({ contactName }) => (
  <div className="flex flex-col items-start justify-center py-8 space-y-5 max-w-md">

    <img src={lrsLogo} alt="LRS Exterior Cleaning" className="h-12 w-auto animate-drop-in delay-0" />

    <div
      className="animate-drop-in delay-1 w-16 h-16 bg-navy rounded-full flex items-center justify-center shadow-btn"
      style={{ animation: 'bounceSoft 1s infinite' }}
    >
      <CheckCircle size={32} strokeWidth={2} className="text-white" />
    </div>

    <h2 className="animate-drop-in delay-2 text-2xl md:text-4xl font-black uppercase leading-tight text-navy">
      Booking Submitted!
    </h2>

    <p className="animate-drop-in delay-3 text-sm font-medium text-navy/50 leading-relaxed">
      Thanks {contactName?.split(' ')[0] || 'there'}! We've received your booking request and will be in touch shortly.
    </p>

    {/* What happens next */}
    <div className="animate-drop-in delay-4 w-full flex flex-col gap-3">

      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-sky-mid shadow-card">
        <div className="w-9 h-9 flex-shrink-0 bg-navy rounded-xl flex items-center justify-center">
          <MessageSquare size={16} strokeWidth={2} className="text-white" />
        </div>
        <div>
          <p className="font-black text-sm text-navy">Quote Approval</p>
          <p className="text-[12px] font-medium text-navy/50 leading-relaxed mt-0.5">
            We will text you with a welcome message once we have reviewed and approved your quote.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-sky-mid shadow-card">
        <div className="w-9 h-9 flex-shrink-0 bg-sky rounded-xl flex items-center justify-center">
          <Clock size={16} strokeWidth={2} className="text-navy" />
        </div>
        <div>
          <p className="font-black text-sm text-navy">Clean Reminder</p>
          <p className="text-[12px] font-medium text-navy/50 leading-relaxed mt-0.5">
            We will also send you a text 24 hours before your first clean so you know we're on our way.
          </p>
        </div>
      </div>

    </div>

    <p className="animate-drop-in delay-5 text-[10px] text-navy/25 font-medium uppercase tracking-widest">
      LRS Exterior Cleaning — Thank you!
    </p>

  </div>
);

export default Step6Success;
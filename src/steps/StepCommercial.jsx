// src/steps/StepCommercial.jsx
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import lrsLogo from '../assets/lrslogo.png';

const CLEANING_TYPES = [
  'Regular window cleaning',
  'One-off clean',
  'Post-construction clean',
  'Gutter cleaning',
  'Facade cleaning',
  'Other',
];

const inputBase = 'w-full bg-white border-2 border-sky-mid rounded-2xl px-4 py-3.5 text-navy font-semibold text-sm outline-none transition-all placeholder:text-navy/25 focus:border-navy';
const inputErr  = 'w-full bg-white border-2 border-error rounded-2xl px-4 py-3.5 text-navy font-semibold text-sm outline-none placeholder:text-navy/25';
const errMsg    = 'text-error text-[10px] font-black uppercase tracking-wide mt-1 animate-shake';

const StepCommercial = ({ contact, onSuccess }) => {
  const [form, setForm]         = useState({ businessName: '', buildingType: '', address: '', postcode: '', cleaningTypes: [] });
  const [errors, setErrors]     = useState({});
  const [shakeKey, setShakeKey] = useState(0);
  const [sending, setSending]   = useState(false);
  const [done, setDone]         = useState(false);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); };

  const toggleType = (t) => setForm(f => ({
    ...f,
    cleaningTypes: f.cleaningTypes.includes(t)
      ? f.cleaningTypes.filter(x => x !== t)
      : [...f.cleaningTypes, t],
  }));

  const handleSubmit = async () => {
    const e = {};
    if (!form.businessName.trim())       e.businessName  = 'Business name is required';
    if (!form.buildingType.trim())       e.buildingType  = 'Building type is required';
    if (form.cleaningTypes.length === 0) e.cleaningTypes = 'Please select at least one cleaning type';
    if (!form.address.trim())            e.address       = 'Address is required';
    if (!form.postcode.trim())           e.postcode      = 'Postcode is required';
    if (Object.keys(e).length > 0) { setErrors(e); setShakeKey(k => k + 1); return; }

    setSending(true);

    const htmlContent = `
      <h2 style="color:#002664;font-size:15px;margin:0 0 16px;font-weight:800;">Commercial Enquiry Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;width:150px;">Name</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.name}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;">Phone</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.phone}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;">Email</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.email}</td>
        </tr>
        <tr><td colspan="2" style="padding:12px 0 4px;"><hr style="border:none;border-top:1px solid #e0f2fe;" /></td></tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;">Business Name</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${form.businessName}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;">Building Type</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${form.buildingType}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;">Address</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${form.address}, ${form.postcode}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;vertical-align:top;">Cleaning Needs</td>
          <td style="padding:7px 0;color:#002664;font-weight:bold;font-size:13px;">${form.cleaningTypes.join(', ')}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding:14px 16px;background:#eff6ff;border-radius:10px;border-left:4px solid #002664;">
        <p style="margin:0;color:#002664;font-size:12px;font-weight:700;">
          This is a commercial enquiry — please contact the customer to arrange a site visit and tailored quote.
        </p>
      </div>
    `;

    try {
      // ✅ Uses our Resend serverless function — same as residential
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:        'booking',
          name:        contact.name,
          phone:       contact.phone,
          email:       contact.email,
          category:    'commercial',
          htmlContent,
        }),
      });
    } catch (err) {
      console.error('Commercial email error:', err);
    } finally {
      setSending(false);
      setDone(true);
    }
  };

  // ── Success Screen ────────────────────────────────────────────────────────
  if (done) return (
    <div className="flex flex-col items-start gap-5 max-w-md py-8">
      <img src={lrsLogo} alt="LRS" className="h-12 w-auto animate-drop-in delay-0" />
      <div
        className="animate-drop-in delay-1 w-16 h-16 bg-navy rounded-full flex items-center justify-center shadow-btn"
        style={{ animation: 'bounceSoft 1s infinite' }}
      >
        <CheckCircle size={32} strokeWidth={2} className="text-white" />
      </div>
      <h2 className="animate-drop-in delay-2 text-2xl md:text-3xl font-black uppercase text-navy">Thank You!</h2>
      <p className="animate-drop-in delay-3 text-sm font-medium text-navy/50 leading-relaxed">
        We've received your commercial property enquiry and will be in touch soon with a tailored quote.
      </p>
      <div className="animate-drop-in delay-4 w-full p-5 bg-white rounded-2xl border border-sky-mid">
        <p className="font-black text-sm text-navy mb-2">What happens next?</p>
        <p className="text-sm text-navy/50 font-medium leading-relaxed">
          One of our specialists will contact you within 24–48 hours to discuss your requirements and arrange a site visit if needed.
        </p>
      </div>
      <p className="animate-drop-in delay-5 text-[10px] text-navy/25 uppercase tracking-widest">
        LRS Exterior Cleaning — Thank you!
      </p>
    </div>
  );

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full max-w-lg w-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Commercial Property Details
      </h2>
      <p className="animate-drop-in delay-1 text-sm font-medium text-navy/40 mb-1">
        Please provide details about your commercial property so we can give you an accurate quote.
      </p>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-6" />

      <div className="flex flex-col gap-4 w-full">

        {/* Business Name */}
        <div className="animate-drop-in delay-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-navy/50 mb-1 block">Business Name*</label>
          <input type="text" placeholder="Business Name"
            className={errors.businessName ? inputErr : inputBase}
            value={form.businessName} onChange={e => set('businessName', e.target.value)} />
          {errors.businessName && <p key={`bn-${shakeKey}`} className={errMsg}>{errors.businessName}</p>}
        </div>

        {/* Building Type */}
        <div className="animate-drop-in delay-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-navy/50 mb-1 block">Building Type*</label>
          <input type="text" placeholder="e.g. Office, Retail, Warehouse"
            className={errors.buildingType ? inputErr : inputBase}
            value={form.buildingType} onChange={e => set('buildingType', e.target.value)} />
          {errors.buildingType && <p key={`bt-${shakeKey}`} className={errMsg}>{errors.buildingType}</p>}
        </div>

        {/* Cleaning Types */}
        <div className="animate-drop-in delay-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-navy/50 mb-2 block">
            What type of cleaning do you need?*
          </label>
          <div className="flex flex-wrap gap-2">
            {CLEANING_TYPES.map(t => (
              <button key={t} type="button"
                onClick={() => { toggleType(t); setErrors(e => ({ ...e, cleaningTypes: '' })); }}
                className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer
                  ${form.cleaningTypes.includes(t)
                    ? 'border-navy bg-navy text-white'
                    : 'border-sky-mid bg-white text-navy hover:border-navy/40'}`}>
                {t}
              </button>
            ))}
          </div>
          {errors.cleaningTypes && <p key={`ct-${shakeKey}`} className={errMsg}>{errors.cleaningTypes}</p>}
        </div>

        {/* Address */}
        <div className="animate-drop-in delay-5">
          <label className="text-[11px] font-black uppercase tracking-widest text-navy/50 mb-1 block">First line of address*</label>
          <input type="text" placeholder="Address line 1"
            className={errors.address ? inputErr : inputBase}
            value={form.address} onChange={e => set('address', e.target.value)} />
          {errors.address && <p key={`a-${shakeKey}`} className={errMsg}>{errors.address}</p>}
        </div>

        {/* Postcode */}
        <div className="animate-drop-in delay-6">
          <label className="text-[11px] font-black uppercase tracking-widest text-navy/50 mb-1 block">Postcode*</label>
          <input type="text" placeholder="POSTCODE"
            className={`${errors.postcode ? inputErr : inputBase} uppercase`}
            value={form.postcode} onChange={e => set('postcode', e.target.value.toUpperCase())} />
          {errors.postcode && <p key={`pc-${shakeKey}`} className={errMsg}>{errors.postcode}</p>}
        </div>

        <button disabled={sending} onClick={handleSubmit}
          className="mt-2 w-full bg-navy text-white py-4 rounded-2xl font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-navy-light transition-all shadow-btn active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
          {sending
            ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</span>
            : <><Send size={16} strokeWidth={2.5} /> Submit Enquiry</>}
        </button>

      </div>
    </div>
  );
};

export default StepCommercial;
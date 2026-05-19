// src/steps/Step5Quote.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import {
  calculateWindowTotal,
  getAdditionalServicePrice,
  getServiceTierKey,
  pricingConfig,
} from '../data/pricingConfig';
import { sendBookingEmail } from '../utils/sendEmail';

const inputBase = 'w-full bg-white border-2 border-sky-mid rounded-2xl px-4 py-3 text-navy font-semibold text-sm outline-none transition-all placeholder:text-navy/25 focus:border-navy focus:shadow-active';
const inputErr  = 'w-full bg-white border-2 border-error rounded-2xl px-4 py-3 text-navy font-semibold text-sm outline-none placeholder:text-navy/25';
const errMsg    = 'text-error text-[10px] font-black uppercase tracking-wide mt-1 animate-shake';

const LineItem = ({ label, price }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-sky-mid/40 last:border-0">
    <span className="text-sm font-medium text-navy/60">{label}</span>
    <span className="text-sm font-bold text-navy">£{price}</span>
  </div>
);

const Step5Quote = ({ formData, selectedExtras, onSuccess }) => {
  const [sending, setSending]   = useState(false);
  const [address, setAddress]   = useState({ line1: '', line2: '', postcode: '' });
  const [errors, setErrors]     = useState({});
  const [shakeKey, setShakeKey] = useState(0);

  const windowTotal = calculateWindowTotal(formData);
  const tierKey     = getServiceTierKey(formData.propertyType, formData.bedrooms);
  const hasExtra    = formData.hasConservatory || formData.hasExtension;

  const extrasLines = selectedExtras.map(key => ({
    key,
    label: pricingConfig.additionalServices[key]?.label || key,
    price: getAdditionalServicePrice(key, tierKey, hasExtra),
  }));

  const extrasTotal = extrasLines.reduce((sum, s) => sum + s.price, 0);

  const setAddr = (key, val) => {
    setAddress(a => ({ ...a, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleBook = async () => {
    const e = {};
    if (!address.line1.trim())    e.line1    = 'Address line 1 is required';
    if (!address.postcode.trim()) e.postcode = 'Postcode is required';
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setShakeKey(k => k + 1);
      return;
    }

    setSending(true);
    await sendBookingEmail({
      contact:         formData.contact,
      propertyType:    formData.propertyType,
      bedrooms:        formData.bedrooms,
      hasConservatory: formData.hasConservatory,
      hasExtension:    formData.hasExtension,
      selectedExtras,
      extrasLines,
      windowTotal,
      extrasTotal,
      address,
    });
    setSending(false);
    onSuccess();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
        Your Quote
      </h2>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* Quote Breakdown Card */}
        <div className="animate-drop-in delay-2 bg-white rounded-3xl border-2 border-sky-mid shadow-card p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4">Breakdown</p>

          <LineItem
            label={`Window Cleaning — ${formData.propertyType} (${formData.bedrooms} bed)`}
            price={pricingConfig.windowCleaning[formData.propertyType]?.[formData.bedrooms] || 0}
          />
          {formData.hasConservatory && (
            <LineItem label="Conservatory add-on" price={pricingConfig.windowAddons.conservatory} />
          )}
          {formData.hasExtension && (
            <LineItem label="Extension / 3-Storey add-on" price={pricingConfig.windowAddons.extension} />
          )}

          {extrasLines.length > 0 && (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/30 mt-4 mb-1">Additional Services</p>
              {extrasLines.map(s => <LineItem key={s.key} label={s.label} price={s.price} />)}
            </>
          )}

          {/* Total */}
          <div className="mt-5 pt-4 border-t-2 border-navy/10">
            <div className="bg-navy rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Per visit (6-weekly)</p>
                <p className="text-3xl font-black text-white mt-0.5">£{windowTotal}</p>
              </div>
              {extrasTotal > 0 && (
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Extras (one-off)</p>
                  <p className="text-2xl font-black text-sky mt-0.5">£{extrasTotal}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address + Book Now */}
        <div className="animate-drop-in delay-3 flex flex-col gap-4">
          <p className="text-sm font-black uppercase text-navy">Your address*</p>

          <div>
            <input type="text" placeholder="Address line 1*"
              className={errors.line1 ? inputErr : inputBase}
              value={address.line1} onChange={e => setAddr('line1', e.target.value)} />
            {errors.line1 && <p key={`l1-${shakeKey}`} className={`${errMsg} animate-shake`}>{errors.line1}</p>}
          </div>

          <input type="text" placeholder="Address line 2 (optional)"
            className={inputBase}
            value={address.line2} onChange={e => setAddr('line2', e.target.value)} />

          <div>
            <input type="text" placeholder="Postcode*"
              className={errors.postcode ? inputErr : inputBase}
              value={address.postcode} onChange={e => setAddr('postcode', e.target.value.toUpperCase())} />
            {errors.postcode && <p key={`pc-${shakeKey}`} className={`${errMsg} animate-shake`}>{errors.postcode}</p>}
          </div>

          <button disabled={sending} onClick={handleBook}
            className="mt-2 w-full bg-navy text-white py-4 rounded-2xl font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-navy-light transition-all shadow-btn active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
            {sending
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</span>
              : <><Send size={16} strokeWidth={2.5} /> Book Now</>}
          </button>

          <p className="text-[10px] text-navy/30 font-medium text-center">
            We'll be in touch to confirm your first clean date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step5Quote;
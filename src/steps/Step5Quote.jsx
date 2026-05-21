// src/steps/Step5Quote.jsx
import React, { useState } from 'react';
import { Send, XCircle } from 'lucide-react';
import AddressLookup from '../components/AddressLookup';
import {
  calculateWindowTotal,
  getAdditionalServicePrice,
  getServiceTierKey,
  pricingConfig,
} from '../data/pricingConfig';
import { sendBookingEmail } from '../utils/sendEmail';

const errMsg = 'text-error text-[10px] font-black uppercase tracking-wide mt-1 animate-shake';

const LineItem = ({ label, price }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-sky-mid/40 last:border-0">
    <span className="text-sm font-medium text-navy/60">{label}</span>
    <span className="text-sm font-bold text-navy">£{price}</span>
  </div>
);

const Step5Quote = ({ formData, selectedExtras, onSuccess, onNotInterested }) => {
  const [sending, setSending]         = useState(false);
  const [address, setAddress]         = useState({ line1: '', line2: '', postcode: '' });
  const [addressError, setAddressError] = useState('');
  const [shakeKey, setShakeKey]       = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const windowTotal = calculateWindowTotal(formData);
  const tierKey     = getServiceTierKey(formData.propertyType, formData.bedrooms);
  const hasExtra    = formData.hasConservatory || formData.hasExtension;

  const extrasLines = selectedExtras.map(key => ({
    key,
    label: pricingConfig.additionalServices[key]?.label || key,
    price: getAdditionalServicePrice(key, tierKey, hasExtra),
  }));
  const extrasTotal = extrasLines.reduce((sum, s) => sum + s.price, 0);

  const handleBook = async () => {
    if (!address.line1.trim()) {
      setAddressError('Please enter your street address');
      setShakeKey(k => k + 1);
      return;
    }
    setSending(true);
    await sendBookingEmail({
      contact: formData.contact,
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      hasConservatory: formData.hasConservatory,
      hasExtension: formData.hasExtension,
      hasLantern: formData.hasLantern,
      hasVelux: formData.hasVelux,
      veluxCount: formData.veluxCount,
      selectedExtras,
      extrasLines,
      windowTotal,
      extrasTotal,
      address,
    });
    setSending(false);
    onSuccess();
  };

  const handleNotInterested = async () => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          name: formData.contact?.name,
          phone: formData.contact?.phone,
          email: formData.contact?.email,
          category: 'residential',
          htmlContent: `
            <h2 style="color:#dc2626;font-size:15px;margin:0 0 12px;font-weight:900;">Customer Left — No Longer Interested</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Name</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${formData.contact?.name}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${formData.contact?.phone}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${formData.contact?.email}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">How they heard</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${formData.contact?.hearAboutUs || '—'}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Property</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;text-transform:capitalize;">${formData.propertyType} — ${formData.bedrooms} bed</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Quote reached</td><td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">£${windowTotal} per visit</td></tr>
            </table>
            <div style="margin-top:16px;padding:12px;background:#fef2f2;border-radius:8px;border-left:4px solid #dc2626;">
              <p style="margin:0;color:#991b1b;font-size:12px;font-weight:700;">
                This customer clicked "No Longer Interested" at the quote stage. You may want to follow up with them.
              </p>
            </div>
          `,
        }),
      });
    } catch (err) { console.error(err); }
    onNotInterested();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">Your Quote</h2>
      <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* Quote Breakdown Card */}
        <div className="animate-drop-in delay-2 bg-white rounded-3xl border-2 border-sky-mid shadow-card p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4">Breakdown</p>
          <LineItem
            label={`Window Cleaning — ${formData.propertyType} (${formData.bedrooms} bed)`}
            price={pricingConfig.windowCleaning[formData.propertyType]?.[formData.bedrooms] || 0}
          />
          {formData.hasConservatory && <LineItem label="Conservatory"           price={pricingConfig.windowAddons.conservatory} />}
          {formData.hasExtension    && <LineItem label="Extension / 3-Storey"   price={pricingConfig.windowAddons.extension}    />}
          {formData.hasLantern      && <LineItem label="Roof Lantern"            price={pricingConfig.windowAddons.lantern}      />}
          {formData.hasVelux        && <LineItem label={`Velux Windows (x${formData.veluxCount || 1})`} price={(parseInt(formData.veluxCount) || 1) * pricingConfig.windowAddons.velux} />}

          {extrasLines.length > 0 && (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/30 mt-4 mb-1">Additional Services</p>
              {extrasLines.map(s => <LineItem key={s.key} label={s.label} price={s.price} />)}
            </>
          )}

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
            {/* Small print */}
            <p className="text-[9px] text-navy/35 font-medium mt-3 leading-relaxed">
              * This price is an estimate based on the information provided. The final price may vary depending on the accuracy of the details given, the actual size of the property, or any additional features identified on the day of the first clean.
            </p>
          </div>
        </div>

        {/* Address + Buttons */}
        <div className="animate-drop-in delay-3 flex flex-col gap-4">
          <p className="text-sm font-black uppercase text-navy">Your address*</p>

          <AddressLookup
            onAddressSelect={(addr) => { setAddress(addr); setAddressError(''); }}
            error={addressError}
            shakeKey={shakeKey}
          />

          {/* Book Now */}
          <button disabled={sending} onClick={handleBook}
            className="w-full bg-navy text-white py-4 rounded-2xl font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-navy-light transition-all shadow-btn active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
            {sending
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</span>
              : <><Send size={16} strokeWidth={2.5} />Book Now</>}
          </button>

          <p className="text-[10px] text-navy/30 font-medium text-center">
            We'll be in touch to confirm your first clean date.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-sky-mid" />
            <span className="text-[10px] text-navy/30 font-bold uppercase">or</span>
            <div className="flex-1 h-px bg-sky-mid" />
          </div>

          {/* No Longer Interested */}
          <button onClick={() => setShowExitModal(true)}
            className="w-full bg-white border-2 border-sky-mid text-navy/40 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:border-error hover:text-error transition-all active:scale-[0.98]">
            <XCircle size={15} strokeWidth={2} />
            No Longer Interested
          </button>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-active animate-drop-in delay-0">
            <h3 className="text-lg font-black uppercase text-navy mb-2">Are you sure?</h3>
            <p className="text-sm text-navy/50 font-medium mb-6 leading-relaxed">
              We're sorry to see you go! If you change your mind, feel free to come back anytime.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowExitModal(false)}
                className="w-full bg-navy text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-navy-light transition-all">
                Actually, I'll Stay!
              </button>
              <button onClick={handleNotInterested}
                className="w-full bg-white border-2 border-sky-mid text-navy/40 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide hover:border-error hover:text-error transition-all">
                No Thanks, I'm Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5Quote;
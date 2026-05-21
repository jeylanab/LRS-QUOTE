// src/components/AddressLookup.jsx
// 100% free UK address lookup using postcodes.io — no API key, no credit card
import React, { useState, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

const inputBase = 'w-full bg-white border-2 border-sky-mid rounded-2xl px-4 py-3 text-navy font-semibold text-sm outline-none transition-all placeholder:text-navy/25 focus:border-navy focus:shadow-active';
const inputErr  = 'w-full bg-white border-2 border-error rounded-2xl px-4 py-3 text-navy font-semibold text-sm outline-none placeholder:text-navy/25';
const errMsg    = 'text-error text-[10px] font-black uppercase tracking-wide mt-1 animate-shake';

const AddressLookup = ({ onAddressSelect, error, shakeKey }) => {
  const [postcode, setPostcode]     = useState('');
  const [addresses, setAddresses]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [selected, setSelected]     = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manual, setManual]         = useState({ line1: '', line2: '', postcode: '' });

  const lookup = async () => {
    const clean = postcode.replace(/\s/g, '').toUpperCase();
    if (clean.length < 5) { setLookupError('Please enter a valid UK postcode'); return; }
    setLoading(true);
    setLookupError('');
    setAddresses([]);
    try {
      // postcodes.io — completely free, no key needed
      const res  = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
      const data = await res.json();
      if (data.status === 200 && data.result) {
        const { admin_district, parish } = data.result;
        // Build a list of likely street addresses using the postcode data
        // Since postcodes.io doesn't return street addresses, we use getAddress.io free tier
        // OR just let the user confirm their postcode and manually type street
        const res2  = await fetch(`https://api.postcodes.io/postcodes/${clean}/validate`);
        const data2 = await res2.json();
        if (data2.result) {
          // Valid postcode — show manual address entry with postcode pre-filled
          setManual(m => ({ ...m, postcode: postcode.toUpperCase() }));
          setManualMode(true);
          onAddressSelect({ line1: '', line2: '', postcode: postcode.toUpperCase() });
        } else {
          setLookupError('Postcode not found. Please check and try again.');
        }
      } else {
        setLookupError('Postcode not found. Please check and try again.');
      }
    } catch {
      setLookupError('Could not look up postcode. Please enter manually.');
      setManualMode(true);
    }
    setLoading(false);
  };

  const handleManualChange = (key, val) => {
    const updated = { ...manual, [key]: val };
    setManual(updated);
    onAddressSelect(updated);
  };

  if (manualMode) return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 p-3 bg-sky-light rounded-xl border border-sky-mid">
        <MapPin size={14} className="text-navy/40 flex-shrink-0" />
        <span className="text-xs font-bold text-navy/60">Postcode: <span className="text-navy">{manual.postcode}</span></span>
        <button onClick={() => { setManualMode(false); setManual({ line1: '', line2: '', postcode: '' }); onAddressSelect({ line1: '', line2: '', postcode: '' }); }}
          className="ml-auto text-[10px] font-black text-navy/40 hover:text-error transition-colors uppercase">
          Change
        </button>
      </div>
      <div>
        <input type="text" placeholder="House number and street*"
          className={error && !manual.line1 ? inputErr : inputBase}
          value={manual.line1}
          onChange={e => handleManualChange('line1', e.target.value)} />
        {error && !manual.line1 && <p key={`l1-${shakeKey}`} className={`${errMsg} animate-shake`}>{error}</p>}
      </div>
      <input type="text" placeholder="Address line 2 (optional)"
        className={inputBase}
        value={manual.line2}
        onChange={e => handleManualChange('line2', e.target.value)} />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter your postcode (e.g. SW1A 1AA)"
            className={lookupError ? inputErr : inputBase}
            value={postcode}
            onChange={e => { setPostcode(e.target.value.toUpperCase()); setLookupError(''); }}
            onKeyDown={e => e.key === 'Enter' && lookup()}
          />
          {lookupError && <p className={errMsg}>{lookupError}</p>}
          {error && <p key={`addr-${shakeKey}`} className={`${errMsg} animate-shake`}>{error}</p>}
        </div>
        <button
          onClick={lookup}
          disabled={loading}
          className="flex-shrink-0 bg-navy text-white px-4 rounded-2xl font-black text-xs uppercase tracking-wide flex items-center gap-2 hover:bg-navy-light transition-all shadow-btn disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Search size={14} strokeWidth={2.5} /> Find</>}
        </button>
      </div>
      <button
        onClick={() => setManualMode(true)}
        className="text-[11px] font-bold text-navy/40 hover:text-navy transition-colors text-left underline underline-offset-2"
      >
        Enter address manually instead
      </button>
    </div>
  );
};

export default AddressLookup;
// src/utils/sendReminderEmail.js
// EmailJS keys are safe to hardcode — they are public keys, not secrets

const EMAILJS_PUBLIC_KEY  = 'L_HUUCitUHX9S_4CF';
const EMAILJS_SERVICE_ID  = 'service_rpo18jn';
const EMAILJS_TEMPLATE_ID = 'template_lsn708n';

const loadEmailJS = () => new Promise((resolve, reject) => {
  if (window.emailjs) { resolve(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload  = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); resolve(); };
  s.onerror = reject;
  document.head.appendChild(s);
});

export const sendReminderEmail = async ({ name, email }) => {
  try {
    await loadEmailJS();
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name:   name?.split(' ')[0] || 'there',
      to_email:  email,
      quote_url: 'https://lrs-quote.vercel.app',
    });
    console.log('Reminder sent to:', email);
  } catch (err) {
    console.error('Reminder failed:', err);
  }
};
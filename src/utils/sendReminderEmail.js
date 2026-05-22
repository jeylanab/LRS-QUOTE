// src/utils/sendReminderEmail.js
// Uses EmailJS — free, browser-based, no domain verification needed
// Sends reminder email directly to the customer

const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

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
      to_name:  name?.split(' ')[0] || 'there',
      to_email: email,
      quote_url: import.meta.env.VITE_APP_URL || 'https://lrs-quote.vercel.app',
    });
    console.log('Reminder email sent to customer');
  } catch (err) {
    // Silent fail — never block the user
    console.error('Reminder email failed:', err);
  }
};
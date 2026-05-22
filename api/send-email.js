// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, category, type, htmlContent } = req.body;

  const RESEND_API_KEY  = process.env.RESEND_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
  const APP_URL         = process.env.APP_URL || 'https://lrs-quote.vercel.app';

  if (!RESEND_API_KEY || !RECIPIENT_EMAIL) return res.status(500).json({ error: 'Server configuration missing' });

  const emailHeader = `
    <div style="background:#002664;padding:24px 28px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:16px;">
      <img src="${APP_URL}/lrslogo.png" alt="LRS Exterior Cleaning" style="height:48px;width:auto;" />
      <div>
        <h1 style="color:white;margin:0;font-size:17px;font-weight:900;">LRS Exterior Cleaning</h1>
        <p style="color:rgba(255,255,255,0.5);margin:3px 0 0;font-size:11px;">Instant Quote Tool</p>
      </div>
    </div>
  `;

  const subject = type === 'not-interested'
    ? `⚠️ Customer Left — ${name}`
    : `✅ New Booking — ${name}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,38,100,0.10);">
      ${emailHeader}
      <div style="background:#f0fdf4;padding:28px;border:2px solid #bbf7d0;border-top:none;border-radius:0 0 12px 12px;">
        ${htmlContent || ''}
        <p style="margin:24px 0 0;color:#94a3b8;font-size:11px;text-align:center;">LRS Exterior Cleaning — lrsexteriorcleaning.com</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'LRS Quote <onboarding@resend.dev>',
        to:      [RECIPIENT_EMAIL],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
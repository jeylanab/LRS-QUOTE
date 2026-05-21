// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, category, type, htmlContent } = req.body;

  const RESEND_API_KEY  = process.env.RESEND_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
  const APP_URL         = process.env.APP_URL || 'https://lrs-quote.vercel.app';

  if (!RESEND_API_KEY) return res.status(500).json({ error: 'Server configuration missing' });

  const emailHeader = `
    <div style="background:#002664;padding:24px 28px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:16px;">
      <img src="${APP_URL}/lrslogo.png" alt="LRS Exterior Cleaning" style="height:48px;width:auto;" />
      <div>
        <h1 style="color:white;margin:0;font-size:17px;font-weight:900;">LRS Exterior Cleaning</h1>
        <p style="color:rgba(255,255,255,0.5);margin:3px 0 0;font-size:11px;">Instant Quote Tool</p>
      </div>
    </div>
  `;

  let subject, html, toEmail;

  // ── REMINDER — sent to the customer ──────────────────────────────────────
  if (type === 'reminder') {
    toEmail = email;
    subject = `${name?.split(' ')[0] || 'Hi'}, you forgot to finish your instant quote!`;
    html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,38,100,0.10);">
        ${emailHeader}
        <div style="background:#f0f9ff;padding:32px 28px;border:2px solid #e0f2fe;border-top:none;border-radius:0 0 12px 12px;">

          <h2 style="color:#002664;font-size:20px;font-weight:900;margin:0 0 8px;">
            You're almost there, ${name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6;">
            It looks like you started getting an instant quote for your window cleaning but didn't quite finish.
            No worries — your quote is just a few clicks away and it only takes 2 minutes!
          </p>

          <!-- CTA Button -->
          <div style="text-align:center;margin:28px 0;">
            <a href="${APP_URL}"
              style="display:inline-block;background:#002664;color:white;padding:16px 40px;border-radius:14px;font-weight:900;font-size:15px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
              Finish My Quote →
            </a>
          </div>

          <!-- What to expect -->
          <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e0f2fe;margin-bottom:20px;">
            <p style="color:#002664;font-size:13px;font-weight:900;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">What to expect:</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#64748b;">⏱️ Takes less than</td>
                <td style="padding:5px 0;font-size:13px;color:#002664;font-weight:bold;">2 minutes</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#64748b;">💷 Get an</td>
                <td style="padding:5px 0;font-size:13px;color:#002664;font-weight:bold;">Instant price — no waiting</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#64748b;">📅 Book your</td>
                <td style="padding:5px 0;font-size:13px;color:#002664;font-weight:bold;">First clean straight away</td>
              </tr>
            </table>
          </div>

          <p style="color:#94a3b8;font-size:11px;text-align:center;margin:0;line-height:1.6;">
            If you no longer need our services, simply ignore this email.<br/>
            LRS Exterior Cleaning — <a href="https://lrsexteriorcleaning.com" style="color:#6EC6F0;">lrsexteriorcleaning.com</a>
          </p>
        </div>
      </div>
    `;

  // ── BOOKING — sent to Liam ────────────────────────────────────────────────
  } else {
    if (!RECIPIENT_EMAIL) return res.status(500).json({ error: 'Recipient not configured' });
    toEmail = RECIPIENT_EMAIL;
    subject = `✅ New Booking Request — ${name}`;
    html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,38,100,0.10);">
        ${emailHeader}
        <div style="background:#f0fdf4;padding:28px;border:2px solid #bbf7d0;border-top:none;border-radius:0 0 12px 12px;">
          ${htmlContent || ''}
          <p style="margin:24px 0 0;color:#94a3b8;font-size:11px;text-align:center;">LRS Exterior Cleaning — lrsexteriorcleaning.com</p>
        </div>
      </div>
    `;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'LRS Exterior Cleaning <onboarding@resend.dev>',
        to:   [toEmail],
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
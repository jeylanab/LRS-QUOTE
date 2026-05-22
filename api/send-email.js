// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, category, type, htmlContent } = req.body;

  const BREVO_API_KEY   = process.env.BREVO_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
  const APP_URL         = process.env.APP_URL || 'https://lrs-quote.vercel.app';

  if (!BREVO_API_KEY) return res.status(500).json({ error: 'Missing API key' });

  const emailHeader = `
    <div style="background:#002664;padding:24px 28px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:16px;">
      <img src="${APP_URL}/lrslogo.png" alt="LRS Exterior Cleaning" style="height:48px;width:auto;" />
      <div>
        <h1 style="color:white;margin:0;font-size:17px;font-weight:900;">LRS Exterior Cleaning</h1>
        <p style="color:rgba(255,255,255,0.5);margin:3px 0 0;font-size:11px;">Instant Quote Tool</p>
      </div>
    </div>
  `;

  let subject, html, toEmail, toName;

  // ── REMINDER — sent to the customer ──────────────────────────────────────
  if (type === 'reminder') {
    if (!email) return res.status(400).json({ error: 'No email provided' });
    toEmail = email;
    toName  = name || 'Customer';
    subject = `${name?.split(' ')[0] || 'Hi'}, you forgot to finish your instant quote!`;
    html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,38,100,0.10);">
        ${emailHeader}
        <div style="background:#f0f9ff;padding:32px 28px;border:2px solid #e0f2fe;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="color:#002664;font-size:20px;font-weight:900;margin:0 0 8px;">
            You're almost there${name ? ', ' + name.split(' ')[0] : ''}! 👋
          </h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6;">
            It looks like you started getting an instant quote for your window cleaning but didn't quite finish.
            No worries — your quote is just a few clicks away and it only takes 2 minutes!
          </p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${APP_URL}"
              style="display:inline-block;background:#002664;color:white;padding:16px 40px;border-radius:14px;font-weight:900;font-size:15px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
              Finish My Quote →
            </a>
          </div>
          <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e0f2fe;margin-bottom:20px;">
            <p style="color:#002664;font-size:13px;font-weight:900;margin:0 0 12px;text-transform:uppercase;">What to expect:</p>
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

  // ── BOOKING / NOT-INTERESTED — sent to Liam ───────────────────────────────
  } else {
    if (!RECIPIENT_EMAIL) return res.status(500).json({ error: 'Recipient not configured' });
    toEmail = RECIPIENT_EMAIL;
    toName  = 'LRS Exterior Cleaning';
    subject = type === 'not-interested'
      ? `⚠️ Customer Left — ${name}`
      : `✅ New Booking — ${name}`;
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
    // ── Brevo API — free, no domain verification needed ──────────────────
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key':      BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender:  { name: 'LRS Exterior Cleaning', email: 'noreply@lrsexteriorcleaning.com' },
        to:      [{ email: toEmail, name: toName }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Brevo error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
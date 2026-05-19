// api/send-email.js
// Vercel Serverless Function — keeps Resend API key safe on the server

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, category, type, htmlContent } = req.body;

  const RESEND_API_KEY  = process.env.RESEND_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

  if (!RESEND_API_KEY || !RECIPIENT_EMAIL) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  const isLead = type === 'lead';

  const subject = isLead
    ? `🪟 New Lead — ${name} started a quote`
    : `✅ New Booking Request — ${name}`;

  const html = isLead ? `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#002664;padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">🪟 New Quote Started</h1>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px;">LRS Exterior Cleaning</p>
      </div>
      <div style="background:#f0f9ff;padding:24px;border-radius:0 0 12px 12px;border:2px solid #e0f2fe;">
        <h2 style="color:#002664;font-size:16px;margin:0 0 16px;">Contact Details Captured</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;width:120px;">Name</td>
            <td style="padding:8px 0;color:#002664;font-weight:bold;font-size:13px;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;">Phone</td>
            <td style="padding:8px 0;color:#002664;font-weight:bold;font-size:13px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td>
            <td style="padding:8px 0;color:#002664;font-weight:bold;font-size:13px;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;">Quote Type</td>
            <td style="padding:8px 0;font-size:13px;">
              <span style="background:${category === 'residential' ? '#dbeafe' : '#fef3c7'};color:#002664;padding:2px 10px;border-radius:20px;font-size:12px;text-transform:uppercase;font-weight:bold;">
                ${category}
              </span>
            </td>
          </tr>
        </table>
        <div style="margin-top:20px;padding:14px;background:#fff7ed;border-radius:8px;border-left:4px solid #f97316;">
          <p style="margin:0;color:#9a3412;font-size:12px;font-weight:bold;">
            ⚡ This customer just started your quote form. They may not complete it —
            you have their details to follow up if needed.
          </p>
        </div>
      </div>
    </div>
  ` : `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#002664;padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">✅ New Booking Request</h1>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px;">LRS Exterior Cleaning</p>
      </div>
      <div style="background:#f0fdf4;padding:24px;border-radius:0 0 12px 12px;border:2px solid #bbf7d0;">
        ${htmlContent || ''}
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
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
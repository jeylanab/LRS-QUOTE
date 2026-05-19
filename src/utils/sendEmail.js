// src/utils/sendEmail.js
// Frontend helper — calls our Vercel serverless function silently

/**
 * sendLeadEmail — fires immediately when user clicks "Get My Quote"
 * Silent background call — never blocks the UI
 */
export const sendLeadEmail = async ({ name, phone, email, category }) => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lead', name, phone, email, category }),
    });
  } catch (err) {
    // Silent fail — never interrupt the user flow
    console.error('Lead email failed silently:', err);
  }
};

/**
 * sendBookingEmail — fires on "Book Now" with full quote details
 */
export const sendBookingEmail = async ({
  contact,
  propertyType,
  bedrooms,
  hasConservatory,
  hasExtension,
  selectedExtras,
  extrasLines,
  windowTotal,
  extrasTotal,
  address,
  frequency,
}) => {
  const extrasText = extrasLines?.length > 0
    ? extrasLines.map(s => `
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;">${s.label}</td>
          <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;text-align:right;">£${s.price}</td>
        </tr>`).join('')
    : `<tr><td colspan="2" style="padding:6px 0;color:#94a3b8;font-size:13px;">None selected</td></tr>`;

  const htmlContent = `
    <h2 style="color:#002664;font-size:16px;margin:0 0 16px;">Booking Details</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;width:160px;">Name</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.phone}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${contact.email}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Address</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">
          ${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.postcode}
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #e0f2fe;margin:16px 0;" />

    <h3 style="color:#002664;font-size:14px;margin:0 0 12px;">Property Details</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;width:160px;">Property Type</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;text-transform:capitalize;">${propertyType}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Bedrooms</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${bedrooms}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Conservatory</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${hasConservatory ? 'Yes (+£5)' : 'No'}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Extension / 3-Storey</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;">${hasExtension ? 'Yes (+£3)' : 'No'}</td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #e0f2fe;margin:16px 0;" />

    <h3 style="color:#002664;font-size:14px;margin:0 0 12px;">Quote Breakdown</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:#64748b;font-size:13px;">Window Cleaning (6-weekly)</td>
        <td style="padding:6px 0;color:#002664;font-weight:bold;font-size:13px;text-align:right;">£${windowTotal} per visit</td>
      </tr>
      ${extrasText}
    </table>

    <div style="margin-top:16px;padding:16px;background:#002664;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:bold;">Window clean per visit</span>
      <span style="color:white;font-size:22px;font-weight:900;">£${windowTotal}</span>
    </div>
    ${extrasTotal > 0 ? `
    <div style="margin-top:8px;padding:12px 16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;display:flex;justify-content:space-between;">
      <span style="color:#166534;font-size:13px;font-weight:bold;">Additional services (one-off)</span>
      <span style="color:#166534;font-size:18px;font-weight:900;">£${extrasTotal}</span>
    </div>` : ''}
  `;

  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking',
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        category: 'residential',
        htmlContent,
      }),
    });
  } catch (err) {
    console.error('Booking email failed silently:', err);
  }
};
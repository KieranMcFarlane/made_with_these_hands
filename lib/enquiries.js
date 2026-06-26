import { Resend } from 'resend';

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function hasResendConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL);
}

export function validateEnquiry(payload) {
  const errors = {};
  const name = String(payload?.name || '').trim();
  const email = String(payload?.email || '').trim();
  const message = String(payload?.message || '').trim();
  const productName = String(payload?.productName || '').trim();

  if (!name) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'A valid email is required';
  if (!message) errors.message = 'Message is required';
  if (!productName) errors.productName = 'Product is required';

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export async function sendProductEnquiry(payload) {
  if (!hasResendConfig()) {
    throw new Error('Resend enquiry email is not configured');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const productName = String(payload.productName || '').trim();
  const makerName = String(payload.makerName || '').trim();
  const productPrice = String(payload.productPrice || '').trim();
  const productUrl = String(payload.productUrl || '').trim();
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const phone = String(payload.phone || '').trim();
  const message = String(payload.message || '').trim();

  const subject = `Product enquiry: ${productName}`;
  const text = [
    `Product: ${productName}`,
    makerName && `Maker: ${makerName}`,
    productPrice && `Price shown: ${productPrice}`,
    productUrl && `Page: ${productUrl}`,
    '',
    `From: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    '',
    'Message:',
    message,
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family: Georgia, serif; color: #201c18; line-height: 1.55;">
      <p style="font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8a5b35;">Made With These Hands enquiry</p>
      <h1 style="font-size: 24px; font-weight: 400; margin: 0 0 18px;">${escapeHtml(productName)}</h1>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 620px;">
        ${[
          ['Maker', makerName],
          ['Price shown', productPrice],
          ['Page', productUrl],
          ['Name', name],
          ['Email', email],
          ['Phone', phone],
        ].filter(([, value]) => value).map(([label, value]) => `
          <tr>
            <td style="border-top: 1px solid #ddd6ca; padding: 10px 18px 10px 0; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #6c6257;">${escapeHtml(label)}</td>
            <td style="border-top: 1px solid #ddd6ca; padding: 10px 0;">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      <h2 style="font-size: 18px; font-weight: 400; margin: 28px 0 8px;">Message</h2>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL,
    to: [process.env.ENQUIRY_TO_EMAIL],
    replyTo: email,
    subject,
    text,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Resend failed to send enquiry');
  }

  return result.data;
}

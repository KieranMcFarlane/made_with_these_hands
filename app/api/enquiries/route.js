import { NextResponse } from 'next/server';

import { createProductEnquiry } from '../../../lib/directus';
import { hasResendConfig, sendProductEnquiry, validateEnquiry } from '../../../lib/enquiries';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = validateEnquiry(payload);
  if (!validation.isValid) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    const enquiry = await createProductEnquiry(payload).catch((error) => {
      console.error('Failed to save product enquiry in Directus', error);
      return null;
    });

    if (!hasResendConfig()) {
      return NextResponse.json({ ok: true, emailSent: false, enquiryId: enquiry?.id || null });
    }

    const data = await sendProductEnquiry(payload);
    return NextResponse.json({ ok: true, emailSent: true, id: data?.id || null, enquiryId: enquiry?.id || null });
  } catch (error) {
    console.error('Failed to send product enquiry', error);
    return NextResponse.json({ ok: false, error: 'Failed to send enquiry' }, { status: 502 });
  }
}

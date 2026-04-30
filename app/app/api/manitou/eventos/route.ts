import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    const authBody = new URLSearchParams();
    authBody.append('grant_type', 'manitou_contact');
    authBody.append('username', username || '');
    authBody.append('password', password || '');
    authBody.append('context_serial_number', '1');
    authBody.append('context_contact_type', '0');

    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: authBody,
      cache: 'no-store'
    });

    const authData = await authRes.json();
    const token = authData.access_token;

    if (!token) {
      return NextResponse.json({ success: false, error: "No token" }, { status: 401 });
    }

    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Top: 10, IncludeAudits: false })
    });

    const eventData = await activityRes.json();

    return NextResponse.json({
      success: true,
      data: Array.isArray(eventData) ? eventData : []
    });

  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

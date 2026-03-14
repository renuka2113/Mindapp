import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/models/user'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Call the SQLite model
    const result = verifyUser(email, password);

    if (result.success) {
      // You can return the user object (without the password hash) to store in local storage if needed
      return NextResponse.json({ message: 'Login successful', user: result.user }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
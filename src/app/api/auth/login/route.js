import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/models/user'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const result = verifyUser(email, password);

    if (result.success) {
      return NextResponse.json({ 
        message: 'Login successful', 
        user: result.user,
        role: result.user.role 
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
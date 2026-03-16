import { NextResponse } from 'next/server';
import { createUser } from '@/lib/models/user';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role, collegeName } = body;

    // Validate required fields (collegeName is now required for everyone)
    if (!fullName || !email || !password || !role || !collegeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Pass the new fields to the model
    const result = createUser(fullName, email, password, role, collegeName);

    if (result.success) {
      return NextResponse.json({ 
        message: 'User created successfully', 
        userId: result.userId,
        role: role // Send back role so frontend can redirect immediately
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
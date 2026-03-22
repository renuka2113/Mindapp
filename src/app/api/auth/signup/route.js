import { NextResponse } from 'next/server';
import { createUser } from '@/lib/models/user';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role, collegeName, branch, year } = body;

    
    if (!fullName || !email || !password || !role || !collegeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    
    const result = createUser(fullName, email, password, role, collegeName, branch, year);

    if (result.success) {
      return NextResponse.json({ 
        message: 'User created successfully', 
        userId: result.userId,
        role: role 
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/models/user'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    
    const result = createUser(fullName, email, password);

    if (result.success) {
      return NextResponse.json({ message: 'User created successfully', userId: result.userId }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
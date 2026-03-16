import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const adminId = searchParams.get('adminId');

  if (!adminId) {
    return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
  }

  try {
    // 1. Find the admin's college name
    const admin = db.prepare("SELECT college_name FROM users WHERE id = ? AND role = 'admin'").get(adminId);

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin record not found' }, { status: 403 });
    }

    // 2. Fetch all students from the same college
    // We join with the latest check-in to see their current risk status
    const students = db.prepare(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email,
        u.current_streak, 
        u.wellness_score,
        (SELECT risk_score FROM checkins WHERE user_id = u.id ORDER BY date DESC LIMIT 1) as latest_risk,
        (SELECT date FROM checkins WHERE user_id = u.id ORDER BY date DESC LIMIT 1) as last_checkin
      FROM users u
      WHERE u.college_name = ? AND u.role = 'student'
      ORDER BY latest_risk DESC -- High risk students at the top
    `).all(admin.college_name);

    return NextResponse.json({ 
      college: admin.college_name,
      students: students 
    });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
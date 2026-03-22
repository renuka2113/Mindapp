import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    
    const latestCheckin = db.prepare(`
      SELECT 
        ai_status as status, 
        ai_code as code, 
        ai_trigger as trigger, 
        ai_shap_json,
        date(date) as checkin_date
      FROM checkins 
      WHERE user_id = ? AND ai_status IS NOT NULL
      ORDER BY date DESC 
      LIMIT 1
    `).get(userId);

    if (!latestCheckin) {
      return NextResponse.json({ hasData: false });
    }

    
    const shap_scores = JSON.parse(latestCheckin.ai_shap_json || '{}');

    
    const tasks = db.prepare(`
      SELECT id, task_title as task, task_detail as detail, is_completed 
      FROM daily_tasks 
      WHERE user_id = ? AND date = ?
    `).all(userId, latestCheckin.checkin_date);

    
    const aiOutput = {
      status: latestCheckin.status,
      code: latestCheckin.code,
      trigger: latestCheckin.trigger,
      shap_scores: shap_scores,
      plan: tasks 
    };

    return NextResponse.json({ hasData: true, aiOutput });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
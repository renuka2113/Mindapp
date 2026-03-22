import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    
    const latestCheckin = db
      .prepare(
        `
      SELECT ai_code as code, risk_score 
      FROM checkins 
      WHERE user_id = ? AND ai_status IS NOT NULL
      ORDER BY date DESC 
      LIMIT 1
    `,
      )
      .get(userId);

    
    const tasks = db
      .prepare(
        `
      SELECT id, task_title, task_detail, category, priority, is_completed 
      FROM daily_tasks 
      WHERE user_id = ? AND date = date('now', 'localtime')
    `,
      )
      .all(userId);

    return NextResponse.json({
      hasData: tasks.length > 0,
      riskScore: latestCheckin?.risk_score || 0,
      code: latestCheckin?.code || 0,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.task_title,
        desc: t.task_detail,
        category: t.category,
        priority: t.priority,
        completed: Boolean(t.is_completed),
      })),
    });
  } catch (error) {
    console.error('Plan API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}


export async function PATCH(request) {
  try {
    const { taskId, completed } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE daily_tasks 
      SET is_completed = ? 
      WHERE id = ?
    `);

    
    stmt.run(completed ? 1 : 0, taskId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Plan Toggle Error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  // Extract the userId from the URL query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Query SQLite to see if a check-in exists for this user TODAY
    // date('now', 'localtime') ensures it matches the user's current local day
    const todayCheckin = db
      .prepare(
        `
      SELECT * FROM checkins 
      WHERE user_id = ? AND date(date) = date('now', 'localtime')
    `,
      )
      .get(userId);

    if (todayCheckin) {
      // If found, return true and send back the existing data to pre-fill the UI sliders
      return NextResponse.json({ hasSubmitted: true, data: todayCheckin });
    }

    // If no row is found for today, return false
    return NextResponse.json({ hasSubmitted: false });
  } catch (error) {
    console.error('GET Check-in Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, ...inputs } = data;

    const avgData = db
      .prepare(
        `
      SELECT 
        AVG(leisure_score) as leisure,
        AVG(me_score) as me,
        AVG(phone_score) as phone,
        AVG(sleep_score) as sleep,
        AVG(social_score) as social
      FROM (
        SELECT leisure_score, me_score, phone_score, sleep_score, social_score 
        FROM checkins 
        WHERE user_id = ? 
        ORDER BY rowid DESC 
        LIMIT 15
      )
    `,
      )
      .get(userId);

    const history_avg = {
      leisure_score: avgData?.leisure ?? 5,
      me_score: avgData?.me ?? 5,
      phone_score: avgData?.phone ?? 5,
      sleep_score: avgData?.sleep ?? 5,
      social_score: avgData?.social ?? 5,
    };

    const sleep_score =
      (((Number(inputs.sleepDuration) || 0) / 8) * 0.7 +
        ((Number(inputs.sleepQuality) || 0) / 5) * 0.3) *
      10;
    const leisure_score =
      (Number(inputs.physicalActivity) || 0) * 2 +
      (10 - (Number(inputs.stressLevel) || 0));
    const phone_score = Math.max(
      0,
      10 - (Number(inputs.socialMedia) || 0) / 1.5,
    );
    const social_score = (Number(inputs.socialInteraction) || 0) * 2;
    const me_score =
      ((Number(inputs.moodLevel) || 0) +
        (10 - (Number(inputs.anxietyLevel) || 0))) /
      2;

    const mlPayload = {
      current: {
        leisure_score,
        me_score,
        phone_score,
        sleep_score,
        social_score,
      },
      history_avg,
    };

    // 1. Call Flask Backend First
    const flaskResponse = await fetch('http://localhost:5000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mlPayload),
    });

    const mlResult = await flaskResponse.json();

    // Calculate the final risk score using the logic from your MyPlanPage
    const baseValues = { 0: 15, 1: 42, 2: 68, 3: 92 };
    const base = baseValues[mlResult.code] || 0;
    const intensity = mlResult.shap_scores
      ? mlResult.shap_scores[mlResult.trigger] || 0
      : 0;
    const finalRiskScore = Math.min(Math.round(base + intensity * 5), 100);

    const shapJson = JSON.stringify(mlResult.shap_scores || {});
    // 2. Check if an entry already exists for today
    const existing = db
      .prepare(
        `
      SELECT id FROM checkins WHERE user_id = ? AND date(date) = date('now', 'localtime')
    `,
      )
      .get(userId);

    if (existing) {
      db.prepare(
        `
        UPDATE checkins SET 
          sleep_duration=?, sleep_quality=?, study_hours=?, academic_workload=?, physical_activity=?, 
          social_interaction=?, social_media=?, mood_level=?, stress_level=?, anxiety_level=?,
          sleep_score=?, leisure_score=?, phone_score=?, social_score=?, me_score=?, 
          risk_score=?, ai_status=?, ai_code=?, ai_trigger=?, ai_shap_json=?
        WHERE id = ?
      `,
      ).run(
        inputs.sleepDuration,
        inputs.sleepQuality,
        inputs.studyHours,
        inputs.academicWorkload,
        inputs.physicalActivity,
        inputs.socialInteraction,
        inputs.socialMedia,
        inputs.moodLevel,
        inputs.stressLevel,
        inputs.anxietyLevel,
        sleep_score,
        leisure_score,
        phone_score,
        social_score,
        me_score,
        finalRiskScore,
        mlResult.status,
        mlResult.code,
        mlResult.trigger,
        shapJson,
        existing.id,
      );
    } else {
      db.prepare(
        `
        INSERT INTO checkins (
            user_id, sleep_duration, sleep_quality, study_hours, academic_workload,
            physical_activity, social_interaction, social_media, mood_level,
            stress_level, anxiety_level, sleep_score, leisure_score, phone_score,
            social_score, me_score, risk_score, ai_status, ai_code, ai_trigger, ai_shap_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
        userId,
        inputs.sleepDuration,
        inputs.sleepQuality,
        inputs.studyHours,
        inputs.academicWorkload,
        inputs.physicalActivity,
        inputs.socialInteraction,
        inputs.socialMedia,
        inputs.moodLevel,
        inputs.stressLevel,
        inputs.anxietyLevel,
        sleep_score,
        leisure_score,
        phone_score,
        social_score,
        me_score,
        finalRiskScore,
        mlResult.status,
        mlResult.code,
        mlResult.trigger,
        shapJson,
      );
    }

    // 2. UPSERT DAILY TASKS
    // First, delete any existing tasks for today (so if they re-submit, we generate a fresh plan)
    db.prepare(
      `DELETE FROM daily_tasks WHERE user_id = ? AND date = date('now', 'localtime')`,
    ).run(userId);

    if (mlResult.plan && Array.isArray(mlResult.plan)) {
      const insertTask = db.prepare(`
        INSERT INTO daily_tasks (user_id, task_title, task_detail, category, priority, is_completed)
        VALUES (?, ?, ?, ?, ?, 0)
      `);
      mlResult.plan.forEach((task) => {
        // Now saving category and priority!
        insertTask.run(
          userId,
          task.task,
          task.detail,
          task.category || 'Wellness',
          task.priority || 'Medium',
        );
      });
    }
    try {
      // Get all check-in dates for this user to calculate the streak
      const checkins = db
        .prepare(
          `
    SELECT date(date) as checkin_date 
    FROM checkins 
    WHERE user_id = ? 
    ORDER BY date DESC
  `,
        )
        .all(userId);

      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const checkinDates = checkins.map((c) => c.checkin_date);

      // Simple Streak Calculation
      for (let i = 0; i < checkinDates.length; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        if (checkinDates.includes(dateStr)) {
          streak++;
        } else {
          break;
        }
      }

      // Update the users table
      // We'll increment the wellness_score by 10 for every check-in
      db.prepare(
        `
    UPDATE users 
    SET current_streak = ?, 
        wellness_score = wellness_score + 10 
    WHERE id = ?
  `,
      ).run(streak, userId);
    } catch (streakError) {
      console.error('Failed to update user streak stats:', streakError);
      // We don't want to fail the whole check-in if just the streak update fails
    }
    return NextResponse.json({ success: true, ml: mlResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 },
    );
  }
}

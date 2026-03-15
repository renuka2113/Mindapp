import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, ...inputs } = data;
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
    const stmt = db.prepare(`
        INSERT INTO checkins (
            user_id, sleep_duration, sleep_quality, study_hours, academic_workload,
            physical_activity, social_interaction, social_media, mood_level,
            stress_level, anxiety_level, sleep_score, leisure_score, phone_score,
            social_score, me_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

    stmt.run(
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
    );
    const mlPayload = {
      current: {
        leisure_score,
        me_score,
        phone_score,
        sleep_score,
        social_score,
      },
      history_avg: {
        leisure_score: 5,
        me_score: 5,
        phone_score: 5,
        sleep_score: 5,
        social_score: 5,
      },
    };
    const flaskResponse = await fetch('http://localhost:5000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mlPayload),
    });

    const mlResult = await flaskResponse.json();
    console.log(mlResult)
    return NextResponse.json({ success: true, ml: mlResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 },
    );
  }
}

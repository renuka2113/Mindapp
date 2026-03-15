import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // 1. Get history for the chart (Formatting the date as 'Mar 14')
    const rawHistory = db.prepare(`
      SELECT 
        strftime('%b %d', date) as date_str, 
        risk_score as score 
      FROM checkins 
      WHERE user_id = ? 
      ORDER BY date ASC 
      LIMIT 15
    `).all(userId);

    // Filter out any check-ins where risk_score might be null
    const history = rawHistory.filter(h => h.score !== null).map(h => ({
      date: h.date_str,
      score: h.score
    }));

    // 2. Get Baseline (The very first check-in)
    const baseline = db.prepare(`
      SELECT sleep_duration, mood_level, stress_level, anxiety_level, physical_activity, social_media
      FROM checkins WHERE user_id = ? ORDER BY date ASC LIMIT 1
    `).get(userId);

    // 3. Get Current (Average of the last 3 check-ins)
    const currentAvg = db.prepare(`
      SELECT 
        AVG(sleep_duration) as sleep, 
        AVG(mood_level) as mood, 
        AVG(stress_level) as stress, 
        AVG(anxiety_level) as anxiety, 
        AVG(physical_activity) as activity, 
        AVG(social_media) as social
      FROM (SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC LIMIT 3)
    `).get(userId);

    // If no data exists yet
    if (!baseline || history.length === 0) {
      return NextResponse.json({ history: [] });
    }

    // 4. Calculate Stats
    const initialScore = history[0]?.score || 0;
    const currentScore = history[history.length - 1]?.score || 0;
    
    // Improvement percentage
    let improvement = 0;
    if (initialScore > 0) {
      improvement = Math.round(((initialScore - currentScore) / initialScore) * 100);
    }

    // 7-day average (or less if they haven't done 7 days)
    const recentScores = history.slice(-7);
    const avg7Day = Math.round(recentScores.reduce((sum, curr) => sum + curr.score, 0) / recentScores.length);

    // 5. Structure Behavioral Comparison Data
    const behavioral = [
      { 
        label: 'Sleep Duration', 
        oldVal: `${baseline.sleep_duration?.toFixed(1)}h`, 
        newVal: `${currentAvg.sleep?.toFixed(1)}h`, 
        trend: currentAvg.sleep >= baseline.sleep_duration ? 'Improved' : 'Declined',
        isPositive: currentAvg.sleep >= baseline.sleep_duration 
      },
      { 
        label: 'Mood Level', 
        oldVal: `${baseline.mood_level}/10`, 
        newVal: `${currentAvg.mood?.toFixed(1)}/10`, 
        trend: currentAvg.mood >= baseline.mood_level ? 'Improved' : 'Declined',
        isPositive: currentAvg.mood >= baseline.mood_level 
      },
      { 
        label: 'Stress Level', 
        oldVal: `${baseline.stress_level}/10`, 
        newVal: `${currentAvg.stress?.toFixed(1)}/10`, 
        trend: currentAvg.stress <= baseline.stress_level ? 'Improved' : 'Declined',
        isPositive: currentAvg.stress <= baseline.stress_level 
      },
      { 
        label: 'Anxiety Level', 
        oldVal: `${baseline.anxiety_level}/10`, 
        newVal: `${currentAvg.anxiety?.toFixed(1)}/10`, 
        trend: currentAvg.anxiety <= baseline.anxiety_level ? 'Improved' : 'Declined',
        isPositive: currentAvg.anxiety <= baseline.anxiety_level 
      },
      { 
        label: 'Physical Activity', 
        oldVal: `${baseline.physical_activity?.toFixed(1)}h`, 
        newVal: `${currentAvg.activity?.toFixed(1)}h`, 
        trend: currentAvg.activity >= baseline.physical_activity ? 'Improved' : 'Declined',
        isPositive: currentAvg.activity >= baseline.physical_activity 
      },
      { 
        label: 'Social Media', 
        oldVal: `${baseline.social_media?.toFixed(1)}h`, 
        newVal: `${currentAvg.social?.toFixed(1)}h`, 
        trend: currentAvg.social <= baseline.social_media ? 'Improved' : 'Declined',
        isPositive: currentAvg.social <= baseline.social_media 
      },
    ];

    return NextResponse.json({ history, stats: { initialScore, currentScore, improvement, avg7Day }, behavioral });

  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
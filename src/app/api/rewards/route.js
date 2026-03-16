import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // 1. Fetch recent check-ins (last 30 days is enough for badges/streaks)
    const checkins = db.prepare(`
      SELECT date(date) as checkin_date, sleep_duration, physical_activity, stress_level 
      FROM checkins 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 30
    `).all(userId);

    // 2. Calculate Streak
    let currentStreak = 0;
    const today = new Date();
    // Normalize dates to check for consecutive days
    const checkinDates = checkins.map(c => c.checkin_date);
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      if (checkinDates.includes(dateString)) {
        currentStreak++;
      } else if (i === 0) {
        // If they missed today, streak isn't broken yet (they have until midnight)
        continue;
      } else {
        // Broken streak
        break;
      }
    }

    // 3. Calculate Wellness Score & Level
    // Simple formula: 15 points per check-in + bonus for current streak
    const totalCheckins = db.prepare('SELECT COUNT(*) as count FROM checkins WHERE user_id = ?').get(userId).count;
    const rawScore = (totalCheckins * 15) + (currentStreak * 10);
    
    // Level up every 100 points
    const level = Math.floor(rawScore / 100) + 1;
    const wellnessScore = rawScore % 100; // Progress towards next level (0-99)
    const pointsToNextLevel = 100 - wellnessScore;

    // 4. Weekly Tracker (Mon-Sun)
    const weekTracker = [];
    const currentDay = today.getDay() || 7; // Make Sunday 7 instead of 0
    const monday = new Date(today);
    monday.setDate(monday.getDate() - currentDay + 1);

    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      
      weekTracker.push({
        day: dayNames[i],
        completed: checkinDates.includes(dateString),
        isFuture: d > today
      });
    }

    // 5. Badge Progress Logic
    // Badge 1: Consistency Star (10 days streak)
    const consistencyProgress = Math.min(currentStreak, 10);
    
    // Badge 2: Sleep Champion (7+ hours for 5 consecutive days)
    let sleepProgress = 0;
    for (let i = 0; i < Math.min(5, checkins.length); i++) {
      if (checkins[i].sleep_duration >= 7) sleepProgress++;
      else break; 
    }

    // Badge 3: Fitness Starter (30+ mins / 0.5h activity 3 times in last 7 days)
    const last7Days = checkins.slice(0, 7);
    const fitnessProgress = Math.min(last7Days.filter(c => c.physical_activity >= 0.5).length, 3);

    // Badge 4: Zen Master (Low stress <= 5 for 7 days)
    const zenProgress = Math.min(last7Days.filter(c => c.stress_level <= 5).length, 7);

    const badgesData = [
      { id: 1, progress: consistencyProgress, target: 10, unlocked: consistencyProgress >= 10 },
      { id: 2, progress: sleepProgress, target: 5, unlocked: sleepProgress >= 5 },
      { id: 3, progress: fitnessProgress, target: 3, unlocked: fitnessProgress >= 3 },
      { id: 4, progress: zenProgress, target: 7, unlocked: zenProgress >= 7 },
    ];

    return NextResponse.json({
      currentStreak,
      wellnessScore,
      level,
      pointsToNextLevel,
      weekTracker,
      badgesData
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
'use client';

import React from 'react';
import { 
  Trophy, Flame, Check, Star, Moon, Activity, Wind, Lock, Info 
} from 'lucide-react';

export default function RewardsPage() {
  
  const currentStreak = 15;
  const wellnessScore = 72;
  
  
  const weekTracker = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false }, 
    { day: 'S', completed: false }, 
  ];

  
  const badges = [
    {
      id: 1,
      title: 'Consistency Star',
      description: 'Completed 10 daily check-ins in a row.',
      icon: Star,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-100',
      unlocked: true,
      progress: 10,
      target: 10,
    },
    {
      id: 2,
      title: 'Sleep Champion',
      description: 'Maintained 7+ hours of sleep for 5 consecutive days.',
      icon: Moon,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      unlocked: true,
      progress: 5,
      target: 5,
    },
    {
      id: 3,
      title: 'Fitness Starter',
      description: 'Log 30+ mins of physical activity 3 days a week.',
      icon: Activity,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-100',
      unlocked: false,
      progress: 1,
      target: 3,
    },
    {
      id: 4,
      title: 'Zen Master',
      description: 'Complete all breathing exercises in your plan for a week.',
      icon: Wind,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-100',
      unlocked: false,
      progress: 4,
      target: 7,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 pb-8">
      
      {/* 1. HEADER AREA */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700">
            <Trophy size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Achievements & Rewards</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Track your consistency and unlock milestones</p>
          </div>
        </div>
      </div>

      {/* 2. TOP HERO ROW: STREAK & SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Streak Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">Check-In Streak</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Keep the momentum going!</p>
            </div>
            <div className="bg-orange-50 p-2 rounded-xl">
              <Flame size={28} className="text-orange-500 fill-orange-500" />
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-4xl sm:text-5xl font-black text-slate-800">{currentStreak}</span>
            <span className="text-sm sm:text-base font-bold text-slate-400 ml-2">Days</span>
          </div>

          {/* 7-Day Visual Tracker */}
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
            {weekTracker.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{day.day}</span>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  day.completed 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm' 
                    : 'bg-white border-slate-200 text-transparent'
                }`}>
                  {day.completed && <Check size={14} strokeWidth={4} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Wellness Score Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">Wellness Score</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Earn points by following your plan</p>
            </div>
            <div className="bg-teal-50 p-2 rounded-xl text-teal-700 font-black text-sm">
              Level 4
            </div>
          </div>

          <div className="text-center mb-6 mt-4">
            <span className="text-5xl sm:text-6xl font-black text-teal-700">{wellnessScore}</span>
            <span className="text-sm font-bold text-slate-400"> / 100</span>
          </div>

          <div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
              <div 
                className="bg-teal-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${wellnessScore}%` }}
              ></div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium text-center">
              28 points to reach Level 5
            </p>
          </div>
        </div>

      </div>

      {/* 3. ACHIEVEMENT BADGES GALLERY */}
      <div>
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-3 px-1">Badges & Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {badges.map((badge) => {
            const Icon = badge.icon;
            const isUnlocked = badge.unlocked;
            const progressPct = Math.round((badge.progress / badge.target) * 100);

            return (
              <div 
                key={badge.id} 
                className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-white border-slate-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 opacity-80 grayscale-[0.5]'
                }`}
              >
                {/* Badge Icon */}
                <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-inner ${
                  isUnlocked ? badge.bgColor : 'bg-slate-200'
                }`}>
                  <Icon size={28} className={isUnlocked ? badge.iconColor : 'text-slate-400'} />
                </div>

                {/* Badge Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm sm:text-base font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                      {badge.title}
                    </h3>
                    {!isUnlocked && <Lock size={14} className="text-slate-400" />}
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 mb-3 leading-relaxed">
                    {badge.description}
                  </p>

                  {/* Progress Bar for Locked Badges */}
                  {!isUnlocked ? (
                    <div>
                      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress} / {badge.target} days</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-slate-400 h-1.5 rounded-full transition-all" 
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg w-max">
                      <Check size={12} strokeWidth={3} /> Unlocked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RULE TRIGGERS FOOTER */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 sm:p-5 flex gap-3 items-start shadow-sm mt-2">
        <Info className="text-teal-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-teal-900">How to earn rewards</h3>
          <p className="text-[10px] sm:text-xs text-teal-700 mt-1 leading-relaxed">
            These gamification elements are driven by simple rule triggers based on your daily data. Keep completing your daily check-ins and adhering to your wellness plan to unlock new milestones and boost your wellness score!
          </p>
        </div>
      </div>

    </div>
  );
}
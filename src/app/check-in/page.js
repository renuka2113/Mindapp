'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Brain, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CustomSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  leftLabel,
  rightLabel,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className='mb-6 last:mb-0'>
      <div className='flex justify-between items-end mb-3'>
        <label className='text-sm font-bold text-slate-800'>{label}</label>
        <span className='text-sm font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100'>
          {formatValue(value)}
        </span>
      </div>

      <div className='relative w-full flex items-center h-4'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className='w-full h-1.5 appearance-none rounded-full cursor-pointer outline-none z-10 bg-transparent
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-[3px] 
            [&::-webkit-slider-thumb]:border-teal-700 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:mt-[-5px]
            [&::-moz-range-thumb]:w-4 
            [&::-moz-range-thumb]:h-4 
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-[3px] 
            [&::-moz-range-thumb]:border-teal-700 
            [&::-moz-range-thumb]:rounded-full'
          style={{
            background: `linear-gradient(to right, #0f766e ${percentage}%, #e2e8f0 ${percentage}%)`,
          }}
        />
      </div>

      <div className='flex justify-between mt-2 text-[10px] sm:text-xs font-medium text-slate-400'>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default function CheckInPage() {
  const router = useRouter();

  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [sleepDuration, setSleepDuration] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(4);

  const [studyHours, setStudyHours] = useState(4);
  const [academicWorkload, setAcademicWorkload] = useState(3);

  const [physicalActivity, setPhysicalActivity] = useState(1);
  const [socialInteraction, setSocialInteraction] = useState(2);
  const [socialMedia, setSocialMedia] = useState(2);

  const [moodLevel, setMoodLevel] = useState(6);
  const [stressLevel, setStressLevel] = useState(4);
  const [anxietyLevel, setAnxietyLevel] = useState(4);

  const formatHours = (val) =>
    `${val}h${val === 12 || val === 5 || val === 10 ? '+' : ''}`;
  const formatQuality = (val) =>
    ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][val - 1];
  const formatWorkload = (val) =>
    ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'][val - 1];
  const formatSocial = (val) =>
    ['Isolated', 'Low', 'Moderate', 'Active', 'Very Social'][val - 1];
  const formatOutof10 = (val) => `${val}/10`;

  useEffect(() => {
    const checkTodayStatus = async () => {
      const userId = localStorage.getItem('userId') || 1;
      try {
        const res = await fetch(`/api/check-in?userId=${userId}`);
        const result = await res.json();

        if (result.hasSubmitted && result.data) {
          setHasSubmittedToday(true);
          // Pre-fill sliders with what they submitted earlier today
          setSleepDuration(result.data.sleep_duration);
          setSleepQuality(result.data.sleep_quality);
          setStudyHours(result.data.study_hours);
          setAcademicWorkload(result.data.academic_workload);
          setPhysicalActivity(result.data.physical_activity);
          setSocialInteraction(result.data.social_interaction);
          setSocialMedia(result.data.social_media);
          setMoodLevel(result.data.mood_level);
          setStressLevel(result.data.stress_level);
          setAnxietyLevel(result.data.anxiety_level);
        }
      } catch (err) {
        console.error('Failed to fetch status', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkTodayStatus();
  }, []);

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');

    const payload = {
      userId,
      sleepDuration,
      sleepQuality,
      studyHours,
      academicWorkload,
      physicalActivity,
      socialInteraction,
      socialMedia,
      moodLevel,
      stressLevel,
      anxietyLevel,
    };

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      localStorage.setItem('latest_analysis', JSON.stringify(result.ml));
      if (result.success) {
        // alert("Check-in complete! View your updated plan.");
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Submission failed', err);
    }
  };
  return (
    <div className='max-w-2xl mx-auto space-y-6 pb-8'>
      {/* 1. HEADER AREA */}
      <div className='flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <div className='bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700'>
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-slate-900'>
              Daily Check-In
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 font-medium'>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        {hasSubmittedToday ? (
          <div className='bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-teal-100'>
            <span>✓</span>{' '}
            <span className='hidden sm:inline'>Submitted today</span>
          </div>
        ) : (
          <div className='bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-orange-100'>
            <AlertCircle size={14} />{' '}
            <span className='hidden sm:inline'>Pending today</span>
          </div>
        )}
      </div>

      {/* 2. SLEEP CATEGORY */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <h2 className='text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6'>
          Sleep
        </h2>
        <CustomSlider
          label='Sleep Duration'
          value={sleepDuration}
          onChange={setSleepDuration}
          min={0}
          max={12}
          step={0.5}
          formatValue={formatHours}
          leftLabel='0h'
          rightLabel='12h'
        />
        <CustomSlider
          label='Sleep Quality'
          value={sleepQuality}
          onChange={setSleepQuality}
          min={1}
          max={5}
          step={1}
          formatValue={formatQuality}
          leftLabel='Poor'
          rightLabel='Excellent'
        />
      </div>

      {/* 3. ACADEMICS CATEGORY */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <h2 className='text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6'>
          Academics
        </h2>
        <CustomSlider
          label='Study Hours Today'
          value={studyHours}
          onChange={setStudyHours}
          min={0}
          max={10}
          step={0.5}
          formatValue={formatHours}
          leftLabel='0h'
          rightLabel='10h'
        />
        <CustomSlider
          label='Academic Workload'
          value={academicWorkload}
          onChange={setAcademicWorkload}
          min={1}
          max={5}
          step={1}
          formatValue={formatWorkload}
          leftLabel='Very Light'
          rightLabel='Very Heavy'
        />
      </div>

      {/* 4. ACTIVITY & SOCIAL CATEGORY */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <h2 className='text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6'>
          Activity & Social
        </h2>
        <CustomSlider
          label='Physical Activity'
          value={physicalActivity}
          onChange={setPhysicalActivity}
          min={0}
          max={5}
          step={0.5}
          formatValue={formatHours}
          leftLabel='None'
          rightLabel='5h+'
        />
        <CustomSlider
          label='Social Interaction Time'
          value={socialInteraction}
          onChange={setSocialInteraction}
          min={1}
          max={5}
          step={1}
          formatValue={formatSocial}
          leftLabel='Isolated'
          rightLabel='Very Social'
        />
        <CustomSlider
          label='Social Media Usage'
          value={socialMedia}
          onChange={setSocialMedia}
          min={0}
          max={12}
          step={0.5}
          formatValue={formatHours}
          leftLabel='0h'
          rightLabel='12h+'
        />
      </div>

      {/* 5. MENTAL STATE CATEGORY */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <h2 className='text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6'>
          Mental State
        </h2>
        <CustomSlider
          label='Mood Level'
          value={moodLevel}
          onChange={setMoodLevel}
          min={1}
          max={10}
          step={1}
          formatValue={formatOutof10}
          leftLabel='Very Low'
          rightLabel='Excellent'
        />
        <CustomSlider
          label='Stress Level'
          value={stressLevel}
          onChange={setStressLevel}
          min={1}
          max={10}
          step={1}
          formatValue={formatOutof10}
          leftLabel='Calm'
          rightLabel='Very Stressed'
        />
        <CustomSlider
          label='Anxiety Level'
          value={anxietyLevel}
          onChange={setAnxietyLevel}
          min={1}
          max={10}
          step={1}
          formatValue={formatOutof10}
          leftLabel='Relaxed'
          rightLabel='High Anxiety'
        />
      </div>

      {/* 6. AI DISCLAIMER & SUBMISSION */}
      <div className='bg-teal-50 border border-teal-100 rounded-2xl p-4 sm:p-5 flex gap-3 items-start shadow-sm'>
        <Brain className='text-teal-600 shrink-0 mt-0.5' size={20} />
        <div>
          <h3 className='text-xs sm:text-sm font-bold text-teal-900'>
            AI Processing
          </h3>
          <p className='text-[10px] sm:text-xs text-teal-700 mt-1 sm:mt-1.5 leading-relaxed'>
            Your responses are analyzed by our Deep Neural Network (DNN) for
            immediate risk classification, and Temporal Fusion Transformer (TFT)
            for future forecasting with SHAP explainability.
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className='w-full bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm sm:text-base py-4 rounded-xl transition-colors shadow-md active:scale-[0.99]'
      >
        {hasSubmittedToday
          ? 'Update Check-In & Re-Analyze'
          : 'Submit Check-In & Analyze'}
      </button>
    </div>
  );
}

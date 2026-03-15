'use client';

import React, { useState, useEffect } from 'react';
import { Info, Activity, TrendingDown, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function DashboardPage() {
  const [aiOutput, setAiOutput] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedData = localStorage.getItem("latest_analysis");
    if (savedData) {
      setAiOutput(JSON.parse(savedData));
    }
  }, []);

  if (!mounted || !aiOutput) {
    return (
      <div className="p-20 text-center font-bold">
        Loading Analysis...
      </div>
    );
  }


  // 1. DYNAMIC COLOR CONFIG
  const statusConfig = {
    Normal: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      stroke: '#16a34a',
    },
    Mild: {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      stroke: '#ea580c',
    },
    Moderate: {
      text: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      stroke: '#ef4444',
    },
    Severe: {
      text: 'text-red-700',
      bg: 'bg-red-100',
      border: 'border-red-300',
      stroke: '#b91c1c',
    },
  };
  const theme = statusConfig[aiOutput.status] || statusConfig['Normal'];

  const behavioralData = Object.entries(aiOutput.shap_scores)
    .filter(([key]) => !key.includes('_diff')) 
    .map(([key, value]) => ({
      name: key.replace('_score', '').toUpperCase(),
      value: Math.abs(Math.round(value * 100)),
    }))
    .slice(0, 5);

  const forecast7Day = [
    { day: 'D1', risk: 47 },
    { day: 'D2', risk: 44 },
    { day: 'D3', risk: 42 },
    { day: 'D4', risk: 38 },
    { day: 'D5', risk: 35 },
    { day: 'D6', risk: 32 },
    { day: 'D7', risk: 30 },
  ];

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* 1. DYNAMIC STATUS ALERT */}
      <div
        className={`${theme.bg} ${theme.border} border rounded-2xl p-4 sm:p-6 shadow-sm`}
      >
        <div className='flex items-center gap-2 mb-3 sm:mb-4'>
          <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-tight'>
            Personalized Health Insight
          </h2>
          <Info size={16} className='text-slate-400 hidden sm:block' />
        </div>

        <div className='flex flex-col md:flex-row md:items-stretch justify-between gap-4 sm:gap-6'>
          <div className='md:w-1/2 flex flex-col justify-center'>
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <Activity size={24} />
              <h3 className='text-xl sm:text-2xl font-bold'>
                {aiOutput.status} Level Detected
              </h3>
            </div>
            <p className='text-xs sm:text-sm text-slate-700 leading-relaxed font-medium'>
              The trigger identified is{' '}
              <span className='underline decoration-2'>
                {aiOutput.trigger.replace('_', ' ')}
              </span>
              .{aiOutput.plan[0]?.detail || ' Maintain your healthy routine.'}
            </p>
          </div>

          {/* CURATED DAILY PLAN LIST (Inserted into the right side of alert) */}
          <div className='md:w-1/2 bg-white/60 rounded-xl p-3 sm:p-4 border border-white shadow-inner'>
            <h4 className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2'>
              Your Daily Intervention Plan
            </h4>
            <div className='space-y-2'>
              {aiOutput.plan.map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-start gap-2 text-[11px] sm:text-xs'
                >
                  <CheckCircle2
                    size={14}
                    className='text-teal-700 mt-0.5 shrink-0'
                  />
                  <p>
                    <span className='font-bold text-slate-800'>
                      {item.task}:
                    </span>{' '}
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        {/* 2. DYNAMIC GAUGE ASSESSMENT */}
        <div className='bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-between'>
          <div className='w-full flex justify-between items-center mb-4 sm:mb-6'>
            <h2 className='text-xs sm:text-sm font-bold text-slate-800'>
              Risk Assessment
            </h2>
            <span className='text-[10px] sm:text-xs text-slate-400 font-medium'>
              AI CODE: {aiOutput.code}
            </span>
          </div>

          <div className='relative w-40 sm:w-48 h-20 sm:h-24 overflow-hidden mb-2 sm:mb-4'>
            <svg
              className='absolute top-0 left-0 w-full h-[200%]'
              viewBox='0 0 100 100'
            >
              <path
                d='M 10 50 A 40 40 0 0 1 90 50'
                fill='none'
                stroke='#f1f5f9'
                strokeWidth='12'
                strokeLinecap='round'
              />
            </svg>
            <svg
              className='absolute top-0 left-0 w-full h-[200%]'
              viewBox='0 0 100 100'
            >
              {/* StrokeDashoffset logic based on 0-3 code */}
              <path
                d='M 10 50 A 40 40 0 0 1 90 50'
                fill='none'
                stroke={theme.stroke}
                strokeWidth='12'
                strokeLinecap='round'
                strokeDasharray='125'
                strokeDashoffset={125 - (aiOutput.code + 1) * 31.25}
              />
            </svg>

            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center'>
              <span className={`text-2xl sm:text-3xl font-black ${theme.text}`}>
                {aiOutput.status}
              </span>
            </div>
          </div>

          <div className='w-full flex justify-around border-t border-slate-100 pt-3 sm:pt-4'>
            {behavioralData.slice(0, 3).map((item, idx) => (
              <div key={idx} className='flex flex-col items-center'>
                <span className='text-xs sm:text-sm font-bold text-slate-800'>
                  {item.value}%
                </span>
                <span className='text-[9px] sm:text-[10px] text-slate-500 font-medium mt-1'>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DYNAMIC SHAP PROGRESS BARS */}
        <div className='bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
          <div className='mb-4 sm:mb-6'>
            <h2 className='text-xs sm:text-sm font-bold text-slate-800'>
              SHAP Feature Contributions
            </h2>
            <p className='text-[10px] sm:text-xs text-slate-500 mt-1'>
              Relative weight of each factor in this prediction
            </p>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            {behavioralData.map((feature, idx) => (
              <div key={idx}>
                <div className='flex justify-between text-xs sm:text-sm mb-1 sm:mb-1.5'>
                  <span className='font-medium text-slate-700'>
                    {feature.name}
                  </span>
                  <span className='font-bold text-slate-600'>
                    {feature.value}%
                  </span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-1.5 sm:h-2'>
                  <div
                    className='bg-teal-700 h-1.5 sm:h-2 rounded-full transition-all duration-1000'
                    style={{ width: `${Math.min(feature.value * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BEHAVIORAL FACTOR BAR CHART (Uses behavioralData) */}
      <div className='bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
        <div className='mb-4 sm:mb-6'>
          <h2 className='text-xs sm:text-sm font-bold text-slate-800'>
            Behavioral Factor Analysis
          </h2>
        </div>
        <div className='h-[200px] sm:h-[250px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={behavioralData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#f1f5f9'
              />
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey='value'
                fill='#0f766e'
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. FORECASTING (Keeping UI Structure) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <div className='bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
          <div className='flex items-center gap-1.5 sm:gap-2 mb-1'>
            <TrendingDown size={16} className='text-teal-700' />
            <h2 className='text-xs sm:text-sm font-bold text-slate-800'>
              7-Day Risk Projection
            </h2>
          </div>
          <p className='text-[10px] sm:text-xs text-slate-500 mb-4 sm:mb-6'>
            Simulated trend based on current intervention compliance
          </p>
          <div className='h-[150px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={forecast7Day}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#f1f5f9'
                />
                <XAxis dataKey='day' hide />
                <YAxis domain={[0, 100]} hide />
                <Line
                  type='monotone'
                  dataKey='risk'
                  stroke='#0f766e'
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Placeholder for 30 Day if needed, same structure */}
      </div>
    </div>
  );
}

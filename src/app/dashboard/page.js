'use client';

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Info, Activity, CheckCircle2, LayoutDashboard } from 'lucide-react';
=======
import { Info, Activity, TrendingDown, CheckCircle2 } from 'lucide-react';
>>>>>>> 5d8c49f89cc4f2dd1bcf2a288ab05b7fc50a2b91
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const [aiOutput, setAiOutput] = useState(null);
<<<<<<< HEAD

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('latest_analysis');
      if (savedData) {
        setAiOutput(JSON.parse(savedData));
      }
    }
  }, []);

  if (!aiOutput) {
    return (
      <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
        <LayoutDashboard size={48} className='mb-4 opacity-20' />
        <p className='font-bold'>No analysis found. Please complete a Check-In.</p>
      </div>
    );
  }
=======
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

>>>>>>> 5d8c49f89cc4f2dd1bcf2a288ab05b7fc50a2b91

  // 1. DYNAMIC COLOR CONFIG
  const statusConfig = {
    Normal: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', stroke: '#16a34a' },
    Mild: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', stroke: '#ea580c' },
    Moderate: { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', stroke: '#ef4444' },
    Severe: { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', stroke: '#b91c1c' },
  };
  const theme = statusConfig[aiOutput.status] || statusConfig['Normal'];

<<<<<<< HEAD
  // 2. MAP SHAP DATA FOR CHARTS
  const behavioralData = Object.entries(aiOutput.shap_scores)
    .filter(([key]) => !key.includes('_diff'))
=======
  const behavioralData = Object.entries(aiOutput.shap_scores)
    .filter(([key]) => !key.includes('_diff')) 
>>>>>>> 5d8c49f89cc4f2dd1bcf2a288ab05b7fc50a2b91
    .map(([key, value]) => ({
      name: key.replace('_score', '').toUpperCase(),
      value: Math.abs(Math.round(value * 100)),
    }))
    .slice(0, 5);

<<<<<<< HEAD
=======
  const forecast7Day = [
    { day: 'D1', risk: 47 },
    { day: 'D2', risk: 44 },
    { day: 'D3', risk: 42 },
    { day: 'D4', risk: 38 },
    { day: 'D5', risk: 35 },
    { day: 'D6', risk: 32 },
    { day: 'D7', risk: 30 },
  ];

>>>>>>> 5d8c49f89cc4f2dd1bcf2a288ab05b7fc50a2b91
  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-10'>
      
      {/* 1. DYNAMIC STATUS ALERT & PLAN */}
      <div className={`${theme.bg} ${theme.border} border rounded-2xl p-4 sm:p-6 shadow-sm`}>
        <div className='flex items-center gap-2 mb-4'>
          <h2 className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Current Status</h2>
        </div>

        <div className='flex flex-col md:flex-row justify-between gap-6'>
          <div className='md:w-1/2 flex flex-col justify-center'>
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <Activity size={28} />
              <h3 className='text-2xl font-black italic tracking-tight'>
                {aiOutput.status.toUpperCase()} RISK
              </h3>
            </div>
            <p className='text-sm text-slate-700 leading-relaxed font-medium'>
              Primary trigger: <span className='font-bold underline'>{aiOutput.trigger.replace('_', ' ')}</span>. 
              {aiOutput.plan[0]?.detail}
            </p>
          </div>

          <div className='md:w-1/2 bg-white/60 rounded-xl p-4 border border-white shadow-inner'>
            <h4 className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3'>
              Priority Action Items
            </h4>
            <div className='space-y-3'>
              {aiOutput.plan.map((item, idx) => (
                <div key={idx} className='flex items-start gap-3 text-xs'>
                  <CheckCircle2 size={16} className='text-teal-700 shrink-0 mt-0.5' />
                  <p className='text-slate-700'>
                    <span className='font-bold text-slate-900'>{item.task}:</span> {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* 2. RISK GAUGE */}
        <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center'>
          <h2 className='w-full text-xs font-bold text-slate-500 uppercase tracking-widest mb-8'>Risk Assessment</h2>
          
          <div className='relative w-48 h-24 overflow-hidden mb-6'>
            <svg className='absolute top-0 left-0 w-full h-[200%]' viewBox='0 0 100 100'>
              <path d='M 10 50 A 40 40 0 0 1 90 50' fill='none' stroke='#f1f5f9' strokeWidth='12' strokeLinecap='round' />
              <path d='M 10 50 A 40 40 0 0 1 90 50' fill='none' stroke={theme.stroke} strokeWidth='12' strokeLinecap='round' strokeDasharray='125' strokeDashoffset={125 - (aiOutput.code + 1) * 31.25} />
            </svg>
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 mb-1'>
              <span className={`text-3xl font-black ${theme.text}`}>{aiOutput.status}</span>
            </div>
          </div>

          <div className='w-full flex justify-around border-t border-slate-50 pt-4'>
            {behavioralData.slice(0, 3).map((item, idx) => (
              <div key={idx} className='flex flex-col items-center'>
                <span className='text-sm font-bold text-slate-800'>{item.value}%</span>
                <span className='text-[10px] text-slate-400 font-bold uppercase'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SHAP BARS */}
        <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xs font-bold text-slate-500 uppercase tracking-widest mb-6'>Feature Contributions</h2>
          <div className='space-y-4'>
            {behavioralData.map((feature, idx) => (
              <div key={idx}>
                <div className='flex justify-between text-xs mb-1.5'>
                  <span className='font-bold text-slate-600'>{feature.name}</span>
                  <span className='font-black text-teal-800'>{feature.value}%</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div 
                    className='bg-teal-700 h-2 rounded-full transition-all duration-700' 
                    style={{ width: `${Math.min(feature.value * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BEHAVIORAL ANALYSIS BAR CHART */}
      <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
        <h2 className='text-xs font-bold text-slate-500 uppercase tracking-widest mb-6'>Influence Analysis</h2>
        <div className='h-[250px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={behavioralData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
              <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              <Bar dataKey='value' fill='#0f766e' radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
}

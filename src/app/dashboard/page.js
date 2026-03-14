'use client'; 

import { Info, Activity, TrendingDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';

export default function DashboardPage() {
  // Mock data for the charts
  const behavioralData = [
    { name: 'Sleep', value: 28 },
    { name: 'Mood', value: 14 },
    { name: 'Academic', value: 11 },
    { name: 'Physical', value: 11 },
    { name: 'Social', value: 11 },
  ];

  const forecast7Day = [
    { day: 'Day 1', risk: 47 }, { day: 'Day 2', risk: 46 }, { day: 'Day 3', risk: 45 },
    { day: 'Day 4', risk: 45 }, { day: 'Day 5', risk: 44 }, { day: 'Day 6', risk: 45 },
    { day: 'Day 7', risk: 43 },
  ];

  const forecast30Day = [
    { day: 'Day 1', risk: 47 }, { day: 'Day 8', risk: 42 }, { day: 'Day 15', risk: 38 },
    { day: 'Day 22', risk: 35 }, { day: 'Day 29', risk: 30 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. MENTAL HEALTH STATUS ALERT */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Your Mental Health Status</h2>
          <Info size={16} className="text-slate-400 hidden sm:block" />
        </div>
        
        {/* Responsive flex: stacks on mobile (flex-col), side-by-side on md screens (md:flex-row) */}
        <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-4 sm:gap-6">
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <Activity size={24} />
              <h3 className="text-xl sm:text-2xl font-bold">Anxiety</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Your recent patterns suggest elevated anxiety levels. Consider the breathing exercises in your plan.
            </p>
          </div>

          <div className="md:w-1/2 bg-white/60 rounded-xl p-3 sm:p-4 border border-orange-100">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Top Contributing Factors</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-700 font-medium">Sleep Duration</span>
                <span className="text-orange-700 font-bold">27%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-700 font-medium">Mood Level</span>
                <span className="text-orange-700 font-bold">14%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-700 font-medium">Academic Workload</span>
                <span className="text-orange-700 font-bold">11%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: 1 column on mobile, 2 on medium+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 2. CURRENT RISK ASSESSMENT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">Current Risk Assessment</h2>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">3/6/2026</span>
          </div>

          {/* Gauge container */}
          <div className="relative w-40 sm:w-48 h-20 sm:h-24 overflow-hidden mb-2 sm:mb-4">
            <svg className="absolute top-0 left-0 w-full h-[200%]" viewBox="0 0 100 100">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
            </svg>
            <svg className="absolute top-0 left-0 w-full h-[200%]" viewBox="0 0 100 100">
              <path d="M 10 50 A 40 40 0 0 1 45 13" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" strokeDasharray="125" strokeDashoffset="0" />
            </svg>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-orange-500">47</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
          
          <div className="text-center w-full">
            <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-0.5">Anxiety</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 mb-4 sm:mb-6">Mental Health Risk Score</p>
          </div>

          <div className="w-full flex justify-around border-t border-slate-100 pt-3 sm:pt-4">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-800">4<span className="text-[9px] sm:text-[10px] text-slate-400">/10</span></span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-1">Stress</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-800">4<span className="text-[9px] sm:text-[10px] text-slate-400">/10</span></span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-1">Anxiety</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-800">6<span className="text-[9px] sm:text-[10px] text-slate-400">/10</span></span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-1">Mood</span>
            </div>
          </div>
        </div>

        {/* 3. SHAP EXPLAINABLE AI */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">SHAP Feature Contributions</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Explainable AI — factors driving your risk score</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { label: 'Sleep Duration', value: 27 },
              { label: 'Mood Level', value: 14 },
              { label: 'Academic Workload', value: 11 },
              { label: 'Physical Activity', value: 11 },
              { label: 'Social Interaction', value: 11 }
            ].map((feature, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-1.5">
                  <span className="font-medium text-slate-700">{feature.label}</span>
                  <span className="font-bold text-slate-600">{feature.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2">
                  <div className="bg-teal-700 h-1.5 sm:h-2 rounded-full" style={{ width: `${feature.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BEHAVIORAL FACTOR ANALYSIS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Behavioral Factor Analysis</h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Relative contribution of each behavioral factor to risk score</p>
        </div>
        {/* Fixed height ensures chart doesn't collapse on mobile */}
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behavioralData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. FORECASTING: Stacks on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 7-Day Forecast */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <TrendingDown size={16} className="text-teal-700 sm:w-[18px] sm:h-[18px]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">7-Day Forecast</h2>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 mb-4 sm:mb-6">TFT model — projected risk trend</p>
          
          <div className="h-[150px] sm:h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast7Day} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="risk" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 3, fill: '#0f766e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-Day Forecast */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <TrendingDown size={16} className="text-teal-700 sm:w-[18px] sm:h-[18px]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">30-Day Forecast</h2>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 mb-4 sm:mb-6">TFT model — long-term risk projection</p>
          
          <div className="h-[150px] sm:h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast30Day} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="risk" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 3, fill: '#0f766e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
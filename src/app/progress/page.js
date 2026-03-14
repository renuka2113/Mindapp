'use client';

import React from 'react';
import { BarChart2, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

export default function ProgressPage() {
  // Mock data for the historical risk score trend
  const historyData = [
    { date: 'Feb 20', score: 56 },
    { date: 'Feb 23', score: 50 },
    { date: 'Feb 26', score: 45 },
    { date: 'Mar 1', score: 40 },
    { date: 'Mar 4', score: 42 },
    { date: 'Mar 7', score: 38 },
    { date: 'Mar 10', score: 35 },
    { date: 'Mar 12', score: 38 },
    { date: 'Mar 14', score: 47 }, // Today's spike back up to 47
  ];

  // Data for the Behavioral Changes Grid
  const behavioralChanges = [
    { label: 'Sleep Duration', oldVal: '5.8h', newVal: '3.0h', trend: 'Declined', isPositive: false },
    { label: 'Mood Level', oldVal: '4.0/10', newVal: '6.0/10', trend: 'Improved', isPositive: true },
    { label: 'Stress Level', oldVal: '8.0/10', newVal: '4.0/10', trend: 'Improved', isPositive: true },
    { label: 'Anxiety Level', oldVal: '7.0/10', newVal: '4.0/10', trend: 'Improved', isPositive: true },
    { label: 'Physical Activity', oldVal: '0.9h', newVal: '1.0h', trend: 'Improved', isPositive: true },
    { label: 'Social Media', oldVal: '4.5h', newVal: '2.0h', trend: 'Improved', isPositive: true },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 pb-8">
      
      {/* 1. HEADER AREA */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700">
            <BarChart2 size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Progress Monitoring</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">15 check-ins tracked</p>
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS (Top Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-1">Initial Score</p>
          <p className="text-xl sm:text-2xl font-black text-orange-600">56</p>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Anxiety</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-1">Current Score</p>
          <p className="text-xl sm:text-2xl font-black text-orange-500">47</p>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Anxiety</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-1">Improvement</p>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingDown size={18} strokeWidth={3} />
            <p className="text-xl sm:text-2xl font-black">17%</p>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">better</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-1">7-Day Avg</p>
          <p className="text-xl sm:text-2xl font-black text-yellow-500">38</p>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">risk score</p>
        </div>
      </div>

      {/* 3. RISK SCORE HISTORY CHART */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Risk Score History</h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Your mental health journey over time</p>
        </div>
        
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              {/* Threshold Lines to match the screenshot */}
              <ReferenceLine y={20} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} /> {/* Normal */}
              <ReferenceLine y={40} stroke="#eab308" strokeDasharray="3 3" opacity={0.5} /> {/* Mild Stress */}
              <ReferenceLine y={60} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} /> {/* Anxiety */}
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} /> {/* Depression */}
              
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                formatter={(value) => [`Score: ${value}`, 'Risk']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0f766e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Chart Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-green-500"></div><span className="text-[10px] sm:text-xs text-slate-500">Normal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-yellow-500"></div><span className="text-[10px] sm:text-xs text-slate-500">Mild Stress</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-orange-500"></div><span className="text-[10px] sm:text-xs text-slate-500">Anxiety</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-red-500"></div><span className="text-[10px] sm:text-xs text-slate-500">Depression</span></div>
        </div>
      </div>

      {/* 4. BEHAVIORAL CHANGES GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Behavioral Changes</h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Comparison of baseline vs. current averages</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {behavioralChanges.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mb-2">{item.label}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-bold text-slate-400">{item.oldVal}</span>
                <ArrowRight size={14} className="text-slate-300" />
                <span className={`text-sm sm:text-base font-bold ${item.isPositive ? 'text-teal-700' : 'text-red-600'}`}>
                  {item.newVal}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold ${item.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {item.isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                <span>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PLAN EFFECTIVENESS FOOTER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">Intervention Plan Effectiveness</h2>
          <p className="text-[10px] sm:text-xs text-slate-500">Based on risk score trajectory and behavioral changes</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg sm:text-xl font-black text-orange-500 mb-0.5">Good</h3>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1">
            <TrendingDown size={10} strokeWidth={3} className="text-slate-400" /> 9 points reduced
          </p>
        </div>
      </div>

    </div>
  );
}
import { Info, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* 1. MENTAL HEALTH STATUS CARD */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-800">Your Mental Health Status</h2>
          <Info size={16} className="text-slate-400" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <Activity size={24} />
              <h3 className="text-2xl font-bold">Anxiety</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Your recent patterns suggest elevated anxiety levels. Consider the breathing exercises in your plan.
            </p>
          </div>

          {/* Quick Contributing Factors Summary */}
          <div className="md:w-1/2 bg-white/60 rounded-xl p-4 border border-orange-100">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Top Contributing Factors</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 font-medium">Sleep Duration</span>
                <span className="text-orange-700 font-bold">27%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 font-medium">Mood Level</span>
                <span className="text-orange-700 font-bold">14%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 font-medium">Academic Workload</span>
                <span className="text-orange-700 font-bold">11%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID FOR CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. CURRENT RISK ASSESSMENT CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-slate-800">Current Risk Assessment</h2>
            <span className="text-xs text-slate-400 font-medium">3/6/2026</span>
          </div>

          {/* Custom SVG Half-Circle Gauge */}
          <div className="relative w-48 h-24 overflow-hidden mb-4">
            {/* Background Arc */}
            <svg className="absolute top-0 left-0 w-full h-[200%]" viewBox="0 0 100 100">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
            </svg>
            {/* Foreground Arc (The orange value) */}
            <svg className="absolute top-0 left-0 w-full h-[200%]" viewBox="0 0 100 100">
              <path d="M 10 50 A 40 40 0 0 1 45 13" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" strokeDasharray="125" strokeDashoffset="0" />
            </svg>
            
            {/* Score Text inside Gauge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-4xl font-black text-orange-500">47</span>
              <span className="text-[10px] text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-orange-600 mb-1">Anxiety</h3>
          <p className="text-xs text-slate-500 mb-6">Mental Health Risk Score</p>

          {/* Bottom Sub-scores */}
          <div className="w-full flex justify-around border-t border-slate-100 pt-4">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800">4<span className="text-[10px] text-slate-400">/10</span></span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Stress</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800">4<span className="text-[10px] text-slate-400">/10</span></span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Anxiety</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800">6<span className="text-[10px] text-slate-400">/10</span></span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Mood</span>
            </div>
          </div>
        </div>

        {/* 3. SHAP EXPLAINABLE AI CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-800">SHAP Feature Contributions</h2>
            <p className="text-xs text-slate-500 mt-1">Explainable AI — factors driving your risk score</p>
          </div>

          <div className="space-y-4">
            {/* Row 1 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Sleep Duration</span>
                <span className="font-bold text-slate-600">27%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-700 h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Mood Level</span>
                <span className="font-bold text-slate-600">14%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-700 h-2 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Academic Workload</span>
                <span className="font-bold text-slate-600">11%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-700 h-2 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Physical Activity</span>
                <span className="font-bold text-slate-600">11%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-700 h-2 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
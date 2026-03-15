'use client';

import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, Circle, Info, AlertTriangle } from 'lucide-react';

export default function MyPlanPage() {
  const [tasks, setTasks] = useState([]);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('latest_analysis');
      if (savedData) {
        const aiOutput = JSON.parse(savedData);

        const baseValues = { 0: 15, 1: 42, 2: 68, 3: 92 };
        const base = baseValues[aiOutput.code] || 0;
        
        const intensity = aiOutput.shap_scores[aiOutput.trigger] || 0;
        const finalRisk = Math.min(Math.round(base + intensity * 5), 100);
        setRiskScore(finalRisk);

        
        const mappedTasks = aiOutput.plan.map((item, index) => {
          const taskName = item.task.toLowerCase();
          const category = item.category?.toLowerCase() || '';

          
          let assignedTime = 'Afternoon';
          if (
            taskName.includes('inertia') ||
            taskName.includes('morning') ||
            category.includes('productivity')
          ) {
            assignedTime = 'Morning';
          } else if (
            taskName.includes('calibration') ||
            taskName.includes('sunset') ||
            taskName.includes('night') ||
            category.includes('sleep')
          ) {
            assignedTime = 'Night';
          } else if (
            category.includes('social') ||
            category.includes('leisure') ||
            taskName.includes('recovery')
          ) {
            assignedTime = 'Afternoon';
          }

          
          const icons = {
            sleep: '🌙',
            phone: '📱',
            social: '👥',
            leisure: '🎨',
            productivity: '📚',
            balance: '⚖️',
          };

          return {
            id: index + 1,
            time: assignedTime,
            title: item.task,
            desc: item.detail,
            category: item.category || 'Wellness',
            icon: icons[category] || '✨',
            completed: false,
            priority: item.priority || 'Medium',
          };
        });

        
        const sortedTasks = mappedTasks.sort((a, b) => {
          const order = { Morning: 1, Afternoon: 2, Night: 3 };
          return order[a.time] - order[b.time];
        });

        setTasks(sortedTasks);
      }
    }
  }, []);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (tasks.length === 0)
    return (
      <div className='p-20 text-center text-slate-500 font-medium'>
        No active plan. Please complete a check-in first.
      </div>
    );

  return (
    <div className='max-w-2xl mx-auto space-y-6 pb-8'>
      {/* 1. HEADER AREA */}
      <div className='flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <div className='bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700'>
            <Brain size={24} />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-slate-900 leading-tight'>
              My Wellness Plan
            </h1>
            <p className='text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5'>
              AI-Generated Interventions
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${riskScore > 60 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
        >
          Risk: <span>{riskScore}/100</span>
        </div>
      </div>

      {/* 2. PROGRESS TRACKER */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <div className='flex justify-between items-end mb-3'>
          <h2 className='text-xs sm:text-sm font-bold text-slate-800'>
            Intervention Adherence
          </h2>
          <span className='text-lg sm:text-xl font-black text-teal-700'>
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className='w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden'>
          <div
            className='bg-teal-700 h-2.5 rounded-full transition-all duration-500'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className='text-[10px] text-slate-400 font-medium'>
          {progressPercentage}% of tasks completed
        </p>
      </div>

      {/* 3. TASK LISTS */}
      <div className='space-y-6'>
        {['Morning', 'Afternoon', 'Night'].map((timeOfDay) => {
          const filteredTasks = tasks.filter((task) => task.time === timeOfDay);
          if (filteredTasks.length === 0) return null;

          return (
            <div key={timeOfDay}>
              <h3 className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2'>
                {timeOfDay}
              </h3>
              <div className='space-y-3'>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 sm:gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-slate-50 opacity-60'
                        : 'bg-white shadow-sm hover:border-teal-300'
                    }`}
                  >
                    <div className='shrink-0 mt-0.5'>
                      {task.completed ? (
                        <CheckCircle2 size={22} className='text-teal-600' />
                      ) : (
                        <Circle size={22} className='text-slate-300' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between items-start mb-1'>
                        <h4
                          className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}
                        >
                          {task.icon} {task.title}
                        </h4>
                        {task.priority === 'CRITICAL' && !task.completed && (
                          <AlertTriangle size={14} className='text-red-500' />
                        )}
                      </div>
                      <p
                        className={`text-xs ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        {task.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

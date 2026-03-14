'use client';

import React, { useState } from 'react';
import { Brain, CheckCircle2, Circle, Info } from 'lucide-react';

export default function MyPlanPage() {
  // Mocking the generated wellness plan based on the Rule-Based Engine
  const [tasks, setTasks] = useState([
    { 
      id: 1, time: 'Morning', title: '5-Minute Morning Meditation', 
      desc: 'Start each morning with a guided mindfulness session to center your thoughts and reduce anxiety.', 
      category: 'Meditation', icon: '🧘', completed: true 
    },
    { 
      id: 2, time: 'Afternoon', title: '30-Minute Daily Walk', 
      desc: 'Take a brisk walk outdoors. Physical movement releases endorphins and improves mental clarity.', 
      category: 'Physical Activity', icon: '🚶', completed: true 
    },
    { 
      id: 3, time: 'Afternoon', title: 'Pomodoro Study Schedule', 
      desc: 'Study in 25-minute focused blocks with 5-minute breaks to optimize learning and reduce burnout.', 
      category: 'Study Schedule', icon: '📚', completed: true 
    },
    { 
      id: 4, time: 'Afternoon', title: 'Social Connection Time', 
      desc: 'Schedule at least 20 minutes of meaningful in-person or video interaction with friends or family.', 
      category: 'Social', icon: '👥', completed: true 
    },
    { 
      id: 5, time: 'Night', title: 'Box Breathing Exercise', 
      desc: 'Practice 4-4-4-4 box breathing for 10 minutes when you feel overwhelmed or stressed.', 
      category: 'Breathing', icon: '🫁', completed: true 
    },
    { 
      id: 6, time: 'Night', title: 'Sleep Hygiene Routine', 
      desc: 'Set a consistent bedtime, avoid screens 1 hour before sleep, and keep your room cool.', 
      category: 'Sleep', icon: '🌙', completed: false 
    },
  ]);

  // Toggle task completion status
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Calculate progress metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  const remainingTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      
      {/* 1. HEADER AREA */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">My Wellness Plan</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Personalized by Rule-Based Engine</p>
          </div>
        </div>
        <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200">
          Risk: <span className="text-orange-600">47/100</span>
        </div>
      </div>

      {/* 2. PROGRESS TRACKER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Today's Progress</h2>
          <span className="text-lg sm:text-xl font-black text-teal-700">{completedTasks}/{totalTasks}</span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
          <div 
            className="bg-teal-700 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] sm:text-xs font-medium">
          <span className="text-slate-500">{progressPercentage}% adherence today</span>
          <span className="text-slate-400">{remainingTasks} remaining</span>
        </div>
      </div>

      {/* 3. ADAPTIVE PLAN INFO BOX */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 items-start shadow-sm">
        <Info className="text-slate-400 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-700">Adaptive Recommendations</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
            Your plan adapts dynamically based on your adherence and risk score changes. Complete tasks consistently to build effective wellness strategies.
          </p>
        </div>
      </div>

      {/* 4. THE ACTIONABLE TASK LIST (Grouped by Time of Day) */}
      <div className="space-y-6">
        {['Morning', 'Afternoon', 'Night'].map((timeOfDay) => (
          <div key={timeOfDay}>
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">
              {timeOfDay}
            </h3>
            
            <div className="space-y-3">
              {tasks.filter(task => task.time === timeOfDay).map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-3 sm:gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    task.completed 
                      ? 'bg-slate-50 border-slate-200 opacity-75' 
                      : 'bg-white border-slate-200 shadow-sm hover:border-teal-300'
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <div className="shrink-0 mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 size={22} className="text-teal-600 fill-teal-50" />
                    ) : (
                      <Circle size={22} className="text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                        {task.icon} {task.title}
                      </h4>
                      {/* Category Badge */}
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        task.completed ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                      {task.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 5. FOOTER DISCLAIMER */}
      <div className="pt-4 flex items-start gap-2 text-slate-400">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p className="text-[10px] sm:text-xs font-medium leading-relaxed">
          Complete a daily check-in to receive updated intervention recommendations. The rule-based engine continuously refines your plan based on your reported behavioral changes.
        </p>
      </div>

    </div>
  );
}
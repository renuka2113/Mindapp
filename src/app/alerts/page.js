'use client';

import React, { useState } from 'react';
import { Bell, BellRing, AlertTriangle, TrendingUp, CheckCircle2, Trophy, Clock, Trash2 } from 'lucide-react';

export default function AlertsPage() {
  
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Risk Escalation Detected',
      message: 'Your responses suggest a sudden spike in Anxiety. Your wellness plan has been updated with immediate breathing exercises.',
      time: '10m ago',
      isNew: true,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Worsening Forecast',
      message: 'Our 7-day forecast indicates a potential increase in stress based on recent sleep patterns. Consider adjusting your study-rest schedule.',
      time: '2h ago',
      isNew: true,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      id: 3,
      type: 'action',
      title: 'Daily Check-In Reminder',
      message: "You haven't completed your daily check-in yet. Take 2 minutes to log your sleep and mood data for accurate monitoring.",
      time: '5h ago',
      isNew: false,
      icon: BellRing,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100'
    },
    {
      id: 4,
      type: 'success',
      title: 'Risk Score Improvement',
      message: 'Great progress! Your mental health risk score has dropped by 9 points compared to last week.',
      time: 'Yesterday',
      isNew: false,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      id: 5,
      type: 'reward',
      title: 'Milestone Reached',
      message: "Awesome job! You've hit a 15-day check-in streak. Keep the momentum going to earn your next badge.",
      time: 'Yesterday',
      isNew: false,
      icon: Trophy,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100'
    }
  ]);

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isNew: false })));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 pb-8">
      
      {/* 1. HEADER AREA */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-teal-50 p-2 sm:p-2.5 rounded-xl text-teal-700">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Alerts & Notifications</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
              {alerts.filter(a => a.isNew).length} new messages
            </p>
          </div>
        </div>
        <button 
          onClick={markAllRead}
          className="text-[10px] sm:text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* 2. ALERTS LIST */}
      <div className="space-y-3 sm:space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div 
                key={alert.id}
                className={`relative group flex gap-4 p-4 rounded-2xl border transition-all ${
                  alert.isNew ? `${alert.bgColor} ${alert.borderColor}` : 'bg-white border-slate-100 opacity-90'
                }`}
              >
                {/* New Indicator Dot */}
                {alert.isNew && (
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${alert.color.replace('text', 'bg')}`}></div>
                )}

                {/* Icon Section */}
                <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                  alert.isNew ? 'bg-white shadow-sm' : 'bg-slate-50'
                }`}>
                  <Icon className={alert.color} size={22} />
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm sm:text-base font-bold ${alert.isNew ? 'text-slate-900' : 'text-slate-700'}`}>
                      {alert.title}
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${alert.isNew ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <Clock size={12} />
                      <span>{alert.time}</span>
                    </div>
                    
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-900 font-bold">All caught up!</h3>
            <p className="text-slate-400 text-sm">No new alerts to show right now.</p>
          </div>
        )}
      </div>

      {/* 3. QUICK INFO BOX */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 items-start shadow-sm mt-4">
        <BellRing className="text-slate-400 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-700">How alerts work</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
            Alerts are triggered by real-time DNN risk classification. If your scores enter high-risk zones or show rapid progression, the system prioritizes intervention alerts to your dashboard.
          </p>
        </div>
      </div>

    </div>
  );
}
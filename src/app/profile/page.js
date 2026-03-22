'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Calendar, Shield, Award } from 'lucide-react';

export default function StudentHomePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await res.json();
      setProfile(data.user);
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <User size={120} />
        </div>
        
        <div className="flex items-center gap-5 mb-6">
          <div className="h-20 w-20 bg-teal-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{profile.full_name}</h1>
            <p className="text-teal-600 font-bold text-sm flex items-center gap-1">
              <Shield size={14} /> Student Account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<Mail size={18}/>} label="Email" value={profile.email} />
          <InfoItem icon={<GraduationCap size={18}/>} label="Branch" value={profile.branch} />
          <InfoItem icon={<Calendar size={18}/>} label="Academic Year" value={`${profile.year}${getOrdinal(profile.year)} Year`} />
          <InfoItem icon={<Award size={18}/>} label="Wellness Score" value={`${profile.wellness_score} Points`} />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-teal-800 text-white p-6 rounded-3xl shadow-md">
          <p className="text-teal-200 text-xs font-bold uppercase mb-1">Current Streak</p>
          <p className="text-3xl font-black">{profile.current_streak} Days</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">College</p>
          <p className="text-lg font-bold text-slate-800 leading-tight">{profile.college_name}</p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}
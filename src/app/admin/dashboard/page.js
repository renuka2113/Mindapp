'use client';

import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, ShieldCheck, Search, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem('userId');
      try {
        const res = await fetch(`/api/admin/students?adminId=${adminId}`);
        const data = await res.json();
        if (data.students) {
          setStudents(data.students);
          setCollegeName(data.college);
        }
      } catch (err) {
        console.error("Error loading admin dashboard", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center text-slate-500">Loading Student Records...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{collegeName}</h1>
          <p className="text-slate-500 text-sm font-medium">Institutional Wellness Monitoring Panel</p>
        </div>
        <div className="flex items-center gap-3 bg-teal-50 px-4 py-2 rounded-2xl text-teal-700">
          <Users size={20} />
          <span className="font-bold">{students.length} Students Enrolled</span>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
          />
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-orange-500 text-white p-2 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-orange-700 text-xs font-bold uppercase tracking-wider">At Risk</p>
            <p className="text-2xl font-black text-orange-900">
              {students.filter(s => s.latest_risk > 60).length}
            </p>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Student Information</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Score</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Consistency</th>
              {/* <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Action</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <p className="font-bold text-slate-800">{student.full_name}</p>
                  <p className="text-xs text-slate-400">{student.email}</p>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-black border ${
                      student.latest_risk > 60 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {student.latest_risk || 0}%
                    </div>
                    {student.latest_risk > 60 && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{student.current_streak} Day Streak</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Last check-in: {student.last_checkin || 'Never'}</p>
                </td>
                {/* <td className="p-5 text-center">
                  <button className="p-2 hover:bg-teal-50 rounded-xl text-slate-400 hover:text-teal-600 transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
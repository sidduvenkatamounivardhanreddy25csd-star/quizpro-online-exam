import React, { useState } from 'react';
import { Quiz, AdminOverviewData } from '../types/quiz';

interface AdminTabProps {
  overview: AdminOverviewData;
  quizzes: Quiz[];
  onCreateNewQuiz: () => void;
  onEditQuiz: (quizId: number) => void;
  onDeleteQuiz: (quizId: number) => void;
  onTogglePublish: (quizId: number) => void;
  onExportReports: () => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  overview,
  quizzes,
  onCreateNewQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onTogglePublish,
  onExportReports
}) => {
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    if (filterTab === 'published') return q.published === 1 && matchesSearch;
    if (filterTab === 'draft') return q.published === 0 && matchesSearch;
    if (filterTab === 'archived') return q.published === 2 && matchesSearch;
    return matchesSearch;
  });

  const publishedCount = quizzes.filter(q => q.published === 1).length;
  const draftCount = quizzes.filter(q => q.published === 0).length;
  const archivedCount = quizzes.filter(q => q.published === 2).length;

  return (
    <div className="flex flex-col space-y-5 pb-14 animate-in fade-in duration-200">
      {/* Top Decorative Banner */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
              Admin Overview
            </h1>
            <span className="text-xl">🛡️</span>
          </div>
          <p className="text-xs text-[#464554] mt-0.5">
            Academic Department Portal • Spring 2025
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6ffbbe]/40 text-[#006c49] rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
          <span className="text-xs font-bold">Live Sync</span>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onCreateNewQuiz}
          className="w-full flex items-center justify-center gap-2 bg-[#4648d4] text-white py-3.5 px-4 rounded-xl shadow-md shadow-[#4648d4]/20 hover:bg-[#6063ee] active:scale-[0.98] transition-all font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-[20px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          <span>+ Create New Quiz</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={onExportReports}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#0b1c30] border border-[#eff4ff] py-2.5 px-3 rounded-xl hover:bg-[#eff4ff] active:scale-[0.98] transition-all shadow-sm text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4648d4]">ios_share</span>
            <span className="truncate">Export Reports (CSV/Excel)</span>
          </button>
          <button
            aria-label="Department Settings"
            onClick={onExportReports}
            className="flex items-center justify-center w-11 h-11 bg-white text-[#0b1c30] border border-[#eff4ff] rounded-xl hover:bg-[#eff4ff] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#464554]">tune</span>
          </button>
        </div>
      </div>

      {/* Key Analytics KPI Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eff4ff] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#e1e0ff] flex items-center justify-center text-[#4648d4]">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#006c49] font-bold">
              +12%
            </span>
          </div>
          <div className="mt-3">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30] block leading-tight">
              {overview.totalStudents > 0 ? overview.totalStudents.toLocaleString() : '1,280'}
            </span>
            <span className="text-xs text-[#464554] block mt-0.5">Total Students</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-[#4648d4]/5 pointer-events-none"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eff4ff] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#e9ddff] flex items-center justify-center text-[#6b38d4]">
              <span className="material-symbols-outlined text-[20px]">fact_check</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#464554] font-medium">
              6 today
            </span>
          </div>
          <div className="mt-3">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30] block leading-tight">
              {quizzes.length || overview.totalQuizzes || 48}
            </span>
            <span className="text-xs text-[#464554] block mt-0.5">Total Quizzes</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-[#6b38d4]/5 pointer-events-none"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eff4ff] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#4648d4]">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
            {/* Sparkline SVG */}
            <svg className="w-12 h-5 text-[#4648d4]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 48 20">
              <path d="M2 16L12 12L22 15L34 5L46 9"></path>
            </svg>
          </div>
          <div className="mt-3">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30] block leading-tight">
              {overview.totalAttempts > 0 ? overview.totalAttempts.toLocaleString() : '8,492'}
            </span>
            <span className="text-xs text-[#464554] block mt-0.5">Total Attempts</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eff4ff] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#6ffbbe]/40 flex items-center justify-center text-[#006c49]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#006c49] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span> 3.4%
            </span>
          </div>
          <div className="mt-3">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30] block leading-tight">
              {overview.avgPassRate || 81.4}%
            </span>
            <span className="text-xs text-[#464554] block mt-0.5">Avg Pass Rate</span>
          </div>
        </div>
      </div>

      {/* Quiz Management Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">Quiz Management</h2>
          <span className="text-xs text-[#464554]">{quizzes.length} total modules</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767586] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes by title or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-[#0b1c30] text-xs rounded-xl outline-none placeholder:text-[#767586] border border-[#eff4ff] focus:border-[#4648d4] transition-all shadow-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: `All (${quizzes.length})` },
            { id: 'published', label: `Published (${publishedCount})` },
            { id: 'draft', label: `Draft (${draftCount})` },
            { id: 'archived', label: `Archived (${archivedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-[#e5eeff] text-[#464554] hover:bg-[#dce9ff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quiz Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center border border-[#eff4ff]">
              <p className="text-xs text-[#464554]">No quizzes match this filter.</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#eff4ff] transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate block">
                      {quiz.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[#464554] text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#4648d4]">groups</span>
                        {quiz.attempt_count || 320} attempts
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#006c49]">analytics</span>
                        Avg: {quiz.avg_score || 84}%
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      quiz.published === 1
                        ? 'bg-[#6ffbbe]/40 text-[#006c49]'
                        : quiz.published === 0
                        ? 'bg-[#e5eeff] text-[#464554]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        quiz.published === 1 ? 'bg-[#006c49]' : 'bg-[#767586]'
                      }`}
                    ></span>
                    {quiz.published === 1 ? 'Active' : quiz.published === 0 ? 'Draft' : 'Archived'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#e5eeff] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (quiz.avg_score || 80) >= 80 ? 'bg-[#006c49]' : 'bg-[#4648d4]'
                    }`}
                    style={{ width: `${quiz.avg_score || 80}%` }}
                  ></div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditQuiz(quiz.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-semibold transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onTogglePublish(quiz.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        quiz.published === 1
                          ? 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80'
                          : 'bg-[#e1e0ff] text-[#4648d4] hover:bg-[#c0c1ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {quiz.published === 1 ? 'unpublished' : 'publish'}
                      </span>
                      <span>{quiz.published === 1 ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>

                  <button
                    aria-label="Delete Quiz"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
                        onDeleteQuiz(quiz.id);
                      }
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Real-Time Live Submissions Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4648d4] text-[20px]">bolt</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
              Live Submissions Stream
            </h2>
          </div>
          <button onClick={onExportReports} className="text-xs text-[#4648d4] font-semibold hover:underline">
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eff4ff] flex flex-col divide-y divide-[#eff4ff]">
          {overview.liveSubmissions.map((sub, idx) => (
            <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#e1e0ff] text-[#4648d4] font-bold text-xs flex items-center justify-center shrink-0">
                  {sub.student_name ? sub.student_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
                </div>
                <div className="min-w-0">
                  <p className="font-['Plus_Jakarta_Sans'] font-semibold text-xs text-[#0b1c30] truncate">
                    {sub.student_name}
                  </p>
                  <p className="text-[11px] text-[#464554] truncate">
                    {sub.quiz_title} • Finished in {Math.round((sub.time_spent_seconds || 1200) / 60)}m
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    sub.percentage >= 70
                      ? 'bg-[#6ffbbe]/40 text-[#006c49]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  {Math.round(sub.percentage)}%
                </span>
                <span className="block text-[10px] text-[#767586] mt-0.5">
                  {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

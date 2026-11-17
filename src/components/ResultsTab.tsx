import React, { useState } from 'react';
import { AttemptHistoryItem } from '../types/quiz';

interface ResultsTabProps {
  attempts: AttemptHistoryItem[];
  onReviewAttempt: (attemptId: number) => void;
  onExploreQuizzes: () => void;
  onRefresh?: () => void;
  isAdmin?: boolean;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  attempts,
  onReviewAttempt,
  onExploreQuizzes,
  onRefresh,
  isAdmin = false
}) => {
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const passedCount = attempts.filter(a => a.percentage >= (a.pass_mark || 70)).length;
  const failedCount = attempts.filter(a => a.percentage < (a.pass_mark || 70)).length;

  const filtered = attempts.filter(a => {
    const isPassed = a.percentage >= (a.pass_mark || 70);
    if (filter === 'passed') return isPassed;
    if (filter === 'failed') return !isPassed;
    return true;
  });

  const handleManualRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-12 animate-in fade-in duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
            {isAdmin ? 'Student Assessment Results' : 'Assessment History'}
          </h1>
          <p className="text-xs text-[#464554]">
            {isAdmin
              ? 'Review all candidate submissions, performance scores, and test attempt logs.'
              : 'Review all your past quiz submissions, diagnostic marks, and answer rationales.'}
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={handleManualRefresh}
            title="Refresh results history"
            className="w-9 h-9 rounded-xl bg-white border border-[#eff4ff] flex items-center justify-center text-[#4648d4] hover:bg-[#eff4ff] shadow-sm transition-all active:scale-95"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-[#4648d4] text-white shadow-sm'
              : 'bg-white text-[#464554] border border-[#eff4ff] hover:bg-[#eff4ff]'
          }`}
        >
          All Attempts ({attempts.length})
        </button>
        <button
          onClick={() => setFilter('passed')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'passed'
              ? 'bg-[#006c49] text-white shadow-sm'
              : 'bg-white text-[#464554] border border-[#eff4ff] hover:bg-[#eff4ff]'
          }`}
        >
          Passed ({passedCount})
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'failed'
              ? 'bg-[#ba1a1a] text-white shadow-sm'
              : 'bg-white text-[#464554] border border-[#eff4ff] hover:bg-[#eff4ff]'
          }`}
        >
          Needs Retake ({failedCount})
        </button>
      </div>

      {/* Attempts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#eff4ff] space-y-3 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#767586]">assignment_late</span>
            <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">No assessments to display</p>
            <p className="text-xs text-[#464554]">
              {filter === 'all'
                ? "You haven't submitted any quizzes yet. Start an assessment to see your diagnostic results here."
                : `No quiz attempts match the "${filter === 'passed' ? 'Passed' : 'Needs Retake'}" filter.`}
            </p>
            <button
              onClick={onExploreQuizzes}
              className="px-4 py-2 rounded-xl bg-[#4648d4] text-white text-xs font-semibold hover:bg-[#6063ee] transition-all shadow-sm"
            >
              Take a Quiz Now
            </button>
          </div>
        ) : (
          filtered.map((attempt) => {
            const isPassed = attempt.percentage >= (attempt.pass_mark || 70);
            const totalQs = attempt.total_questions || Math.max(Math.round(attempt.total / 2), 1);
            const correctQs = attempt.correct_count ?? Math.min(totalQs, Math.round((attempt.percentage / 100) * totalQs));

            return (
              <div
                key={attempt.id}
                onClick={() => onReviewAttempt(attempt.id)}
                className="bg-white p-4 rounded-2xl border border-[#eff4ff] shadow-sm hover:border-[#c7c4d7] hover:shadow-md transition-all space-y-3 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-[#6b38d4] uppercase tracking-wider block">
                        {attempt.quiz_category || 'Computer Science'}
                      </span>
                      {isAdmin && attempt.student_name && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#eff4ff] text-[#4648d4]">
                          Student: {attempt.student_name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30] group-hover:text-[#4648d4] transition-colors truncate">
                      {attempt.quiz_title}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                      isPassed
                        ? 'bg-[#6ffbbe]/30 text-[#006c49]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isPassed ? 'bg-[#006c49]' : 'bg-[#ba1a1a]'}`}
                    ></span>
                    {isPassed ? (attempt.percentage >= 85 ? 'Passed with Distinction 🏆' : 'Passed') : 'Needs Retake'}
                  </span>
                </div>

                {/* Score Banner */}
                <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] p-2.5 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-[#464554] uppercase font-semibold block">Questions</span>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                      {correctQs} / {totalQs}
                    </span>
                    <span className="text-[9px] text-[#767586] block">
                      {attempt.score}/{attempt.total} pts
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#464554] uppercase font-semibold block">Percentage</span>
                    <span className={`font-['Plus_Jakarta_Sans'] font-bold text-sm ${isPassed ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                      {Math.round(attempt.percentage)}%
                    </span>
                    <span className="text-[9px] text-[#767586] block">
                      Pass mark: {attempt.pass_mark || 70}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#464554] uppercase font-semibold block">Time Spent</span>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                      {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s
                    </span>
                    <span className="text-[9px] text-[#767586] block">
                      Limit: {attempt.quiz_duration}m
                    </span>
                  </div>
                </div>

                {/* Footer with date and Review button */}
                <div className="flex items-center justify-between text-xs text-[#464554] pt-1 border-t border-[#eff4ff]">
                  <span className="flex items-center gap-1 text-[11px] text-[#767586]">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(attempt.submitted_at).toLocaleDateString()} at{' '}
                    {new Date(attempt.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReviewAttempt(attempt.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span>View Breakdown</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { StudentDashboardData } from '../types/quiz';

interface DashboardTabProps {
  data: StudentDashboardData;
  onStartQuiz: (quizId: number) => void;
  onReviewAttempt: (attemptId: number) => void;
  onSeeAllQuizzes: () => void;
  onViewHistory: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  data,
  onStartQuiz,
  onReviewAttempt,
  onSeeAllQuizzes,
  onViewHistory
}) => {
  return (
    <div className="flex flex-col space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Welcome & Profile Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30] truncate">
              Hello, {data.studentName}
            </h1>
            <span className="text-xl select-none">👋</span>
          </div>
          <p className="font-['Inter'] text-xs text-[#464554] truncate">Computer Science • Semester 4</p>
        </div>
        {/* Streak Badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e9ddff] text-[#23005c] shadow-sm">
          <span className="text-xs select-none">🔥</span>
          <span className="font-['Inter'] font-semibold text-xs">{data.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Active / In-Progress Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4648d4] via-[#6063ee] to-[#6b38d4] text-white p-4 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-xl"></div>
        <div className="relative flex flex-col space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              In Progress
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-white/80">Question 26 of 40</span>
          </div>

          <div className="min-w-0">
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-white truncate">Midterm Prep: Operating Systems</h2>
            <p className="text-xs text-white/80 mt-0.5">Virtual Memory • Page Replacement Algorithms</p>
          </div>

          {/* Progress Track */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-white/90 text-xs">
              <span>Completion</span>
              <span className="font-semibold">65%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-[#6ffbbe] rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex items-center justify-end">
            <button
              onClick={() => onStartQuiz(5)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#4648d4] font-semibold text-xs shadow-sm hover:bg-[#f8f9ff] active:scale-95 transition-all"
            >
              <span>Resume Quiz</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards: 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Available Quizzes */}
        <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#eff4ff] flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464554] font-medium">Available</span>
            <div className="w-8 h-8 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4648d4]">
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            </div>
          </div>
          <div>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
              {data.availableCount}
            </span>
            <p className="text-[11px] text-[#464554] mt-0.5">3 due this week</p>
          </div>
        </div>

        {/* Card 2: Completed Quizzes */}
        <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#eff4ff] flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464554] font-medium">Completed</span>
            <div className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006c49]">
              <span className="material-symbols-outlined text-[18px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
          <div>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
              {data.completedCount || 28}
            </span>
            <p className="text-[11px] text-[#006c49] mt-0.5 flex items-center gap-0.5 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +4 this week
            </p>
          </div>
        </div>

        {/* Card 3: Average Score with Mini Progress Ring */}
        <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#eff4ff] flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464554] font-medium">Avg. Score</span>
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#dce9ff]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#4648d4]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${data.avgScore}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-[#4648d4] font-mono">{Math.round(data.avgScore)}%</span>
            </div>
          </div>
          <div>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
              {data.avgScore}%
            </span>
            <p className="text-[11px] text-[#006c49] mt-0.5 font-semibold">+4.2% mo/mo</p>
          </div>
        </div>

        {/* Card 4: Global Rank */}
        <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#eff4ff] flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464554] font-medium">Global Rank</span>
            <div className="w-8 h-8 rounded-full bg-[#e9ddff] flex items-center justify-center text-[#6b38d4]">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">
                #{data.globalRank}
              </span>
              <span className="text-xs text-[#464554]">/ {data.cohortSize}</span>
            </div>
            <p className="text-[11px] text-[#6b38d4] mt-0.5 font-semibold">Top 5% Cohort</p>
          </div>
        </div>
      </div>

      {/* Performance & Weekly Study Hours Breakdown Widget */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#eff4ff] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">Weekly Study & Accuracy</h3>
            <p className="text-xs text-[#464554]">Past 7 days performance metrics</p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#464554] text-[11px] font-semibold">
            {data.hoursLogged} hrs logged
          </div>
        </div>

        {/* Mini Bar Chart Visualization */}
        <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28">
          {data.weeklyChart.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div
                className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                  item.isToday
                    ? 'bg-[#006c49]'
                    : item.height > 60
                    ? 'bg-[#4648d4]'
                    : 'bg-[#c0c1ff]'
                }`}
                style={{ height: `${item.height}%` }}
              ></div>
              <span className={`text-[11px] font-semibold ${item.isToday ? 'text-[#006c49] font-bold' : 'text-[#464554]'}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Mini Accuracy Breakdown Footer */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#eff4ff]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4648d4] flex-shrink-0"></div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#464554] uppercase tracking-wider font-semibold">Quiz Accuracy</p>
              <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">{data.accuracyRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#eff4ff]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006c49] flex-shrink-0"></div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#464554] uppercase tracking-wider font-semibold">Time / Question</p>
              <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">{data.timePerQuestionSec} sec</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">Available Quizzes</h3>
          <button
            onClick={onSeeAllQuizzes}
            className="text-xs text-[#4648d4] font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>See all ({data.availableCount})</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col space-y-2.5">
          {data.availableQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-2xl p-4 bg-white shadow-sm border border-[#eff4ff] flex flex-col space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#4648d4] flex items-center justify-center font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {quiz.category.includes('Network') ? 'lan' : quiz.category.includes('Theory') ? 'calculate' : 'code'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#464554] text-[10px] font-semibold mb-1">
                      {quiz.category}
                    </span>
                    <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate">
                      {quiz.title}
                    </h4>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold flex-shrink-0">
                  Due Today
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#464554] pt-1 border-t border-[#eff4ff]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {quiz.duration} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">help_outline</span>
                    {quiz.question_count || 10} Qs
                  </span>
                </div>
                <button
                  onClick={() => onStartQuiz(quiz.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-semibold text-xs active:scale-95 transition-transform"
                >
                  Take Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">Recent Activity</h3>
          <button
            onClick={onViewHistory}
            className="text-xs text-[#4648d4] font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>View History</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          {data.recentAttempts.map((attempt) => {
            const letter = attempt.percentage >= 90 ? 'A' : attempt.percentage >= 80 ? 'B+' : attempt.percentage >= 70 ? 'B' : 'C';
            const colorClass = letter === 'A' 
              ? 'bg-[#006c49]/10 text-[#006c49]' 
              : letter === 'B+' 
              ? 'bg-[#4648d4]/10 text-[#4648d4]' 
              : 'bg-[#e5eeff] text-[#464554]';

            return (
              <div
                key={attempt.id}
                className="rounded-2xl p-3.5 bg-white shadow-sm border border-[#eff4ff] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 font-bold font-['Plus_Jakarta_Sans'] text-sm`}>
                    {letter}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-xs sm:text-sm text-[#0b1c30] truncate">
                      {attempt.quiz_title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-semibold ${attempt.percentage >= 70 ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                        {Math.round(attempt.percentage)}% Score
                      </span>
                      <span className="text-[#464554]/50 text-[10px]">•</span>
                      <span className="text-[11px] text-[#464554]">
                        {new Date(attempt.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onReviewAttempt(attempt.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-xs transition-colors flex-shrink-0"
                >
                  Review
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

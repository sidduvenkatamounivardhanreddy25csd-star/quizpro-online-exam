import React, { useState } from 'react';
import { Quiz } from '../types/quiz';

interface HomeTabProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: number) => void;
  onExploreQuizzes: () => void;
  onViewResults: () => void;
  onOpenAuth: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  quizzes,
  onStartQuiz,
  onExploreQuizzes,
  onViewResults,
  onOpenAuth,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'cs' | 'algo'>('all');
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});

  const handleReminderToggle = (id: string) => {
    setReminderSet(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Tag & Hero Statement */}
      <div className="space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9ddff] text-[#6b38d4] text-xs font-semibold">
          <span>🚀</span>
          <span>NEW TERM QUIZZES LIVE</span>
        </div>

        <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-3xl sm:text-4xl text-[#0b1c30] tracking-tight leading-tight">
          Master Your Skills with <span className="text-[#4648d4]">QuizPro</span>
        </h1>

        <p className="font-['Inter'] text-sm sm:text-base text-[#464554] leading-relaxed max-w-xl">
          Test your knowledge across Computer Science, Data Structures, Web Development, and more with instant automated grading.
        </p>

        {/* Primary Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={onExploreQuizzes}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-semibold text-sm shadow-md shadow-[#4648d4]/20 active:scale-[0.98] transition-all"
          >
            <span>Explore Quizzes</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={onViewResults}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#4648d4] font-semibold text-sm transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            <span>View My Scores</span>
          </button>
        </div>
      </div>

      {/* Hero Stats (3 Pill Cards) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-[#eff4ff] shadow-sm text-center">
          <p className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl sm:text-2xl text-[#0b1c30]">150+</p>
          <p className="text-[11px] text-[#464554] font-medium mt-0.5">Quizzes</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#eff4ff] shadow-sm text-center">
          <p className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl sm:text-2xl text-[#0b1c30]">12.4k</p>
          <p className="text-[11px] text-[#464554] font-medium mt-0.5">Students</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#eff4ff] shadow-sm text-center">
          <p className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl sm:text-2xl text-[#006c49]">98%</p>
          <p className="text-[11px] text-[#464554] font-medium mt-0.5">Pass Rate</p>
        </div>
      </div>

      {/* Featured & Available Quizzes Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">Featured & Available Quizzes</h2>
          <span className="flex items-center gap-1.5 text-xs text-[#006c49] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming (3)' },
            { id: 'cs', label: 'CS & Coding' },
            { id: 'algo', label: 'Algorithms' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-[#e5eeff] text-[#464554] hover:bg-[#dce9ff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Quizzes Scheduled List */}
      {(filter === 'all' || filter === 'upcoming') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#464554]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">schedule</span>
              Upcoming Quizzes
            </span>
            <span>3 scheduled</span>
          </div>

          {/* Scheduled Card 1 */}
          <div className="bg-white p-4 rounded-2xl border border-[#eff4ff] shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e9ddff] text-[#6b38d4] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud_queue</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">Cloud Architecture & DevOps</h3>
                  <p className="text-xs text-[#464554]">Microservices • Kubernetes • Event-Driven</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">Hard</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#464554] pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#4648d4]">alarm</span>
                Tomorrow, 10:00 AM
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                45 mins
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">quiz</span>
                35 Questions
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff]">
              <span className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#4648d4] text-xs font-semibold">Starts in 16 hrs</span>
              <button
                onClick={() => handleReminderToggle('cloud')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  reminderSet['cloud']
                    ? 'bg-[#006c49] text-white'
                    : 'bg-[#eff4ff] text-[#4648d4] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {reminderSet['cloud'] ? 'check' : 'notifications'}
                </span>
                <span>{reminderSet['cloud'] ? 'Reminder Set' : 'Set Reminder'}</span>
              </button>
            </div>
          </div>

          {/* Scheduled Card 2 */}
          <div className="bg-white p-4 rounded-2xl border border-[#eff4ff] shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">AI & Neural Networks</h3>
                  <p className="text-xs text-[#464554]">Syllabus Units 1-4 • Backprop & CNNs</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#4648d4] text-[10px] font-bold">Intermediate</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#464554] pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#4648d4]">calendar_today</span>
                Oct 28, 2:00 PM
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                50 mins
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">quiz</span>
                40 Questions
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff]">
              <span className="text-xs text-[#006c49] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">menu_book</span>
                Syllabus Released
              </span>
              <button
                onClick={() => handleReminderToggle('ai')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  reminderSet['ai']
                    ? 'bg-[#006c49] text-white'
                    : 'bg-[#eff4ff] text-[#4648d4] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {reminderSet['ai'] ? 'event_available' : 'calendar_month'}
                </span>
                <span>{reminderSet['ai'] ? 'Added' : 'Add to Calendar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Quizzes Ready to Take */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">Available Quizzes Ready to Take</h2>
          <span className="text-xs text-[#464554]">
            {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} online
          </span>
        </div>

        <div className="space-y-3">
          {(() => {
            const availableQuizzes = quizzes.filter(q => {
              if (filter === 'all' || filter === 'upcoming') return true;
              const cat = (q.category || '').toLowerCase();
              if (filter === 'cs') return cat.includes('computer') || cat.includes('software');
              if (filter === 'algo') return cat.includes('theory') || cat.includes('math') || cat.includes('data') || cat.includes('ai');
              return true;
            });

            if (availableQuizzes.length === 0) {
              return (
                <div className="bg-white p-6 rounded-2xl border border-[#eff4ff] text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#767586]">quiz</span>
                  <p className="text-xs font-semibold text-[#0b1c30]">No quizzes in this category</p>
                  <p className="text-[11px] text-[#464554]">Switch to "All" to browse all active assessments.</p>
                </div>
              );
            }

            return availableQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white p-4 rounded-2xl border border-[#eff4ff] shadow-sm hover:border-[#c7c4d7] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4648d4]/10 to-[#6b38d4]/10 text-[#4648d4] flex items-center justify-center flex-shrink-0 font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        {(quiz.category || '').includes('Database') ? 'database' : (quiz.category || '').includes('AI') ? 'neurology' : 'code'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30]">{quiz.title}</h3>
                      <p className="text-xs text-[#464554] line-clamp-1">{quiz.description || 'Academic examination assessment'}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#4648d4] text-[10px] font-bold shrink-0">
                    {quiz.category || 'Computer Science'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#464554] pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#4648d4]">schedule</span>
                      {quiz.duration} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">quiz</span>
                      {quiz.question_count ?? 0} Questions
                    </span>
                    <span className="flex items-center gap-0.5 text-[#006c49] font-bold">
                      ★ 4.8
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff]">
                  <div className="flex items-center gap-1 text-[11px] text-[#464554]">
                    <span className="material-symbols-outlined text-[14px] text-[#4648d4]">groups</span>
                    <span>{quiz.attempt_count || 0} enrolled</span>
                  </div>
                  <button
                    onClick={() => onStartQuiz(quiz.id)}
                    className="px-4 py-2 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span>Start Quiz</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </button>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Bottom Conversion Banner from Stitch */}
      <div className="rounded-2xl bg-gradient-to-br from-[#4648d4] via-[#6063ee] to-[#6b38d4] text-white p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="relative space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">Instant Certification & Analytics</span>
          <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base sm:text-lg">Ready to benchmark your knowledge?</h3>
          <p className="text-xs text-white/90 leading-relaxed">
            Join thousands of students today and get automated detailed diagnostic score reports with instant explanations.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#4648d4] font-bold text-xs shadow-sm hover:bg-[#f8f9ff] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

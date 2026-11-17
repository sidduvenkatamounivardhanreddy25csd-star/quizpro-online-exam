import React, { useState } from 'react';
import { Quiz } from '../types/quiz';

interface QuizzesTabProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: number) => void;
}

export const QuizzesTab: React.FC<QuizzesTabProps> = ({ quizzes, onStartQuiz }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultCategories = ['Computer Science', 'AI & Data Science', 'Core Theory', 'Database Systems', 'Software Engineering'];
  const categories = ['All', ...Array.from(new Set([...defaultCategories, ...quizzes.map(q => q.category).filter(Boolean)]))];

  const filtered = quizzes.filter(q => {
    const titleMatch = (q.title || '').toLowerCase().includes(search.toLowerCase());
    const descMatch = (q.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col space-y-4 pb-12 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#0b1c30]">Quiz Catalog</h1>
        <p className="text-xs text-[#464554]">Explore all academic examination modules and practice sprints.</p>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767586] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic, keyword, or title..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#eff4ff] text-sm text-[#0b1c30] placeholder:text-[#767586] shadow-sm focus:outline-none focus:border-[#4648d4]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'bg-white text-[#464554] border border-[#eff4ff] hover:bg-[#eff4ff]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Cards */}
      <div className="space-y-3 pt-1">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#eff4ff] space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#767586]">quiz</span>
            <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">No quizzes found</p>
            <p className="text-xs text-[#464554]">Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          filtered.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-4 rounded-2xl border border-[#eff4ff] shadow-sm hover:border-[#c7c4d7] transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#4648d4]/10 to-[#6b38d4]/15 text-[#4648d4] flex items-center justify-center font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {(quiz.category || '').includes('Database') ? 'database' : (quiz.category || '').includes('AI') ? 'neurology' : 'code'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#6b38d4] uppercase tracking-wider block mb-0.5">
                      {quiz.category || 'Computer Science'}
                    </span>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30]">
                      {quiz.title}
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#4648d4] text-[11px] font-bold shrink-0">
                  Pass: {quiz.pass_mark}%
                </span>
              </div>

              <p className="text-xs text-[#464554] leading-relaxed line-clamp-2">
                {quiz.description || 'Academic examination module.'}
              </p>

              <div className="flex items-center justify-between text-xs text-[#464554] pt-2 border-t border-[#eff4ff]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-[#4648d4]">schedule</span>
                    {quiz.duration} mins
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px]">help_outline</span>
                    {quiz.question_count ?? 0} Questions
                  </span>
                </div>

                <button
                  onClick={() => onStartQuiz(quiz.id)}
                  className="px-4 py-2 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <span>Take Quiz</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

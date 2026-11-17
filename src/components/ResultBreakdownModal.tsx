import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AttemptResult } from '../types/quiz';

interface ResultBreakdownModalProps {
  result: AttemptResult;
  onClose: () => void;
  onRetake: (quizId: number) => void;
}

export const ResultBreakdownModal: React.FC<ResultBreakdownModalProps> = ({
  result,
  onClose,
  onRetake
}) => {
  const [showMistakesOnly, setShowMistakesOnly] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [result.passed]);

  const mistakesCount = result.review.filter(q => !q.isCorrect).length;
  const filteredQuestions = showMistakesOnly
    ? result.review.filter(q => !q.isCorrect)
    : result.review;

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShareBadge = () => {
    const text = `I just scored ${Math.round(result.percentage)}% in ${result.quizTitle} on QuizPro! 🎓 Check it out.`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1c30]/60 backdrop-blur-sm flex flex-col justify-start items-center p-2 sm:p-4">
      <div className="bg-[#f8f9ff] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#eff4ff] flex flex-col min-h-0 my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="h-16 px-4 bg-white/90 backdrop-blur-xl border-b border-[#eff4ff] flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4648d4] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30] truncate max-w-[220px]">
              Result Breakdown
            </h1>
          </div>

          <div className="w-10"></div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Top Celebration Banner */}
          <div className="flex items-center gap-3 bg-[#eff4ff] p-3.5 rounded-2xl shadow-sm border border-[#dce9ff]">
            <div className="w-12 h-12 rounded-full bg-[#e9ddff] flex items-center justify-center shrink-0 text-[#6b38d4]">
              <span className="material-symbols-outlined text-[28px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30] truncate">
                Quiz Assessment Completed! 🎉
              </h2>
              <p className="text-xs text-[#464554] truncate">{result.quizTitle}</p>
            </div>
          </div>

          {/* Score Hero Card with Circular Mastery Gauge */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4648d4] via-[#6063ee] to-[#6b38d4] text-white p-6 shadow-xl shadow-[#4648d4]/20">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -top-6 w-32 h-32 bg-[#8455ef]/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Result Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#6ffbbe] text-[#002113] font-semibold text-xs shadow-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                <span>
                  {result.passed
                    ? result.percentage >= 85
                      ? 'Passed with Distinction 🏆'
                      : 'Passed Successfully'
                    : 'Needs Improvement'}
                </span>
              </div>

              {/* Gauge Ring Indicator */}
              <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    className="stroke-white/20"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    strokeWidth="10"
                  />
                  <circle
                    className="stroke-[#6ffbbe] transition-all duration-1000 ease-out"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    strokeDasharray="314.16"
                    strokeDashoffset={314.16 - (314.16 * result.percentage) / 100}
                    strokeLinecap="round"
                    strokeWidth="10"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-3xl text-white leading-none">
                    {Math.round(result.percentage)}%
                  </span>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                    Mastery
                  </span>
                </div>
              </div>

              {/* Sub-stat & Time Spent */}
              <div className="mt-2 flex flex-col items-center gap-1">
                <p className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#e1e0ff]">
                  {result.correctCount} / {result.totalQuestions} Correct • {result.score} / {result.total} Points
                </p>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  <span>
                    {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s{' '}
                    <span className="text-white/70">(of {result.duration}m limit)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analytics (3 Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                Performance Analytics
              </h3>
              <span className="text-[10px] font-bold text-[#4648d4] uppercase tracking-wider">
                Assessment Benchmarks
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#eff4ff]">
                <div className="w-7 h-7 rounded-lg bg-[#6ffbbe]/40 text-[#006c49] flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span className="text-[11px] text-[#464554] block">Accuracy</span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                  {result.percentage}%
                </span>
                <span className="text-[10px] text-[#006c49] font-semibold mt-0.5 block">
                  {result.passed ? 'Above pass mark' : 'Under threshold'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#eff4ff]">
                <div className="w-7 h-7 rounded-lg bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                </div>
                <span className="text-[11px] text-[#464554] block">Avg Speed</span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                  {Math.round(result.timeSpentSeconds / Math.max(result.totalQuestions, 1))}s
                </span>
                <span className="text-[10px] text-[#464554] font-medium mt-0.5 block">/ question</span>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#eff4ff]">
                <div className="w-7 h-7 rounded-lg bg-[#e9ddff] text-[#6b38d4] flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                </div>
                <span className="text-[11px] text-[#464554] block">Class Rank</span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                  #{result.classRank || 1}
                </span>
                <span className="text-[10px] text-[#6b38d4] font-medium mt-0.5 block">
                  of {result.totalPeers || 1} peers
                </span>
              </div>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eff4ff] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                Domain Breakdown
              </h3>
              <span className="text-xs text-[#464554]">Knowledge & Competency</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#0b1c30] truncate max-w-[200px]">
                    {result.quizCategory || result.quizTitle}
                  </span>
                  <span className="text-[#006c49] font-bold">
                    {Math.round((result.correctCount / Math.max(result.totalQuestions, 1)) * 100)}% ({result.correctCount}/{result.totalQuestions})
                  </span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#006c49] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((result.correctCount / Math.max(result.totalQuestions, 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#0b1c30]">Scoring Efficiency</span>
                  <span className={`${result.passed ? 'text-[#006c49]' : 'text-[#ba1a1a]'} font-bold`}>
                    {result.score} / {result.total} pts ({Math.round(result.percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div
                    className={`${result.passed ? 'bg-[#006c49]' : 'bg-[#ba1a1a]'} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.round(result.percentage))}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#0b1c30]">Pacing & Time Allocation</span>
                  <span className="text-[#4648d4] font-bold">
                    {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s of {result.duration}m
                  </span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#4648d4] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, Math.round((result.timeSpentSeconds / (result.duration * 60)) * 100)))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                Question Review ({result.review.length})
              </h3>
              <button
                onClick={() => setShowMistakesOnly(!showMistakesOnly)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                  showMistakesOnly
                    ? 'bg-[#e9ddff] text-[#6b38d4]'
                    : 'bg-[#e1e0ff] text-[#4648d4]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">filter_list</span>
                <span>{showMistakesOnly ? 'Show All Questions' : `Show Mistakes (${mistakesCount})`}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`bg-white p-4 rounded-2xl shadow-sm border transition-all space-y-2.5 ${
                    q.isCorrect ? 'border-[#eff4ff]' : 'border-[#ffdad6]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#4648d4]">
                      Question #{idx + 1}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        q.isCorrect ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {q.isCorrect ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{q.isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#0b1c30] font-medium leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {/* Student Answer */}
                    <div
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                        q.isCorrect
                          ? 'bg-[#6ffbbe]/20 text-[#002113]'
                          : 'bg-[#ffdad6]/40 text-[#93000a]'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-bold">Your Answer:</span> ({q.studentAnswer || 'None'}) {q.studentAnswerText}
                      </span>
                      <span className="material-symbols-outlined text-[16px] shrink-0 ml-1">
                        {q.isCorrect ? 'check' : 'close'}
                      </span>
                    </div>

                    {/* Correct Key if student missed it */}
                    {!q.isCorrect && (
                      <div className="p-2.5 rounded-xl text-xs bg-[#6ffbbe]/25 text-[#002113] flex items-center justify-between">
                        <span className="truncate">
                          <span className="font-bold">Correct Key:</span> ({q.correctAnswer}) {q.correctAnswerText}
                        </span>
                        <span className="material-symbols-outlined text-[#006c49] text-[16px] shrink-0 ml-1">
                          check_circle
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Explanation Note */}
                  {q.explanation && (
                    <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#464554] flex items-start gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-[15px] text-[#4648d4] shrink-0 mt-0.5">
                        lightbulb
                      </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Hub */}
          <div className="space-y-2 pt-2 border-t border-[#eff4ff]">
            <button
              onClick={() => onRetake(result.quizId)}
              className="w-full bg-[#4648d4] hover:bg-[#6063ee] text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#4648d4]/20 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Retake Quiz Assessment</span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Return to Dashboard</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#eff4ff] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4648d4]">download</span>
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleShareBadge}
                className="bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#eff4ff] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">share</span>
                <span>{copiedShare ? 'Copied Link!' : 'Share Badge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

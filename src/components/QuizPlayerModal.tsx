import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Question } from '../types/quiz';

interface QuizPlayerModalProps {
  quiz: Quiz & { questions: Question[] };
  onClose: () => void;
  onSubmit: (answers: Record<number, string>, timeSpentSeconds: number) => void;
  isSubmitting?: boolean;
}

export const QuizPlayerModal: React.FC<QuizPlayerModalProps> = ({
  quiz,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [showPalette, setShowPalette] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer logic
  const totalSeconds = quiz.duration * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    const currentQuestion = quiz.questions[currentIndex];
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));
  };

  const toggleFlagCurrent = () => {
    const currentQuestion = quiz.questions[currentIndex];
    if (!currentQuestion) return;
    setFlagged(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const submittingRef = useRef(false);

  const handleFinalSubmit = () => {
    if (submittingRef.current || isSubmitting) return;
    submittingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = totalSeconds - secondsRemaining;
    onSubmit(answers, Math.max(timeSpent, 1));
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal) return;
      if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelectOption('A');
      if (e.key === '2' || e.key === 'b' || e.key === 'B') handleSelectOption('B');
      if (e.key === '3' || e.key === 'c' || e.key === 'C') handleSelectOption('C');
      if (e.key === '4' || e.key === 'd' || e.key === 'D') handleSelectOption('D');
      if (e.key === 'ArrowRight' && currentIndex < quiz.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, quiz.questions, showConfirmModal]);

  const currentQuestion = quiz.questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining <= 120; // less than 2 minutes

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const progressPercent = quiz.questions.length > 0
    ? Math.round(((currentIndex + 1) / quiz.questions.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/70 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Quiz Top Navigation Bar */}
      <div className="bg-white border-b border-[#eff4ff] shadow-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Quit quiz? Your progress will not be submitted.')) {
                  onClose();
                }
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#464554] hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate max-w-[200px] sm:max-w-xs">
                {quiz.title}
              </h2>
              <span className="text-[11px] text-[#464554] font-medium block">
                Question {currentIndex + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors ${
                isTimeCritical
                  ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse'
                  : 'bg-[#eff4ff] text-[#4648d4]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">timer</span>
              <span>{timeFormatted}</span>
            </div>

            {/* Questions Palette Toggle */}
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#eff4ff] text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4648d4]">grid_view</span>
              <span className="hidden sm:inline">Palette</span>
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-[#eff4ff] h-1.5">
          <div
            className="bg-[#4648d4] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Assessment Body */}
      <div className="max-w-3xl mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-start">
        {/* Question Palette Drawer Popover if open */}
        {showPalette && (
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-[#eff4ff] mb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[#eff4ff]">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#0b1c30]">Question Palette</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#4648d4]"></span> Answered ({answeredCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#f59e0b]"></span> Flagged ({flaggedCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#eff4ff] border border-[#cbd5e1]"></span> Remaining
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPalette(false);
                    }}
                    className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center relative transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#4648d4] ring-offset-1 font-bold'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-[#4648d4] text-white'
                        : 'bg-[#eff4ff] text-[#464554] hover:bg-[#dce9ff]'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-1 ring-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Question Container */}
        {currentQuestion && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-[#eff4ff] space-y-6 animate-in fade-in duration-150">
            {/* Question Header & Flag Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#e1e0ff] text-[#07006c] font-bold text-xs">
                  Question #{currentIndex + 1}
                </span>
                <span className="text-xs text-[#767586]">
                  ({currentQuestion.points || 2} Points)
                </span>
              </div>

              <button
                onClick={toggleFlagCurrent}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  flagged[currentQuestion.id]
                    ? 'bg-[#f59e0b]/20 text-[#b45309]'
                    : 'bg-[#eff4ff] text-[#464554] hover:bg-[#e5eeff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {flagged[currentQuestion.id] ? 'bookmark_added' : 'bookmark_border'}
                </span>
                <span>{flagged[currentQuestion.id] ? 'Flagged for Review' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Statement */}
            <div className="text-[#0b1c30] font-['Plus_Jakarta_Sans'] font-semibold text-base sm:text-lg leading-relaxed">
              {currentQuestion.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d },
              ].map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.key;

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key as any)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'border-[#4648d4] bg-[#eff4ff] ring-2 ring-[#4648d4]/20 shadow-sm'
                        : 'border-[#eff4ff] bg-white hover:border-[#c0c1ff] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#4648d4] text-white'
                          : 'bg-[#eff4ff] text-[#464554] group-hover:bg-[#dce9ff]'
                      }`}
                    >
                      {opt.key}
                    </div>

                    <span className={`text-xs sm:text-sm leading-relaxed flex-1 ${isSelected ? 'font-semibold text-[#0b1c30]' : 'text-[#464554]'}`}>
                      {opt.text}
                    </span>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0">
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4648d4]"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quiz Bottom Action Bar */}
      <div className="bg-white border-t border-[#eff4ff] p-3 sm:p-4 sticky bottom-0 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="text-xs text-[#767586] font-medium hidden sm:inline">
            Answered {answeredCount} of {quiz.questions.length}
          </span>

          <div className="flex items-center gap-2">
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#4648d4] text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            ) : null}

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-bold shadow-md shadow-[#4648d4]/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Submit Assessment</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Final Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[30px]">fact_check</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
                Ready to submit?
              </h3>
              <p className="text-xs text-[#464554]">
                Please review your progress before completing the assessment.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-2xl grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#464554] block">Answered</span>
                <span className="font-bold text-[#006c49] text-base">{answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#464554] block">Unanswered</span>
                <span className="font-bold text-[#ba1a1a] text-base">
                  {quiz.questions.length - answeredCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#464554] block">Flagged</span>
                <span className="font-bold text-[#b45309] text-base">{flaggedCount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold hover:bg-[#dce9ff]"
              >
                Keep Reviewing
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-bold shadow-md shadow-[#4648d4]/20 flex items-center justify-center gap-1"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Confirm & Finish</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

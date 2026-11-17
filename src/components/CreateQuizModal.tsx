import React, { useState, useEffect } from 'react';
import { Quiz, AdminQuestion } from '../types/quiz';

interface CreateQuizModalProps {
  quizToEdit?: (Quiz & { questions: AdminQuestion[] }) | null;
  onClose: () => void;
  onSave: (quizData: any) => Promise<void>;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  quizToEdit,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState(quizToEdit?.title || '');
  const [category, setCategory] = useState(quizToEdit?.category || 'Computer Science');
  const [description, setDescription] = useState(quizToEdit?.description || '');
  const [duration, setDuration] = useState(quizToEdit?.duration || 30);
  const [passMark, setPassMark] = useState(quizToEdit?.pass_mark || 70);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showInstantAnswers, setShowInstantAnswers] = useState(false);
  const [strictCountdown, setStrictCountdown] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Questions Bank
  const [questions, setQuestions] = useState<
    Array<{
      question: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      correct_answer: 'A' | 'B' | 'C' | 'D';
      explanation: string;
      points: number;
    }>
  >(() => {
    if (quizToEdit?.questions && quizToEdit.questions.length > 0) {
      return quizToEdit.questions.map(q => ({
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer || 'A',
        explanation: q.explanation || '',
        points: q.points || 2
      }));
    }
    return [
      {
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        explanation: '',
        points: 2
      }
    ];
  });

  // Sync state if quizToEdit prop changes
  useEffect(() => {
    if (quizToEdit) {
      setTitle(quizToEdit.title || '');
      setCategory(quizToEdit.category || 'Computer Science');
      setDescription(quizToEdit.description || '');
      setDuration(quizToEdit.duration || 30);
      setPassMark(quizToEdit.pass_mark || 70);
      if (quizToEdit.questions && quizToEdit.questions.length > 0) {
        setQuestions(
          quizToEdit.questions.map(q => ({
            question: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer || 'A',
            explanation: q.explanation || '',
            points: q.points || 2
          }))
        );
      }
    }
  }, [quizToEdit]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        explanation: '',
        points: 2
      }
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setErrorMessage('A quiz must have at least one question.');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const validateForm = (isPublishing: boolean): string | null => {
    if (!title.trim()) {
      setCurrentStep(1);
      return 'Please enter a quiz title.';
    }

    if (!duration || duration <= 0) {
      setCurrentStep(1);
      return 'Quiz duration must be greater than 0 minutes.';
    }

    if (questions.length === 0) {
      setCurrentStep(2);
      return 'A quiz must contain at least one question.';
    }

    if (isPublishing) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim()) {
          setCurrentStep(2);
          return `Question #${i + 1} statement cannot be empty.`;
        }
        if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
          setCurrentStep(2);
          return `Please provide all four options (A, B, C, D) for Question #${i + 1}.`;
        }
        if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
          setCurrentStep(2);
          return `Please select a valid correct answer key for Question #${i + 1}.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (publish: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const error = validateForm(publish);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category,
        description: description.trim(),
        duration,
        pass_mark: passMark,
        published: publish ? 1 : 0,
        questions
      });
      setSuccessMessage(publish ? 'Quiz published successfully! It is now live for students.' : 'Quiz saved as draft.');
      setTimeout(() => {
        onClose();
      }, 750);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1c30]/60 backdrop-blur-sm flex justify-center p-2 sm:p-4">
      <div className="bg-[#f8f9ff] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#eff4ff] flex flex-col my-auto max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="h-16 px-4 bg-white/95 backdrop-blur-xl border-b border-[#eff4ff] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4648d4] text-white flex items-center justify-center font-bold text-xs">
                P
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30]">
                {quizToEdit ? 'Edit Quiz Assessment' : 'Create New Quiz'}
              </h1>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#006c49] flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#006c49]"></span> Ready
          </span>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto pb-24">
          {/* Header Banner & Micro-Indicator */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">edit_note</span>
                Authoring Mode
              </span>
              <span className="text-xs text-[#767586] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span> Auto-saved
              </span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl sm:text-2xl text-[#0b1c30]">
              {quizToEdit ? 'Update Quiz Details' : 'Configure Assessment'}
            </h2>
            <p className="text-xs text-[#464554]">
              Configure metadata, time restrictions, scoring criteria, and multiple-choice questions.
            </p>
          </div>

          {/* Error and Success Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center justify-between gap-2 border border-[#ba1a1a]/20 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#ffb4ab] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-[#6ffbbe]/30 text-[#006c49] text-xs font-bold flex items-center gap-2 border border-[#006c49]/20 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Stepper Track */}
          <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2.5 text-left transition-opacity ${
                currentStep === 1 ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 1 ? 'bg-[#4648d4] text-white shadow-sm' : 'bg-white text-[#4648d4]'
                }`}
              >
                1
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30]">Configuration</p>
                <p className="text-[10px] text-[#464554]">Metadata & rules</p>
              </div>
            </button>

            <span className="material-symbols-outlined text-[#767586] text-[18px]">chevron_right</span>

            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2.5 text-left transition-opacity ${
                currentStep === 2 ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 2 ? 'bg-[#4648d4] text-white shadow-sm' : 'bg-white text-[#4648d4]'
                }`}
              >
                2
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30]">Questions</p>
                <p className="text-[10px] text-[#4648d4] font-bold">{questions.length} defined</p>
              </div>
            </button>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-[#eff4ff] space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#eff4ff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">Basic Information</h3>
                    <p className="text-[11px] text-[#464554]">Core details, timing, and assessment policy</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#4648d4]">
                  Required
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
                  Quiz Title <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#767586] text-[18px]">
                    title
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Python Backend & Flask Architecture"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4] transition-all"
                  />
                </div>
                <p className="text-[10px] text-[#767586]">Visible to students on their assigned examination board.</p>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
                  Category / Department <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#767586] text-[18px]">
                    domain
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#0b1c30] outline-none appearance-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4] transition-all cursor-pointer"
                  >
                    <option>Computer Science</option>
                    <option>AI & Data Science</option>
                    <option>Core Theory</option>
                    <option>Database Systems</option>
                    <option>Software Engineering</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#767586] text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Assessment Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide test objectives, topic scope, and instructions..."
                  className="w-full p-3 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4] transition-all resize-none"
                />
                <div className="flex justify-between items-center text-[10px] text-[#767586]">
                  <span>Provide objectives and preparation tips</span>
                  <span>{description.length} / 300 chars</span>
                </div>
              </div>

              {/* Dual Metric Inputs: Duration & Pass Mark */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Duration Stepper */}
                <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1.5">
                  <span className="text-[11px] text-[#464554] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#4648d4]">schedule</span>
                    Duration
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setDuration(prev => Math.max(5, prev - 5))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] shadow-sm hover:bg-[#dce9ff]"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                      {duration} <span className="text-[10px] text-[#464554] font-normal">min</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setDuration(prev => Math.min(180, prev + 5))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] shadow-sm hover:bg-[#dce9ff]"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>

                {/* Pass Mark Slider */}
                <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#464554] font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#006c49]">verified</span>
                      Pass Mark
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#006c49]">
                      {passMark}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={5}
                    value={passMark}
                    onChange={(e) => setPassMark(parseInt(e.target.value, 10))}
                    className="w-full accent-[#4648d4] cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[18px]">shuffle</span>
                    <div>
                      <span className="text-xs font-semibold text-[#0b1c30] block">Shuffle Questions</span>
                      <span className="text-[10px] text-[#464554]">Randomize sequence per candidate</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 accent-[#4648d4] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#6b38d4] text-[18px]">quickreply</span>
                    <div>
                      <span className="text-xs font-semibold text-[#0b1c30] block">Show Instant Answers</span>
                      <span className="text-[10px] text-[#464554]">Immediate feedback on selection</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showInstantAnswers}
                    onChange={(e) => setShowInstantAnswers(e.target.checked)}
                    className="w-4 h-4 accent-[#4648d4] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">alarm_on</span>
                    <div>
                      <span className="text-xs font-semibold text-[#0b1c30] block">Strict Countdown Timer</span>
                      <span className="text-[10px] text-[#464554]">Auto-submit upon timer expiration</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictCountdown}
                    onChange={(e) => setStrictCountdown(e.target.checked)}
                    className="w-4 h-4 accent-[#4648d4] rounded"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-2.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Continue to Questions ({questions.length})</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Questions Bank */}
          {currentStep === 2 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e9ddff] text-[#6b38d4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">Questions Bank</h3>
                    <p className="text-[11px] text-[#464554]">Compose options and mark correct key</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e1e0ff] text-[#4648d4] text-[11px] font-bold">
                  {questions.length} Questions
                </span>
              </div>

              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#eff4ff] space-y-3 relative"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                    <div className="flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#4648d4]">
                        Question #{qIdx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#e9ddff] text-[#6b38d4] text-[10px] font-bold">
                        Single Choice
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff4ff] text-xs">
                        <span className="material-symbols-outlined text-[15px] text-[#6b38d4]">stars</span>
                        <select
                          value={q.points}
                          onChange={(e) => updateQuestion(qIdx, 'points', parseInt(e.target.value, 10))}
                          className="bg-transparent font-semibold text-[#0b1c30] outline-none text-xs cursor-pointer"
                        >
                          <option value={1}>1 Point</option>
                          <option value={2}>2 Points</option>
                          <option value={5}>5 Points</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6]"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Statement */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0b1c30]">Question Statement</label>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                      placeholder="e.g. What is the output of type((1,)) in Python?"
                      className="w-full p-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white border border-transparent focus:border-[#4648d4] transition-all resize-none"
                    />
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0b1c30]">Answer Options</span>
                      <span className="text-[#006c49] font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span> Radio sets answer key
                      </span>
                    </div>

                    {[
                      { key: 'A', field: 'option_a' },
                      { key: 'B', field: 'option_b' },
                      { key: 'C', field: 'option_c' },
                      { key: 'D', field: 'option_d' },
                    ].map((opt) => {
                      const isCorrect = q.correct_answer === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                            isCorrect ? 'bg-[#6ffbbe]/20 ring-1 ring-[#006c49]' : 'bg-[#eff4ff]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={isCorrect}
                            onChange={() => updateQuestion(qIdx, 'correct_answer', opt.key)}
                            className="w-4 h-4 accent-[#006c49] cursor-pointer"
                          />
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect ? 'bg-[#006c49] text-white' : 'bg-white text-[#464554]'
                            }`}
                          >
                            {opt.key}
                          </div>
                          <input
                            type="text"
                            value={(q as any)[opt.field]}
                            onChange={(e) => updateQuestion(qIdx, opt.field, e.target.value)}
                            placeholder={`Option ${opt.key} text`}
                            className="flex-1 bg-transparent text-xs text-[#0b1c30] outline-none font-medium"
                          />
                          {isCorrect && (
                            <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-bold shrink-0">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-semibold text-[#0b1c30] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#4648d4]">lightbulb</span>
                      Answer Explanation Note
                    </label>
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="Why is this answer correct? Shown during review..."
                      className="w-full p-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white border border-transparent focus:border-[#4648d4] transition-all resize-none"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-3 rounded-2xl bg-white hover:bg-[#eff4ff] text-[#4648d4] font-semibold text-xs flex items-center justify-center gap-1.5 border border-dashed border-[#c0c1ff] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Another Question</span>
              </button>
            </section>
          )}

          {/* Auxiliary Anti-Cheating Suite Preview */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#eff4ff] flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#4648d4] uppercase tracking-wider block">
                Proctoring Ready
              </span>
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30] truncate">
                Automated Integrity Suite
              </h4>
              <p className="text-[11px] text-[#464554] truncate">
                Tab-switch monitoring, server-side timer enforcement, and answer hiding active.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-3.5 bg-white border-t border-[#eff4ff] flex items-center gap-2.5 sticky bottom-0 z-30">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(false)}
            className={`flex-1 py-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              isSaving ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            <span>{isSaving ? 'Saving...' : 'Save as Draft'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(true)}
            className={`flex-1 py-3 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-bold shadow-md shadow-[#4648d4]/20 flex items-center justify-center gap-1.5 transition-all ${
              isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing Quiz...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Publish Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

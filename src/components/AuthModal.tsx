import React, { useState } from 'react';
import { User } from '../types/quiz';
import { api } from '../lib/api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillQuickDemo = (demoRole: 'student' | 'admin') => {
    if (demoRole === 'student') {
      setEmail('student@quizpro.edu');
      setPassword('alex123');
      setRole('student');
    } else {
      setEmail('admin@quizpro.edu');
      setPassword('admin123');
      setRole('admin');
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { user } = await api.login(email, password);
        onSuccess(user);
        onClose();
      } else {
        const { user } = await api.register(name, email, password, role);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#eff4ff] animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4648d4] to-[#6b38d4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              P
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                {mode === 'login' ? 'Sign In to QuizPro' : 'Create Free Account'}
              </h2>
              <p className="text-[11px] text-[#464554]">
                Online Quiz & Result Management Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#767586] hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="bg-[#eff4ff] p-3 rounded-2xl space-y-2 border border-[#dce9ff]">
          <span className="text-[10px] uppercase font-bold text-[#4648d4] tracking-wider block">
            ⚡ Quick 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('student')}
              className="py-1.5 px-2 bg-white hover:bg-[#e1e0ff] rounded-xl text-left border border-[#eff4ff] transition-all text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4648d4]">school</span>
              <span className="truncate">Alex (Student)</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-[#e9ddff] rounded-xl text-left border border-[#eff4ff] transition-all text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">admin_panel_settings</span>
              <span className="truncate">Eleanor (Admin)</span>
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-[#eff4ff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'login' ? 'bg-white text-[#4648d4] shadow-sm' : 'text-[#464554]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'register' ? 'bg-white text-[#4648d4] shadow-sm' : 'text-[#464554]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === 'student'
                        ? 'bg-[#e1e0ff] text-[#07006c] border-[#4648d4]'
                        : 'bg-[#eff4ff] text-[#464554] border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === 'admin'
                        ? 'bg-[#e9ddff] text-[#23005c] border-[#6b38d4]'
                        : 'bg-[#eff4ff] text-[#464554] border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@quizpro.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20 border border-transparent focus:border-[#4648d4]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-xs shadow-md shadow-[#4648d4]/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {mode === 'login' ? 'login' : 'how_to_reg'}
            </span>
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

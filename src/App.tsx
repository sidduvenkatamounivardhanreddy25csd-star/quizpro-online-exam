/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Quiz, Question, AdminQuestion, AttemptResult, AttemptHistoryItem, StudentDashboardData, AdminOverviewData } from './types/quiz';
import { api, getStoredUser, clearStoredAuth } from './lib/api';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { DashboardTab } from './components/DashboardTab';
import { QuizzesTab } from './components/QuizzesTab';
import { ResultsTab } from './components/ResultsTab';
import { AdminTab } from './components/AdminTab';
import { QuizPlayerModal } from './components/QuizPlayerModal';
import { ResultBreakdownModal } from './components/ResultBreakdownModal';
import { CreateQuizModal } from './components/CreateQuizModal';
import { AuthModal } from './components/AuthModal';
import { AdminReportsModal } from './components/AdminReportsModal';

export default function App() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [adminQuizzes, setAdminQuizzes] = useState<Quiz[]>([]);
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboardData | null>(null);
  const [adminOverview, setAdminOverview] = useState<AdminOverviewData | null>(null);
  const [myAttempts, setMyAttempts] = useState<AttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [activeQuizTaking, setActiveQuizTaking] = useState<(Quiz & { questions: Question[] }) | null>(null);
  const [activeResultBreakdown, setActiveResultBreakdown] = useState<AttemptResult | null>(null);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState<(Quiz & { questions: AdminQuestion[] }) | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminReportsOpen, setAdminReportsOpen] = useState(false);
  const [adminReportsData, setAdminReportsData] = useState<any[]>([]);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // Load app data
  const loadData = async () => {
    try {
      const isUserAdmin = user?.role === 'admin';
      const [fetchedQuizzes, fetchedAdminQuizzes, fetchedDash, fetchedAdmin, fetchedAttempts] = await Promise.all([
        api.getQuizzes().catch(() => []),
        isUserAdmin ? api.getAdminQuizzes().catch(() => []) : Promise.resolve([]),
        api.getStudentDashboard().catch(() => null),
        isUserAdmin ? api.getAdminOverview().catch(() => null) : Promise.resolve(null),
        api.getMyAttempts().catch(() => [])
      ]);

      setQuizzes(fetchedQuizzes);
      if (isUserAdmin && fetchedAdminQuizzes.length > 0) {
        setAdminQuizzes(fetchedAdminQuizzes);
      } else {
        setAdminQuizzes(fetchedQuizzes);
      }
      if (fetchedDash) setStudentDashboard(fetchedDash);
      if (fetchedAdmin) setAdminOverview(fetchedAdmin);
      setMyAttempts(fetchedAttempts);
    } catch (err) {
      console.error('Error loading QuizPro data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, currentTab]);

  // Switch demo persona
  const handleSwitchRole = async (role: 'student' | 'admin') => {
    try {
      const { user: updatedUser } = await api.switchDemo(role);
      setUser(updatedUser);
      if (role === 'admin') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('dashboard');
      }
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
    setCurrentTab('home');
  };

  // Start taking a quiz
  const handleStartQuiz = async (quizId: number) => {
    try {
      await api.startQuiz(quizId);
      const quizDetails = await api.getQuiz(quizId);
      if (!quizDetails.questions || quizDetails.questions.length === 0) {
        alert('This quiz does not have any questions yet.');
        return;
      }
      setActiveQuizTaking(quizDetails);
    } catch (err: any) {
      alert(err.message || 'Failed to start quiz');
    }
  };

  // Submit active quiz answers
  const handleSubmitQuiz = async (answers: Record<number, string>, timeSpentSeconds: number) => {
    if (!activeQuizTaking) return;
    setIsSubmittingQuiz(true);
    try {
      const result = await api.submitQuiz(activeQuizTaking.id, answers, timeSpentSeconds);
      setActiveQuizTaking(null);
      setActiveResultBreakdown(result);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Open review for past attempt
  const handleReviewAttempt = async (attemptId: number) => {
    try {
      const attemptBreakdown = await api.getAttempt(attemptId);
      setActiveResultBreakdown(attemptBreakdown);
    } catch (err: any) {
      alert(err.message || 'Failed to load attempt details');
    }
  };

  // Admin: Open Create Quiz
  const handleOpenCreateQuiz = () => {
    setQuizToEdit(null);
    setCreateQuizOpen(true);
  };

  // Admin: Open Edit Quiz
  const handleOpenEditQuiz = async (quizId: number) => {
    try {
      const adminQuiz = await api.getQuizAdmin(quizId);
      setQuizToEdit(adminQuiz);
      setCreateQuizOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load quiz details');
    }
  };

  // Admin: Save or Update Quiz
  const handleSaveQuiz = async (quizData: any) => {
    try {
      if (quizToEdit) {
        await api.updateQuiz(quizToEdit.id, quizData);
        showToast(quizData.published === 1 ? 'Quiz updated and published!' : 'Quiz draft updated.', 'success');
      } else {
        await api.createQuiz(quizData);
        showToast(quizData.published === 1 ? 'Quiz published successfully! Now live for students.' : 'Quiz saved as draft.', 'success');
      }
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save quiz', 'error');
      throw err;
    }
  };

  // Admin: Delete Quiz
  const handleDeleteQuiz = async (quizId: number) => {
    try {
      await api.deleteQuiz(quizId);
      showToast('Quiz deleted successfully.', 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete quiz', 'error');
    }
  };

  // Admin: Toggle Publish Status
  const handleTogglePublish = async (quizId: number) => {
    try {
      const res = await api.togglePublish(quizId);
      showToast(res.published === 1 ? 'Quiz is now published and visible to students!' : 'Quiz has been unpublished to drafts.', 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle publish status', 'error');
    }
  };

  // Admin: Open Reports
  const handleOpenReports = async () => {
    try {
      const reports = await api.getAdminReports();
      setAdminReportsData(reports);
      setAdminReportsOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load reports');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Header */}
      <Header
        user={user}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl border flex items-center gap-2 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-[#002113] text-[#6ffbbe] border-[#006c49]/40'
                : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-20 pb-24 min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-10 h-10 border-3 border-[#4648d4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-[#464554]">Loading QuizPro environment...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeTab
                quizzes={quizzes}
                onStartQuiz={handleStartQuiz}
                onExploreQuizzes={() => setCurrentTab('quizzes')}
                onViewResults={() => setCurrentTab('results')}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentTab === 'dashboard' && studentDashboard && (
              <DashboardTab
                data={studentDashboard}
                onStartQuiz={handleStartQuiz}
                onReviewAttempt={handleReviewAttempt}
                onSeeAllQuizzes={() => setCurrentTab('quizzes')}
                onViewHistory={() => setCurrentTab('results')}
              />
            )}

            {currentTab === 'quizzes' && (
              <QuizzesTab
                quizzes={quizzes}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {currentTab === 'results' && (
              <ResultsTab
                attempts={myAttempts}
                onReviewAttempt={handleReviewAttempt}
                onExploreQuizzes={() => setCurrentTab('quizzes')}
                onRefresh={loadData}
                isAdmin={user?.role === 'admin'}
              />
            )}

            {currentTab === 'admin' && adminOverview && (
              <AdminTab
                overview={adminOverview}
                quizzes={adminQuizzes.length > 0 ? adminQuizzes : quizzes}
                onCreateNewQuiz={handleOpenCreateQuiz}
                onEditQuiz={handleOpenEditQuiz}
                onDeleteQuiz={handleDeleteQuiz}
                onTogglePublish={handleTogglePublish}
                onExportReports={handleOpenReports}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Active Quiz Assessment Modal (Timed Player) */}
      {activeQuizTaking && (
        <QuizPlayerModal
          quiz={activeQuizTaking}
          onClose={() => setActiveQuizTaking(null)}
          onSubmit={handleSubmitQuiz}
          isSubmitting={isSubmittingQuiz}
        />
      )}

      {/* Result Breakdown Modal (Image 10) */}
      {activeResultBreakdown && (
        <ResultBreakdownModal
          result={activeResultBreakdown}
          onClose={() => setActiveResultBreakdown(null)}
          onRetake={(quizId) => {
            setActiveResultBreakdown(null);
            handleStartQuiz(quizId);
          }}
        />
      )}

      {/* Admin: Create / Edit Quiz Modal (Image 12) */}
      {createQuizOpen && (
        <CreateQuizModal
          quizToEdit={quizToEdit}
          onClose={() => {
            setCreateQuizOpen(false);
            setQuizToEdit(null);
          }}
          onSave={handleSaveQuiz}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            if (loggedUser.role === 'admin') {
              setCurrentTab('admin');
            } else {
              setCurrentTab('dashboard');
            }
          }}
        />
      )}

      {/* Admin Reports Export Modal */}
      {adminReportsOpen && (
        <AdminReportsModal
          reports={adminReportsData}
          onClose={() => setAdminReportsOpen(false)}
        />
      )}
    </div>
  );
}

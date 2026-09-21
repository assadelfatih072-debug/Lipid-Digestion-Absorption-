import { useState, useMemo } from 'react';
import { QUESTIONS } from './data/questions';
import { QuizMode } from './types';
import { Navbar } from './components/Navbar';
import { QuestionCard } from './components/QuestionCard';
import { ScoreModal } from './components/ScoreModal';
import { ChallengeCalculator } from './components/ChallengeCalculator';
import { QuickReviewList } from './components/QuickReviewList';
import {
  Send,
  RotateCcw,
  Sparkles,
  Filter,
  CheckCircle,
  AlertCircle,
  Calculator,
  Flame,
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<QuizMode>('practice');
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // Filter state
  const [filterSection, setFilterSection] = useState<'all' | 'standard' | 'challenge' | 'mistakes'>('all');
  const [filterBookmarked, setFilterBookmarked] = useState<boolean>(false);

  // Statistics calculation
  const answeredCount = Object.keys(answers).length;
  const totalCount = QUESTIONS.length;

  const score = useMemo(() => {
    return QUESTIONS.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  }, [answers]);

  const incorrectQuestionIds = useMemo(() => {
    return QUESTIONS.filter((q) => answers[q.id] && answers[q.id] !== q.correctAnswer).map((q) => q.id);
  }, [answers]);

  // Handle option select with immediate correction
  const handleSelectOption = (questionId: number, optionId: 'A' | 'B' | 'C' | 'D') => {
    // Immediate correction locks option on selection
    if (answers[questionId]) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Toggle bookmark
  const handleToggleBookmark = (questionId: number) => {
    setBookmarked((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  // Reset entire quiz
  const handleReset = () => {
    if (answeredCount > 0 && !window.confirm('Are you sure you want to reset all answers?')) {
      return;
    }
    setAnswers({});
    setIsSubmitted(false);
    setShowScoreModal(false);
    setFilterSection('all');
  };

  // Submit exam
  const handleSubmitExam = () => {
    const unans = totalCount - answeredCount;
    if (unans > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unans} unanswered question(s). Finish exam and view score summary anyway?`
      );
      if (!confirmSubmit) return;
    }
    setIsSubmitted(true);
    setShowScoreModal(true);
  };

  // Filter questions
  const displayedQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (filterBookmarked && !bookmarked.includes(q.id)) {
        return false;
      }
      if (filterSection === 'standard' && q.section !== 'mcq') {
        return false;
      }
      if (filterSection === 'challenge' && q.section !== 'challenge') {
        return false;
      }
      if (filterSection === 'mistakes' && !incorrectQuestionIds.includes(q.id)) {
        return false;
      }
      return true;
    });
  }, [filterBookmarked, filterSection, bookmarked, incorrectQuestionIds]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900 pb-20">
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        setMode={(m) => {
          setMode(m);
          setFilterSection('all');
        }}
        showCalculator={showCalculator}
        setShowCalculator={setShowCalculator}
        answeredCount={answeredCount}
        totalCount={totalCount}
        score={score}
        submitted={isSubmitted}
        bookmarkedCount={bookmarked.length}
        filterBookmarked={filterBookmarked}
        setFilterBookmarked={setFilterBookmarked}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        {/* Banner with lecture theme info */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6 text-9xl font-bold font-mono">
            TAG
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Medical Biochemistry Lecture Series
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Lipid Digestion, Absorption &amp; β-Oxidation
            </h2>

            <p className="text-teal-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              25 comprehensive multiple-choice questions with immediate correction and detailed explanations. Covering lipid digestion, bile salts and pancreatic lipase, fatty acid absorption pathways, lipolysis and HSL regulation, the β-oxidation spiral, ATP bioenergetics formulas, and the 20-carbon arachidic acid challenge (Net ATP = 163).
            </p>

            {/* Quick Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setShowCalculator(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Open ATP Calculator (Q21–Q25)</span>
              </button>

              <button
                onClick={() => {
                  setMode('practice');
                  setFilterSection('all');
                }}
                className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  mode === 'practice'
                    ? 'bg-white/20 text-white border-white/40 font-semibold'
                    : 'bg-teal-900/40 text-teal-200 border-teal-700/50 hover:bg-teal-900/60'
                }`}
              >
                Practice All Questions
              </button>
            </div>
          </div>
        </div>

        {/* Mode-specific content */}
        {mode === 'flashcards' ? (
          <QuickReviewList
            questions={QUESTIONS}
            language="en"
            bookmarked={bookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          <div className="space-y-5">
            {/* Filter toolbar & Quick Question Jump Grid */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setFilterSection('all')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      filterSection === 'all'
                        ? 'bg-teal-700 text-white border-teal-800 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Questions ({QUESTIONS.length})
                  </button>

                  <button
                    onClick={() => setFilterSection('standard')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      filterSection === 'standard'
                        ? 'bg-teal-700 text-white border-teal-800 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Standard MCQs (1–20)
                  </button>

                  <button
                    onClick={() => setFilterSection('challenge')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                      filterSection === 'challenge'
                        ? 'bg-amber-600 text-white border-amber-700 font-semibold'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Flame className="w-3 h-3 fill-current" />
                    ⚡ Challenge (21–25)
                  </button>

                  {incorrectQuestionIds.length > 0 && (
                    <button
                      onClick={() => setFilterSection('mistakes')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                        filterSection === 'mistakes'
                          ? 'bg-rose-600 text-white border-rose-700 font-semibold'
                          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      Mistakes Only ({incorrectQuestionIds.length})
                    </button>
                  )}
                </div>

                {/* Reset button */}
                {answeredCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Answers</span>
                  </button>
                )}
              </div>

              {/* Numbered Jump Grid with Immediate Visual Status */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Q:
                </span>
                {QUESTIONS.map((q) => {
                  const isAns = !!answers[q.id];
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  const isChallenge = q.section === 'challenge';

                  let btnStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';
                  if (isAns) {
                    btnStyle = isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-rose-600 text-white border-rose-600 font-bold';
                  } else if (isChallenge) {
                    btnStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        const el = document.getElementById(`question-card-${q.id}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      title={`Question ${q.id}${isAns ? (isCorrect ? ' (Correct)' : ' (Incorrect)') : ''}`}
                      className={`w-7 h-7 shrink-0 text-xs rounded-lg border font-mono flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List */}
            {displayedQuestions.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-2">
                <p className="text-slate-600 text-sm font-medium">
                  No questions match your current filter criteria.
                </p>
                <button
                  onClick={() => {
                    setFilterSection('all');
                    setFilterBookmarked(false);
                  }}
                  className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    selectedOption={answers[question.id]}
                    onSelectOption={(opt) => handleSelectOption(question.id, opt)}
                    isBookmarked={bookmarked.includes(question.id)}
                    onToggleBookmark={() => handleToggleBookmark(question.id)}
                    mode={mode}
                    isSubmitted={isSubmitted}
                    language="en"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky Exam Mode Bottom Action Bar */}
      {mode === 'exam' && !isSubmitted && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3 sm:p-4 shadow-lg z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">Exam Mode:</span>
              <span className="font-mono font-bold text-teal-700">
                {answeredCount} / {totalCount}
              </span>
              <span className="text-slate-500 hidden sm:inline">answered</span>
              {answeredCount > 0 && (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs ml-2">
                  Live Score: {score}/{answeredCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-submit-exam"
                onClick={handleSubmitExam}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Finish Exam &amp; View Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score and Detailed Breakdown Modal */}
      {showScoreModal && (
        <ScoreModal
          score={score}
          total={totalCount}
          questions={QUESTIONS}
          userAnswers={answers}
          onRetake={handleReset}
          onReviewMistakes={() => {
            setShowScoreModal(false);
            setFilterSection('mistakes');
          }}
          onClose={() => setShowScoreModal(false)}
        />
      )}

      {/* Challenge ATP Calculator Modal */}
      <ChallengeCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </div>
  );
}

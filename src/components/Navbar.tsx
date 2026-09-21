import { BookOpen, Award, Calculator, CheckCircle2, Bookmark } from 'lucide-react';
import { QuizMode } from '../types';

interface NavbarProps {
  mode: QuizMode;
  setMode: (mode: QuizMode) => void;
  showCalculator: boolean;
  setShowCalculator: (show: boolean) => void;
  answeredCount: number;
  totalCount: number;
  score: number;
  submitted: boolean;
  bookmarkedCount: number;
  filterBookmarked: boolean;
  setFilterBookmarked: (val: boolean) => void;
  onReset: () => void;
}

export function Navbar({
  mode,
  setMode,
  showCalculator,
  setShowCalculator,
  answeredCount,
  totalCount,
  score,
  submitted: _submitted,
  bookmarkedCount,
  filterBookmarked,
  setFilterBookmarked,
}: NavbarProps) {
  const percentComplete = Math.round((answeredCount / totalCount) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Lecture Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                β
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-snug">
                    Lipid Metabolism MCQs
                  </h1>
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    25 Questions
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Digestion, Absorption &amp; β-Oxidation
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Modes */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
              <button
                id="tab-mode-practice"
                onClick={() => {
                  setMode('practice');
                  setShowCalculator(false);
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'practice' && !showCalculator
                    ? 'bg-white text-teal-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>

              <button
                id="tab-mode-exam"
                onClick={() => {
                  setMode('exam');
                  setShowCalculator(false);
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'exam' && !showCalculator
                    ? 'bg-white text-teal-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Exam</span>
              </button>

              <button
                id="tab-mode-flashcards"
                onClick={() => {
                  setMode('flashcards');
                  setShowCalculator(false);
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'flashcards' && !showCalculator
                    ? 'bg-white text-teal-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Key Review</span>
              </button>
            </div>

            {/* Quick Challenge Calculator modal toggle */}
            <button
              id="btn-open-calculator"
              onClick={() => setShowCalculator(!showCalculator)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                showCalculator
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-current" />
              <span>ATP Calculator</span>
            </button>

            {/* Bookmark filter */}
            <button
              id="btn-filter-bookmark"
              onClick={() => setFilterBookmarked(!filterBookmarked)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                filterBookmarked
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Bookmarks</span>
              <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {bookmarkedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Progress bar and live score */}
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap flex items-center gap-2">
            <span>
              {answeredCount}/{totalCount} answered ({percentComplete}%)
            </span>
            {answeredCount > 0 && (
              <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                Score: {score}/{answeredCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

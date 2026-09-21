import { Award, CheckCircle, XCircle, RotateCcw, Filter, ArrowRight } from 'lucide-react';
import { Question } from '../types';

interface ScoreModalProps {
  score: number;
  total: number;
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onRetake: () => void;
  onReviewMistakes: () => void;
  onClose: () => void;
}

export function ScoreModal({
  score,
  total,
  questions,
  userAnswers,
  onRetake,
  onReviewMistakes,
  onClose,
}: ScoreModalProps) {
  const percentage = Math.round((score / total) * 100);
  const incorrectCount = total - score;

  // Breakdown by section
  const digestionQuestions = questions.filter((q) => q.category === 'digestion' || q.category === 'absorption');
  const lipolysisQuestions = questions.filter((q) => q.category === 'lipolysis');
  const betaOxQuestions = questions.filter((q) => q.category === 'beta_oxidation');
  const challengeQuestions = questions.filter((q) => q.section === 'challenge');

  const calcCatScore = (qList: Question[]) => {
    return qList.reduce((acc, q) => acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0);
  };

  const digestionScore = calcCatScore(digestionQuestions);
  const lipolysisScore = calcCatScore(lipolysisQuestions);
  const betaOxScore = calcCatScore(betaOxQuestions);
  const challengeScore = calcCatScore(challengeQuestions);

  let verdict = {
    title: 'Outstanding Mastery!',
    desc: 'You have demonstrated a comprehensive understanding of lipid digestion, transport, β-oxidation, and bioenergetics.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  if (percentage < 70) {
    verdict = {
      title: 'Keep Practicing!',
      desc: 'Review the high-yield explanations, especially the steps of β-oxidation and the ATP formulas.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    };
  } else if (percentage < 90) {
    verdict = {
      title: 'Very Good Performance!',
      desc: 'Solid grasp of key mechanisms! Check the detailed explanations for any questions missed.',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-teal-50/70 to-white">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white mx-auto flex items-center justify-center shadow-md mb-3">
            <Award className="w-8 h-8" />
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${verdict.badgeClass}`}>
            {verdict.title}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {score} / {total} <span className="text-xl text-teal-600 font-sans">({percentage}%)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
            {verdict.desc}
          </p>
        </div>

        {/* Breakdown by category */}
        <div className="p-6 space-y-3 bg-slate-50/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Performance Breakdown by Topic
          </h4>

          <div className="space-y-2">
            {/* Digestion & Absorption */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                1. Digestion &amp; Absorption
              </span>
              <span className="font-mono font-bold text-slate-900">
                {digestionScore} / {digestionQuestions.length}
              </span>
            </div>

            {/* Lipolysis & Activation */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                2. Lipolysis &amp; Activation
              </span>
              <span className="font-mono font-bold text-slate-900">
                {lipolysisScore} / {lipolysisQuestions.length}
              </span>
            </div>

            {/* β-Oxidation Pathway */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                3. β-Oxidation Pathway
              </span>
              <span className="font-mono font-bold text-slate-900">
                {betaOxScore} / {betaOxQuestions.length}
              </span>
            </div>

            {/* Challenge Bioenergetics */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs">
              <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                ⚡ 4. Bioenergetics Challenge
              </span>
              <span className="font-mono font-bold text-amber-900">
                {challengeScore} / {challengeQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          {incorrectCount > 0 && (
            <button
              onClick={onReviewMistakes}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Review Mistakes ({incorrectCount})</span>
            </button>
          )}

          <button
            onClick={onRetake}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Review All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Bookmark, CheckCircle, XCircle, ChevronDown, ChevronUp, Lightbulb, Zap, HelpCircle } from 'lucide-react';
import { Question, QuizMode } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  mode: QuizMode;
  isSubmitted: boolean;
  language?: 'en' | 'ar' | 'both';
}

export function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  mode,
  isSubmitted,
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Immediate correction: As soon as an option is selected, reveal feedback immediately
  const isRevealed = !!selectedOption || isSubmitted;
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <article
      id={`question-card-${question.id}`}
      className={`relative bg-white rounded-xl border transition-all duration-200 shadow-xs overflow-hidden ${
        question.section === 'challenge'
          ? 'border-amber-300 ring-1 ring-amber-100/60'
          : 'border-slate-200'
      }`}
    >
      {/* Accent Header bar */}
      <div
        className={`px-4 sm:px-6 py-3 flex items-center justify-between border-b ${
          question.section === 'challenge'
            ? 'bg-amber-50/80 border-amber-200/80'
            : 'bg-slate-50/70 border-slate-200/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              question.section === 'challenge'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-white'
            }`}
          >
            {question.id}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                question.section === 'challenge'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-teal-50 text-teal-700 border border-teal-200'
              }`}
            >
              {question.categoryTitle.en}
            </span>
            {question.section === 'challenge' && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                Challenge
              </span>
            )}
          </div>
        </div>

        {/* Action icons: Bookmark */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-bookmark-${question.id}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6">
        {/* Question Text (English Only) */}
        <div className="mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5" role="radiogroup" aria-label={`Options for question ${question.id}`}>
          {question.options.map((option) => {
            const isOptionSelected = selectedOption === option.id;
            const isOptionCorrect = question.correctAnswer === option.id;

            let optionStyle =
              'border-slate-200 hover:border-slate-300 bg-white text-slate-800 hover:bg-slate-50/80';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (isRevealed) {
              if (isOptionCorrect) {
                // Correct answer is always green with emerald accent
                optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isOptionSelected && !isOptionCorrect) {
                // Chosen wrong answer is red with rose accent
                optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={option.id}
                id={`q${question.id}-opt-${option.id}`}
                onClick={() => onSelectOption(option.id)}
                disabled={isRevealed}
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${badgeStyle}`}
                >
                  {option.id}
                </span>

                <span className="flex-1 text-sm sm:text-base leading-snug self-center">
                  {option.text}
                </span>

                {/* Instant Feedback indicator icon */}
                {isRevealed && (
                  <span className="shrink-0 self-center">
                    {isOptionCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : isOptionSelected ? (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Correction & Explanation Banner */}
        {isRevealed && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Correct Answer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Incorrect — Correct Answer: {question.correctAnswer}
                  </span>
                )}
              </div>

              <button
                id={`btn-toggle-explain-${question.id}`}
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showExplanation ? 'Hide Explanation' : 'Detailed Explanation'}</span>
                {showExplanation ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Expandable Biochemical Explanation Box (English Only) */}
            {(showExplanation || mode === 'flashcards' || (!isCorrect && isRevealed)) && (
              <div
                id={`explanation-box-${question.id}`}
                className="mt-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm space-y-3"
              >
                {/* Rule Callout */}
                {question.explanation.lectureRule && (
                  <div className="flex items-start gap-2 bg-amber-50/90 text-amber-900 border border-amber-200 p-2.5 rounded-lg font-mono text-xs font-semibold">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{question.explanation.lectureRule}</span>
                  </div>
                )}

                {/* Summary in English */}
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 leading-relaxed">
                    {question.explanation.summaryEn}
                  </p>
                </div>

                {/* Detailed points in English */}
                <div className="space-y-2 pt-1 border-t border-slate-200/70">
                  <div className="space-y-1.5">
                    {question.explanation.detailsEn.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-600 leading-relaxed">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

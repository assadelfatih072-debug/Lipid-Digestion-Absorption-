import { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, Zap, Bookmark, Search } from 'lucide-react';

interface QuickReviewListProps {
  questions: Question[];
  language: 'en' | 'ar' | 'both';
  bookmarked: number[];
  onToggleBookmark: (id: number) => void;
}

export function QuickReviewList({
  questions,
  language,
  bookmarked,
  onToggleBookmark,
}: QuickReviewListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.questionAr && q.questionAr.includes(searchTerm)) ||
      q.explanation.summaryEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.explanation.lectureRule && q.explanation.lectureRule.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'challenge' ? q.section === 'challenge' : q.category === selectedCategory);

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, enzymes, products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/50"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All (25)' },
            { id: 'digestion', label: 'Digestion' },
            { id: 'absorption', label: 'Absorption' },
            { id: 'lipolysis', label: 'Lipolysis' },
            { id: 'beta_oxidation', label: 'β-Oxidation' },
            { id: 'challenge', label: '⚡ Challenge' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white border-teal-800 font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {filtered.map((q) => {
          const correctOpt = q.options.find((o) => o.id === q.correctAnswer);
          const isBkm = bookmarked.includes(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl p-4 sm:p-5 border shadow-xs space-y-3 ${
                q.section === 'challenge'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {q.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {q.categoryTitle.en}
                  </span>
                  {q.section === 'challenge' && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500" />
                      Challenge
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onToggleBookmark(q.id)}
                  className={`p-1 rounded-md ${
                    isBkm ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBkm ? 'fill-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-900 text-sm leading-relaxed">{q.question}</p>
              </div>

              {/* Verified Correct Option Box */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {q.correctAnswer}
                  </span>
                  <span className="font-bold text-emerald-950">{correctOpt?.text}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded shrink-0">
                  Correct Answer
                </span>
              </div>

              {/* Lecture High-Yield Takeaway */}
              {q.explanation.lectureRule && (
                <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{q.explanation.lectureRule}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

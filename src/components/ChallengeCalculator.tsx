import { useState } from 'react';
import { Calculator, X, Sparkles, ArrowRight, Check } from 'lucide-react';

interface ChallengeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChallengeCalculator({ isOpen, onClose }: ChallengeCalculatorProps) {
  const [carbons, setCarbons] = useState<number>(20);

  if (!isOpen) return null;

  // Formula calculations based strictly on lecture standards:
  const n = carbons;
  const acetylCoA = Math.floor(n / 2);
  const cycles = Math.max(0, acetylCoA - 1);
  const nadh = cycles;
  const fadh2 = cycles;

  // Traditional lecture constants:
  // 1 Acetyl-CoA = 12 ATP
  // 1 NADH = 3 ATP
  // 1 FADH2 = 2 ATP
  // Activation cost = 2 ATP
  const acetylAtp = acetylCoA * 12;
  const nadhAtp = nadh * 3;
  const fadh2Atp = fadh2 * 2;
  const cycleAtp = nadhAtp + fadh2Atp;
  const grossAtp = acetylAtp + cycleAtp;
  const netAtp = grossAtp - 2;

  const presets = [
    { name: 'Lauric acid', c: 12 },
    { name: 'Myristic acid', c: 14 },
    { name: 'Palmitic acid', c: 16 },
    { name: 'Stearic acid', c: 18 },
    { name: 'Arachidic acid (Lecture Q21-25)', c: 20 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                β-Oxidation ATP Calculator
                <span className="text-xs bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                  Lecture Rules
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Standard lecture formulas for energy yield calculation (Questions 21–25)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Carbon chain input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Fatty Acid Carbon Chain Length (n)</span>
              <span className="text-amber-700 font-mono text-sm">{n} Carbons</span>
            </label>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="4"
                max="26"
                step="2"
                value={carbons}
                onChange={(e) => setCarbons(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="w-12 text-center font-mono font-bold text-slate-800 text-base bg-slate-100 py-1 rounded-md border border-slate-200">
                {carbons}
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presets.map((p) => (
                <button
                  key={p.c}
                  onClick={() => setCarbons(p.c)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    carbons === p.c
                      ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.name} ({p.c}C)
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Step-by-Step Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {/* Step 1: Acetyl-CoA */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>1. Number of Acetyl-CoA (Q21)</span>
                <span className="text-teal-700 font-mono font-bold">n / 2</span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {n} ÷ 2 = <span className="text-teal-600">{acetylCoA}</span> Acetyl-CoA
              </div>
              <p className="text-[11px] text-slate-500">
                Each cleavage releases a 2-carbon Acetyl-CoA molecule.
              </p>
            </div>

            {/* Step 2: Cycles */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>2. Number of Cycles (Q22)</span>
                <span className="text-teal-700 font-mono font-bold">(n / 2) - 1</span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {acetylCoA} - 1 = <span className="text-teal-600">{cycles}</span> Cycles
              </div>
              <p className="text-[11px] text-slate-500">
                The final cycle splits the remaining 4-carbon intermediate into 2 Acetyl-CoA units.
              </p>
            </div>
          </div>

          {/* Step 3: ATP Math Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
              <span>Energy Source &amp; Yield</span>
              <span>Calculation &amp; Total ATP</span>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Acetyl-CoA in TCA */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-900">From Acetyl-CoA (Krebs Cycle):</span>
                  <p className="text-[11px] text-slate-500">{acetylCoA} Acetyl-CoA × 12 ATP (Q23)</p>
                </div>
                <span className="font-mono font-bold text-slate-800 text-sm">+{acetylAtp} ATP</span>
              </div>

              {/* NADH from cycles */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-semibold text-slate-900">From NADH in β-Oxidation:</span>
                  <p className="text-[11px] text-slate-500">{cycles} cycles × 1 NADH × 3 ATP (Q24)</p>
                </div>
                <span className="font-mono font-bold text-slate-800 text-sm">+{nadhAtp} ATP</span>
              </div>

              {/* FADH2 from cycles */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-900">From FADH₂ in β-Oxidation:</span>
                  <p className="text-[11px] text-slate-500">{cycles} cycles × 1 FADH₂ × 2 ATP</p>
                </div>
                <span className="font-mono font-bold text-slate-800 text-sm">+{fadh2Atp} ATP</span>
              </div>

              {/* Gross Total */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-amber-50/40 font-semibold">
                <span className="text-amber-950">Gross ATP Produced:</span>
                <span className="font-mono text-amber-900">{grossAtp} ATP</span>
              </div>

              {/* Activation */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-rose-50/30">
                <div>
                  <span className="font-semibold text-rose-900">Fatty Acid Activation Cost:</span>
                  <p className="text-[11px] text-rose-700">ATP → AMP + PPi (consumes 2 ATP, Q12)</p>
                </div>
                <span className="font-mono font-bold text-rose-700">-2 ATP</span>
              </div>
            </div>

            {/* Net Total Footer */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Net ATP Yield
                </span>
                <span className="text-xs text-teal-300">
                  {grossAtp} - 2 = {netAtp} ATP (Question 25)
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-teal-400">
                {netAtp} <span className="text-sm text-slate-300">ATP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  section: 'mcq' | 'challenge';
  category: 'digestion' | 'absorption' | 'lipolysis' | 'beta_oxidation' | 'bioenergetics';
  categoryTitle: {
    en: string;
    ar: string;
  };
  question: string;
  questionAr?: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    summaryEn: string;
    summaryAr: string;
    detailsEn: string[];
    detailsAr: string[];
    lectureRule?: string;
  };
}

export type QuizMode = 'practice' | 'exam' | 'flashcards';

export interface QuizState {
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  submitted: boolean;
  bookmarked: number[];
  revealedExplanations: Record<number, boolean>;
}

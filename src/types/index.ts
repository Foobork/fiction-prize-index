export type AwardStatus = 'winner' | 'shortlist' | 'longlist' | 'finalist';

export type PrizeCategory = 
  | 'literary' 
  | 'international' 
  | 'speculative' 
  | 'crime' 
  | 'innovation' 
  | 'debut'
  | 'regional';

export interface Prize {
  id: string;              // e.g. "booker-prize"
  name: string;            // "The Booker Prize"
  shortName: string;       // "Booker"
  establishedYear: number; // 1969
  country: string;         // "United Kingdom"
  sponsor: string;         // "Booker Prize Foundation"
  websiteUrl: string;      // "https://thebookerprizes.com"
  description: string;
  category: PrizeCategory;
  purse?: string;          // e.g. "£50,000"
  color?: string;          // Hex or Tailwind class for badges
}

export interface Author {
  id: string;
  name: string;
  nationality?: string;
  birthYear?: number;
  deathYear?: number;
  nobelYear?: number;
  bio?: string;
  websiteUrl?: string;
}

export interface Book {
  id: string;              // unique slug e.g. "lincoln-in-the-bardo"
  title: string;
  authorId: string;
  authorName: string;
  publicationYear: number;
  publisher: string;
  imprint?: string;
  isbn13?: string;
  genres: string[];        // e.g. ["Historical Fiction", "Experimental", "Literary"]
  synopsis: string;
  coverImage?: string;     // URL or fallback placeholder
  openLibraryKey?: string;
  pageCount?: number;
  spineColor?: string;     // For virtual bookshelf rendering
  countryOfOrigin?: string;
  translator?: string;
  originalLanguage?: string;
  originalTitle?: string;
}

export interface Nomination {
  id: string;
  prizeId: string;
  bookId: string;
  year: number;
  status: AwardStatus;
  category?: string;       // e.g. "Best Novel", "Translated Fiction"
  citation?: string;       // Jury citation/blurb
  sourceUrl: string;       // Verification link to official archive
  translator?: string;
}

export interface BookWithNominations extends Book {
  nominations: (Nomination & { prize: Prize })[];
  totalWins: number;
  totalNominations: number;
}

export type ReadingStatus = 'want-to-read' | 'reading' | 'completed';

export interface UserSavedBook {
  bookId: string;
  status: ReadingStatus;
  savedAt: string;         // ISO date string
  rating?: number;         // 1-5
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  prizes: string[];
  status: AwardStatus[];
  genres: string[];
  yearStart: number;
  yearEnd: number;
  publishers: string[];
  onlyMultipleWinners: boolean;
  sortBy: 'year-desc' | 'year-asc' | 'title' | 'author' | 'wins-desc';
}

/**
 * Book Related Type Definitions
 */

export interface Book {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  audioFileUrl: string;
  price: number;
  isFree: boolean;
  category: string;
  ageMin: number;
  ageMax: number;
  language: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  pages?: number;
  rating?: number;
  reviews?: number;
  previewUrl?: string;
  duration?: number; // in seconds
}

export interface BookDownload {
  id: string;
  bookId: string;
  userId: string;
  downloadedAt: string;
  fileSize: number;
  localPath?: string;
  progress: number; // 0-100
  status: 'downloading' | 'paused' | 'completed' | 'failed';
}

export interface BookCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface BookFilter {
  category?: string;
  ageMin?: number;
  ageMax?: number;
  language?: string;
  isFree?: boolean;
  priceRange?: [number, number];
  searchQuery?: string;
}

export interface BookSearchResult {
  books: Book[];
  total: number;
  hasMore: boolean;
}

export interface BookPurchase {
  id: string;
  userId: string;
  bookId: string;
  purchaseDate: string;
  price: number;
  transactionId: string;
}

export interface BookLibraryItem extends Book {
  isDownloaded: boolean;
  localPath?: string;
  downloadProgress: number;
  lastAccessedAt?: string;
  isPinned?: boolean;
}

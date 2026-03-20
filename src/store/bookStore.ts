/**
 * Book State Store (Zustand)
 * Manages books, downloads, and library
 */

import { create } from 'zustand';
import { Book, BookDownload, BookLibraryItem, BookFilter } from '@types/book';
import * as bookService from '@services/firebase/books';

interface BookStore {
  // State
  books: Book[];
  libraryBooks: BookLibraryItem[];
  downloads: Map<string, BookDownload>;
  filteredBooks: Book[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  /** bookId → star rating (1–5) submitted by user */
  ratedBooks: Record<string, number>;
  /** bookIds that have been transferred to pen / used */
  usedBooks: string[];

  // Actions
  fetchBooks: (limit?: number) => Promise<void>;
  fetchBooksByCategory: (category: string, limit?: number) => Promise<void>;
  fetchFreeBooks: (limit?: number) => Promise<void>;
  fetchTrendingBooks: (limit?: number) => Promise<void>;
  fetchNewBooks: (limit?: number) => Promise<void>;
  fetchBookById: (bookId: string) => Promise<Book | null>;
  searchBooks: (filters: BookFilter, limit?: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: string) => void;
  updateDownloadProgress: (bookId: string, progress: number) => void;
  startDownload: (bookId: string) => void;
  completeDownload: (bookId: string, localPath: string) => void;
  pauseDownload: (bookId: string) => void;
  cancelDownload: (bookId: string) => void;
  getLibraryBooks: () => BookLibraryItem[];
  rateBook: (bookId: string, stars: number) => void;
  markBookAsUsed: (bookId: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  libraryBooks: [],
  downloads: new Map(),
  filteredBooks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  ratedBooks: {},
  usedBooks: [],

  fetchBooks: async (limit = 20) => {
    set({ isLoading: true, error: null });

    try {
      const books = await bookService.getAllBooks(limit);
      set({ books, filteredBooks: books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchBooksByCategory: async (category: string, limit = 20) => {
    set({ isLoading: true, error: null, selectedCategory: category });

    try {
      const books = await bookService.getBooksByCategory(category, limit);
      set({ books, filteredBooks: books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchFreeBooks: async (limit = 20) => {
    set({ isLoading: true, error: null });

    try {
      const books = await bookService.getFreeBooks(limit);
      set({ books, filteredBooks: books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchTrendingBooks: async (limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const books = await bookService.getTrendingBooks(limit);
      set({ books, filteredBooks: books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchNewBooks: async (limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const books = await bookService.getNewBooks(limit);
      set({ books, filteredBooks: books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchBookById: async (bookId: string): Promise<Book | null> => {
    try {
      const book = await bookService.getBookById(bookId);
      return book;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  searchBooks: async (filters: BookFilter, limit = 20) => {
    set({ isLoading: true, error: null });

    try {
      const result = await bookService.searchBooks(filters, limit);
      set({ books: result.books, filteredBooks: result.books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });

    const { books } = get();
    const filtered = books.filter(
      book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredBooks: filtered });
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  addToLibrary: (book: Book) => {
    const libraryItem: BookLibraryItem = {
      ...book,
      isDownloaded: false,
      downloadProgress: 0,
    };

    set(state => ({
      libraryBooks: [...state.libraryBooks, libraryItem],
    }));
  },

  removeFromLibrary: (bookId: string) => {
    set(state => ({
      libraryBooks: state.libraryBooks.filter(b => b.id !== bookId),
    }));
  },

  updateDownloadProgress: (bookId: string, progress: number) => {
    const downloads = new Map(get().downloads);
    const download = downloads.get(bookId);

    if (download) {
      downloads.set(bookId, {
        ...download,
        progress,
      });

      set({ downloads });
    }
  },

  startDownload: (bookId: string) => {
    const downloads = new Map(get().downloads);
    downloads.set(bookId, {
      id: bookId,
      bookId,
      userId: '',
      downloadedAt: new Date().toISOString(),
      fileSize: 0,
      progress: 0,
      status: 'downloading',
    });

    set({ downloads });
  },

  completeDownload: (bookId: string, localPath: string) => {
    const downloads = new Map(get().downloads);
    const download = downloads.get(bookId);

    if (download) {
      downloads.set(bookId, {
        ...download,
        status: 'completed',
        progress: 100,
        localPath,
      });
    }

    // Update library item
    set(state => ({
      downloads,
      libraryBooks: state.libraryBooks.map(book =>
        book.id === bookId
          ? {
              ...book,
              isDownloaded: true,
              downloadProgress: 100,
              localPath,
            }
          : book
      ),
    }));
  },

  pauseDownload: (bookId: string) => {
    const downloads = new Map(get().downloads);
    const download = downloads.get(bookId);

    if (download) {
      downloads.set(bookId, {
        ...download,
        status: 'paused',
      });

      set({ downloads });
    }
  },

  cancelDownload: (bookId: string) => {
    const downloads = new Map(get().downloads);
    downloads.delete(bookId);

    set({ downloads });
  },

  getLibraryBooks: () => {
    return get().libraryBooks;
  },

  rateBook: (bookId: string, stars: number) => {
    set(state => ({
      ratedBooks: { ...state.ratedBooks, [bookId]: stars },
    }));
  },

  markBookAsUsed: (bookId: string) => {
    set(state => ({
      usedBooks: state.usedBooks.includes(bookId)
        ? state.usedBooks
        : [...state.usedBooks, bookId],
    }));
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      books: [],
      libraryBooks: [],
      downloads: new Map(),
      filteredBooks: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedCategory: null,
      ratedBooks: {},
      usedBooks: [],
    });
  },
}));

export default useBookStore;

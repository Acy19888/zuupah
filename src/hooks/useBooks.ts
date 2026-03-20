/**
 * useBooks Hook
 * Provides book management functionality
 */

import { useCallback, useEffect } from 'react';
import { useBookStore } from '@store/bookStore';
import { BookFilter } from '@types/book';

export const useBooks = () => {
  const {
    books,
    libraryBooks,
    filteredBooks,
    downloads,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    fetchBooks,
    fetchBooksByCategory,
    fetchFreeBooks,
    fetchTrendingBooks,
    fetchNewBooks,
    searchBooks,
    setSearchQuery,
    setSelectedCategory,
    addToLibrary,
    removeFromLibrary,
    startDownload,
    updateDownloadProgress,
    completeDownload,
    pauseDownload,
    cancelDownload,
    clearError,
  } = useBookStore();

  useEffect(() => {
    // Load initial books on mount
    fetchBooks(20);
  }, [fetchBooks]);

  const handleSearch = useCallback(
    async (filters: BookFilter) => {
      try {
        await searchBooks(filters, 20);
      } catch (err) {
        console.error('Search failed:', err);
      }
    },
    [searchBooks]
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleSetCategory = useCallback(
    async (category: string | null) => {
      setSelectedCategory(category);
      if (category) {
        try {
          await fetchBooksByCategory(category, 20);
        } catch (err) {
          console.error('Load category failed:', err);
        }
      } else {
        try {
          await fetchBooks(20);
        } catch (err) {
          console.error('Load books failed:', err);
        }
      }
    },
    [fetchBooksByCategory, fetchBooks, setSelectedCategory]
  );

  const handleAddToLibrary = useCallback(
    (bookId: string) => {
      const book = books.find(b => b.id === bookId);
      if (book) {
        addToLibrary(book);
      }
    },
    [books, addToLibrary]
  );

  const handleStartDownload = useCallback(
    (bookId: string) => {
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      // Skip if already in library
      const alreadyInLibrary = useBookStore.getState().libraryBooks.some(b => b.id === bookId);
      if (alreadyInLibrary) return;

      // Add to library and start download
      addToLibrary(book);
      startDownload(bookId);

      // Animate progress: 0 → 100% in ~2.5s (steps every 250ms)
      const STEPS = 10;
      const INTERVAL = 250;
      let step = 0;
      const timer = setInterval(() => {
        step += 1;
        const progress = Math.round((step / STEPS) * 100);
        updateDownloadProgress(bookId, progress);
        if (step >= STEPS) {
          clearInterval(timer);
          completeDownload(bookId, `local-mock/${bookId}`);
        }
      }, INTERVAL);
    },
    [books, addToLibrary, startDownload, updateDownloadProgress, completeDownload]
  );

  const handleUpdateProgress = useCallback(
    (bookId: string, progress: number) => {
      updateDownloadProgress(bookId, progress);
    },
    [updateDownloadProgress]
  );

  const handleCompleteDownload = useCallback(
    (bookId: string, localPath: string) => {
      completeDownload(bookId, localPath);
    },
    [completeDownload]
  );

  const handlePauseDownload = useCallback(
    (bookId: string) => {
      pauseDownload(bookId);
    },
    [pauseDownload]
  );

  const handleCancelDownload = useCallback(
    (bookId: string) => {
      cancelDownload(bookId);
    },
    [cancelDownload]
  );

  const handleRemoveFromLibrary = useCallback(
    (bookId: string) => {
      removeFromLibrary(bookId);
    },
    [removeFromLibrary]
  );

  return {
    books: filteredBooks,
    libraryBooks,
    allBooks: books,
    downloads,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    handleSearch,
    handleSetSearchQuery,
    handleSetCategory,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleStartDownload,
    handleUpdateProgress,
    handleCompleteDownload,
    handlePauseDownload,
    handleCancelDownload,
    clearError,
    fetchFreeBooks,
    fetchTrendingBooks,
    fetchNewBooks,
  };
};

export default useBooks;

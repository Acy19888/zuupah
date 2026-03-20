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
      // Find the book in all available books
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      // Skip if already in library
      const alreadyInLibrary = useBookStore.getState().libraryBooks.some(b => b.id === bookId);
      if (alreadyInLibrary) return;

      // Add to library immediately
      addToLibrary(book);
      startDownload(bookId);

      // Simulate download completing after 1.5 seconds
      setTimeout(() => {
        completeDownload(bookId, `local-mock/${bookId}`);
      }, 1500);
    },
    [books, addToLibrary, startDownload, completeDownload]
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

/**
 * Firebase Books Service
 * Handles book queries and Firestore operations
 */

import { getFirebaseFirestore } from './config';
import { Book, BookFilter, BookSearchResult } from '@types/book';
import { CONFIG } from '@constants/config';

const db = getFirebaseFirestore();
const BOOKS_COLLECTION = CONFIG.FIRESTORE_COLLECTIONS.BOOKS;

/**
 * Fetch all available books from Firestore
 * @param limit - Number of books to fetch (default 20)
 * @returns Array of books
 */
export const getAllBooks = async (limit: number = 20): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
};

/**
 * Fetch books by category
 * @param category - Category name
 * @param limit - Number of books to fetch
 * @returns Array of books in category
 */
export const getBooksByCategory = async (
  category: string,
  limit: number = 20
): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .where('category', '==', category)
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching books by category:', error);
    throw new Error('Failed to fetch books');
  }
};

/**
 * Get free books
 * @param limit - Number of books to fetch
 * @returns Array of free books
 */
export const getFreeBooks = async (limit: number = 20): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .where('isFree', '==', true)
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching free books:', error);
    throw new Error('Failed to fetch free books');
  }
};

/**
 * Get books by age range
 * @param ageMin - Minimum age
 * @param ageMax - Maximum age
 * @param limit - Number of books to fetch
 * @returns Array of books for age group
 */
export const getBooksByAge = async (
  ageMin: number,
  ageMax: number,
  limit: number = 20
): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .where('ageMin', '<=', ageMax)
      .where('ageMax', '>=', ageMin)
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching books by age:', error);
    throw new Error('Failed to fetch books');
  }
};

/**
 * Fetch single book by ID
 * @param bookId - Book ID
 * @returns Book object
 */
export const getBookById = async (bookId: string): Promise<Book> => {
  try {
    const doc = await db.collection(BOOKS_COLLECTION).doc(bookId).get();

    if (!doc.exists) {
      throw new Error('Book not found');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Book;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Failed to fetch book');
  }
};

/**
 * Search books with multiple filters
 * @param filters - Search filters
 * @param limit - Number of books to fetch
 * @returns Search results with pagination
 */
export const searchBooks = async (
  filters: BookFilter,
  limit: number = 20
): Promise<BookSearchResult> => {
  try {
    let query: any = db.collection(BOOKS_COLLECTION);

    // Apply category filter
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }

    // Apply age range filter
    if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
      query = query
        .where('ageMin', '<=', filters.ageMax)
        .where('ageMax', '>=', filters.ageMin);
    } else if (filters.ageMin !== undefined) {
      query = query.where('ageMin', '<=', filters.ageMin);
    } else if (filters.ageMax !== undefined) {
      query = query.where('ageMax', '>=', filters.ageMax);
    }

    // Apply language filter
    if (filters.language) {
      query = query.where('language', '==', filters.language);
    }

    // Apply free/paid filter
    if (filters.isFree !== undefined) {
      query = query.where('isFree', '==', filters.isFree);
    }

    // Apply price range filter
    if (filters.priceRange) {
      query = query
        .where('price', '>=', filters.priceRange[0])
        .where('price', '<=', filters.priceRange[1]);
    }

    // Execute query with limit
    const querySnapshot = await query.limit(limit).get();

    const books = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];

    // Note: For full text search, consider using Algolia or similar service
    // This is a basic filter-based search
    let filteredBooks = books;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredBooks = books.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          (book.author && book.author.toLowerCase().includes(query))
      );
    }

    return {
      books: filteredBooks,
      total: filteredBooks.length,
      hasMore: querySnapshot.docs.length === limit,
    };
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books');
  }
};

/**
 * Get trending books
 * @param limit - Number of books to fetch
 * @returns Array of trending books
 */
export const getTrendingBooks = async (limit: number = 10): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .orderBy('rating', 'desc')
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching trending books:', error);
    throw new Error('Failed to fetch trending books');
  }
};

/**
 * Get newly released books
 * @param limit - Number of books to fetch
 * @returns Array of new books
 */
export const getNewBooks = async (limit: number = 10): Promise<Book[]> => {
  try {
    const querySnapshot = await db
      .collection(BOOKS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching new books:', error);
    throw new Error('Failed to fetch new books');
  }
};

/**
 * Get books by IDs (for user library)
 * @param bookIds - Array of book IDs
 * @returns Array of books
 */
export const getBooksByIds = async (bookIds: string[]): Promise<Book[]> => {
  if (bookIds.length === 0) {
    return [];
  }

  try {
    // Firestore has a limit of 10 for 'in' operator, so chunk the requests
    const chunks = [];
    for (let i = 0; i < bookIds.length; i += 10) {
      const chunk = bookIds.slice(i, i + 10);
      const querySnapshot = await db
        .collection(BOOKS_COLLECTION)
        .where('id', 'in', chunk)
        .get();

      chunks.push(
        ...querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }

    return chunks as Book[];
  } catch (error) {
    console.error('Error fetching books by IDs:', error);
    throw new Error('Failed to fetch books');
  }
};

export default {
  getAllBooks,
  getBooksByCategory,
  getFreeBooks,
  getBooksByAge,
  getBookById,
  searchBooks,
  getTrendingBooks,
  getNewBooks,
  getBooksByIds,
};

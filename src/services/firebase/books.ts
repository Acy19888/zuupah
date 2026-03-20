/**
 * Firebase Books Service — Firebase JS SDK (Expo Go compatible)
 */
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from './config';
import { Book, BookFilter, BookSearchResult } from '@types/book';

const BOOKS = 'books';

const snap = (d: any): Book => ({ id: d.id, ...d.data() } as Book);

export const getAllBooks = async (lim = 20): Promise<Book[]> => {
  const q = query(collection(firebaseDb, BOOKS), limit(lim));
  const snap2 = await getDocs(q);
  return snap2.docs.map(snap);
};

export const getBooksByCategory = async (category: string, lim = 20): Promise<Book[]> => {
  const q = query(collection(firebaseDb, BOOKS), where('category', '==', category), limit(lim));
  return (await getDocs(q)).docs.map(snap);
};

export const getFreeBooks = async (lim = 20): Promise<Book[]> => {
  const q = query(collection(firebaseDb, BOOKS), where('isFree', '==', true), limit(lim));
  return (await getDocs(q)).docs.map(snap);
};

export const getTrendingBooks = async (lim = 10): Promise<Book[]> => {
  const q = query(collection(firebaseDb, BOOKS), orderBy('rating', 'desc'), limit(lim));
  return (await getDocs(q)).docs.map(snap);
};

export const getNewBooks = async (lim = 10): Promise<Book[]> => {
  const q = query(collection(firebaseDb, BOOKS), orderBy('createdAt', 'desc'), limit(lim));
  return (await getDocs(q)).docs.map(snap);
};

export const getBookById = async (bookId: string): Promise<Book> => {
  const d = await getDoc(doc(firebaseDb, BOOKS, bookId));
  if (!d.exists()) throw new Error('Book not found');
  return snap(d);
};

export const searchBooks = async (filters: BookFilter, lim = 20): Promise<BookSearchResult> => {
  const books = await getAllBooks(lim);
  let filtered = books;
  if (filters.category) filtered = filtered.filter(b => b.category === filters.category);
  if (filters.isFree !== undefined) filtered = filtered.filter(b => b.isFree === filters.isFree);
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
  }
  return { books: filtered, total: filtered.length, hasMore: false };
};

export const getBooksByIds = async (ids: string[]): Promise<Book[]> => {
  if (!ids.length) return [];
  const results = await Promise.all(ids.map(id => getBookById(id).catch(() => null)));
  return results.filter(Boolean) as Book[];
};

export default { getAllBooks, getBooksByCategory, getFreeBooks, getTrendingBooks, getNewBooks, getBookById, searchBooks, getBooksByIds };

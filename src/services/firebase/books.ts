/**
 * Books Service — fetches from the Zuupah backend API.
 * Falls back to mock data when the backend is unavailable.
 */
import { Book, BookFilter, BookSearchResult } from '@types/book';
import { MOCK_ZOO_BOOKS, getMockBookById } from './mockBooksData';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

// Map backend book format → app Book type
function mapBook(b: any): Book {
  return {
    id:          b.id,
    title:       b.title,
    author:      b.author,
    description: b.description ?? '',
    category:    b.ageGroup ?? 'all',
    ageGroup:    b.ageGroup,
    language:    b.language ?? 'en',
    coverImage:  b.coverImageUrl ?? b.coverImage ?? '',
    audioUrl:    b.audioFileUrl  ?? b.audioFile  ?? '',
    isFree:      !b.isPremium,
    isPremium:   b.isPremium ?? false,
    isPublished: b.isPublished ?? true,
    duration:    b.duration ?? 0,
    fileSize:    b.fileSize ?? 0,
    tags:        b.tags ?? [],
    rating:      4.5,
    reviewCount: b._count?.downloads ?? 0,
    downloadCount: b._count?.downloads ?? 0,
    createdAt:   b.createdAt,
    updatedAt:   b.updatedAt ?? b.createdAt,
  };
}

async function fetchFromApi(path: string): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const books = Array.isArray(data) ? data : data.books ?? [];
  return books.filter((b: any) => b.isPublished !== false).map(mapBook);
}

// Try backend first, fall back to mock if unavailable
const withFallback = async (apiPath: string, mockFn: () => Book[]): Promise<Book[]> => {
  try {
    const books = await fetchFromApi(apiPath);
    return books.length > 0 ? books : mockFn();
  } catch {
    return mockFn();
  }
};

export const getAllBooks = (lim = 20) =>
  withFallback(`/api/books?limit=${lim}`, () => MOCK_ZOO_BOOKS.slice(0, lim));

export const getBooksByCategory = (category: string, lim = 20) =>
  withFallback(`/api/books?ageGroup=${encodeURIComponent(category)}&limit=${lim}`, () =>
    MOCK_ZOO_BOOKS.filter(b => b.category === category).slice(0, lim));

export const getFreeBooks = (lim = 20) =>
  withFallback(`/api/books?limit=${lim}`, () =>
    MOCK_ZOO_BOOKS.filter(b => b.isFree).slice(0, lim));

export const getTrendingBooks = (lim = 10) =>
  withFallback(`/api/books?limit=${lim}`, () => MOCK_ZOO_BOOKS.slice(0, lim));

export const getNewBooks = (lim = 10) =>
  withFallback(`/api/books?limit=${lim}`, () => MOCK_ZOO_BOOKS.slice(0, lim));

export const getBookById = async (bookId: string): Promise<Book> => {
  if (bookId.startsWith('mock-')) {
    const mock = getMockBookById(bookId);
    if (mock) return mock;
    throw new Error('Book not found');
  }
  try {
    const res = await fetch(`${BASE_URL}/api/books/${bookId}`);
    if (!res.ok) throw new Error('Book not found');
    return mapBook(await res.json());
  } catch {
    const mock = getMockBookById(bookId);
    if (mock) return mock;
    throw new Error('Book not found');
  }
};

export const searchBooks = async (filters: BookFilter, lim = 20): Promise<BookSearchResult> => {
  const params = new URLSearchParams({ limit: String(lim) });
  if (filters.category)   params.set('ageGroup', filters.category);
  if (filters.searchQuery) params.set('search',  filters.searchQuery);
  const books = await withFallback(`/api/books?${params}`, () => {
    let r = MOCK_ZOO_BOOKS;
    if (filters.category)    r = r.filter(b => b.category === filters.category);
    if (filters.isFree !== undefined) r = r.filter(b => b.isFree === filters.isFree);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
    }
    return r;
  });
  return { books, total: books.length, hasMore: false };
};

export const getBooksByIds = async (ids: string[]): Promise<Book[]> => {
  if (!ids.length) return [];
  const results = await Promise.all(ids.map(id => getBookById(id).catch(() => null)));
  return results.filter(Boolean) as Book[];
};

export default { getAllBooks, getBooksByCategory, getFreeBooks, getTrendingBooks, getNewBooks, getBookById, searchBooks, getBooksByIds };

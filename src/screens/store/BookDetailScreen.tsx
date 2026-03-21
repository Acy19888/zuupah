/**
 * Book Detail Screen
 * Book information, download (from Store) or rating (from Library)
 */

import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Image, Text,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useBookStore } from '@store/bookStore';
import { useBooks } from '@hooks/useBooks';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import * as bookService from '@services/firebase/books';
import { getBookCoverSource } from '@services/firebase/mockBooksData';
import { Book } from '@types/book';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const STARS = [1, 2, 3, 4, 5];

const BookDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { bookId, fromLibrary = false } = route.params ?? {};
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleStartDownload, libraryBooks, downloads } = useBooks();
  const { ratedBooks, usedBooks, rateBook, markBookAsUsed } = useBookStore();
  const { tc } = useAppTheme();

  const dl              = downloads.get(bookId);
  const isDownloading   = dl?.status === 'downloading';
  const downloadProgress = dl?.progress ?? 0;
  const isInLibrary     = libraryBooks.some((b: any) => b.id === bookId);
  const showLibraryMode = fromLibrary || isInLibrary;
  const existingRating  = ratedBooks[bookId] ?? 0;
  const [selectedStars, setSelectedStars] = useState(existingRating);
  const hasBeenUsed     = usedBooks.includes(bookId);
  const [ratingSubmitted, setRatingSubmitted] = useState(existingRating > 0);

  useEffect(() => { loadBook(); }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const bookData = await bookService.getBookById(bookId);
      setBook(bookData);
    } catch (error) { console.error('Error loading book:', error); }
    finally { setLoading(false); }
  };

  const handleDownload   = () => { if (book) handleStartDownload(book.id); };
  const handleMarkAsUsed = () => { markBookAsUsed(bookId); };
  const handleRating     = () => {
    if (selectedStars > 0) { rateBook(bookId, selectedStars); setRatingSubmitted(true); }
  };

  if (loading) return <LoadingSpinner text="Loading book..." fullScreen />;

  if (!book) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: tc.text }]}>Book not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          {showLibraryMode && (
            <View style={styles.libraryBadge}>
              <Text style={styles.libraryBadgeText}>📚 In Library</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Image source={getBookCoverSource(book)} style={[styles.cover, { backgroundColor: tc.surface }]} />

          <View style={styles.info}>
            <Text style={[styles.title, { color: tc.text }]}>{book.title}</Text>
            {book.author && <Text style={[styles.author, { color: tc.textSecondary }]}>by {book.author}</Text>}

            <View style={styles.metadata}>
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { color: tc.text }]}>Age {book.ageMin}+</Text>
              </View>
              <Text style={[styles.category, { color: tc.textSecondary }]}>{book.category}</Text>
              {(existingRating > 0 || ratingSubmitted) && (
                <Text style={[styles.rating, { color: tc.text }]}>⭐ {ratedBooks[bookId] ?? selectedStars}.0 (You)</Text>
              )}
              {book.rating && !ratingSubmitted && (
                <Text style={[styles.rating, { color: tc.text }]}>⭐ {book.rating.toFixed(1)}</Text>
              )}
            </View>

            <Text style={[styles.description, { color: tc.textSecondary }]}>{book.description}</Text>

            <View style={[styles.details, { borderTopColor: tc.divider }]}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: tc.textSecondary }]}>Language</Text>
                <Text style={[styles.detailValue, { color: tc.text }]}>{book.language}</Text>
              </View>
              {book.duration && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: tc.textSecondary }]}>Duration</Text>
                  <Text style={[styles.detailValue, { color: tc.text }]}>{Math.floor(book.duration / 60)} min</Text>
                </View>
              )}
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: tc.textSecondary }]}>File Size</Text>
                <Text style={[styles.detailValue, { color: tc.text }]}>{(book.fileSize / 1024 / 1024).toFixed(1)} MB</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {showLibraryMode ? (
        <View style={[styles.footer, { backgroundColor: tc.card, borderTopColor: tc.border }]}>
          {!hasBeenUsed ? (
            <View style={styles.ratingSection}>
              <Text style={[styles.ratingHint, { color: tc.textSecondary }]}>
                🎧 Use this book with your Zuupah Pen first to unlock rating
              </Text>
              <TouchableOpacity style={[styles.markUsedBtn, { backgroundColor: tc.surface }]} onPress={handleMarkAsUsed}>
                <Text style={styles.markUsedText}>Mark as Listened ✓</Text>
              </TouchableOpacity>
            </View>
          ) : ratingSubmitted ? (
            <View style={styles.ratingSection}>
              <Text style={[styles.ratedTitle, { color: tc.text }]}>Your Rating</Text>
              <View style={styles.starsRow}>
                {STARS.map(s => (
                  <Text key={s} style={[styles.star, s <= (ratedBooks[bookId] ?? selectedStars) && styles.starActive]}>★</Text>
                ))}
              </View>
              <Text style={[styles.ratingHint, { color: tc.textSecondary }]}>Thanks for your review!</Text>
            </View>
          ) : (
            <View style={styles.ratingSection}>
              <Text style={[styles.ratedTitle, { color: tc.text }]}>Rate this book</Text>
              <View style={styles.starsRow}>
                {STARS.map(s => (
                  <TouchableOpacity key={s} onPress={() => setSelectedStars(s)}>
                    <Text style={[styles.star, s <= selectedStars && styles.starActive]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button
                title={selectedStars > 0 ? `Submit ${selectedStars} Star${selectedStars !== 1 ? 's' : ''}` : 'Tap Stars to Rate'}
                onPress={handleRating}
                disabled={selectedStars === 0}
                fullWidth
                size="large"
              />
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.footer, { backgroundColor: tc.card, borderTopColor: tc.border }]}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.downloadButton}>
            {isDownloading ? (
              <View style={styles.progressWrapper}>
                <View style={[styles.progressBg, { backgroundColor: tc.border }]}>
                  <View style={[styles.progressBar, { width: `${downloadProgress}%` as any }]} />
                </View>
                <Text style={[styles.progressLabel, { color: tc.text }]}>{downloadProgress}%</Text>
              </View>
            ) : (
              <Button
                title={isInLibrary ? 'Downloaded ✓' : 'Download'}
                onPress={handleDownload}
                disabled={isInLibrary}
                size="large"
                fullWidth
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: { width: 60 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', color: COLORS.beachBlue },
  libraryBadge: {
    backgroundColor: COLORS.softPillowBlue, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12,
  },
  libraryBadgeText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  content: { paddingHorizontal: 16, paddingBottom: 160 },
  cover: { width: '100%', height: 300, borderRadius: 16, marginBottom: 24 },
  info: { gap: 12 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  author: { fontSize: TYPOGRAPHY.fontSize.base },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: COLORS.morningYellow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  badgeText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold' },
  category: { fontSize: TYPOGRAPHY.fontSize.sm },
  rating: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  description: { fontSize: TYPOGRAPHY.fontSize.base, lineHeight: 22, marginTop: 8 },
  details: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, gap: 16 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: TYPOGRAPHY.fontSize.sm },
  detailValue: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  priceContainer: { paddingHorizontal: 12 },
  price: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold', color: COLORS.zestyOrange },
  downloadButton: { flex: 1 },
  progressWrapper: { flex: 1, gap: 6, justifyContent: 'center' },
  progressBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 5, backgroundColor: '#3b82f6' },
  progressLabel: { textAlign: 'center', fontSize: 13, fontFamily: 'Nunito-SemiBold' },
  ratingSection: { flex: 1, alignItems: 'center', gap: 8 },
  ratedTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
  starsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  star: { fontSize: 32, color: '#cbd5e0' },
  starActive: { color: '#f59e0b' },
  ratingHint: { fontSize: TYPOGRAPHY.fontSize.xs, textAlign: 'center' },
  markUsedBtn: { borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8 },
  markUsedText: { color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', fontSize: TYPOGRAPHY.fontSize.sm },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 16 },
  errorText: { fontSize: TYPOGRAPHY.fontSize.lg },
});

export default BookDetailScreen;

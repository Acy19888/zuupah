/**
 * Book Detail Screen
 * Book information, download (from Store) or rating (from Library)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useBookStore } from '@store/bookStore';
import { useBooks } from '@hooks/useBooks';
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
  const { handleStartDownload, libraryBooks } = useBooks();
  const { ratedBooks, usedBooks, rateBook, markBookAsUsed } = useBookStore();

  const isInLibrary = libraryBooks.some((b: any) => b.id === bookId);
  const showLibraryMode = fromLibrary || isInLibrary;
  const existingRating = ratedBooks[bookId] ?? 0;
  const [selectedStars, setSelectedStars] = useState(existingRating);
  const hasBeenUsed = usedBooks.includes(bookId);
  const [ratingSubmitted, setRatingSubmitted] = useState(existingRating > 0);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const bookData = await bookService.getBookById(bookId);
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (book) handleStartDownload(book.id);
  };

  const handleMarkAsUsed = () => {
    markBookAsUsed(bookId);
  };

  const handleRating = () => {
    if (selectedStars > 0) {
      rateBook(bookId, selectedStars);
      setRatingSubmitted(true);
    }
  };

  if (loading) return <LoadingSpinner text="Loading book..." fullScreen />;

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
          <Image source={getBookCoverSource(book)} style={styles.cover} />

          <View style={styles.info}>
            <Text style={styles.title}>{book.title}</Text>
            {book.author && <Text style={styles.author}>by {book.author}</Text>}

            <View style={styles.metadata}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Age {book.ageMin}+</Text>
              </View>
              <Text style={styles.category}>{book.category}</Text>
              {(existingRating > 0 || ratingSubmitted) && (
                <Text style={styles.rating}>⭐ {ratedBooks[bookId] ?? selectedStars}.0 (You)</Text>
              )}
              {book.rating && !ratingSubmitted && (
                <Text style={styles.rating}>⭐ {book.rating.toFixed(1)}</Text>
              )}
            </View>

            <Text style={styles.description}>{book.description}</Text>

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Language</Text>
                <Text style={styles.detailValue}>{book.language}</Text>
              </View>
              {book.duration && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{Math.floor(book.duration / 60)} min</Text>
                </View>
              )}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>File Size</Text>
                <Text style={styles.detailValue}>{(book.fileSize / 1024 / 1024).toFixed(1)} MB</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer: Library mode = rating | Store mode = download */}
      {showLibraryMode ? (
        <View style={styles.footer}>
          {!hasBeenUsed ? (
            /* Not yet used with pen → prompt to mark as used */
            <View style={styles.ratingSection}>
              <Text style={styles.ratingHint}>
                🎧 Use this book with your Zuupah Pen first to unlock rating
              </Text>
              <TouchableOpacity style={styles.markUsedBtn} onPress={handleMarkAsUsed}>
                <Text style={styles.markUsedText}>Mark as Listened ✓</Text>
              </TouchableOpacity>
            </View>
          ) : ratingSubmitted ? (
            /* Already rated */
            <View style={styles.ratingSection}>
              <Text style={styles.ratedTitle}>Your Rating</Text>
              <View style={styles.starsRow}>
                {STARS.map(s => (
                  <Text key={s} style={[styles.star, s <= (ratedBooks[bookId] ?? selectedStars) && styles.starActive]}>★</Text>
                ))}
              </View>
              <Text style={styles.ratingHint}>Thanks for your review!</Text>
            </View>
          ) : (
            /* Used but not yet rated */
            <View style={styles.ratingSection}>
              <Text style={styles.ratedTitle}>Rate this book</Text>
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
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}
            </Text>
          </View>
          <Button
            title={isInLibrary ? 'Downloaded ✓' : 'Download'}
            onPress={handleDownload}
            disabled={isInLibrary}
            size="large"
            style={styles.downloadButton}
            fullWidth
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  cover: {
    width: '100%', height: 300, borderRadius: 16,
    backgroundColor: COLORS.surfaceLight, marginBottom: 24,
  },
  info: { gap: 12 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold', color: COLORS.darkText },
  author: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.lightText },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: COLORS.morningYellow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  badgeText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  category: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText },
  rating: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  description: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.lightText, lineHeight: 22, marginTop: 8 },
  details: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 16 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText },
  detailValue: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  priceContainer: { paddingHorizontal: 12 },
  price: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold', color: COLORS.zestyOrange },
  downloadButton: { flex: 1 },
  // Library / Rating UI
  ratingSection: { flex: 1, alignItems: 'center', gap: 8 },
  ratedTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold', color: COLORS.darkText },
  starsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  star: { fontSize: 32, color: COLORS.border },
  starActive: { color: '#f59e0b' },
  ratingHint: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText, textAlign: 'center' },
  markUsedBtn: {
    backgroundColor: COLORS.softPillowBlue, borderRadius: 8,
    paddingHorizontal: 20, paddingVertical: 8,
  },
  markUsedText: { color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', fontSize: TYPOGRAPHY.fontSize.sm },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 16 },
  errorText: { fontSize: TYPOGRAPHY.fontSize.lg, color: COLORS.darkText },
});

export default BookDetailScreen;

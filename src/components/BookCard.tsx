/**
 * Book Card Component — theme aware
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Book } from '@types/book';
import { getBookCoverSource } from '@services/firebase/mockBooksData';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';
import Card from './common/Card';
import Button from './common/Button';

interface BookCardProps {
  book: Book;
  onPress: (bookId: string) => void;
  onDownload?: (bookId: string) => void;
  isDownloading?: boolean;
  downloadProgress?: number;
  isDownloaded?: boolean;
  onRemove?: (bookId: string) => void;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book, onPress, onDownload,
  isDownloading = false, downloadProgress = 0,
  isDownloaded = false, onRemove, compact = false,
}) => {
  const { tc } = useAppTheme();

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: tc.card, borderRadius: 12 }]}
        onPress={() => onPress(book.id)}
      >
        <Image source={getBookCoverSource(book)} style={styles.compactImage} />
        <Text style={[styles.compactTitle, { color: tc.text }]} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.price}>{book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={styles.card} onPress={() => onPress(book.id)}>
      <View style={styles.container}>
        <Image source={getBookCoverSource(book)} style={styles.image} />

        <View style={styles.content}>
          <Text style={[styles.title, { color: tc.text }]} numberOfLines={3}>{book.title}</Text>

          {book.author && (
            <Text style={[styles.author, { color: tc.textSecondary }]} numberOfLines={1}>by {book.author}</Text>
          )}

          <Text style={[styles.description, { color: tc.textSecondary }]} numberOfLines={3}>{book.description}</Text>

          <View style={styles.metadata}>
            <View style={styles.ageCategory}>
              <Text style={styles.ageText}>{book.ageMin}+</Text>
            </View>
            <Text style={[styles.category, { color: tc.textSecondary }]}>{book.category}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>{book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}</Text>
            {book.rating && <Text style={[styles.rating, { color: tc.text }]}>⭐ {book.rating.toFixed(1)}</Text>}
          </View>

          {isDownloaded ? (
            <TouchableOpacity style={styles.button} onPress={() => onRemove?.(book.id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          ) : isDownloading ? (
            <View style={styles.downloadingContainer}>
              <View style={[styles.progressBg, { backgroundColor: tc.border }]}>
                <View style={[styles.progressFill, { width: `${downloadProgress}%` as any }]} />
              </View>
              <Text style={styles.downloadingText}>{Math.round(downloadProgress)}%</Text>
            </View>
          ) : (
            <Button title="Download" onPress={() => onDownload?.(book.id)} size="small" style={styles.button} />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  container: { flexDirection: 'row', gap: 12 },
  image: { width: 100, height: 140, borderRadius: 8, backgroundColor: COLORS.surfaceLight },
  compactImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8, backgroundColor: COLORS.surfaceLight },
  compactContainer: { width: '48%', marginRight: '4%', padding: 8 },
  compactTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', marginBottom: 4 },
  content: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold', marginBottom: 4 },
  author: { fontSize: TYPOGRAPHY.fontSize.sm, marginBottom: 8 },
  description: { fontSize: TYPOGRAPHY.fontSize.sm, marginBottom: 8, lineHeight: 18 },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ageCategory: { backgroundColor: COLORS.morningYellow, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  ageText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  category: { fontSize: TYPOGRAPHY.fontSize.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  price: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold', color: COLORS.zestyOrange },
  rating: { fontSize: TYPOGRAPHY.fontSize.sm },
  button: { marginTop: 8 },
  buttonText: { color: COLORS.error, fontFamily: 'Nunito-SemiBold', padding: 8, textAlign: 'center' },
  downloadingContainer: { marginTop: 8, gap: 4 },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: COLORS.beachBlue, borderRadius: 3 },
  downloadingText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
});

export default BookCard;

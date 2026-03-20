/**
 * Book Card Component
 * Displays a book with cover image, title, and action buttons
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Book } from '@types/book';
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

/**
 * BookCard Component
 * Displays book information with cover image and action buttons
 */
export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onDownload,
  isDownloading = false,
  downloadProgress = 0,
  isDownloaded = false,
  onRemove,
  compact = false,
}) => {
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, styles.card]}
        onPress={() => onPress(book.id)}
      >
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.compactImage}
          defaultSource={require('../../assets/placeholder.png')}
        />
        <Text style={styles.compactTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.price}>
          {book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Card
      style={styles.card}
      onPress={() => onPress(book.id)}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.image}
          defaultSource={require('../../assets/placeholder.png')}
        />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {book.title}
          </Text>

          {book.author && (
            <Text style={styles.author} numberOfLines={1}>
              by {book.author}
            </Text>
          )}

          <Text style={styles.description} numberOfLines={3}>
            {book.description}
          </Text>

          <View style={styles.metadata}>
            <View style={styles.ageCategory}>
              <Text style={styles.ageText}>
                {book.ageMin}+
              </Text>
            </View>
            <Text style={styles.category}>{book.category}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>
              {book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}
            </Text>

            {book.rating && (
              <Text style={styles.rating}>
                ⭐ {book.rating.toFixed(1)}
              </Text>
            )}
          </View>

          {isDownloaded ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => onRemove?.(book.id)}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          ) : isDownloading ? (
            <View style={styles.downloadingContainer}>
              <ActivityIndicator size="small" color={COLORS.beachBlue} />
              <Text style={styles.downloadingText}>
                {Math.round(downloadProgress)}%
              </Text>
            </View>
          ) : (
            <Button
              title="Download"
              onPress={() => onDownload?.(book.id)}
              size="small"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  compactImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  compactContainer: {
    width: '48%',
    marginRight: '4%',
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700' as const,
    color: COLORS.darkText,
    marginBottom: 4,
  },
  author: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: 8,
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ageCategory: {
    backgroundColor: COLORS.morningYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ageText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  category: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '700' as const,
    color: COLORS.zestyOrange,
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.darkText,
  },
  button: {
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.error,
    fontWeight: '600' as const,
    padding: 8,
    textAlign: 'center',
  },
  downloadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  downloadingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.beachBlue,
    fontWeight: '600' as const,
  },
});

export default BookCard;

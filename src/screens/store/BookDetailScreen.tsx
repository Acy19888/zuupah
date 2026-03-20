/**
 * Book Detail Screen
 * Book information and download
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
import { useBooks } from '@hooks/useBooks';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import * as bookService from '@services/firebase/books';
import { Book } from '@types/book';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * BookDetailScreen Component
 * Displays detailed book information with download option
 */
const BookDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleStartDownload } = useBooks();

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
    if (book) {
      handleStartDownload(book.id);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading book..." fullScreen />;
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.cover}
            defaultSource={require('../../assets/placeholder.png')}
          />

          <View style={styles.info}>
            <Text style={styles.title}>{book.title}</Text>

            {book.author && (
              <Text style={styles.author}>by {book.author}</Text>
            )}

            <View style={styles.metadata}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Age {book.ageMin}+</Text>
              </View>
              <Text style={styles.category}>{book.category}</Text>
              {book.rating && (
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
                  <Text style={styles.detailValue}>
                    {Math.floor(book.duration / 60)} min
                  </Text>
                </View>
              )}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>File Size</Text>
                <Text style={styles.detailValue}>
                  {(book.fileSize / 1024 / 1024).toFixed(1)} MB
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}
          </Text>
        </View>
        <Button
          title={book.isFree ? 'Download' : 'Download'}
          onPress={handleDownload}
          size="large"
          style={styles.downloadButton}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 60,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.beachBlue,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  cover: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: 24,
  },
  info: {
    gap: 12,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  author: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.lightText,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: COLORS.morningYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  category: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.lightText,
    lineHeight: 22,
    marginTop: 8,
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceContainer: {
    paddingHorizontal: 12,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700' as const,
    color: COLORS.zestyOrange,
  },
  downloadButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.darkText,
  },
});

export default BookDetailScreen;

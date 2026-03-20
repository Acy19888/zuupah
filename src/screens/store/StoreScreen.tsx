/**
 * Store Screen
 * Browse and download books
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBooks } from '@hooks/useBooks';
import BookCard from '@components/BookCard';
import CategoryChip from '@components/CategoryChip';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { CONFIG } from '@constants/config';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * StoreScreen Component
 * Displays available books for browsing and downloading
 */
const StoreScreen: React.FC<any> = ({ navigation }) => {
  const {
    books,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    handleSetSearchQuery,
    handleSetCategory,
    handleStartDownload,
    clearError,
    fetchFreeBooks,
    fetchTrendingBooks,
  } = useBooks();

  const [activeSection, setActiveSection] = useState<'trending' | 'free' | 'all'>('trending');

  useFocusEffect(
    useCallback(() => {
      if (activeSection === 'trending') {
        fetchTrendingBooks(10);
      } else if (activeSection === 'free') {
        fetchFreeBooks(20);
      }
    }, [activeSection, fetchTrendingBooks, fetchFreeBooks])
  );

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const handleDownload = (bookId: string) => {
    handleStartDownload(bookId);
  };

  const renderBookCard = ({ item }: any) => (
    <BookCard
      book={item}
      onPress={handleBookPress}
      onDownload={handleDownload}
      compact={false}
    />
  );

  if (isLoading && books.length === 0) {
    return <LoadingSpinner text="Loading books..." fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search books..."
                placeholderTextColor={COLORS.placeholderText}
                value={searchQuery}
                onChangeText={handleSetSearchQuery}
              />
            </View>

            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CONFIG.BOOK_CATEGORIES.map(category => (
                  <CategoryChip
                    key={category}
                    label={category}
                    isSelected={selectedCategory === category}
                    onPress={() =>
                      selectedCategory === category
                        ? handleSetCategory(null)
                        : handleSetCategory(category)
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.darkText,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  errorContainer: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500' as const,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default StoreScreen;

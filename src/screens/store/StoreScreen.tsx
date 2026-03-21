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
import { useAppTheme } from '@hooks/useAppTheme';
import BookCard from '@components/BookCard';
import CategoryChip from '@components/CategoryChip';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { CONFIG } from '@constants/config';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const StoreScreen: React.FC<any> = ({ navigation }) => {
  const {
    books, downloads, libraryBooks, isLoading, error,
    searchQuery, selectedCategory,
    handleSetSearchQuery, handleSetCategory, handleStartDownload,
    clearError, fetchFreeBooks, fetchTrendingBooks,
  } = useBooks();
  const { tc } = useAppTheme();

  const [activeSection, setActiveSection] = useState<'trending' | 'free' | 'all'>('trending');

  useFocusEffect(
    useCallback(() => {
      if (activeSection === 'trending') fetchTrendingBooks(10);
      else if (activeSection === 'free') fetchFreeBooks(20);
    }, [activeSection, fetchTrendingBooks, fetchFreeBooks])
  );

  const handleBookPress = (bookId: string) => navigation.navigate('BookDetail', { bookId });
  const handleDownload  = (bookId: string) => handleStartDownload(bookId);

  const renderBookCard = ({ item }: any) => {
    const dl = downloads.get(item.id);
    const isInLibrary = libraryBooks.some((b: any) => b.id === item.id);
    return (
      <BookCard
        book={item}
        onPress={handleBookPress}
        onDownload={handleDownload}
        isDownloading={dl?.status === 'downloading'}
        downloadProgress={dl?.progress ?? 0}
        isDownloaded={isInLibrary && dl?.status === 'completed'}
        compact={false}
      />
    );
  };

  if (isLoading && books.length === 0) return <LoadingSpinner text="Loading books..." fullScreen />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={[styles.searchContainer, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, borderWidth: 1 }]}>
              <TextInput
                style={[styles.searchInput, { color: tc.inputText }]}
                placeholder="Search books..."
                placeholderTextColor={tc.textDisabled}
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
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 24, paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 8,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  categoriesContainer: { paddingVertical: 8 },
  errorContainer: {
    backgroundColor: COLORS.error, paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 8,
  },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  listContent: { paddingHorizontal: 12, paddingVertical: 8 },
});

export default StoreScreen;

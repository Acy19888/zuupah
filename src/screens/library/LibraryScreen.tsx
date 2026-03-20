/**
 * Library Screen
 * View and manage downloaded books
 */

import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
} from 'react-native';
import { useBooks } from '@hooks/useBooks';
import BookCard from '@components/BookCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const LibraryScreen: React.FC<any> = ({ navigation }) => {
  const { libraryBooks, isLoading, handleRemoveFromLibrary } = useBooks();

  const handleBookPress = (bookId: string) => {
    // Navigate within the LibraryStack so we get rating UI, not download
    navigation.navigate('LibraryBookDetail', { bookId, fromLibrary: true });
  };

  const renderBookCard = ({ item }: any) => (
    <BookCard
      book={item}
      onPress={handleBookPress}
      isDownloaded={true}
      onRemove={handleRemoveFromLibrary}
      compact={false}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>No Books Yet</Text>
      <Text style={styles.emptyText}>
        Browse the store and download books to add them to your library
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading library..." fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Text style={styles.subtitle}>
          {libraryBooks.length} book{libraryBooks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={libraryBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyState}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700' as const, color: COLORS.darkText },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText, marginTop: 4 },
  listContent: { paddingHorizontal: 12, paddingVertical: 12 },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: '600' as const,
    color: COLORS.darkText, textAlign: 'center', marginBottom: 8,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.lightText,
    textAlign: 'center', lineHeight: 20,
  },
});

export default LibraryScreen;

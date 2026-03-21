/**
 * Library Screen
 * View and manage downloaded books
 */

import React from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { useBooks } from '@hooks/useBooks';
import { useAppTheme } from '@hooks/useAppTheme';
import BookCard from '@components/BookCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { TYPOGRAPHY } from '@constants/typography';

const LibraryScreen: React.FC<any> = ({ navigation }) => {
  const { libraryBooks, isLoading, handleRemoveFromLibrary } = useBooks();
  const { tc } = useAppTheme();

  const handleBookPress = (bookId: string) => {
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
      <Text style={[styles.emptyTitle, { color: tc.text }]}>No Books Yet</Text>
      <Text style={[styles.emptyText, { color: tc.textSecondary }]}>
        Browse the store and download books to add them to your library
      </Text>
    </View>
  );

  if (isLoading) return <LoadingSpinner text="Loading library..." fullScreen />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={[styles.header, { borderBottomColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>My Library</Text>
        <Text style={[styles.subtitle, { color: tc.textSecondary }]}>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, marginTop: 4 },
  listContent: { paddingHorizontal: 12, paddingVertical: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginBottom: 8 },
  emptyText: { fontSize: TYPOGRAPHY.fontSize.base, textAlign: 'center', lineHeight: 20 },
});

export default LibraryScreen;

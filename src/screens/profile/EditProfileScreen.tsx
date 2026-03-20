/**
 * Edit Profile Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  Text, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const EditProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, handleUpdateProfile, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    await handleUpdateProfile({ displayName: displayName.trim() });
    setSaved(true);
    setTimeout(() => {
      navigation.goBack();
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(displayName || user?.displayName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.avatarHint}>Tap to change photo (coming soon)</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={COLORS.placeholderText}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.email ?? ''}
              editable={false}
            />
            <Text style={styles.hint}>Email cannot be changed here</Text>
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Profile updated!</Text>
          </View>
        )}

        <Button
          title={isLoading ? 'Saving…' : 'Save Changes'}
          onPress={handleSave}
          isLoading={isLoading}
          disabled={isLoading || !displayName.trim()}
          fullWidth
          size="large"
          style={styles.saveBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 32 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontWeight: '600' as const },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700' as const, color: COLORS.darkText },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarText: { fontSize: 38, fontWeight: '700' as const, color: COLORS.white },
  avatarHint: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600' as const, color: COLORS.darkText },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.darkText,
    backgroundColor: COLORS.white,
  },
  inputDisabled: { backgroundColor: COLORS.backgroundAlt, color: COLORS.lightText },
  hint: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText },
  successBanner: {
    backgroundColor: COLORS.success, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10, marginTop: 16,
  },
  successText: { color: COLORS.white, fontWeight: '600' as const, textAlign: 'center' },
  saveBtn: { marginTop: 32 },
});

export default EditProfileScreen;

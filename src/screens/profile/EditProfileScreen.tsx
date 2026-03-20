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
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName,  setLastName]  = useState(user?.lastName  ?? '');
  const [childName, setChildName] = useState(user?.childName ?? '');
  const [saved, setSaved] = useState(false);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || (user?.displayName?.charAt(0).toUpperCase() ?? 'U');

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'First name and last name cannot be empty.');
      return;
    }
    await handleUpdateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      childName: childName.trim() || undefined,
    });
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
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.avatarHint}>Tap to change photo (coming soon)</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* First + Last name row */}
          <View style={styles.rowGroup}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor={COLORS.placeholderText}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor={COLORS.placeholderText}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Child's Name <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              value={childName}
              onChangeText={setChildName}
              placeholder="Emma"
              placeholderTextColor={COLORS.placeholderText}
              editable={!isLoading}
              autoCapitalize="words"
            />
            <Text style={styles.hint}>Shown in greetings and the learning pen</Text>
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
          disabled={isLoading || !firstName.trim() || !lastName.trim()}
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
  header: { marginBottom: 28 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontWeight: '600' as const },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700' as const, color: COLORS.darkText },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarText: { fontSize: 32, fontWeight: '700' as const, color: COLORS.white },
  avatarHint: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText },
  form: { gap: 20 },
  rowGroup: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600' as const, color: COLORS.darkText },
  optional: { fontWeight: '400' as const, color: COLORS.lightText },
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

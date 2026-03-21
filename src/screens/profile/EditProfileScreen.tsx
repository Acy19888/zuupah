/**
 * Edit Profile Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  Text, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const EditProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, handleUpdateProfile, isLoading } = useAuth();
  const { tc } = useAppTheme();
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
    await handleUpdateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), childName: childName.trim() || undefined });
    setSaved(true);
    setTimeout(() => navigation.goBack(), 800);
  };

  const inputStyle = [styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>Edit Profile</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.avatarHint, { color: tc.textSecondary }]}>Tap to change photo (coming soon)</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.rowGroup}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: tc.text }]}>First Name</Text>
              <TextInput style={inputStyle} value={firstName} onChangeText={setFirstName}
                placeholder="John" placeholderTextColor={tc.textDisabled} editable={!isLoading} autoCapitalize="words" />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: tc.text }]}>Last Name</Text>
              <TextInput style={inputStyle} value={lastName} onChangeText={setLastName}
                placeholder="Doe" placeholderTextColor={tc.textDisabled} editable={!isLoading} autoCapitalize="words" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Child's Name <Text style={[styles.optional, { color: tc.textSecondary }]}>(optional)</Text></Text>
            <TextInput style={inputStyle} value={childName} onChangeText={setChildName}
              placeholder="Emma" placeholderTextColor={tc.textDisabled} editable={!isLoading} autoCapitalize="words" />
            <Text style={[styles.hint, { color: tc.textSecondary }]}>Shown in greetings and the learning pen</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Email</Text>
            <TextInput style={[inputStyle, { backgroundColor: tc.backgroundAlt, color: tc.textSecondary }]}
              value={user?.email ?? ''} editable={false} />
            <Text style={[styles.hint, { color: tc.textSecondary }]}>Email cannot be changed here</Text>
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Profile updated!</Text>
          </View>
        )}

        <Button title={isLoading ? 'Saving…' : 'Save Changes'} onPress={handleSave}
          isLoading={isLoading} disabled={isLoading || !firstName.trim() || !lastName.trim()}
          fullWidth size="large" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 28 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.beachBlue, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { fontSize: 32, fontFamily: 'Nunito-Bold', color: COLORS.white },
  avatarHint: { fontSize: TYPOGRAPHY.fontSize.sm },
  form: { gap: 20 },
  rowGroup: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  optional: { fontFamily: 'Nunito-Regular' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: TYPOGRAPHY.fontSize.base },
  hint: { fontSize: TYPOGRAPHY.fontSize.xs },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, marginTop: 16 },
  successText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
  saveBtn: { marginTop: 32 },
});

export default EditProfileScreen;

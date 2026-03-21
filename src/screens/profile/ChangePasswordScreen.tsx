/**
 * Change Password Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  Text, SafeAreaView, TouchableOpacity,
} from 'react-native';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const ChangePasswordScreen: React.FC<any> = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (next.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    // Simulate password change (mock)
    await new Promise(r => setTimeout(r, 900));
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Choose a strong password of at least 6 characters.</Text>
        </View>

        <View style={styles.form}>
          {/* Current */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.rowInput}
                value={current}
                onChangeText={setCurrent}
                secureTextEntry={!showCurrent}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderText}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Text style={styles.toggleText}>{showCurrent ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* New */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.rowInput}
                value={next}
                onChangeText={setNext}
                secureTextEntry={!showNext}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderText}
              />
              <TouchableOpacity onPress={() => setShowNext(!showNext)}>
                <Text style={styles.toggleText}>{showNext ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {/* Strength bar */}
            {next.length > 0 && (
              <View style={styles.strengthBar}>
                <View style={[
                  styles.strengthFill,
                  {
                    width: `${Math.min(100, (next.length / 12) * 100)}%`,
                    backgroundColor: next.length < 6 ? COLORS.error : next.length < 10 ? COLORS.warning : COLORS.success,
                  },
                ]} />
              </View>
            )}
          </View>

          {/* Confirm */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={[styles.input, confirm && confirm !== next && { borderColor: COLORS.error }]}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={COLORS.placeholderText}
            />
            {confirm.length > 0 && confirm !== next && (
              <Text style={styles.errorInline}>Passwords don't match</Text>
            )}
          </View>
        </View>

        {error !== '' && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Password changed successfully!</Text>
          </View>
        )}

        <Button
          title={isLoading ? 'Saving…' : 'Update Password'}
          onPress={handleSave}
          isLoading={isLoading}
          disabled={isLoading || !current || next.length < 6 || next !== confirm}
          fullWidth size="large" style={styles.saveBtn}
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
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold', color: COLORS.darkText, marginBottom: 6 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText, lineHeight: 20 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.darkText, backgroundColor: COLORS.white,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 14, backgroundColor: COLORS.white,
  },
  rowInput: { flex: 1, paddingVertical: 13, fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.darkText },
  toggleText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  strengthBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  errorInline: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.error },
  errorBanner: { backgroundColor: COLORS.error, borderRadius: 8, padding: 12, marginTop: 16 },
  errorText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold' },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12, marginTop: 16 },
  successText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
  saveBtn: { marginTop: 32 },
});

export default ChangePasswordScreen;

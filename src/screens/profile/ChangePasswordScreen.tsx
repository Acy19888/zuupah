/**
 * Change Password Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  Text, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const ChangePasswordScreen: React.FC<any> = ({ navigation }) => {
  const { tc } = useAppTheme();
  const [current, setCurrent]     = useState('');
  const [next, setNext]           = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const handleSave = async () => {
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (next.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setIsLoading(false); setSuccess(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  const rowStyle = [styles.row, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder }];
  const inputStyle = [styles.rowInput, { color: tc.inputText }];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>Change Password</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Choose a strong password of at least 6 characters.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Current Password</Text>
            <View style={rowStyle}>
              <TextInput style={inputStyle} value={current} onChangeText={setCurrent}
                secureTextEntry={!showCurrent} placeholder="••••••••" placeholderTextColor={tc.textDisabled} />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Text style={styles.toggleText}>{showCurrent ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>New Password</Text>
            <View style={rowStyle}>
              <TextInput style={inputStyle} value={next} onChangeText={setNext}
                secureTextEntry={!showNext} placeholder="••••••••" placeholderTextColor={tc.textDisabled} />
              <TouchableOpacity onPress={() => setShowNext(!showNext)}>
                <Text style={styles.toggleText}>{showNext ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {next.length > 0 && (
              <View style={[styles.strengthBar, { backgroundColor: tc.border }]}>
                <View style={[styles.strengthFill, {
                  width: `${Math.min(100, (next.length / 12) * 100)}%` as any,
                  backgroundColor: next.length < 6 ? COLORS.error : next.length < 10 ? COLORS.warning : COLORS.success,
                }]} />
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Confirm New Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg, borderColor: confirm && confirm !== next ? COLORS.error : tc.inputBorder, color: tc.inputText }]}
              value={confirm} onChangeText={setConfirm}
              secureTextEntry placeholder="••••••••" placeholderTextColor={tc.textDisabled} />
            {confirm.length > 0 && confirm !== next && (
              <Text style={styles.errorInline}>Passwords don't match</Text>
            )}
          </View>
        </View>

        {error !== '' && (
          <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>
        )}
        {success && (
          <View style={styles.successBanner}><Text style={styles.successText}>✓ Password changed successfully!</Text></View>
        )}

        <Button title={isLoading ? 'Saving…' : 'Update Password'} onPress={handleSave}
          isLoading={isLoading} disabled={isLoading || !current || next.length < 6 || next !== confirm}
          fullWidth size="large" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 32 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold', marginBottom: 6 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: TYPOGRAPHY.fontSize.base },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14 },
  rowInput: { flex: 1, paddingVertical: 13, fontSize: TYPOGRAPHY.fontSize.base },
  toggleText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  strengthBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  errorInline: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.error },
  errorBanner: { backgroundColor: COLORS.error, borderRadius: 8, padding: 12, marginTop: 16 },
  errorText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold' },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12, marginTop: 16 },
  successText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
  saveBtn: { marginTop: 32 },
});

export default ChangePasswordScreen;

/**
 * Forgot Password Screen
 */

import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, TouchableOpacity, Text,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const ForgotPasswordScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { handleForgotPassword, isLoading, error, clearError } = useAuth();
  const { tc } = useAppTheme();

  const handleSubmit = async () => {
    if (!email) return;
    try { clearError(); await handleForgotPassword(email); setEmailSent(true); }
    catch (err) { console.error('Forgot password error:', err); }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: tc.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>
            {emailSent ? 'Check your email for reset instructions' : 'Enter your email to reset your password'}
          </Text>
        </View>

        {!emailSent ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: tc.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
                placeholder="your@email.com"
                placeholderTextColor={tc.textDisabled}
                value={email} onChangeText={setEmail}
                keyboardType="email-address" editable={!isLoading} autoCapitalize="none"
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button title="Send Reset Link" onPress={handleSubmit} isLoading={isLoading}
              disabled={!email || isLoading} fullWidth size="large" style={styles.button} />
            <Text style={[styles.helpText, { color: tc.textSecondary }]}>
              We'll send you an email with instructions to reset your password.
            </Text>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}><Text style={styles.checkmark}>✓</Text></View>
            <Text style={[styles.successTitle, { color: tc.text }]}>Email Sent!</Text>
            <Text style={[styles.successText, { color: tc.textSecondary }]}>
              We've sent password reset instructions to{'\n'}
              <Text style={[styles.emailHighlight, { color: tc.text }]}>{email}</Text>
            </Text>
            <Text style={[styles.successHint, { color: tc.textSecondary }]}>
              Check your email and follow the link to reset your password.
            </Text>
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} fullWidth size="large" style={styles.button} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 40 },
  header: { marginBottom: 40 },
  backButton: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', marginBottom: 16 },
  title: { fontSize: TYPOGRAPHY.fontSize['3xl'], fontFamily: 'Nunito-Bold', marginBottom: 8 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.base, lineHeight: 20 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: TYPOGRAPHY.fontSize.base },
  errorContainer: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  button: { marginTop: 16 },
  helpText: { fontSize: TYPOGRAPHY.fontSize.sm, textAlign: 'center', marginTop: 8 },
  successContainer: { alignItems: 'center', gap: 16 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  checkmark: { fontSize: 40, color: COLORS.white, fontFamily: 'Nunito-Bold' },
  successTitle: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  successText: { fontSize: TYPOGRAPHY.fontSize.base, textAlign: 'center', lineHeight: 22 },
  emailHighlight: { fontFamily: 'Nunito-SemiBold' },
  successHint: { fontSize: TYPOGRAPHY.fontSize.sm, textAlign: 'center', marginTop: 8 },
});

export default ForgotPasswordScreen;

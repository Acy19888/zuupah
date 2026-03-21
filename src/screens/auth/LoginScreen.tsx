/**
 * Login Screen — with Remember Me, Google Sign-In, and i18n
 */

import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, TouchableOpacity, Text,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import { useI18n } from '@hooks/useI18n';
import Button from '@components/common/Button';
import ZuupahLogo from '@components/ZuupahLogo';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';
import * as authService from '@services/firebase/auth';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const { handleSignIn, handleGoogleSignIn, isLoading, error, clearError } = useAuth();
  const { tc } = useAppTheme();
  const { t } = useI18n();

  // Pre-fill remembered credentials on mount
  useEffect(() => {
    authService.getRememberedCredentials().then(creds => {
      if (creds) {
        setEmail(creds.email);
        setPassword(creds.password);
        setRememberMe(true);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      clearError();
      if (rememberMe) {
        await authService.saveRememberedCredentials(email, password);
      } else {
        await authService.clearRememberedCredentials();
      }
      await handleSignIn(email, password);
    } catch (err) { console.error('Login error:', err); }
  };

  const handleGoogle = async () => {
    try { clearError(); await handleGoogleSignIn(); }
    catch (err) { console.error('Google login error:', err); }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: tc.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ZuupahLogo width={180} />
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Play. Learn. Explore.</Text>
        </View>

        {/* Google Sign-In */}
        <TouchableOpacity
          style={[styles.googleBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
          onPress={handleGoogle}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleLabel, { color: tc.text }]}>{t('continueWithGoogle')}</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: tc.border }]} />
          <Text style={[styles.dividerText, { color: tc.textSecondary }]}>{t('orDivider')}</Text>
          <View style={[styles.dividerLine, { backgroundColor: tc.border }]} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>{t('email')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
              placeholder="your@email.com"
              placeholderTextColor={tc.textDisabled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>{t('password')}</Text>
            <View style={[styles.passwordContainer, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder }]}>
              <TextInput
                style={[styles.passwordInput, { color: tc.inputText }]}
                placeholder="••••••••"
                placeholderTextColor={tc.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me + Forgot Password row */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberMeRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, { borderColor: tc.border, backgroundColor: tc.inputBg }, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.rememberLabel, { color: tc.textSecondary }]}>{t('rememberMe')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title={t('signIn')}
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password || isLoading}
            fullWidth size="large" style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: tc.textSecondary }]}>{t('noAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>{t('signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 32, gap: 12 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.base, marginTop: 4 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, marginBottom: 16,
  },
  googleIcon: {
    fontSize: 18, fontFamily: 'Nunito-Bold', color: '#4285F4',
    width: 22, textAlign: 'center',
  },
  googleLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: TYPOGRAPHY.fontSize.sm },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  input: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 12,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: TYPOGRAPHY.fontSize.base },
  showButtonText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', paddingLeft: 8 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rememberMeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  checkmark: { color: '#fff', fontSize: 12, fontFamily: 'Nunito-Bold', lineHeight: 14 },
  rememberLabel: { fontSize: TYPOGRAPHY.fontSize.sm },
  button: { marginTop: 4 },
  link: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  errorContainer: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: TYPOGRAPHY.fontSize.sm },
  footerLink: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-Bold' },
});

export default LoginScreen;

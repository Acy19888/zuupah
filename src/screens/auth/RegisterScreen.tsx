/**
 * Register Screen — with Google Sign-In and i18n
 */

import React, { useState } from 'react';
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

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [childName, setChildName]         = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [acceptTerms, setAcceptTerms]     = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const { handleSignUp, handleGoogleSignIn, isLoading, error, clearError } = useAuth();
  const { tc } = useAppTheme();
  const { t } = useI18n();

  const canRegister = firstName && lastName && email && password && acceptTerms && acceptPrivacy;

  const handleRegister = async () => {
    if (!canRegister) return;
    try {
      clearError();
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await handleSignUp(email, password, displayName, firstName.trim(), lastName.trim(), childName.trim() || undefined);
    } catch (err) { console.error('Register error:', err); }
  };

  const handleGoogle = async () => {
    try { clearError(); await handleGoogleSignIn(); }
    catch (err) { console.error('Google register error:', err); }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: tc.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{t('back')}</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}><ZuupahLogo width={140} /></View>
          <Text style={[styles.title, { color: tc.text }]}>{t('createAccount')}</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Join Zuupah Today</Text>
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
          <View style={styles.rowGroup}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: tc.text }]}>{t('firstName')} *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
                placeholder="John" placeholderTextColor={tc.textDisabled}
                value={firstName} onChangeText={setFirstName}
                editable={!isLoading} autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: tc.text }]}>{t('lastName')} *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
                placeholder="Doe" placeholderTextColor={tc.textDisabled}
                value={lastName} onChangeText={setLastName}
                editable={!isLoading} autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>
              {t('childName')} <Text style={[styles.optional, { color: tc.textSecondary }]}>({t('optional')})</Text>
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
              placeholder="Emma" placeholderTextColor={tc.textDisabled}
              value={childName} onChangeText={setChildName}
              editable={!isLoading} autoCapitalize="words"
            />
            <Text style={[styles.hint, { color: tc.textSecondary }]}>{t('childNameHint')}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>{t('email')} *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
              placeholder="your@email.com" placeholderTextColor={tc.textDisabled}
              value={email} onChangeText={setEmail}
              keyboardType="email-address" editable={!isLoading} autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>{t('password')} *</Text>
            <View style={[styles.passwordContainer, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder }]}>
              <TextInput
                style={[styles.passwordInput, { color: tc.inputText }]}
                placeholder="••••••••" placeholderTextColor={tc.textDisabled}
                value={password} onChangeText={setPassword}
                secureTextEntry={!showPassword} editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.hint, { color: tc.textSecondary }]}>{t('atLeast6')}</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.checkboxGroup}>
            <TouchableOpacity style={styles.checkbox} onPress={() => !isLoading && setAcceptTerms(!acceptTerms)} activeOpacity={0.7}>
              <View style={[styles.checkboxBox, { borderColor: tc.border, backgroundColor: tc.inputBg }, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, { color: tc.text }]}>{t('acceptTerms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkbox} onPress={() => !isLoading && setAcceptPrivacy(!acceptPrivacy)} activeOpacity={0.7}>
              <View style={[styles.checkboxBox, { borderColor: tc.border, backgroundColor: tc.inputBg }, acceptPrivacy && styles.checkboxChecked]}>
                {acceptPrivacy && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, { color: tc.text }]}>{t('acceptPrivacy')}</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={t('createAccount')} onPress={handleRegister}
            isLoading={isLoading} disabled={!canRegister || isLoading}
            fullWidth size="large" style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: tc.textSecondary }]}>{t('hasAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>{t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 40 },
  header: { marginBottom: 24 },
  logoRow: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
  backButton: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', marginBottom: 16 },
  title: { fontSize: TYPOGRAPHY.fontSize['3xl'], fontFamily: 'Nunito-Bold', marginBottom: 4 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.base },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, marginBottom: 16,
  },
  googleIcon: { fontSize: 18, fontFamily: 'Nunito-Bold', color: '#4285F4', width: 22, textAlign: 'center' },
  googleLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: TYPOGRAPHY.fontSize.sm },
  form: { gap: 16 },
  rowGroup: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  optional: { fontFamily: 'Nunito-Regular' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: TYPOGRAPHY.fontSize.base },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: TYPOGRAPHY.fontSize.base },
  showButtonText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  hint: { fontSize: TYPOGRAPHY.fontSize.xs },
  checkboxGroup: { gap: 12, marginTop: 8 },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkboxBox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  checkboxChecked: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  checkboxTick: { color: COLORS.white, fontSize: 13, fontFamily: 'Nunito-Bold', lineHeight: 16 },
  checkboxLabel: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm },
  button: { marginTop: 16 },
  errorContainer: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: TYPOGRAPHY.fontSize.sm },
  footerLink: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-Bold' },
});

export default RegisterScreen;

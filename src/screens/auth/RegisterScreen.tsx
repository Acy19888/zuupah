/**
 * Register Screen
 * New user registration
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/common/Button';
import ZuupahLogo from '@components/ZuupahLogo';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [childName, setChildName]       = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms]   = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const { handleSignUp, isLoading, error, clearError } = useAuth();

  const canRegister = firstName && lastName && email && password && acceptTerms && acceptPrivacy;

  const handleRegister = async () => {
    if (!canRegister) return;
    try {
      clearError();
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await handleSignUp(email, password, displayName, firstName.trim(), lastName.trim(), childName.trim() || undefined);
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <ZuupahLogo width={140} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Zuupah Today</Text>
        </View>

        <View style={styles.form}>
          {/* First + Last name side by side */}
          <View style={styles.rowGroup}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor={COLORS.placeholderText}
                value={firstName}
                onChangeText={setFirstName}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor={COLORS.placeholderText}
                value={lastName}
                onChangeText={setLastName}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Child's Name <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Emma"
              placeholderTextColor={COLORS.placeholderText}
              value={childName}
              onChangeText={setChildName}
              editable={!isLoading}
              autoCapitalize="words"
            />
            <Text style={styles.hint}>Your child's name shown in the app</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.placeholderText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>At least 6 characters</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => !isLoading && setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I accept the Terms of Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => !isLoading && setAcceptPrivacy(!acceptPrivacy)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, acceptPrivacy && styles.checkboxChecked]}>
                {acceptPrivacy && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I accept the Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={!canRegister || isLoading}
            fullWidth
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1, justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 40,
  },
  header: { marginBottom: 40 },
  logoRow: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
  backButton: {
    fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue,
    fontFamily: 'Nunito-SemiBold', marginBottom: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'], fontFamily: 'Nunito-Bold',
    color: COLORS.darkText, marginBottom: 4,
  },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.lightText },
  form: { gap: 16 },
  rowGroup: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', color: COLORS.darkText },
  optional: { fontFamily: 'Nunito-Regular', color: COLORS.lightText },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 12,
    fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.darkText,
    backgroundColor: COLORS.white,
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
    paddingHorizontal: 12, backgroundColor: COLORS.white,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.darkText },
  showButtonText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  hint: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText },
  checkboxGroup: { gap: 12, marginTop: 8 },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkboxBox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2,
    borderColor: COLORS.border, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', marginRight: 4,
  },
  checkboxChecked: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  checkboxTick: { color: COLORS.white, fontSize: 13, fontFamily: 'Nunito-Bold', lineHeight: 16 },
  checkboxLabel: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.darkText },
  button: { marginTop: 16 },
  errorContainer: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText },
  footerLink: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-Bold' },
});

export default RegisterScreen;

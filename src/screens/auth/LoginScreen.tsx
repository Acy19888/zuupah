/**
 * Login Screen
 */

import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, TouchableOpacity, Text,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import ZuupahLogo from '@components/ZuupahLogo';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignIn, isLoading, error, clearError } = useAuth();
  const { tc } = useAppTheme();

  const handleLogin = async () => {
    if (!email || !password) return;
    try { clearError(); await handleSignIn(email, password); }
    catch (err) { console.error('Login error:', err); }
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

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.inputText }]}
              placeholder="your@email.com"
              placeholderTextColor={tc.textDisabled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tc.text }]}>Password</Text>
            <View style={[styles.passwordContainer, { backgroundColor: tc.inputBg, borderColor: tc.inputBorder }]}>
              <TextInput
                style={[styles.passwordInput, { color: tc.inputText }]}
                placeholder="••••••••"
                placeholderTextColor={tc.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password || isLoading}
            fullWidth size="large" style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: tc.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40, gap: 12 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.base, marginTop: 4 },
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
  button: { marginTop: 8 },
  link: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 12 },
  errorContainer: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  errorText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Medium' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: TYPOGRAPHY.fontSize.sm },
  footerLink: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.beachBlue, fontFamily: 'Nunito-Bold' },
});

export default LoginScreen;

/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@hooks/useAuth';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * ProfileScreen Component
 * Displays user profile and account settings
 */
const ProfileScreen: React.FC<any> = () => {
  const { user, handleSignOut } = useAuth();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {user && (
          <View style={styles.content}>
            <Card style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.displayName}>{user.displayName}</Text>
                <Text style={styles.email}>{user.email}</Text>
                {!user.isEmailVerified && (
                  <View style={styles.verificationBadge}>
                    <Text style={styles.verificationText}>
                      ⚠️ Email not verified
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="account-edit"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Edit Profile</Text>
                    <Text style={styles.settingDesc}>Update your information</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="lock-reset"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Change Password</Text>
                    <Text style={styles.settingDesc}>Update your password</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="bell"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Notifications</Text>
                    <Text style={styles.settingDesc}>Manage notifications</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="palette"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Appearance</Text>
                    <Text style={styles.settingDesc}>Light, dark, or auto</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="shield-account"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Parental Controls</Text>
                    <Text style={styles.settingDesc}>Manage family settings</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="help-circle"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Help & Support</Text>
                    <Text style={styles.settingDesc}>FAQs and contact us</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="file-document"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Terms & Privacy</Text>
                    <Text style={styles.settingDesc}>Our policies</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Icon
                    name="information"
                    size={24}
                    color={COLORS.beachBlue}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>About</Text>
                    <Text style={styles.settingDesc}>Version 0.1.0</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.lightText} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Button
                title="Sign Out"
                onPress={handleLogout}
                variant="danger"
                fullWidth
                size="large"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: COLORS.white,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
  },
  verificationBadge: {
    marginTop: 8,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verificationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.darkText,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700' as const,
    color: COLORS.lightText,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  settingDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    marginTop: 2,
  },
});

export default ProfileScreen;

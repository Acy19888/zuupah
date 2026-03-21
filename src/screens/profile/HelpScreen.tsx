/**
 * Help & Support Screen
 * FAQ accordion + contact section
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

// ── FAQ content ───────────────────────────────────────────────────────────────

const FAQ_CATEGORIES = [
  {
    category: '🚀 Getting Started',
    icon: 'rocket-launch-outline',
    items: [
      {
        q: 'What is Zuupah?',
        a: 'Zuupah is an interactive learning app designed for children aged 3–10. It pairs with the Zuupah smart pen to bring story books to life with sounds, narration, and games. You can also use the app independently to browse and download books.',
      },
      {
        q: 'How do I create an account?',
        a: "Tap 'Sign Up' on the login screen, fill in your name, email, and a password (at least 6 characters). You can also sign in instantly with your Google account. Once registered, you can add your child's name in your profile.",
      },
      {
        q: 'Which age group is Zuupah for?',
        a: 'Zuupah is designed for children aged 3 to 10 years. The book catalogue is divided by age groups so you can always find content that is right for your child.',
      },
    ],
  },
  {
    category: '📚 Books & Downloads',
    icon: 'book-open-variant',
    items: [
      {
        q: 'How do I download a book?',
        a: "Go to the Store tab, find a book you like, and tap on it to open the detail page. Press the 'Download' button — a progress bar will show the download. Once completed, the book appears in your Library.",
      },
      {
        q: 'Can I read books without internet?',
        a: 'Yes! Once a book is downloaded, you can read and listen to it fully offline. Only browsing the store and downloading new books requires an internet connection.',
      },
      {
        q: 'How do I remove a book from my library?',
        a: "In the Library tab, find the book and tap the remove icon. A confirmation dialog will appear — tap 'Remove' to confirm. The book will be deleted from your device but you can always re-download it from the Store.",
      },
      {
        q: 'How many books can I download?',
        a: 'There is no hard limit on the number of books you can download. Storage is only limited by the free space on your device.',
      },
    ],
  },
  {
    category: '✏️ Zuupah Pen',
    icon: 'pen',
    items: [
      {
        q: 'How do I connect the Zuupah pen?',
        a: "Make sure your pen is charged and Bluetooth is enabled on your device. Go to the Pen tab in the app and tap 'Connect Pen'. The app will scan for nearby Zuupah pens and connect automatically.",
      },
      {
        q: 'My pen is not connecting. What should I do?',
        a: '1. Make sure the pen is charged (charge indicator glows blue).\n2. Toggle Bluetooth off and on on your phone.\n3. Force-close and reopen the app.\n4. If still failing, try resetting the pen by holding the power button for 10 seconds.',
      },
      {
        q: 'How do I update the pen firmware?',
        a: "When a firmware update is available you will see a notification in the Pen tab. Tap 'Update Firmware', keep the pen close to your phone, and wait for the update to finish (approx. 2–3 minutes). Do not close the app during the update.",
      },
    ],
  },
  {
    category: '👤 Account & Settings',
    icon: 'account-cog-outline',
    items: [
      {
        q: 'How do I change the app language?',
        a: 'Go to Profile → Language. Choose from English, Français, Español, or 中文. The change takes effect immediately throughout the app.',
      },
      {
        q: 'How do I switch to dark mode?',
        a: 'Go to Profile → Appearance. Choose Light, Dark, or Auto (follows your device setting).',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: "On the login screen, tap 'Forgot Password?' and enter your email address. You will receive a password reset link within a few minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: 'How do I delete my account?',
        a: 'We are sorry to see you go! Please email privacy@zuupah.com with the subject "Account Deletion Request" and we will delete your account and all associated data within 30 days.',
      },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface FAQItemProps { q: string; a: string; tc: any }

const FAQItem: React.FC<FAQItemProps> = ({ q, a, tc }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[faqStyles.item, { borderBottomColor: tc.divider }]}>
      <TouchableOpacity style={faqStyles.question} onPress={() => setOpen(!open)} activeOpacity={0.7}>
        <Text style={[faqStyles.qText, { color: tc.text }]}>{q}</Text>
        <Icon name={open ? 'minus' : 'plus'} size={18} color={COLORS.beachBlue} />
      </TouchableOpacity>
      {open && <Text style={[faqStyles.aText, { color: tc.textSecondary }]}>{a}</Text>}
    </View>
  );
};

const faqStyles = StyleSheet.create({
  item: { borderBottomWidth: 1, paddingVertical: 4 },
  question: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, gap: 8,
  },
  qText: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', lineHeight: 20 },
  aText: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 22, paddingBottom: 12 },
});

// ── Screen ────────────────────────────────────────────────────────────────────

const HelpScreen: React.FC<any> = ({ navigation }) => {
  const { tc } = useAppTheme();
  const [openCategory, setOpenCategory] = useState<number | null>(0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: tc.text }]}>Help & Support</Text>
        <Text style={[styles.subtitle, { color: tc.textSecondary }]}>
          How can we help you?
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* FAQ accordion */}
        {FAQ_CATEGORIES.map((cat, ci) => {
          const isOpen = openCategory === ci;
          return (
            <View key={ci} style={[styles.category, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <TouchableOpacity
                style={styles.catHeader}
                onPress={() => setOpenCategory(isOpen ? null : ci)}
                activeOpacity={0.75}
              >
                <View style={styles.catLeft}>
                  <View style={[styles.catIcon, { backgroundColor: COLORS.beachBlue + '18' }]}>
                    <Icon name={cat.icon as any} size={20} color={COLORS.beachBlue} />
                  </View>
                  <Text style={[styles.catTitle, { color: tc.text }]}>{cat.category}</Text>
                </View>
                <Icon
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={tc.textSecondary}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={[styles.catBody, { borderTopColor: tc.divider }]}>
                  {cat.items.map((item, qi) => (
                    <FAQItem key={qi} q={item.q} a={item.a} tc={tc} />
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Contact section */}
        <View style={[styles.contactCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <Text style={[styles.contactTitle, { color: tc.text }]}>
            Still need help? 💬
          </Text>
          <Text style={[styles.contactText, { color: tc.textSecondary }]}>
            Our support team is available Monday–Friday, 9:00–18:00 CET.
          </Text>

          {[
            { icon: 'email-outline',   label: 'support@zuupah.com',      action: () => Linking.openURL('mailto:support@zuupah.com') },
            { icon: 'web',             label: 'www.zuupah.com/support',   action: () => Linking.openURL('https://zuupah.com') },
          ].map(row => (
            <TouchableOpacity
              key={row.label}
              style={[styles.contactRow, { borderColor: tc.border }]}
              onPress={row.action}
              activeOpacity={0.75}
            >
              <View style={[styles.contactIcon, { backgroundColor: COLORS.beachBlue + '18' }]}>
                <Icon name={row.icon as any} size={18} color={COLORS.beachBlue} />
              </View>
              <Text style={[styles.contactRowLabel, { color: COLORS.beachBlue }]}>{row.label}</Text>
              <Icon name="chevron-right" size={18} color={tc.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 4 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold', marginBottom: 4 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, marginTop: 2 },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  category: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  catHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 14,
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  catIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  catTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Bold' },
  catBody: { borderTopWidth: 1, paddingHorizontal: 14 },
  contactCard: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 12 },
  contactTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
  contactText: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20 },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderTopWidth: 1,
  },
  contactIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  contactRowLabel: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
});

export default HelpScreen;

/**
 * Terms & Privacy Screen
 * Expandable sections for Terms of Service and Privacy Policy
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

// ── Content ──────────────────────────────────────────────────────────────────

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By downloading or using the Zuupah app ("App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.\n\nThese Terms apply to all users of the App, including parents, guardians, and children who use the App under adult supervision.`,
  },
  {
    title: '2. Use of the App',
    body: `Zuupah is designed for children aged 3–10 years and is intended to be used under parental supervision.\n\n• You may use the App for personal, non-commercial purposes only.\n• You may not copy, modify, distribute, or reverse-engineer any part of the App.\n• You are responsible for maintaining the confidentiality of your account credentials.\n• You agree not to share your account with others outside your household.`,
  },
  {
    title: '3. Content & Downloads',
    body: `All books, stories, and educational content available in Zuupah are protected by copyright and owned by Zuupah GmbH or its content partners.\n\nDownloaded content is licensed for personal use on up to 2 devices per account. You may not redistribute, reproduce, or share downloaded content outside the App.`,
  },
  {
    title: '4. Subscriptions & Payments',
    body: `Some features of Zuupah require a paid subscription. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period.\n\nRefunds are handled according to the refund policy of the respective app store (Apple App Store or Google Play Store). Please contact support@zuupah.com for billing inquiries.`,
  },
  {
    title: '5. Limitation of Liability',
    body: `To the fullest extent permitted by law, Zuupah GmbH shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the App.\n\nThe App is provided "as is" without warranties of any kind, express or implied.`,
  },
  {
    title: '6. Changes to Terms',
    body: `We reserve the right to update these Terms at any time. We will notify you of material changes via in-app notification or email. Continued use of the App after changes constitutes your acceptance of the new Terms.`,
  },
  {
    title: '7. Contact',
    body: `For questions about these Terms, please contact us:\n\n📧 legal@zuupah.com\n🌐 www.zuupah.com/legal\n\nZuupah GmbH\nMusterstraße 12\n10115 Berlin, Germany`,
  },
];

const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect the following information when you use Zuupah:\n\n• Account information: name, email address, child's name (optional)\n• Usage data: books read, time spent, download history\n• Device information: device type, OS version, app version\n• Analytics: anonymised interaction data to improve the App\n\nWe do NOT collect precise location data, voice recordings, or any biometric data.`,
  },
  {
    title: '2. How We Use Your Data',
    body: `We use the collected information to:\n\n• Provide and improve the App and its content\n• Personalise book recommendations for your child\n• Send important account notifications\n• Analyse app performance and fix bugs\n• Comply with legal obligations\n\nWe never sell your personal data to third parties.`,
  },
  {
    title: '3. Children\'s Privacy (COPPA & GDPR-K)',
    body: `Zuupah takes children's privacy seriously and complies with COPPA (US) and GDPR-K (EU).\n\n• We do not knowingly collect personal data directly from children under 13.\n• All account registration is performed by a parent or guardian.\n• Parents can request deletion of their child's data at any time by emailing privacy@zuupah.com.\n• We do not serve behavioural advertising to child users.`,
  },
  {
    title: '4. Data Storage & Security',
    body: `Your data is stored on secure servers in the European Union. We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 for data at rest.\n\nWe retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time.`,
  },
  {
    title: '5. Third-Party Services',
    body: `Zuupah uses the following third-party services:\n\n• Firebase (Google) — authentication & database\n• Expo — app infrastructure\n• RevenueCat — subscription management\n\nEach service has its own privacy policy. Links are available at www.zuupah.com/privacy.`,
  },
  {
    title: '6. Your Rights',
    body: `Depending on your location, you may have the right to:\n\n• Access the personal data we hold about you\n• Correct inaccurate data\n• Request deletion of your data\n• Object to or restrict certain processing\n• Data portability\n\nTo exercise these rights, contact privacy@zuupah.com. We will respond within 30 days.`,
  },
  {
    title: '7. Contact & DPO',
    body: `Data Protection Officer:\n\n📧 privacy@zuupah.com\n🌐 www.zuupah.com/privacy\n\nZuupah GmbH\nMusterstraße 12\n10115 Berlin, Germany\n\nLast updated: January 2025`,
  },
];

// ── Components ────────────────────────────────────────────────────────────────

interface AccordionItemProps {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
  tc: any;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, body, isOpen, onToggle, tc }) => (
  <View style={[styles.item, { backgroundColor: tc.card, borderColor: tc.border }]}>
    <TouchableOpacity style={styles.itemHeader} onPress={onToggle} activeOpacity={0.7}>
      <Text style={[styles.itemTitle, { color: tc.text }]}>{title}</Text>
      <Icon
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={tc.textSecondary}
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={[styles.itemBody, { borderTopColor: tc.divider }]}>
        <Text style={[styles.itemText, { color: tc.textSecondary }]}>{body}</Text>
      </View>
    )}
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

type Tab = 'terms' | 'privacy';

const TermsScreen: React.FC<any> = ({ navigation }) => {
  const { tc } = useAppTheme();
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  const toggleItem = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: tc.text }]}>Terms & Privacy</Text>
      </View>

      {/* Tab switcher */}
      <View style={[styles.tabs, { backgroundColor: tc.backgroundAlt }]}>
        {(['terms', 'privacy'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => { setActiveTab(tab); setOpenIndex(0); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? COLORS.white : tc.textSecondary }]}>
              {tab === 'terms' ? '📋 Terms of Service' : '🔒 Privacy Policy'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, { color: tc.textDisabled }]}>
          {activeTab === 'terms' ? 'Effective: 1 January 2025' : 'Last updated: January 2025'}
        </Text>
        {sections.map((sec, i) => (
          <AccordionItem
            key={i}
            title={sec.title}
            body={sec.body}
            isOpen={openIndex === i}
            onToggle={() => toggleItem(i)}
            tc={tc}
          />
        ))}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: tc.textDisabled }]}>
            © 2025 Zuupah GmbH · All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 6 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  tabs: {
    flexDirection: 'row', margin: 16, borderRadius: 12, padding: 4, gap: 4,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.beachBlue },
  tabText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-Bold' },
  lastUpdated: { fontSize: TYPOGRAPHY.fontSize.xs, marginBottom: 8, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  item: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  itemHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  itemTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Bold', flex: 1, paddingRight: 8 },
  itemBody: { borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  itemText: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 22 },
  footer: { paddingTop: 16, alignItems: 'center' },
  footerText: { fontSize: TYPOGRAPHY.fontSize.xs },
});

export default TermsScreen;

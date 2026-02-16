import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

export default function AdminSettingsScreen() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  async function handleLogout() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(t('logout'), 'Are you sure?', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/role-select' as any);
        },
      },
    ]);
  }

  const sections = [
    {
      title: 'Platform Controls',
      items: [
        { icon: 'notifications-outline' as const, label: 'Push Notifications', subtitle: 'Send broadcasts to all users' },
        { icon: 'megaphone-outline' as const, label: 'Advertisements', subtitle: 'Manage banner & featured ads' },
        { icon: 'cash-outline' as const, label: 'Commission Settings', subtitle: 'Current: 10% per job' },
        { icon: 'shield-outline' as const, label: 'Security Rules', subtitle: 'Firestore & auth rules' },
      ],
    },
    {
      title: 'Data & Analytics',
      items: [
        { icon: 'analytics-outline' as const, label: 'AI Analytics', subtitle: 'Fraud detection & insights' },
        { icon: 'location-outline' as const, label: t('liveDrivers'), subtitle: 'View all active driver locations' },
        { icon: 'document-text-outline' as const, label: 'Reports', subtitle: 'Generate platform reports' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'language-outline' as const, label: t('language'), onPress: () => router.push('/language' as any) },
        { icon: 'help-circle-outline' as const, label: 'Help & Support' },
        { icon: 'information-circle-outline' as const, label: 'About Driver Setu', subtitle: 'Version 1.0.0' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('settings')}</Text>

        <View style={[styles.adminCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.adminAvatar, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#FFF" />
          </View>
          <View>
            <Text style={[styles.adminName, { color: theme.text }]}>{user?.name || 'Admin'}</Text>
            <Text style={[styles.adminEmail, { color: theme.textSecondary }]}>{user?.email || 'admin@driversetu.com'}</Text>
          </View>
        </View>

        {sections.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {section.items.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={item.onPress || (() => {})}
                  style={({ pressed }) => [
                    styles.menuItem,
                    index < section.items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={theme.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                    {item.subtitle && (
                      <Text style={[styles.menuSubtitle, { color: theme.textTertiary }]}>{item.subtitle}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable onPress={handleLogout} style={[styles.logoutBtn, { borderColor: Colors.danger }]}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={[styles.logoutText, { color: Colors.danger }]}>{t('logout')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 16 },
  adminCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  adminAvatar: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  adminName: { fontSize: 17, fontFamily: 'Poppins_600SemiBold' },
  adminEmail: { fontSize: 13, fontFamily: 'Poppins_400Regular', marginTop: 1 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8, paddingLeft: 4 },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuLabel: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  menuSubtitle: { fontSize: 11, fontFamily: 'Poppins_400Regular', marginTop: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1.5, marginTop: 4 },
  logoutText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
});

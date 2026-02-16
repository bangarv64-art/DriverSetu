import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, Platform, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

export default function OwnerProfileScreen() {
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

  const menuItems = [
    { icon: 'person-outline' as const, label: t('profile'), onPress: () => {} },
    { icon: 'card-outline' as const, label: t('payment'), onPress: () => {} },
    { icon: 'language-outline' as const, label: t('language'), onPress: () => router.push('/language' as any) },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => {} },
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profile')}</Text>

        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <LinearGradient colors={[Colors.teal, Colors.tealLight]} style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'O').charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || 'Owner'}</Text>
          <Text style={[styles.profilePhone, { color: theme.textSecondary }]}>+91 {user?.phone}</Text>
          {user?.isVerified && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.teal} />
              <Text style={{ fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.teal }}>{t('verified')}</Text>
            </View>
          )}
        </View>

        <View style={[styles.statsRow, { gap: 10 }]}>
          {[
            { label: 'Jobs Posted', value: '15', color: Colors.teal },
            { label: 'Active', value: '3', color: Colors.success },
            { label: 'Completed', value: '12', color: Colors.accent },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={theme.textSecondary} />
              <Text style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </Pressable>
          ))}
        </View>

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
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 20 },
  profileCard: { borderRadius: 20, padding: 24, borderWidth: 1, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  profileName: { fontSize: 20, fontFamily: 'Poppins_700Bold' },
  profilePhone: { fontSize: 14, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontFamily: 'Poppins_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  menuSection: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuItemLabel: { flex: 1, fontSize: 14, fontFamily: 'Poppins_500Medium' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1.5 },
  logoutText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
});

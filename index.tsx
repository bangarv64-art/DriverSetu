import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

const RECOMMENDED_DRIVERS = [
  { id: '1', name: 'Rajesh Kumar', rating: 4.8, trustScore: 92, experience: 8, trips: 2450, distance: '2.5 km', available: true },
  { id: '2', name: 'Sunil Yadav', rating: 4.6, trustScore: 88, experience: 5, trips: 1680, distance: '4.1 km', available: true },
  { id: '3', name: 'Vikram Singh', rating: 4.9, trustScore: 95, experience: 12, trips: 4200, distance: '6.0 km', available: false },
];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const quickStats = [
    { label: 'Active Jobs', value: '3', icon: 'briefcase', color: Colors.teal },
    { label: 'Drivers Hired', value: '12', icon: 'people', color: Colors.accent },
    { label: 'Total Spent', value: '\u20B945K', icon: 'wallet', color: Colors.success },
    { label: t('rating'), value: '4.8', icon: 'star', color: Colors.gold },
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
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>{t('dashboard')}</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Owner'}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/language' as any)}
            style={[styles.iconBtn, { backgroundColor: theme.surface }]}
          >
            <Ionicons name="language" size={20} color={theme.text} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/post-job' as any);
          }}
          style={styles.postJobCard}
        >
          <LinearGradient
            colors={[Colors.teal, Colors.tealLight]}
            style={styles.postJobGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.postJobContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.postJobTitle}>{t('postJob')}</Text>
                <Text style={styles.postJobSubtitle}>Find the best drivers for your needs</Text>
              </View>
              <View style={styles.postJobIcon}>
                <Ionicons name="add" size={28} color={Colors.teal} />
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="robot" size={20} color={Colors.teal} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('aiRecommended')}</Text>
            </View>
            <Pressable onPress={() => {}}>
              <Text style={{ fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.teal }}>View All</Text>
            </Pressable>
          </View>

          {RECOMMENDED_DRIVERS.map((driver) => (
            <View key={driver.id} style={[styles.driverCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.driverTop}>
                <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>{driver.name.charAt(0)}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <View style={styles.driverNameRow}>
                    <Text style={[styles.driverName, { color: theme.text }]}>{driver.name}</Text>
                    {driver.trustScore >= 90 && (
                      <View style={styles.aiBadge}>
                        <MaterialCommunityIcons name="robot" size={12} color={Colors.teal} />
                        <Text style={styles.aiBadgeText}>AI</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.driverMeta}>
                    <Ionicons name="star" size={12} color={Colors.gold} />
                    <Text style={[styles.driverMetaText, { color: theme.textSecondary }]}>{driver.rating}</Text>
                    <Text style={[styles.driverMetaText, { color: theme.textTertiary }]}>|</Text>
                    <Text style={[styles.driverMetaText, { color: theme.textSecondary }]}>{driver.experience} {t('years')}</Text>
                    <Text style={[styles.driverMetaText, { color: theme.textTertiary }]}>|</Text>
                    <Text style={[styles.driverMetaText, { color: theme.textSecondary }]}>{driver.trips} {t('trips')}</Text>
                  </View>
                </View>
                <View style={[styles.availBadge, { backgroundColor: driver.available ? Colors.success + '15' : theme.surfaceSecondary }]}>
                  <View style={[styles.availDot, { backgroundColor: driver.available ? Colors.success : theme.textTertiary }]} />
                  <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: driver.available ? Colors.success : theme.textTertiary }}>
                    {driver.available ? t('online') : t('offline')}
                  </Text>
                </View>
              </View>
              <View style={styles.driverBottom}>
                <View style={styles.driverInfo}>
                  <Ionicons name="location-outline" size={14} color={theme.textTertiary} />
                  <Text style={[styles.driverInfoText, { color: theme.textTertiary }]}>{driver.distance} away</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={Colors.teal} />
                  <Text style={[styles.driverInfoText, { color: Colors.teal }]}>{driver.trustScore}% Trust</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, fontFamily: 'Poppins_400Regular' },
  userName: { fontSize: 22, fontFamily: 'Poppins_700Bold' },
  iconBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  postJobCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  postJobGradient: { padding: 20 },
  postJobContent: { flexDirection: 'row', alignItems: 'center' },
  postJobTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  postJobSubtitle: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  postJobIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '48%' as any, flexGrow: 1, borderRadius: 14, padding: 14, borderWidth: 1, gap: 6 },
  statValue: { fontSize: 20, fontFamily: 'Poppins_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular' },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  driverCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  driverTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  driverAvatarText: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: Colors.teal + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  aiBadgeText: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: Colors.teal },
  driverMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  driverMetaText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
  availBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  driverBottom: { flexDirection: 'row', gap: 16, marginTop: 12, paddingLeft: 60 },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverInfoText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
});

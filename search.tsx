import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, useColorScheme, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

const ALL_DRIVERS = [
  { id: '1', name: 'Rajesh Kumar', rating: 4.8, trustScore: 92, experience: 8, trips: 2450, location: 'Mumbai', available: true, completionRate: 96 },
  { id: '2', name: 'Sunil Yadav', rating: 4.6, trustScore: 88, experience: 5, trips: 1680, location: 'Pune', available: true, completionRate: 91 },
  { id: '3', name: 'Vikram Singh', rating: 4.9, trustScore: 95, experience: 12, trips: 4200, location: 'Mumbai', available: false, completionRate: 98 },
  { id: '4', name: 'Anil Sharma', rating: 4.5, trustScore: 82, experience: 3, trips: 890, location: 'Thane', available: true, completionRate: 88 },
  { id: '5', name: 'Deepak Pawar', rating: 4.7, trustScore: 90, experience: 7, trips: 3100, location: 'Navi Mumbai', available: true, completionRate: 94 },
  { id: '6', name: 'Manoj Desai', rating: 4.4, trustScore: 78, experience: 2, trips: 520, location: 'Pune', available: false, completionRate: 85 },
];

function DriverSearchItem({ driver, theme, isDark, t }: { driver: typeof ALL_DRIVERS[0]; theme: any; isDark: boolean; t: (k: string) => string }) {
  return (
    <View style={[styles.driverCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardTop}>
        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.avatar}>
          <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.driverName, { color: theme.text }]}>{driver.name}</Text>
            {driver.trustScore >= 90 && (
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="robot" size={12} color={Colors.teal} />
              </View>
            )}
          </View>
          <Text style={[styles.location, { color: theme.textSecondary }]}>{driver.location}</Text>
        </View>
        <View style={[styles.availDot, { backgroundColor: driver.available ? Colors.success : theme.textTertiary }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="star" size={14} color={Colors.gold} />
          <Text style={[styles.statText, { color: theme.text }]}>{driver.rating}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.teal} />
          <Text style={[styles.statText, { color: theme.text }]}>{driver.trustScore}%</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="time" size={14} color={Colors.accent} />
          <Text style={[styles.statText, { color: theme.text }]}>{driver.experience}yr</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="car" size={14} color={Colors.primary} />
          <Text style={[styles.statText, { color: theme.text }]}>{driver.trips}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t('completionRate')}</Text>
        <View style={[styles.progressBar, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={[styles.progressFill, { width: `${driver.completionRate}%`, backgroundColor: Colors.success }]} />
        </View>
        <Text style={[styles.progressValue, { color: Colors.success }]}>{driver.completionRate}%</Text>
      </View>
    </View>
  );
}

export default function OwnerSearchScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery
    ? ALL_DRIVERS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_DRIVERS;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('searchDrivers')}</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('search') + '...'}
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <DriverSearchItem driver={item} theme={theme} isDark={isDark} t={t} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('noDrivers')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 48, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Poppins_400Regular' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  driverCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverName: { fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
  aiBadge: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.teal + '15', alignItems: 'center', justifyContent: 'center' },
  location: { fontSize: 13, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  availDot: { width: 10, height: 10, borderRadius: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#E5E7EB20' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  progressLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', width: 80 },
  progressBar: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressValue: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', width: 36, textAlign: 'right' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins_500Medium' },
});

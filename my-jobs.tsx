import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

const MY_JOBS = [
  { id: '1', title: 'Mumbai - Pune Transfer', driver: 'Rajesh Kumar', salary: '2,500', status: 'active', date: 'Today', driverRating: 4.8 },
  { id: '2', title: 'Local City Driving', driver: 'Sunil Yadav', salary: '1,200', status: 'active', date: 'Yesterday', driverRating: 4.6 },
  { id: '3', title: 'Airport Pickup', driver: 'Vikram Singh', salary: '800', status: 'completed', date: '12 Feb', driverRating: 4.9 },
  { id: '4', title: 'Wedding Car Service', driver: 'Pending', salary: '5,000', status: 'pending', date: '10 Feb', driverRating: 0 },
  { id: '5', title: 'Office Commute Monthly', driver: 'Deepak Pawar', salary: '25,000/mo', status: 'completed', date: '5 Feb', driverRating: 4.7 },
];

export default function OwnerMyJobsScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const statusColors: Record<string, string> = {
    active: Colors.teal,
    completed: Colors.success,
    pending: Colors.warning,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('myJobs')}</Text>
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/post-job' as any);
          }}
        >
          <LinearGradient colors={[Colors.teal, Colors.tealLight]} style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </View>

      <FlatList
        data={MY_JOBS}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.jobCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.jobTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.jobDriver, { color: theme.textSecondary }]}>
                  {item.driver !== 'Pending' ? item.driver : t('pending')}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
                <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: statusColors[item.status] }}>
                  {t(item.status === 'active' ? 'active' : item.status === 'completed' ? 'completed' : 'pending')}
                </Text>
              </View>
            </View>
            <View style={styles.jobBottom}>
              <Text style={[styles.jobSalary, { color: Colors.teal }]}>{'\u20B9'}{item.salary}</Text>
              <Text style={[styles.jobDate, { color: theme.textTertiary }]}>{item.date}</Text>
            </View>
            {item.status === 'active' && (
              <Pressable style={[styles.trackBtn, { backgroundColor: Colors.teal + '10', borderColor: Colors.teal }]}>
                <Ionicons name="locate" size={16} color={Colors.teal} />
                <Text style={{ fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.teal }}>{t('trackDriver')}</Text>
              </Pressable>
            )}
            {item.status === 'completed' && item.driverRating > 0 && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.gold} />
                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{item.driverRating} - {t('completed')}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('noJobs')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  jobCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
  jobDriver: { fontSize: 13, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  jobBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  jobSalary: { fontSize: 20, fontFamily: 'Poppins_700Bold' },
  jobDate: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
  trackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  ratingText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins_500Medium' },
});

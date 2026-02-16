import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

interface Job {
  id: string;
  title: string;
  owner: string;
  salary: string;
  location: string;
  distance: string;
  time: string;
  status: 'pending' | 'accepted' | 'completed';
  type: string;
}

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Mumbai - Pune Transfer', owner: 'Suresh Patil', salary: '2,500', location: 'Mumbai', distance: '148 km', time: '2h ago', status: 'pending', type: 'Long Distance' },
  { id: '2', title: 'Local City Driving', owner: 'Amit Shah', salary: '1,200', location: 'Pune', distance: '25 km', time: '4h ago', status: 'pending', type: 'Local' },
  { id: '3', title: 'Airport Pickup', owner: 'Priya Deshmukh', salary: '800', location: 'Mumbai Airport', distance: '35 km', time: '1d ago', status: 'accepted', type: 'Airport' },
  { id: '4', title: 'Wedding Car Service', owner: 'Rahul Joshi', salary: '5,000', location: 'Nashik', distance: '210 km', time: '2d ago', status: 'completed', type: 'Event' },
  { id: '5', title: 'Corporate Monthly', owner: 'TechCorp Ltd', salary: '25,000/mo', location: 'BKC Mumbai', distance: '15 km', time: '3d ago', status: 'completed', type: 'Monthly' },
];

function JobItem({ job, theme, isDark, t }: { job: Job; theme: any; isDark: boolean; t: (k: string) => string }) {
  const statusColors = {
    pending: Colors.warning,
    accepted: Colors.teal,
    completed: Colors.success,
  };

  return (
    <View style={[styles.jobCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.jobHeader}>
        <View style={[styles.typeBadge, { backgroundColor: Colors.accent + '15' }]}>
          <Text style={[styles.typeText, { color: Colors.accent }]}>{job.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[job.status] + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[job.status] }]} />
          <Text style={[styles.statusText, { color: statusColors[job.status] }]}>
            {t(job.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
      <Text style={[styles.jobOwner, { color: theme.textSecondary }]}>{job.owner}</Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={theme.textTertiary} />
          <Text style={[styles.detailText, { color: theme.textTertiary }]}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="navigate-outline" size={14} color={theme.textTertiary} />
          <Text style={[styles.detailText, { color: theme.textTertiary }]}>{job.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={theme.textTertiary} />
          <Text style={[styles.detailText, { color: theme.textTertiary }]}>{job.time}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={[styles.salary, { color: Colors.accent }]}>{'\u20B9'}{job.salary}</Text>
        {job.status === 'pending' && (
          <View style={styles.actions}>
            <Pressable
              style={[styles.rejectBtn, { borderColor: Colors.danger }]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="close" size={16} color={Colors.danger} />
            </Pressable>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert('Job Accepted');
              }}
            >
              <LinearGradient colors={[Colors.success, '#16A34A']} style={styles.acceptBtn}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export default function DriverJobsScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  const filtered = filter === 'all' ? MOCK_JOBS : MOCK_JOBS.filter(j => j.status === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: t('pending') },
    { key: 'accepted', label: t('accept') },
    { key: 'completed', label: t('completed') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('jobs')}</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? Colors.accent : theme.surface,
                borderColor: filter === f.key ? Colors.accent : theme.border,
              },
            ]}
          >
            <Text style={{
              fontSize: 13,
              fontFamily: 'Poppins_500Medium',
              color: filter === f.key ? '#FFF' : theme.textSecondary,
            }}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <JobItem job={item} theme={theme} isDark={isDark} t={t} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  jobCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: 'Poppins_500Medium' },
  jobTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
  jobOwner: { fontSize: 13, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  jobDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  salary: { fontSize: 20, fontFamily: 'Poppins_700Bold' },
  actions: { flexDirection: 'row', gap: 8 },
  rejectBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  acceptBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins_500Medium' },
});

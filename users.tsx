import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

interface UserItem {
  id: string;
  name: string;
  role: 'driver' | 'owner';
  status: 'active' | 'suspended' | 'blocked';
  phone: string;
  kycStatus: 'approved' | 'pending' | 'rejected';
  rating?: number;
  joinDate: string;
}

const MOCK_USERS: UserItem[] = [
  { id: '1', name: 'Rajesh Kumar', role: 'driver', status: 'active', phone: '9876543210', kycStatus: 'approved', rating: 4.8, joinDate: 'Jan 2025' },
  { id: '2', name: 'Sunil Yadav', role: 'driver', status: 'active', phone: '9876543211', kycStatus: 'pending', rating: 4.6, joinDate: 'Mar 2025' },
  { id: '3', name: 'Suresh Patil', role: 'owner', status: 'active', phone: '9876543212', kycStatus: 'approved', joinDate: 'Feb 2025' },
  { id: '4', name: 'Vikram Singh', role: 'driver', status: 'suspended', phone: '9876543213', kycStatus: 'approved', rating: 4.2, joinDate: 'Dec 2024' },
  { id: '5', name: 'Amit Shah', role: 'owner', status: 'active', phone: '9876543214', kycStatus: 'approved', joinDate: 'Apr 2025' },
  { id: '6', name: 'Ravi Patil', role: 'driver', status: 'blocked', phone: '9876543215', kycStatus: 'rejected', rating: 3.1, joinDate: 'Nov 2024' },
  { id: '7', name: 'Deepak Pawar', role: 'driver', status: 'active', phone: '9876543216', kycStatus: 'approved', rating: 4.7, joinDate: 'May 2025' },
];

function UserCard({ user, theme, t }: { user: UserItem; theme: any; t: (k: string) => string }) {
  const statusColors: Record<string, string> = {
    active: Colors.success,
    suspended: Colors.warning,
    blocked: Colors.danger,
  };
  const kycColors: Record<string, string> = {
    approved: Colors.success,
    pending: Colors.warning,
    rejected: Colors.danger,
  };

  function handleAction(action: string) {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      `${action} ${user.name}?`,
      `This will ${action.toLowerCase()} the user.`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), style: 'destructive', onPress: () => {} },
      ]
    );
  }

  return (
    <View style={[styles.userCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.userTop}>
        <LinearGradient
          colors={user.role === 'driver' ? [Colors.accent, Colors.accentLight] : [Colors.teal, Colors.tealLight]}
          style={styles.userAvatar}
        >
          <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: user.role === 'driver' ? Colors.accent + '15' : Colors.teal + '15' }]}>
              <Text style={{ fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: user.role === 'driver' ? Colors.accent : Colors.teal, textTransform: 'capitalize' as const }}>
                {user.role}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[user.status] + '15' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColors[user.status] }]} />
              <Text style={{ fontSize: 10, fontFamily: 'Poppins_500Medium', color: statusColors[user.status], textTransform: 'capitalize' as const }}>{user.status}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.kycBadge, { backgroundColor: kycColors[user.kycStatus] + '10' }]}>
          <Ionicons
            name={user.kycStatus === 'approved' ? 'checkmark-circle' : user.kycStatus === 'pending' ? 'time' : 'close-circle'}
            size={14}
            color={kycColors[user.kycStatus]}
          />
          <Text style={{ fontSize: 10, fontFamily: 'Poppins_500Medium', color: kycColors[user.kycStatus] }}>KYC</Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>{user.phone}</Text>
        {user.rating && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>{user.rating}</Text>
          </View>
        )}
        <Text style={[styles.userInfoText, { color: theme.textTertiary }]}>{user.joinDate}</Text>
      </View>

      <View style={styles.actionRow}>
        {user.status === 'active' && (
          <Pressable
            style={[styles.actionBtn, { borderColor: Colors.warning }]}
            onPress={() => handleAction(user.role === 'driver' ? 'Suspend' : 'Block')}
          >
            <Ionicons name="ban" size={14} color={Colors.warning} />
            <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.warning }}>
              {user.role === 'driver' ? t('suspendDriver') : t('blockOwner')}
            </Text>
          </Pressable>
        )}
        {user.status === 'suspended' && (
          <Pressable
            style={[styles.actionBtn, { borderColor: Colors.success }]}
            onPress={() => handleAction('Activate')}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
            <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.success }}>Activate</Text>
          </Pressable>
        )}
        {user.kycStatus === 'pending' && (
          <>
            <Pressable
              style={[styles.actionBtn, { borderColor: Colors.danger }]}
              onPress={() => handleAction('Reject KYC')}
            >
              <Ionicons name="close" size={14} color={Colors.danger} />
              <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.danger }}>{t('rejectKyc')}</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { borderColor: Colors.success, backgroundColor: Colors.success + '10' }]}
              onPress={() => handleAction('Approve KYC')}
            >
              <Ionicons name="checkmark" size={14} color={Colors.success} />
              <Text style={{ fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.success }}>{t('approveKyc')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

export default function AdminUsersScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState<'all' | 'driver' | 'owner'>('all');

  const filtered = filter === 'all' ? MOCK_USERS : MOCK_USERS.filter(u => u.role === filter);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('users')}</Text>
        <Text style={[styles.headerCount, { color: theme.textSecondary }]}>{MOCK_USERS.length} total</Text>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'driver', 'owner'] as const).map(f => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? '#8B5CF6' : theme.surface,
                borderColor: filter === f ? '#8B5CF6' : theme.border,
              },
            ]}
          >
            <Text style={{
              fontSize: 13,
              fontFamily: 'Poppins_500Medium',
              color: filter === f ? '#FFF' : theme.textSecondary,
              textTransform: 'capitalize' as const,
            }}>
              {f === 'all' ? 'All' : f === 'driver' ? t('driver') : t('carOwner')}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <UserCard user={item} theme={theme} t={t} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  headerCount: { fontSize: 13, fontFamily: 'Poppins_400Regular', marginBottom: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  userCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
  userTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userAvatar: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  userName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
  userMeta: { flexDirection: 'row', gap: 6, marginTop: 3 },
  roleBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  kycBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  userInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#E5E7EB30' },
  userInfoText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  actionRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
});

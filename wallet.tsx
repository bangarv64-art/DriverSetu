import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

interface Transaction {
  id: string;
  type: 'earning' | 'commission' | 'withdrawal' | 'bonus';
  title: string;
  amount: number;
  date: string;
  status?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'earning', title: 'Mumbai - Pune Transfer', amount: 2500, date: 'Today, 2:30 PM' },
  { id: '2', type: 'commission', title: 'Platform Commission (10%)', amount: -250, date: 'Today, 2:30 PM' },
  { id: '3', type: 'earning', title: 'Local City Driving', amount: 1200, date: 'Yesterday, 6:00 PM' },
  { id: '4', type: 'commission', title: 'Platform Commission (10%)', amount: -120, date: 'Yesterday, 6:00 PM' },
  { id: '5', type: 'withdrawal', title: 'Bank Transfer', amount: -5000, date: '12 Feb, 10:00 AM', status: 'Completed' },
  { id: '6', type: 'bonus', title: 'Weekly Bonus - 10+ Rides', amount: 500, date: '10 Feb, 12:00 PM' },
  { id: '7', type: 'earning', title: 'Airport Pickup', amount: 800, date: '9 Feb, 4:00 PM' },
  { id: '8', type: 'withdrawal', title: 'Bank Transfer', amount: -3000, date: '5 Feb, 11:00 AM', status: 'Pending' },
];

function TransactionItem({ item, theme }: { item: Transaction; theme: any }) {
  const iconMap = {
    earning: { name: 'arrow-down-circle' as const, color: Colors.success },
    commission: { name: 'remove-circle' as const, color: Colors.warning },
    withdrawal: { name: 'arrow-up-circle' as const, color: Colors.teal },
    bonus: { name: 'gift' as const, color: Colors.gold },
  };
  const icon = iconMap[item.type];

  return (
    <View style={[styles.txItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.txIcon, { backgroundColor: icon.color + '15' }]}>
        <Ionicons name={icon.name} size={22} color={icon.color} />
      </View>
      <View style={styles.txInfo}>
        <Text style={[styles.txTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.txDate, { color: theme.textTertiary }]}>{item.date}</Text>
      </View>
      <View style={styles.txAmountContainer}>
        <Text style={[styles.txAmount, { color: item.amount >= 0 ? Colors.success : theme.textSecondary }]}>
          {item.amount >= 0 ? '+' : ''}{'\u20B9'}{Math.abs(item.amount).toLocaleString()}
        </Text>
        {item.status && (
          <Text style={[styles.txStatus, {
            color: item.status === 'Completed' ? Colors.success : Colors.warning
          }]}>
            {item.status}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function DriverWalletScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionItem item={item} theme={theme} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>{t('wallet')}</Text>
            </View>

            <View style={styles.walletCard}>
              <LinearGradient
                colors={[Colors.accent, Colors.accentLight]}
                style={styles.walletGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.balanceLabel}>{t('balance')}</Text>
                <Text style={styles.balanceAmount}>{'\u20B9'}{(user?.walletBalance || 12500).toLocaleString()}</Text>
                <View style={styles.walletActions}>
                  <Pressable
                    style={styles.walletActionBtn}
                    onPress={() => {
                      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Alert.alert(t('withdrawRequest'), 'Minimum withdrawal: \u20B9500\nProcessing time: 24-48 hours');
                    }}
                  >
                    <Ionicons name="arrow-up-circle" size={20} color="#FFF" />
                    <Text style={styles.walletActionText}>{t('withdraw')}</Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.summaryRow}>
              {[
                { label: t('totalEarnings'), amount: '45,200', color: Colors.success },
                { label: 'Commission', amount: '4,520', color: Colors.warning },
                { label: 'Withdrawals', amount: '28,000', color: Colors.teal },
              ].map((item, i) => (
                <View key={i} style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.summaryDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.summaryAmount, { color: theme.text }]}>{'\u20B9'}{item.amount}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{item.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('transactions')}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  walletCard: { marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  walletGradient: { padding: 24 },
  balanceLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF', marginTop: 4 },
  walletActions: { flexDirection: 'row', marginTop: 16 },
  walletActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  walletActionText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  summaryDot: { width: 8, height: 8, borderRadius: 4 },
  summaryAmount: { fontSize: 14, fontFamily: 'Poppins_700Bold' },
  summaryLabel: { fontSize: 10, fontFamily: 'Poppins_400Regular' },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', paddingHorizontal: 20, marginBottom: 8 },
  listContent: { paddingBottom: 100 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, gap: 12 },
  txIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  txDate: { fontSize: 11, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  txAmountContainer: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
  txStatus: { fontSize: 10, fontFamily: 'Poppins_500Medium', marginTop: 2 },
});

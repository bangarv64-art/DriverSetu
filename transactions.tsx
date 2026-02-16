import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

const TRANSACTIONS = [
  { id: '1', type: 'commission', from: 'Rajesh Kumar', amount: 250, date: 'Today, 2:30 PM' },
  { id: '2', type: 'boost', from: 'Suresh Patil', amount: 500, date: 'Today, 1:00 PM' },
  { id: '3', type: 'commission', from: 'Sunil Yadav', amount: 120, date: 'Yesterday, 6:00 PM' },
  { id: '4', type: 'withdrawal', from: 'Deepak Pawar', amount: -5000, date: 'Yesterday, 10:00 AM', status: 'Approved' },
  { id: '5', type: 'subscription', from: 'TechCorp Ltd', amount: 1999, date: '12 Feb, 3:00 PM' },
  { id: '6', type: 'commission', from: 'Vikram Singh', amount: 500, date: '12 Feb, 11:00 AM' },
  { id: '7', type: 'withdrawal', from: 'Manoj Desai', amount: -3000, date: '11 Feb, 9:00 AM', status: 'Pending' },
  { id: '8', type: 'boost', from: 'Amit Shah', amount: 300, date: '10 Feb, 4:00 PM' },
];

export default function AdminTransactionsScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const iconMap: Record<string, { name: string; color: string }> = {
    commission: { name: 'trending-up', color: Colors.success },
    boost: { name: 'flash', color: Colors.warning },
    withdrawal: { name: 'arrow-up-circle', color: Colors.teal },
    subscription: { name: 'card', color: '#8B5CF6' },
  };

  const monthlyRevenue = [
    { month: 'Jan', amount: 3.2 },
    { month: 'Feb', amount: 4.2 },
    { month: 'Mar', amount: 3.8 },
    { month: 'Apr', amount: 5.1 },
    { month: 'May', amount: 4.7 },
    { month: 'Jun', amount: 5.5 },
  ];
  const maxAmount = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('revenue')} & {t('transactions')}</Text>

        <View style={styles.summaryRow}>
          {[
            { label: t('today'), amount: '\u20B92,370', change: '+15%', color: Colors.success },
            { label: t('thisWeek'), amount: '\u20B918.5K', change: '+8%', color: Colors.teal },
            { label: t('thisMonth'), amount: '\u20B94.21L', change: '+12%', color: '#8B5CF6' },
          ].map((item, i) => (
            <View key={i} style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.summaryAmount, { color: theme.text }]}>{item.amount}</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{item.label}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: item.color }}>{item.change}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('analytics')}</Text>
          <View style={styles.chartContainer}>
            {monthlyRevenue.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={[styles.barBackground, { backgroundColor: theme.surfaceSecondary }]}>
                  <LinearGradient
                    colors={['#8B5CF6', '#A78BFA']}
                    style={[styles.barFill, { height: `${(item.amount / maxAmount) * 100}%` }]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: theme.textTertiary }]}>{item.month}</Text>
                <Text style={[styles.barValue, { color: theme.textSecondary }]}>{item.amount}L</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent {t('transactions')}</Text>

        {TRANSACTIONS.map((tx) => {
          const icon = iconMap[tx.type];
          return (
            <View key={tx.id} style={[styles.txItem, { borderBottomColor: theme.border }]}>
              <View style={[styles.txIcon, { backgroundColor: icon.color + '15' }]}>
                <Ionicons name={icon.name as any} size={20} color={icon.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txTitle, { color: theme.text }]}>{tx.from}</Text>
                <Text style={[styles.txType, { color: theme.textTertiary }]}>{tx.type} - {tx.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txAmount, { color: tx.amount >= 0 ? Colors.success : theme.textSecondary }]}>
                  {tx.amount >= 0 ? '+' : ''}{'\u20B9'}{Math.abs(tx.amount).toLocaleString()}
                </Text>
                {(tx as any).status && (
                  <Text style={{
                    fontSize: 10,
                    fontFamily: 'Poppins_500Medium',
                    color: (tx as any).status === 'Approved' ? Colors.success : Colors.warning,
                    marginTop: 2,
                  }}>{(tx as any).status}</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: 'center' },
  summaryAmount: { fontSize: 16, fontFamily: 'Poppins_700Bold' },
  summaryLabel: { fontSize: 10, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  chartCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 20 },
  chartTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', marginBottom: 16 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 140 },
  chartBar: { alignItems: 'center', gap: 4 },
  barBackground: { width: 28, height: 100, borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, fontFamily: 'Poppins_500Medium' },
  barValue: { fontSize: 10, fontFamily: 'Poppins_600SemiBold' },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: 12 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  txType: { fontSize: 11, fontFamily: 'Poppins_400Regular', marginTop: 2, textTransform: 'capitalize' as const },
  txAmount: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
});

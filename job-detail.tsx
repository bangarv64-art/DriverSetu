import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function JobDetailScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Job Details</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={styles.content}>
        <Ionicons name="briefcase-outline" size={48} color={theme.textTertiary} />
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select a job to view details</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  placeholder: { fontSize: 15, fontFamily: 'Poppins_500Medium' },
});

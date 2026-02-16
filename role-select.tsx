import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

const logoImage = require('@/assets/images/logo.png');

const roles: { key: UserRole; icon: string; iconSet: 'ion' | 'mci'; gradient: [string, string] }[] = [
  { key: 'driver', icon: 'steering', iconSet: 'mci', gradient: ['#FF6B35', '#FF8C5E'] },
  { key: 'owner', icon: 'car-sport', iconSet: 'ion', gradient: ['#00B4D8', '#48CAE4'] },
  { key: 'admin', icon: 'shield-checkmark', iconSet: 'ion', gradient: ['#8B5CF6', '#A78BFA'] },
];

export default function RoleSelectScreen() {
  const { setSelectedRole } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  function handleRoleSelect(role: UserRole) {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedRole(role);
    router.push('/login' as any);
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : '#F5F6FA' }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={[styles.selectTitle, { color: theme.text }]}>{t('selectRole')}</Text>
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <Pressable
              key={role.key}
              onPress={() => handleRoleSelect(role.key)}
              style={({ pressed }) => [
                styles.roleCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <LinearGradient
                colors={role.gradient}
                style={styles.roleIconContainer}
              >
                {role.iconSet === 'ion' ? (
                  <Ionicons name={role.icon as any} size={32} color="#FFF" />
                ) : (
                  <MaterialCommunityIcons name={role.icon as any} size={32} color="#FFF" />
                )}
              </LinearGradient>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleName, { color: theme.text }]}>{t(role.key === 'owner' ? 'carOwner' : role.key)}</Text>
                <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>
                  {t(role.key === 'driver' ? 'driverDesc' : role.key === 'owner' ? 'ownerDesc' : 'adminDesc')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/language' as any)}
        style={[styles.langButton, { bottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}
      >
        <Ionicons name="language" size={20} color={Colors.accent} />
        <Text style={[styles.langText, { color: Colors.accent }]}>{t('language')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  logo: {
    width: 200,
    height: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  selectTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  roleDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  langButton: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  langText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, useColorScheme, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const { selectedRole, login } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = selectedRole === 'admin';

  async function handleLogin() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isAdmin) {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
      setIsLoading(true);
      setTimeout(async () => {
        await login({
          id: 'admin_' + Date.now().toString(),
          name: 'Admin',
          email: email.trim(),
          role: 'admin',
          status: 'active',
        });
        setIsLoading(false);
        router.replace('/(admin-tabs)' as any);
      }, 1000);
    } else {
      if (!phone.trim() || phone.length < 10) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
      router.push({ pathname: '/otp-verify' as any, params: { phone: phone.trim(), role: selectedRole } });
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : '#F5F6FA' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <View style={styles.headerSection}>
            <LinearGradient
              colors={isAdmin ? ['#8B5CF6', '#A78BFA'] : selectedRole === 'driver' ? ['#FF6B35', '#FF8C5E'] : ['#00B4D8', '#48CAE4']}
              style={styles.iconBg}
            >
              {isAdmin ? (
                <Ionicons name="shield-checkmark" size={36} color="#FFF" />
              ) : selectedRole === 'driver' ? (
                <MaterialCommunityIcons name="steering" size={36} color="#FFF" />
              ) : (
                <Ionicons name="car-sport" size={36} color="#FFF" />
              )}
            </LinearGradient>
            <Text style={[styles.title, { color: theme.text }]}>
              {isAdmin ? t('adminLogin') : t('login')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {isAdmin
                ? t('enterEmail')
                : t('enterPhone')}
            </Text>
          </View>

          <View style={styles.formSection}>
            {isAdmin ? (
              <>
                <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Ionicons name="mail-outline" size={20} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={t('email')}
                    placeholderTextColor={theme.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={t('password')}
                    placeholderTextColor={theme.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </>
            ) : (
              <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.countryCode, { color: theme.text }]}>+91</Text>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={t('phoneNumber')}
                  placeholderTextColor={theme.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.loginButton,
                { opacity: pressed || isLoading ? 0.8 : 1 },
              ]}
            >
              <LinearGradient
                colors={[Colors.accent, Colors.accentLight]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? '...' : isAdmin ? t('login') : t('sendOtp')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  divider: {
    width: 1,
    height: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
  },
});

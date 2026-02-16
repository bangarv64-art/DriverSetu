import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, useColorScheme, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

export default function OtpVerifyScreen() {
  const { phone, role } = useLocalSearchParams<{ phone: string; role: string }>();
  const { login } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp(code: string) {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsVerifying(true);

    setTimeout(async () => {
      const userRole = role as UserRole;
      const mockProfile = userRole === 'driver' ? {
        id: 'driver_' + Date.now().toString(),
        name: 'Rajesh Kumar',
        phone: phone || '',
        role: 'driver' as UserRole,
        isOnline: false,
        kycStatus: 'pending' as const,
        rating: 4.7,
        trustScore: 85,
        experience: 5,
        completionRate: 94,
        totalTrips: 1247,
        walletBalance: 12500,
        isVerified: false,
        status: 'active' as const,
        licenseUploaded: false,
        aadhaarUploaded: false,
      } : {
        id: 'owner_' + Date.now().toString(),
        name: 'Suresh Patil',
        phone: phone || '',
        role: 'owner' as UserRole,
        status: 'active' as const,
        isVerified: true,
      };

      await login(mockProfile);
      setIsVerifying(false);
      const targetRoute = userRole === 'driver' ? '/(driver-tabs)' : '/(owner-tabs)';
      router.replace(targetRoute as any);
    }, 1500);
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : '#F5F6FA' }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>

        <View style={styles.headerSection}>
          <View style={[styles.otpIcon, { backgroundColor: isDark ? Colors.dark.surfaceSecondary : '#FFF3ED' }]}>
            <Ionicons name="chatbubble-ellipses" size={36} color={Colors.accent} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{t('verifyOtp')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('enterOtp')}
          </Text>
          <Text style={[styles.phoneText, { color: theme.text }]}>+91 {phone}</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: digit ? Colors.accent : theme.border,
                  color: theme.text,
                },
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {isVerifying && (
          <View style={styles.verifyingContainer}>
            <Text style={[styles.verifyingText, { color: Colors.accent }]}>Verifying...</Text>
          </View>
        )}

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={[styles.timerText, { color: theme.textSecondary }]}>
              Resend in {timer}s
            </Text>
          ) : (
            <Pressable onPress={() => setTimer(30)}>
              <Text style={[styles.resendText, { color: Colors.accent }]}>Resend OTP</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  otpIcon: {
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
  },
  phoneText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
  },
  verifyingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  verifyingText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});

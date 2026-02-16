import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, useColorScheme, Platform, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

export default function PostJobScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [duration, setDuration] = useState('');

  function handlePost() {
    if (!title.trim() || !location.trim() || !salary.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Job Posted', 'Your job has been posted successfully. Drivers will be notified.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  const fields = [
    { label: t('jobTitle'), value: title, setter: setTitle, placeholder: 'e.g. Mumbai - Pune Transfer', required: true },
    { label: t('jobDescription'), value: description, setter: setDescription, placeholder: 'Describe the job requirements...', multiline: true },
    { label: t('location'), value: location, setter: setLocation, placeholder: 'e.g. Mumbai', required: true, icon: 'location-outline' as const },
    { label: t('salary') + ' (\u20B9)', value: salary, setter: setSalary, placeholder: 'e.g. 2500', required: true, keyboard: 'numeric' as const },
    { label: t('duration'), value: duration, setter: setDuration, placeholder: 'e.g. 1 day, 1 month' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t('postJob')}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {fields.map((field, index) => (
            <View key={index} style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                {field.label}{field.required ? ' *' : ''}
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {field.icon && <Ionicons name={field.icon} size={20} color={theme.textTertiary} />}
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.text },
                    field.multiline && { height: 100, textAlignVertical: 'top' },
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.textTertiary}
                  value={field.value}
                  onChangeText={field.setter}
                  multiline={field.multiline}
                  keyboardType={field.keyboard || 'default'}
                />
              </View>
            </View>
          ))}

          <Pressable onPress={handlePost} style={({ pressed }) => [styles.postButton, { opacity: pressed ? 0.8 : 1 }]}>
            <LinearGradient colors={[Colors.teal, Colors.tealLight]} style={styles.postButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="send" size={20} color="#FFF" />
              <Text style={styles.postButtonText}>{t('postJob')}</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  fieldContainer: { gap: 6 },
  fieldLabel: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 14, gap: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Poppins_400Regular' },
  postButton: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  postButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, gap: 8 },
  postButtonText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});

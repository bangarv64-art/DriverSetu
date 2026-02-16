import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/constants/translations';
import Colors from '@/constants/colors';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093F\u0902\u0926\u0940' },
  { code: 'mr', name: 'Marathi', nativeName: '\u092E\u0930\u093E\u0920\u0940' },
];

export default function LanguageSheet() {
  const { language, setLanguage, t } = useLanguage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  function handleSelect(lang: Language) {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(lang);
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t('language')}</Text>
      <View style={styles.list}>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => handleSelect(lang.code)}
            style={({ pressed }) => [
              styles.item,
              {
                backgroundColor: language === lang.code
                  ? (isDark ? 'rgba(255,107,53,0.1)' : '#FFF3ED')
                  : 'transparent',
                borderColor: language === lang.code ? Colors.accent : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={styles.itemText}>
              <Text style={[styles.langName, { color: theme.text }]}>{lang.nativeName}</Text>
              <Text style={[styles.langSubName, { color: theme.textSecondary }]}>{lang.name}</Text>
            </View>
            {language === lang.code && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  itemText: {
    flex: 1,
  },
  langName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  langSubName: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
});

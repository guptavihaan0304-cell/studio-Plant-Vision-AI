'use client';

import { translateText as translateTextFlow } from '@/ai/flows/translate-text';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

type Translations = {
  [key: string]: string;
};

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  translations: Translations;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
};

const defaultTranslations: Translations = {
    aiAnalysis: 'AI Analysis',
    aiAssistant: 'AI Assistant',
    myRecords: 'My Records',
    logOut: 'Log out',
    loginSignUp: 'Login / Sign Up',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('English');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    if (targetLanguage === 'English') {
      return text;
    }
    try {
      const result = await translateTextFlow({ text, targetLanguage });
      return result.translation;
    } catch (error) {
      console.error('Translation failed in useLanguage hook:', error);
      // Fallback to original text if translation fails
      return text;
    }
  }, []);

  const translateAll = useCallback(async (targetLanguage: string) => {
    if (targetLanguage === 'English') {
      setTranslations(defaultTranslations);
      return;
    }

    const newTranslations: Partial<Translations> = {};
    const translationPromises = Object.entries(defaultTranslations).map(async ([key, value]) => {
        newTranslations[key] = await translateText(value, targetLanguage);
    });

    await Promise.all(translationPromises);
    setTranslations(newTranslations as Translations);
  }, [translateText]);
  
  const handleSetLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    translateAll(newLanguage);
  };


  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations,
    translateText,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import {useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEY from './storageKeyMap';

// Themes
import {LightTheme, DarkTheme} from '../../theme';

type Theme = {
  PrimaryText: string;
  SecondaryText: string;
  Placeholder: string;
  PrimaryBackground: string;
  Pure?: string;
  Black?: string;
  RippleColor: string;
};

type asyncTheme = string | null;

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(DarkTheme);
  const [theme, setTheme] = useState<asyncTheme>();
  const systemTheme = useColorScheme();
  AsyncStorage.getItem(STORAGE_KEY.THEME).then(val => setTheme(val));

  useEffect(() => {
    async function asyncFunc() {
      if (theme !== null) {
        if (theme === 'light') {
          setCurrentTheme(LightTheme);
        }
        if (theme === 'dark') {
          setCurrentTheme(DarkTheme);
        } else {
          if (systemTheme === 'dark') {
            setCurrentTheme(DarkTheme);
          } else {
            setCurrentTheme(LightTheme);
          }
        }
      } else {
        await AsyncStorage.setItem(STORAGE_KEY.THEME, 'auto');
      }
    }

    asyncFunc();
  }, [theme]);

  return {
    Theme: currentTheme,
    type: currentTheme === LightTheme ? 'light' : 'dark',
  };
};

export default useTheme;
export type {Theme};

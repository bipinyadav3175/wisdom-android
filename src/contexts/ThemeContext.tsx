import {useColorScheme} from 'react-native';
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEY from '../utils/storageKeyMap';
import {LightTheme, DarkTheme} from '../../theme';

type Theme = {
  PrimaryText: string;
  SecondaryText: string;
  Placeholder: string;
  PrimaryBackground: string;
  Pure?: string | undefined;
  Black?: string | undefined;
  RippleColor: string;
  Red?: string;
  Chocolate?: string;
  Green?: string;
  LightBlue?: string;
  LightGray?: string;
};

type Context = {
  Theme: Theme;
  type: string;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  setAutoTheme: () => void;
};

const defaultValue = {
  Theme: LightTheme,
  type: 'dark',
  setLightTheme: () => {},
  setDarkTheme: () => {},
  setAutoTheme: () => {},
};

const ThemeContext = createContext<Context>(defaultValue);

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const systemTheme = useColorScheme();

  const [theme, setTheme] = useState<Theme>(DarkTheme);

  // Actions
  const setLightTheme = async () => {
    try {
      setTheme(LightTheme);
      await AsyncStorage.setItem(STORAGE_KEY.THEME, 'light');
    } catch (err) {
      console.log(err);
    }
  };

  const setDarkTheme = async () => {
    try {
      setTheme(DarkTheme);
      await AsyncStorage.setItem(STORAGE_KEY.THEME, 'dark');
    } catch (err) {
      console.log(err);
    }
  };

  const setAutoTheme = async () => {
    try {
      if (systemTheme === 'dark') {
        setTheme(DarkTheme);
      } else {
        setTheme(LightTheme);
      }

      await AsyncStorage.setItem(STORAGE_KEY.THEME, 'auto');
    } catch (err) {
      console.log(err);
    }
  };

  // Retrive information about the theme from the async storage
  useEffect(() => {
    async function init() {
      setLightTheme();
      try {
        const prevTheme = await AsyncStorage.getItem(STORAGE_KEY.THEME);

        // No theme or auto theme enabled
        if (!prevTheme || prevTheme === 'auto') {
          await AsyncStorage.setItem(STORAGE_KEY.THEME, 'auto');

          if (systemTheme === 'dark') {
            setTheme(DarkTheme);
          } else {
            setTheme(LightTheme);
          }

          return;
        }

        // Dark Theme
        if (prevTheme === 'dark') {
          await AsyncStorage.setItem(STORAGE_KEY.THEME, 'dark');

          setTheme(DarkTheme);
          return;
        }

        // Light Theme
        await AsyncStorage.setItem(STORAGE_KEY.THEME, 'light');
        setTheme(LightTheme);
      } catch (err) {
        console.log(err);

        // If something went wrong, set device default auto theme
        await AsyncStorage.setItem(STORAGE_KEY.THEME, 'auto');

        if (systemTheme === 'dark') {
          setTheme(DarkTheme);
        } else {
          setTheme(LightTheme);
        }
      }
    }

    init();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        Theme: theme,
        type: theme === LightTheme ? 'light' : 'dark',
        setLightTheme,
        setDarkTheme,
        setAutoTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
export {ThemeProvider};

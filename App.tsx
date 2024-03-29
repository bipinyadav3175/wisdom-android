import React, {useContext, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar, useColorScheme, View} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
//
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Toast message
import Toast from 'react-native-toast-message/';

// Universal Provider
import Provider from './src/contexts/Provider';
// Portal
import {PortalProvider} from '@gorhom/portal';

import AuthContext from './src/contexts/AuthContext';
import ThemeContext from './src/contexts/ThemeContext';
import StreakContext from './src/contexts/StreakContext';

// Nav Pages needed here
import BottomNav from './src/NavPages/BottomNav';

// Reading Page
import ReadingPage from './src/pages/ReadingPage';
// Writing Nav Page
import EditorNav from './src/NavPages/EditorNav';
// Login Page
import Login from './src/pages/Login';
// Username Page
import Username from './src/pages/Username';
// Splash Screen
import Splash from './src/pages/Splash';

// Creating Navigation Stack
const Stack = createNativeStackNavigator();

// Themes
import {LightTheme, DarkTheme} from './theme';

// Configs
import toastConfig from './configs/toast_config';

const Light = {
  dark: false,
  colors: {
    primary: LightTheme.PrimaryText,
    background: LightTheme.PrimaryBackground,
    card: 'rgb(255, 255, 255)',
    text: LightTheme.PrimaryText,
    border: 'rgb(0, 0, 0, 0.2)',
    notification: 'rgb(255, 69, 58)',
  },
};

const Dark = {
  dark: true,
  colors: {
    primary: DarkTheme.PrimaryText,
    background: DarkTheme.PrimaryBackground,
    card: DarkTheme.PrimaryBackground,
    text: DarkTheme.PrimaryText,
    border: 'rgb(255, 255, 255, 0.3)',
    notification: 'rgb(255, 69, 58)',
  },
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const {Theme, type} = useContext(ThemeContext);

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      Theme.PrimaryBackground,
      'dark',
      'both',
    );
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId:
        '862554828329-m6s19u2612q48mv5tljpc5l54hh6v463.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <>
      <Provider>
        <GestureHandlerRootView style={{flex: 1}}>
          <PortalProvider>
            <NavigationInsider />
          </PortalProvider>
        </GestureHandlerRootView>
      </Provider>
    </>
  );
};

const NavigationInsider = () => {
  const {Theme, type} = useContext(ThemeContext);

  const {state, isAuthLoading} = useContext(AuthContext);
  const Streak = useContext(StreakContext);

  useEffect(() => {
    if (isAuthLoading) return;

    Streak.getDetails();
  }, [isAuthLoading]);

  if (isAuthLoading) {
    return <Splash />;
  }

  return (
    <>
      <NavigationContainer theme={type === 'dark' ? Dark : Light}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="BottomNav">
          {state.isLoggedIn && state.token ? (
            <>
              {!state.username ? (
                <Stack.Screen name="Username" component={Username} />
              ) : (
                <>
                  <Stack.Screen name="BottomNav" component={BottomNav} />
                  <Stack.Screen
                    name="ReadingPage"
                    component={ReadingPage}
                    options={{
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="EditorNav"
                    component={EditorNav}
                    options={{animation: 'slide_from_bottom'}}
                  />
                </>
              )}
            </>
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast position="bottom" config={toastConfig} bottomOffset={55} />

      <StatusBar
        animated={true}
        barStyle={type === 'dark' ? 'light-content' : 'dark-content'}
        // backgroundColor={'black'}
        backgroundColor={Theme.PrimaryBackground}
      />
    </>
  );
};

export default App;

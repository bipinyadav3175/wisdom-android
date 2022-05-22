import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// All Home nested screens
import Home from '../pages/Home';
import Search from '../pages/Search';
import Explore from '../pages/Explore';
import UserProfile from '../pages/UserProfile';

import ThemeContext from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator();

const HomeNav = () => {
  const {Theme} = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {backgroundColor: Theme.PrimaryBackground},
          headerTintColor: Theme.PrimaryText,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNav;

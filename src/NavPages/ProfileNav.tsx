import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ThemeContext from '../contexts/ThemeContext';

// Pages inside profile nav
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import EditProfile from '../pages/EditProfile';

const Stack = createNativeStackNavigator();

const ProfileNav = () => {
  const {Theme} = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Settings">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Theme.PrimaryBackground,
          },
          headerTintColor: Theme.PrimaryText,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: Theme.PrimaryBackground,
          },
          headerTintColor: Theme.PrimaryText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default ProfileNav;

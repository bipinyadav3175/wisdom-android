import {View, Text} from 'react-native';
import React, {useContext, useRef} from 'react';
import {EventEmitter} from 'fbemitter';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Pages or NavPages (pages with nested navigation) required
import HomeNav from './HomeNav';
import ListNav from './ListNav';
import ProfileNav from './ProfileNav';
// Custom Bottom Tab
import CustomBottomTab from '../components/CustomBottomTab';

import {CustomFonts} from '../../theme';
import ThemeContext from '../contexts/ThemeContext';

// to show writing page icon in the bottom tab
// which is in different navigator
const DummyComponent = () => {
  return <View />;
};

const BottomTab = createBottomTabNavigator();
const emitter = new EventEmitter();

const BottomNav = () => {
  const {Theme} = useContext(ThemeContext);

  return (
    <BottomTab.Navigator
      detachInactiveScreens={false}
      tabBar={props => <CustomBottomTab {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Theme.PrimaryText,
        tabBarInactiveTintColor: Theme.SecondaryText,
        tabBarStyle: {
          height: 55,
          paddingVertical: 3,
          borderTopColor: 'rgba(0, 0, 0, 0.3)',
          borderTopWidth: 1,
          backgroundColor: Theme.PrimaryBackground,
        },
        headerShown: false,
      }}>
      <BottomTab.Screen
        name="HomeNav"
        component={HomeNav}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              style={{
                fontFamily: CustomFonts.SSP.Regular,
                fontSize: 13,
                color,
              }}>
              Home
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            emitter.emit('home-tab-pressed');
          },
        }}
      />
      <BottomTab.Screen
        name="DummyWritingPage"
        component={DummyComponent}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              style={{
                fontFamily: CustomFonts.SSP.Regular,
                fontSize: 13,
                color,
              }}>
              Write
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-create-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Make a custom bottom tab bar */}
      <BottomTab.Screen
        name="ListNav"
        component={ListNav}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              style={{
                fontFamily: CustomFonts.SSP.Regular,
                fontSize: 13,
                color,
              }}>
              Reading list
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <Ionicons name="bookmarks-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ProfileNav"
        component={ProfileNav}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              style={{
                fontFamily: CustomFonts.SSP.Regular,
                fontSize: 13,
                color,
              }}>
              Profile
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomNav;
export {emitter};

import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useContext} from 'react';

import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

//
import {CustomFonts, Spacing} from '../../../theme';
import ThemeContext from '../../contexts/ThemeContext';
// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const {Theme} = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: Spacing.Padding.Small,
        backgroundColor: Theme.Pure,
        borderTopColor: Theme.LightGray,
        borderTopWidth: StyleSheet.hairlineWidth,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            if (route.name === 'DummyWritingPage') {
              // @ts-ignore
              navigation.navigate({name: 'EditorNav', merge: true});
            } else {
              // @ts-ignore
              navigation.navigate({name: route.name, merge: true});
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={'bottomTab-' + index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <Text>
              {label}
            </Text> */}
            {route.name === 'HomeNav' ? (
              <AntDesign
                name="home"
                size={25}
                color={isFocused ? Theme.PrimaryText : Theme.Placeholder}
              />
            ) : null}
            {route.name === 'DummyWritingPage' ? (
              <Ionicons
                name="ios-create-outline"
                size={25}
                color={isFocused ? Theme.PrimaryText : Theme.Placeholder}
              />
            ) : null}
            {route.name === 'ListNav' ? (
              <Ionicons
                name="bookmarks-outline"
                size={23}
                color={isFocused ? Theme.PrimaryText : Theme.Placeholder}
              />
            ) : null}
            {route.name === 'ProfileNav' ? (
              <AntDesign
                name="user"
                size={25}
                color={isFocused ? Theme.PrimaryText : Theme.Placeholder}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomBottomTab;

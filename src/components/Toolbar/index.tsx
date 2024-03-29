import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useCallback, useContext} from 'react';
import ThemeContext from '../../contexts/ThemeContext';

import {Spacing} from '../../../theme';
import {Theme} from '../../utils/Theme';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

const Toolbar = ({
  type,
  onActionTriggered,
}: {
  type: string;
  onActionTriggered: (val: {id: string; type: string}) => void;
}) => {
  const {Theme} = useContext(ThemeContext);

  const generateId = useCallback(
    () => `${Date.now()}-${Math.floor(Math.random() * 100 + 1)}`,
    [],
  );

  const triggerImageAction = () => {
    console.log('pressed');
    let id = generateId();
    onActionTriggered({id, type: 'IMAGE'});
  };

  const triggerBold = () => {
    let id = generateId();
    onActionTriggered({id, type: 'BOLD'});
  };

  const triggerItalic = () => {
    let id = generateId();
    onActionTriggered({id, type: 'ITALIC'});
  };

  const triggerUnderline = () => {
    let id = generateId();
    onActionTriggered({id, type: 'UNDERLINE'});
  };
  const triggerHeading = () => {
    let id = generateId();
    onActionTriggered({id, type: 'H1'});
  };

  const iconSize = 23;
  // const iconColor = '#1B9CFC';
  const iconColor = 'rgba(255, 255, 255, 0.5)';

  return (
    <View
      style={[
        styles.container,
        {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Theme.Placeholder,
          // backgroundColor:
          //   type === 'dark' ? 'rgba(10, 10, 10, 0.9)' : Theme.PrimaryBackground,
          backgroundColor: Theme.Black,
        },
      ]}>
      <View style={[styles.textTools, {borderColor: Theme.LightGray}]}>
        <View style={styles.pressableWrapper}>
          <Pressable
            onPress={triggerHeading}
            android_ripple={{
              color: 'rgba(255, 255, 255, 0.2)',
              borderless: true,
            }}
            style={[styles.iconWrapper, {paddingHorizontal: 10}]}>
            <Octicons name="heading" size={iconSize} color={iconColor} />
          </Pressable>
        </View>

        <View style={{height: '100%', width: Spacing.Margin.Small}} />

        <View style={styles.pressableWrapper}>
          <Pressable
            onPress={triggerBold}
            android_ripple={{
              color: 'rgba(255, 255, 255, 0.2)',
              borderless: true,
            }}
            style={[styles.iconWrapper]}>
            <Feather name="bold" size={iconSize} color={iconColor} />
          </Pressable>
        </View>

        <View style={{height: '100%', width: Spacing.Margin.Small}} />

        <View style={styles.pressableWrapper}>
          <Pressable
            onPress={triggerItalic}
            android_ripple={{
              color: 'rgba(255, 255, 255, 0.2)',
              borderless: true,
            }}
            style={[styles.iconWrapper]}>
            <Feather name="italic" size={iconSize} color={iconColor} />
          </Pressable>
        </View>

        <View style={{height: '100%', width: Spacing.Margin.Small}} />

        <View style={styles.pressableWrapper}>
          <Pressable
            onPress={triggerUnderline}
            android_ripple={{
              color: 'rgba(255, 255, 255, 0.2)',
              borderless: true,
            }}
            style={[styles.iconWrapper]}>
            <Feather name="underline" size={iconSize} color={iconColor} />
          </Pressable>
        </View>
      </View>

      <View style={styles.pressableWrapper}>
        <Pressable
          onPress={triggerImageAction}
          android_ripple={{color: 'rgba(255, 255, 255, 0.2)', borderless: true}}
          style={[styles.iconWrapper]}>
          <Ionicons name="ios-image-outline" size={28} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: 3,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTools: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: StyleSheet.hairlineWidth,
    // borderRadius: 7,
    // padding: 5,
    // paddingHorizontal: Spacing.Padding.Small,
  },
  iconWrapper: {
    padding: 6,
    // paddingHorizontal: Spacing.Padding.Small * 1.2,
  },
  pressableWrapper: {
    // borderColor: '#1B9CFC',
    overflow: 'hidden',
    borderRadius: 50,
    // borderWidth: 1.5,
  },
});

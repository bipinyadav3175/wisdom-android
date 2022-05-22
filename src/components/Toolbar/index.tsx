import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

import {Spacing} from '../../../theme';
import {Theme} from '../../utils/Theme';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

const Toolbar = ({
  Theme,
  type,
  onActionTriggered,
}: {
  Theme: Theme;
  type: string;
  onActionTriggered: (val: {id: string; type: string}) => void;
}) => {
  const triggerImageAction = () => {
    console.log('pressed');
    let id = `${Date.now()}-${Math.floor(Math.random() * 100 + 1)}`;
    onActionTriggered({id, type: 'IMAGE'});
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Theme.SecondaryText,
          backgroundColor:
            type === 'dark' ? 'rgba(10, 10, 10, 0.9)' : Theme.PrimaryBackground,
        },
      ]}>
      <Pressable onPress={triggerImageAction}>
        <Ionicons
          name="ios-image-outline"
          size={28}
          color={Theme.SecondaryText}
        />
      </Pressable>
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
    paddingVertical: 5,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

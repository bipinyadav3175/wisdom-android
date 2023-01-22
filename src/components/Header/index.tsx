import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import ThemeContext from '../../contexts/ThemeContext';

import {Spacing, CustomFonts} from '../../../theme';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({
  title,
  hideBackArrow,
  backgroundColor,
  showSeperator,
}: {
  title: string;
  hideBackArrow: boolean;
  showSeperator: boolean;
  backgroundColor: string | undefined;
}) => {
  const {Theme} = useContext(ThemeContext);
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor,
          borderBottomColor: Theme.LightGray,
          borderBottomWidth: showSeperator ? StyleSheet.hairlineWidth : 0,
        },
      ]}>
      <Text style={[styles.title, {color: Theme.PrimaryText}]}>{title}</Text>
      <Pressable
        style={[styles.back, {display: hideBackArrow ? 'none' : 'flex'}]}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Theme.PrimaryText} />
      </Pressable>
    </View>
  );
};

Header.defaultProps = {
  title: '',
  hideBackArrow: false,
  backgroundColor: undefined,
  showSeperator: false,
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    top: '50%',
    left: Spacing.Padding.Normal,
  },
  title: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 20,
  },
});

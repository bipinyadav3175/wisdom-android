import {View, Text, StyleSheet} from 'react-native';
import React, {useContext, useMemo} from 'react';

import {CustomFonts, Spacing} from '../../../../theme';
import ThemeContext from '../../../contexts/ThemeContext';

// Time to do some work
import numberFormatter from '../../../utils/numberFormatter';

interface statsBoxProps {
  followers: number;
  storyViews: number;
  following: number;
}

const StatsBox = (props: statsBoxProps) => {
  const {Theme} = useContext(ThemeContext);

  const followers = useMemo<string>(() => numberFormatter(props.followers), []);
  const storyViews = useMemo<string>(
    () => numberFormatter(props.storyViews),
    [],
  );
  const following = useMemo<string>(() => numberFormatter(props.following), []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.wrapper, {borderRightColor: Theme.SecondaryText}]}>
        <Text style={[styles.stat, {color: Theme.PrimaryText}]}>
          {followers}
        </Text>
        <Text style={[styles.title, {color: Theme.SecondaryText}]}>
          Followers
        </Text>
      </View>
      <View style={[styles.separator, {backgroundColor: Theme.LightGray}]} />
      <View style={[styles.wrapper, {borderRightColor: Theme.SecondaryText}]}>
        <Text style={[styles.stat, {color: Theme.PrimaryText}]}>
          {storyViews}
        </Text>
        <Text style={[styles.title, {color: Theme.SecondaryText}]}>
          Story views
        </Text>
      </View>
      <View style={[styles.separator, {backgroundColor: Theme.LightGray}]} />
      <View style={[styles.wrapper]}>
        <Text style={[styles.stat, {color: Theme.PrimaryText}]}>
          {following}
        </Text>
        <Text style={[styles.title, {color: Theme.SecondaryText}]}>
          Following
        </Text>
      </View>
    </View>
  );
};

export default StatsBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
  separator: {
    width: 1,
    marginHorizontal: Spacing.Margin.Large,
    borderRadius: 5,
    height: '100%',
  },
  wrapper: {
    alignItems: 'center',
  },
  stat: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 22,
  },
  title: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
  },
});

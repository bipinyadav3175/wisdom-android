import {View, Text, StyleSheet, Pressable, StatusBar} from 'react-native';
import React, {useContext, useEffect} from 'react';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import {CustomFonts, Spacing} from '../../../theme';
import {useNavigation} from '@react-navigation/native';
import ThemeContext from '../../contexts/ThemeContext';
import StreakContext from '../../contexts/StreakContext';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// <AntDesign name="search1" size={24} color="black" />
// <Ionicons name="compass-outline" size={24} color="black" />

type Nav = {
  navigate: (value: string) => void;
};

const HeaderHome = () => {
  const navigation = useNavigation<Nav>();
  const {Theme} = useContext(ThemeContext);
  const Streak = useContext(StreakContext);

  return (
    <View
      style={[
        styles.container,
        {borderBottomColor: Theme.LightGray, backgroundColor: Theme.Pure},
      ]}>
      <Text style={[styles.title, {color: Theme.PrimaryText}]}>Home</Text>
      {/* <View style={styles.rightContainer}>
        <Pressable
          style={styles.pressCont}
          onPress={() => navigation.navigate('Explore')}>
          <Ionicons name="compass-outline" size={24} color="#fff" />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: CustomFonts.SSP.Regular,
              color: '#fff',
              fontSize: 16,
            }}>
            Explore
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Search')}>
          <AntDesign name="search1" size={24} color={Theme.PrimaryText} />
        </Pressable>
      </View> */}
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('Streak')}>
        <FontAwesome5
          name="fire-alt"
          size={22}
          color="#FFA113"
          style={{marginRight: 8, opacity: 0.85}}
        />
        <Text style={[styles.streakText, {color: Theme.PrimaryText}]}>
          {Streak.currentStreak}
        </Text>
      </Pressable>
    </View>
  );
};

export default HeaderHome;

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.Padding.Small,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.Padding.Normal,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontFamily: CustomFonts.SSP.Bold,
    fontSize: 22,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    marginRight: 20,
    borderRadius: 5,
    backgroundColor: '#34495e',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: CustomFonts.SSP.SemiBold,
  },
});

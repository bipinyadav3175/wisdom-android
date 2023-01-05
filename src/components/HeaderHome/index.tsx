import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import React, {useContext} from 'react';
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

  // Styles
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 60,
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.Padding.Normal,
      alignItems: 'center',
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
      fontFamily: CustomFonts.SSP.Bold,
      color: Theme.PrimaryText,
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
      color: Theme.PrimaryText,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: CustomFonts.SSP.SemiBold,
    },
  });

  return (
    <View style={[styles.container, {borderBottomColor: Theme.LightGray}]}>
      <Text style={styles.title}>Home</Text>
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
          style={{marginRight: 8}}
        />
        <Text style={styles.streakText}>{Streak.currentStreak}</Text>
      </Pressable>
    </View>
  );
};

export default HeaderHome;

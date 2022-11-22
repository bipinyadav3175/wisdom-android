import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useContext} from 'react';
import {CustomFonts, Spacing} from '../../../theme';
import {useNavigation} from '@react-navigation/native';
import ThemeContext from '../../contexts/ThemeContext';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// <AntDesign name="search1" size={24} color="black" />
// <Ionicons name="compass-outline" size={24} color="black" />

type Nav = {
  navigate: (value: string) => void;
};

const HeaderHome = () => {
  const navigation = useNavigation<Nav>();
  const {Theme} = useContext(ThemeContext);

  // Styles
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 60,
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.Padding.Normal,
      alignItems: 'center',
      flexDirection: 'row',
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
  });

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default HeaderHome;

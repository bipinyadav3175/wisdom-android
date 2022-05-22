import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useContext} from 'react';
import {CustomFonts, Spacing} from '../../../theme';
import ThemeContext from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';

// Icons
import Entypo from 'react-native-vector-icons/Entypo';

const SettingsProfile = () => {
  const {Theme} = useContext(ThemeContext);
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.container}
      android_ripple={{color: Theme.RippleColor}}
      onPress={() => {
        // @ts-ignore
        navigation.navigate('Profile');
      }}>
      <View style={styles.wrapper}>
        <Image
          source={{uri: 'https://i.pravatar.cc/500'}}
          style={styles.avatar}
        />
        <Text style={[styles.text, {color: Theme.PrimaryText}]}>
          Your Profile
        </Text>
      </View>

      <Entypo name="chevron-small-right" size={24} color={Theme.PrimaryText} />
    </Pressable>
  );
};

export default SettingsProfile;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: Spacing.Margin.Large,
  },
  text: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 20,
  },
});

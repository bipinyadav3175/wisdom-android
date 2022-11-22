import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';

import CONSTANTS from '../../../CONSTANTS';
import {CustomFonts, Spacing} from '../../../theme';
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

// Icons
import Entypo from 'react-native-vector-icons/Entypo';

const SettingsProfile = () => {
  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const navigation = useNavigation();

  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(
          `${CONSTANTS.BACKEND_URI}/user/${state.id}`,
          {
            params: {
              avatar_50: true,
              username: true,
            },
            headers: {
              Authorization: state.token as string,
            },
          },
        );

        const resData = res.data;

        if (resData.success) {
          setAvatar(resData?.data?.avatar_50);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

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
          source={{uri: avatar ? avatar : 'https://i.pravatar.cc/500'}}
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
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 20,
  },
});

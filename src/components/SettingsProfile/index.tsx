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
              avatar_200: true,
            },
            headers: {
              Authorization: state.token as string,
            },
          },
        );

        const resData = res.data;

        if (resData.success) {
          setAvatar(resData?.data?.avatar_200);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{uri: avatar}} style={styles.avatar} />
      <Text style={[styles.name, {color: Theme.PrimaryText}]}>
        {state.name}
      </Text>
      <Text style={[styles.username, {color: Theme.SecondaryText}]}>
        @{state.username}
      </Text>

      <Pressable
        style={[styles.btn, {backgroundColor: Theme.Chocolate}]}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('EditProfile');
        }}>
        <Text style={[styles.btnText, {color: Theme.Pure}]}>Edit Profile</Text>
        <Entypo name="chevron-small-right" color={Theme.Pure} size={26} />
      </Pressable>
    </View>
  );
};

export default SettingsProfile;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Normal,
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: Spacing.Margin.Normal,
  },
  text: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 20,
  },
  name: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 23,
  },
  username: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 18,
  },
  btn: {
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: 6,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.Margin.Normal,
  },
  btnText: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 20,
  },
});

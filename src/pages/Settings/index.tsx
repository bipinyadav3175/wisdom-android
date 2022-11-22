import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useContext} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import styles from './styles';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

// Components
import SettingsProfile from '../../components/SettingsProfile';
import {Spacing} from '../../../theme';

const Settings = () => {
  const {Theme} = useContext(ThemeContext);
  const {logout} = useContext(AuthContext);

  const signOut = async () => {
    console.log('sign out function');
    try {
      await GoogleSignin.signOut();
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
      <SettingsProfile />
      {/* Divider */}
      <View
        style={{
          width: '100%',
          height: StyleSheet.hairlineWidth,
          backgroundColor: Theme.Placeholder,
          marginVertical: Spacing.Margin.Normal,
        }}
      />

      <Pressable onPress={signOut}>
        <Text style={[styles.logoutText, {color: Theme.SecondaryText}]}>
          Logout
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default Settings;

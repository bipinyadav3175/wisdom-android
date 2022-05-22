import {View, Text, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

import ThemeContext from '../../contexts/ThemeContext';

// Components
import SettingsProfile from '../../components/SettingsProfile';
import {Spacing} from '../../../theme';

const Settings = () => {
  const {Theme} = useContext(ThemeContext);
  return (
    <KeyboardAwareScrollView style={styles.container}>
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
    </KeyboardAwareScrollView>
  );
};

export default Settings;

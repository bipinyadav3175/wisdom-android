import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import React, {useContext} from 'react';

import ThemeContext from '../../contexts/ThemeContext';

const logo_aspect_ratio = 2.069;
const logo_resize_factor = 0.3; // value from 0 to 1

const logo_width = Dimensions.get('window').width * logo_resize_factor;
const logo_height = logo_width / logo_aspect_ratio;

const Splash = () => {
  const {Theme} = useContext(ThemeContext);
  return (
    <View
      style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
      <Image
        source={require('../../../assets/logo/logo-png.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: logo_width,
    aspectRatio: logo_aspect_ratio,
    height: logo_height,
  },
});

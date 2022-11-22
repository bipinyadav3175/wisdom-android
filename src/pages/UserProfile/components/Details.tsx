import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useContext} from 'react';

import {CustomFonts, Spacing} from '../../../../theme';
import ThemeContext from '../../../contexts/ThemeContext';

interface DetailsProps {
  avatar_200: string;
  name: string;
  username: string;
  bio: string;
}

const Details = ({avatar_200, name, username, bio}: DetailsProps) => {
  const {Theme} = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Image
        source={{uri: avatar_200}}
        style={[styles.avatar, {borderColor: Theme.LightGray}]}
      />
      <Text style={[styles.name, {color: Theme.PrimaryText}]}>{name}</Text>
      <Text style={[styles.username, {color: Theme.SecondaryText}]}>
        @{username}
      </Text>
      <Text
        style={[
          styles.bio,
          {color: Theme.PrimaryText, display: bio ? 'flex' : 'none'},
        ]}>
        {bio}
      </Text>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
    marginBottom: Spacing.Margin.Small,
    borderWidth: 3,
  },
  name: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 18,
    marginBottom: Spacing.Margin.Small * 0.2,
  },
  username: {
    fontFamily: CustomFonts.SSP.Light,
    fontSize: 15,
    marginBottom: Spacing.Margin.Small,
  },
  bio: {
    fontSize: 15,
    width: '85%',
    textAlign: 'center',
    marginBottom: Spacing.Margin.Large,
  },
});

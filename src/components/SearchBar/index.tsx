import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';

import {Spacing, CustomFonts} from '../../../theme';
import type {Theme} from '../../utils/Theme';
// Iocns
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBar = ({themeType, Theme}: {themeType: string; Theme: Theme}) => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={[styles.container]}>
      <View
        style={[
          {
            backgroundColor:
              themeType === 'dark' ? 'rgba(255, 255, 255, 0.05)' : undefined,
          },
          styles.bar,
        ]}>
        <Ionicons name="search-outline" size={24} color={Theme.PrimaryText} />
        <TextInput
          value={searchText}
          onChangeText={val => setSearchText(val)}
          style={[styles.input, {color: Theme.PrimaryText}]}
          placeholderTextColor={Theme.SecondaryText}
          placeholder="Search stories or users"
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Normal,
  },
  bar: {
    width: '100%',
    borderRadius: 100,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.Padding.Small,
  },

  input: {
    flex: 1,
    marginLeft: 5,
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
    borderRadius: 100,
  },
});

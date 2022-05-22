import {View, Text, StyleSheet} from 'react-native';
import React, {useContext} from 'react';

import ThemeContext from '../../contexts/ThemeContext';
//
import SearchBar from '../../components/SearchBar';

const Search = () => {
  const {Theme, type} = useContext(ThemeContext);

  return (
    <View
      style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
      <SearchBar themeType={type} Theme={Theme} />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

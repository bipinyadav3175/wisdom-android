import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  FlatListProps,
} from 'react-native';
import React, {useContext} from 'react';

import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
import ListItem from '../../components/ListItem';

const data = [
  {
    id: 'gr567ytg46t4',
    listName: 'Entertainment List',
    itemCount: 3,
    thumb:
      'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
    categories: ['Movies', 'Games', 'Sports', 'Games', '5th cat'],
  },
  {
    id: 'grg46t;as4',
    listName: 'Entertainment List',
    itemCount: 3,
    thumb:
      'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
    categories: ['Movies', 'Games', 'Sports', 'Games', '5th cat'],
  },
  {
    id: 'grg4432j6t4',
    listName: 'Entertainment List',
    itemCount: 3,
    thumb:
      'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
    categories: ['Movies', 'Games', 'Sports', 'Games', '5th cat'],
  },
];

type DataItemType = {
  id: string;
  listName: string;
  itemCount: number;
  thumb: string;
  categories: string[];
};

const ReadingList = () => {
  const {Theme} = useContext(ThemeContext);

  const renderLists = ({item}: {item: DataItemType}) => {
    return <ListItem Theme={Theme} data={item} key={item.id} />;
  };

  return (
    <View
      style={[{backgroundColor: Theme.PrimaryBackground}, styles.container]}>
      <FlatList
        data={data}
        renderItem={renderLists}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, {color: Theme.PrimaryText}]}>
              Reading List
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{width: '100%', height: Spacing.Margin.Large}}></View>
        )}
      />
    </View>
  );
};

export default ReadingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Large,
  },
  title: {
    fontFamily: CustomFonts.Ubuntu.Bold,
    fontSize: 21,
  },
});

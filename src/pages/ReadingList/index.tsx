import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  FlatListProps,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

import CONSTANTS from '../../../CONSTANTS';

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
  noOfStories: number;
  thumb: null | string;
};

const ReadingList = () => {
  // const [data, setData] = useState<DataItemType[]>([]);
  const isScreenFocused = useIsFocused();

  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);

  const [data, setData] = useState<DataItemType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderLists = ({item}: {item: DataItemType}) => {
    return <ListItem Theme={Theme} data={item} key={item.id} />;
  };

  const loadLists = async (
    {initialLoad}: {initialLoad?: boolean} = {initialLoad: false},
  ) => {
    if (!initialLoad) {
      setIsRefreshing(true);
    }
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/get-lists`,
        {},
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;
      if (resData.success) {
        setData(resData.data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isScreenFocused) {
      loadLists();
    }
  }, [isScreenFocused]);

  useEffect(() => {
    loadLists({initialLoad: true});
  }, []);

  return (
    <View
      style={[{backgroundColor: Theme.PrimaryBackground}, styles.container]}>
      <FlashList
        data={data}
        renderItem={renderLists}
        keyExtractor={item => item.id}
        estimatedItemSize={100}
        onRefresh={loadLists}
        refreshing={isRefreshing}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, {color: Theme.PrimaryText}]}>
              Reading List
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={{width: '100%', height: Spacing.Margin.Large}} />
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

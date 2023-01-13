import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useCallback, useState, useEffect} from 'react';
import {BottomSheetFlatList, useBottomSheet} from '@gorhom/bottom-sheet';

// Contexts
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

import {CustomFonts, Spacing} from '../../../theme';
import CONSTANTS from '../../../CONSTANTS';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListContext from '../../contexts/ListContext';

// Types
type list = {
  id: string;
  listName: string;
  noOfStories: number;
  thumb: null | string;
};

const ReadingListBottomSheet1 = ({
  isLoading,
  onCreateNewPress,
  data,
  onListSelection,
}: {
  onCreateNewPress: () => void;
  data: list[];
  onListSelection: (listId: string, storyId: string) => void;
  isLoading: boolean;
}) => {
  const {Theme} = useContext(ThemeContext);
  const [lists, setLists] = useState(data);

  // const data = [
  //   {
  //     id: 'gfdsgrhgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 4,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrhdfnbdfhgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 2,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrsdffwetghgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 15,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrsdffwatreetghgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 15,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrsdff,uj,j,wetghgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 15,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrsdffwetfghgfhghgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 15,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  //   {
  //     id: 'gfdsgrsdffwetgserettrthgrfh',
  //     listName: 'Reading list (mine)',
  //     noOfStories: 15,
  //     thumb:
  //       'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706__340.jpg',
  //   },
  // ];

  // useEffect(() => {
  //   console.log(animatedIndex.value);
  //   if (animatedIndex.value === -1) {
  //     return;
  //   }

  //   async function init() {
  //     try {
  //       const res = await axios.post(
  //         `${CONSTANTS.BACKEND_URI}/get-lists`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: state.token as string,
  //           },
  //         },
  //       );

  //       const resData = res.data;

  //       console.log(resData);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   init();
  // }, [animatedIndex.value]);

  useEffect(() => {
    setLists(data);
  }, [data]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={24} />
      </View>
    );
  }

  if (data.length == 0) {
    return (
      <View style={styles.container}>
        <Text style={[{color: Theme.PrimaryText}, styles.heading]}>
          Save to Reading List
        </Text>
        <EmptyList onCreateNewPress={onCreateNewPress} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NormalList
        data={data}
        onCreateNewPress={onCreateNewPress}
        onListSelection={onListSelection}
      />
    </View>
  );
};

export default ReadingListBottomSheet1;

const EmptyList = ({onCreateNewPress}: {onCreateNewPress: () => void}) => {
  const {Theme} = useContext(ThemeContext);
  console.log('IN EMPTY LIST');
  return (
    <View style={styles.emptyCont}>
      <Text style={[styles.emptyHeading, {color: Theme.SecondaryText}]}>
        No reading list
      </Text>
      <Pressable
        onPress={onCreateNewPress}
        style={styles.emptyBtn}
        android_ripple={{color: Theme.RippleColor}}>
        <Text style={styles.emptyBtnText}>Create One</Text>
      </Pressable>
    </View>
  );
};

const NormalList = ({
  data,
  onCreateNewPress,
  onListSelection,
}: {
  data: {
    id: string;
    listName: string;
    noOfStories: number;
    thumb: null | string;
  }[];
  onCreateNewPress: () => void;
  onListSelection: (listId: string, storyId: string) => void;
}) => {
  const {Theme} = useContext(ThemeContext);
  const {storyId} = useContext(ListContext);

  const renderList = useCallback(
    ({
      item,
      storyId,
    }: {
      item: {
        id: string;
        listName: string;
        noOfStories: number;
        thumb: null | string;
      };
      storyId: string;
    }) => {
      return (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'flex-start'}}
          onPress={() => {
            console.log('btn pressed', item.id);
            onListSelection(item.id, storyId as string);
          }}>
          <Image
            source={
              item.thumb
                ? {uri: item.thumb}
                : require('../../../assets/dev/mountain.jpg')
            }
            style={styles.thumb}
          />
          <View style={{width: '100%'}}>
            <Text
              style={[styles.listName, {color: Theme.PrimaryText}]}
              numberOfLines={2}>
              {item.listName}
            </Text>

            <Text style={[styles.count, {color: Theme.SecondaryText}]}>
              {item.noOfStories} {item.noOfStories === 1 ? 'story' : 'stories'}
            </Text>
          </View>
        </Pressable>
      );
    },
    [],
  );

  return (
    <BottomSheetFlatList
      data={data}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => renderList({item, storyId: storyId as string})}
      ListHeaderComponent={() => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[
                {color: Theme.PrimaryText, alignSelf: 'center'},
                styles.heading,
              ]}>
              Save to Reading List
            </Text>
            <Pressable
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={onCreateNewPress}>
              <AntDesign name="plus" size={24} color="#5f27cd" />
            </Pressable>
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
      ListFooterComponent={() => <View style={styles.seperator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.Padding.Normal,
  },
  heading: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 19,
    marginBottom: Spacing.Margin.Normal,
    marginTop: Spacing.Margin.Large,
  },
  emptyHeading: {
    fontSize: 19,
    alignSelf: 'center',
    marginBottom: Spacing.Margin.Small,
  },
  emptyCont: {
    paddingTop: Spacing.Padding.Large * 2,
  },
  emptyBtn: {
    borderRadius: 7,
    paddingVertical: Spacing.Padding.Normal * 0.5,
    paddingHorizontal: Spacing.Padding.Large * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B33771',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  emptyBtnText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  thumb: {
    borderRadius: 7,
    marginRight: Spacing.Margin.Normal,
    width: '40%',
    aspectRatio: 2,
  },
  listName: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 17,
    maxWidth: '50%',
  },
  count: {
    fontSize: 15,
    fontWeight: '300',
    marginTop: Spacing.Margin.Small,
  },
  seperator: {
    width: '100%',
    height: Spacing.Padding.Normal,
  },
});

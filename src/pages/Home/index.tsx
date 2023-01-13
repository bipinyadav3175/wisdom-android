import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {emitter} from '../../NavPages/BottomNav';
import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import axios from 'axios';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

// Portal
import {Portal} from '@gorhom/portal';

import AuthContext from '../../contexts/AuthContext';
import ListContext from '../../contexts/ListContext';
import StreakContext from '../../contexts/StreakContext';

import CONSTANTS from '../../../CONSTANTS';

import ThemeContext from '../../contexts/ThemeContext';

// Header
import HeaderHome from '../../components/HeaderHome';

// Article Item
import ArticleItem from '../../components/ArticleItem';
import {Spacing} from '../../../theme';

// Event emitter
import ArticleEmitter from '../../EventEmitters/ArticleEmitter';

import {useFocusEffect} from '@react-navigation/native';

// BottomSheets
import ReadingListBottomSheet1 from '../../components/ReadingListBottomSheet1';
import ReadingListBottomSheet2 from '../../components/ReadingListBottomSheet2';

//Modals
import StreakComplete from '../../components/Modals/StreakComplete';

// Dummy Data
// const data = [
//   {
//     id: 'dfsf23r5453rf43t4334f4',
//     title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
//     bodyPreview:
//       'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
//     publishedOn: 'Mar 12',
//     timeToRead: '9 min read',
//     thumb:
//       'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
//     category: ['Programming', 'Books'],
//     userId: 'sdfdsfdsff43t543$#3r543',
//     userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
//     shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
//     avatar: 'https://i.pravatar.cc/400',
//     likes: 25503,
//     comments: 1122,
//     hasThumb: false,
//   },
//   {
//     id: 'dfsf23r5453rfdsds43t4334f4',
//     title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
//     bodyPreview:
//       'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
//     publishedOn: 'Mar 12',
//     timeToRead: '9 min read',
//     thumb:
//       'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
//     category: ['Programming', 'Books'],
//     userId: 'sdfdsfdsff43t543$#3r543',
//     userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
//     shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
//     avatar: 'https://i.pravatar.cc/400',
//     likes: 25503,
//     comments: 1122,
//     hasThumb: true,
//   },
//   {
//     id: 'dfsf23r545jtrtrj3rf43t4334f4',
//     title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
//     bodyPreview:
//       'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
//     publishedOn: 'Mar 12',
//     timeToRead: '9 min read',
//     thumb:
//       'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
//     category: ['Programming', 'Books'],
//     userId: 'sdfdsfdsff43t543$#3r543',
//     userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
//     shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
//     avatar: 'https://i.pravatar.cc/400',
//     likes: 25503,
//     comments: 1122,
//     hasThumb: true,
//   },
//   {
//     id: 'dfsf23r5453rf43t433jytrjt4f4',
//     title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
//     bodyPreview:
//       'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
//     publishedOn: 'Mar 12',
//     timeToRead: '9 min read',
//     thumb:
//       'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
//     category: ['Programming', 'Books'],
//     userId: 'sdfdsfdsff43t543$#3r543',
//     userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
//     shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
//     avatar: 'https://i.pravatar.cc/400',
//     likes: 25503,
//     comments: 1122,
//     hasThumb: true,
//   },
// ];

type Item = {
  id: string;
  title: string;
  bodyPreview: string | null;
  dateCreated: number;
  timeToRead: string;
  thumb: string | null;
  category: string;
  ownerId: string;
  ownerName: string;
  shortBio: string | null;
  avatar_50: string;
  avatar_200: string;
  likes: number;
  commentCount: number;
  ownerUsername: string;
  isFollowedByYou: boolean;
  isAddedToList: boolean;
  bio: string;
};

type List = {
  id: string;
  listName: string;
  noOfStories: number;
  thumb: null | string;
};

const Home = ({navigation}: {navigation: any}) => {
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const Streak = useContext(StreakContext);

  // Data for reading list 1
  const [allLists, setAllLists] = useState<List[]>([]);
  const [isloadingLists, setIsLoadingLists] = useState(true);
  // const {storyId: id, changeId} = useContext(ListContext);
  // const [id, setId] = useState('');

  const [data, setData] = useState<Item[]>([]);

  // Refresh Control
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data loading on end reached
  const [isLoading, setIsLoading] = useState(false);

  const homeFlatListRef = useRef<FlashList<Item> | null>(null);

  // BottomSheet (reading list)
  const addBottomSheetRef = useRef<BottomSheet>(null);
  const createBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  // Streak Modal
  const [isStreakCompleteModalVisible, setIsStreakCompleteModalVisible] =
    useState(true);

  const renderHomeFeed = useCallback(({item}: {item: Item}) => {
    return (
      <ArticleItem
        data={item}
        onAddToReadingList={id => addToReadingList(id)}
      />
    );
  }, []);

  // Load Stories
  const loadFeed = async (reset: boolean = false) => {
    try {
      const res = await axios.get(`${CONSTANTS.BACKEND_URI}/feed`, {
        headers: {
          Authorization: state.token as string,
        },
      });

      const resData = res.data;

      if (resData.success) {
        if (reset) {
          setData(resData.feed);
        } else {
          setData(oldData => {
            return [...oldData, ...resData.feed];
          });

          setIsLoading(false);
        }
        setIsRefreshing(false);
        setIsLoading(false);
        return;
      }

      setIsRefreshing(false);
      setIsLoading(false);
      return;
    } catch (err) {
      setIsRefreshing(false);
      setIsLoading(false);
      console.log(err);
      return;
    }
  };

  const openBottomSheet = useCallback(() => {
    createBottomSheetRef.current?.close();
    addBottomSheetRef.current?.snapToIndex(0);
    console.log('openBottomSheet function ran');
  }, []);

  const openBottomSheet2 = useCallback(() => {
    addBottomSheetRef.current?.close();
    createBottomSheetRef.current?.snapToIndex(0);
    console.log('openBottomSheet2 function ran');
  }, []);

  const addToReadingList = async (storyId: string) => {
    // changeId(id);
    // changeId(storyId);
    // setId(storyId);
    openBottomSheet();
    console.log('addToReadingList function ran');
  };

  const onNewListCreation = (isCreated: boolean) => {
    Keyboard.dismiss();
    openBottomSheet();
    console.log('onNewListCreation function ran');
  };

  const loadAllLists = async () => {
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
        setAllLists(resData.data);
        setIsLoadingLists(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onListSelection = async (listId: string, storyId: string) => {
    try {
      console.log('Id at alpha function:', storyId);
      const isAdded = await addToListOnServer(listId, storyId);
      console.log('isAdded', isAdded);
      if (isAdded) {
        // let newData = data;
        // const index = newData.findIndex(
        //   val => val.id.toString() === id,
        // );
        // let oldValueOfElement = newData[index];
        // console.log('before', oldValueOfElement);
        // oldValueOfElement.isAddedToList = true;
        // console.log('after', oldValueOfElement);
        // newData[index] = oldValueOfElement;

        setData(oldData => {
          return oldData.map(item => {
            if (item.id.toString() !== storyId) {
              return item;
            }

            return {...item, isAddedToList: true};
          });
        });

        // for (let i = 0; i < data.length; i++) {
        //   console.log('in loop');
        //   let story = data[i];
        //   if (story.id === id) {
        //     let a = story;
        //     a.isAddedToList = isAdded;
        //     newData.push(a);
        //   } else {
        //     newData.push(story);
        //   }
        // }
        // setData(newData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addToListOnServer = async (listId: string, id: string) => {
    console.log('from the request sending function : story Id =', id);
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/add-story-to-list`,
        {
          storyId: id as string,
          listId,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      if (resData.message) {
        console.log(resData.message);
      }
      if (resData.success) {
        // To tell articleItem that that item is added to a list and show the bookmark
        ArticleEmitter.emit('added-to-list', [
          {
            storyId: id as string,
          },
        ]);

        addBottomSheetRef.current?.close();

        // Show message to the user that the story is added to list
        Toast.show({
          type: 'success',
          text1: `Added to list ${resData.listName}`,
        });

        return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // Display Streak Complete Modal
  // When a screen comes into focus useFocusEffect is called
  // By the mercy of react navigation / native
  useFocusEffect(
    useCallback(() => {
      setIsStreakCompleteModalVisible(Streak.shouldShowCompleteModal);
    }, [Streak.shouldShowCompleteModal]),
  );

  // Load Stories
  useEffect(() => {
    const subscribtion = emitter.addListener('home-tab-pressed', () => {
      homeFlatListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    });
    loadFeed();

    return () => {
      subscribtion.remove();
      setData([]);
    };
  }, []);

  // useEffect(() => {
  //   console.log('Id changed:', id);
  // }, [id]);

  return (
    <>
      <View style={{backgroundColor: Theme.PrimaryBackground, flex: 1}}>
        <HeaderHome />
        <FlashList
          ref={homeFlatListRef}
          data={data}
          renderItem={renderHomeFeed}
          estimatedItemSize={200}
          // initialNumToRender={4}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 5,
                backgroundColor: 'rgb(207, 212, 219)',
                marginVertical: Spacing.Margin.Normal,
                // marginTop: Spacing.Margin.Large,
              }}
            />
          )}
          ListFooterComponent={() => (
            <View
              style={{
                width: '100%',
                height: Spacing.Margin.Large,
                paddingVertical: Spacing.Padding.Large * 3,
              }}>
              <ActivityIndicator
                color="#4b7bec"
                animating={isLoading}
                size={35}
                // style={{display: isLoading ? 'flex' : 'none'}}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={{width: '100%', height: Spacing.Margin.Large}} />
          )}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            loadFeed(true);
          }}
          keyExtractor={(item, index) => item.id + '-' + index}
          onEndReached={() => {
            setIsLoading(true);
            loadFeed();
          }}
          onEndReachedThreshold={1}
        />
      </View>

      <Portal>
        {/* Normal add to reading list sheet */}
        <BottomSheet
          snapPoints={snapPoints}
          ref={addBottomSheetRef}
          index={-1}
          onChange={index => {
            if (index === 0) {
              setIsLoadingLists(true);
              loadAllLists();
            }
          }}
          backgroundStyle={{
            backgroundColor:
              type === 'dark' ? 'rgb(10,20,26)' : Theme.PrimaryBackground,
          }}
          handleIndicatorStyle={{backgroundColor: Theme.Placeholder}}
          enablePanDownToClose>
          {/* <Text style={{color: '#fff'}}>{id}</Text> */}
          <ReadingListBottomSheet1
            isLoading={isloadingLists}
            onCreateNewPress={() => openBottomSheet2()}
            data={allLists}
            onListSelection={onListSelection}
          />
        </BottomSheet>

        {/* Sheet to crete new list */}
        <BottomSheet
          // onClose={openBottomSheet}
          snapPoints={snapPoints}
          ref={createBottomSheetRef}
          index={-1}
          backgroundStyle={{
            backgroundColor:
              type === 'dark' ? 'rgb(10,20,26)' : Theme.PrimaryBackground,
          }}
          handleIndicatorStyle={{backgroundColor: Theme.Placeholder}}
          enablePanDownToClose>
          {/* <Text style={{color: '#fff'}}>{id}</Text> */}
          <ReadingListBottomSheet2
            onCancel={() => openBottomSheet()}
            onCreate={isCreated => onNewListCreation(isCreated)}
          />
        </BottomSheet>
      </Portal>

      <StreakComplete
        visible={isStreakCompleteModalVisible}
        onContinue={() => {
          setIsStreakCompleteModalVisible(false);
          Streak.streakCompleteModalShown();
        }}
      />
    </>
  );
};

export default Home;
export type {Item};

// <View style={{width: "100%", height: Spacing.Margin.Large * 2}} />

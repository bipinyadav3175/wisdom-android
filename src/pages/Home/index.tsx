import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {emitter} from '../../NavPages/BottomNav';
import React, {useEffect, useContext, useState, useRef} from 'react';
import axios from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import AuthContext from '../../contexts/AuthContext';

import CONSTANTS from '../../../CONSTANTS';

import ThemeContext from '../../contexts/ThemeContext';

// Header
import HeaderHome from '../../components/HeaderHome';

// Article Item
import ArticleItem from '../../components/ArticleItem';
import {Spacing} from '../../../theme';

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
  avatar: string;
  likes: number;
  commentCount: number;
  ownerUsername: string;
};

const renderHomeFeed = ({item}: {item: Item}) => {
  return <ArticleItem data={item} />;
};

const Home = ({navigation}: {navigation: any}) => {
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);

  const [data, setData] = useState<Item[]>([]);

  // Refresh Control
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data loading on end reached
  const [isLoading, setIsLoading] = useState(false);

  const homeFlatListRef = useRef<FlatList | null>(null);

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

  return (
    <View style={{backgroundColor: Theme.PrimaryBackground, flex: 1}}>
      <HeaderHome />
      <FlatList
        ref={homeFlatListRef}
        data={data}
        renderItem={renderHomeFeed}
        initialNumToRender={4}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor:
                type === 'dark' ? 'rgb(47,57,63)' : 'rgb(230, 230, 230)',
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
  );
};

export default Home;
export type {Item};

// <View style={{width: "100%", height: Spacing.Margin.Large * 2}} />

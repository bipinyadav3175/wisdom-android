import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';

import CONSTANTS from '../../../CONSTANTS';
import AuthContext from '../../contexts/AuthContext';

import HeaderProfile from '../../components/HeaderProfile';
//
import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
//
import ArticleItem from '../../components/ArticleItem';

// Dummy Data
const data = [
  {
    id: 'dfsf23r5453rf43t4334f4',
    title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
    bodyPreview:
      'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
    publishedOn: 'Mar 12',
    timeToRead: '9 min read',
    thumb:
      'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
    category: ['Programming', 'Books'],
    userId: 'sdfdsfdsff43t543$#3r543',
    userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
    shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
    avatar: 'https://i.pravatar.cc/400',
    likes: 25503,
    commentCount: 1122,
    hasThumb: false,
  },
  {
    id: 'dfsf23r5453rfdsds43t4334f4',
    title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
    bodyPreview:
      'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
    publishedOn: 'Mar 12',
    timeToRead: '9 min read',
    thumb:
      'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
    category: ['Programming', 'Books'],
    userId: 'sdfdsfdsff43t543$#3r543',
    userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
    shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
    avatar: 'https://i.pravatar.cc/400',
    likes: 25503,
    commentCount: 1122,
    hasThumb: true,
  },
  {
    id: 'dfsf23r545jtrtrj3rf43t4334f4',
    title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
    bodyPreview:
      'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
    publishedOn: 'Mar 12',
    timeToRead: '9 min read',
    thumb:
      'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
    category: ['Programming', 'Books'],
    userId: 'sdfdsfdsff43t543$#3r543',
    userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
    shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
    avatar: 'https://i.pravatar.cc/400',
    likes: 25503,
    commentCount: 1122,
    hasThumb: true,
  },
  {
    id: 'dfsf23r5453rf43t433jytrjt4f4',
    title: 'Top 10 Books a Software Developer Must Read IT REALLY HELPS',
    bodyPreview:
      'A continuous learning mindset is a key quality of a software developer who wants to stay relevant and grow their market value. Vectorly has prepared a list of 20 most popular books on software engineering to help you with that.',
    publishedOn: 'Mar 12',
    timeToRead: '9 min read',
    thumb:
      'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
    category: ['Programming', 'Books'],
    userId: 'sdfdsfdsff43t543$#3r543',
    userName: 'John Doe kbkjb u bujbii kbb guig ggj h ubuibi j ',
    shortBio: 'Works at Google bhj ujb uibuhuj uhu ujhbjbuihgu uhuhkj uhuuj b',
    avatar: 'https://i.pravatar.cc/400',
    likes: 25503,
    commentCount: 1122,
    hasThumb: true,
  },
];

type Item = {
  id: string;
  title: string;
  bodyPreview: string;
  timeToRead: string;
  thumb: string;
  category: string;
  ownerId: string;
  ownerName: string;
  avatar: string;
  likes: number;
  commentCount: number;
  ownerUsername: string;
  shortBio: string;
  dateCreated: number;
  avatar_50: string;
  avatar_200: string;
  isFollowedByYou: boolean;
};

const renderUserProfileFeed = ({item}: {item: Item}) => {
  return <ArticleItem data={item} showFollowBtn={false} />;
};

// Header for flatlist
const FlatListHeader = ({data}: {data: User}) => {
  const {Theme} = useContext(ThemeContext);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <HeaderProfile
        Theme={Theme}
        avatar={data.avatar}
        followerCount={data.followerCount}
        followingCount={data.followingCount}
        storyViews={data.storyViews}
        isFollowedByYou={data.isFollowedByYou}
      />

      {/* Name and bio */}
      <View style={styles.bioCont}>
        <View style={styles.nameCont}>
          <Text style={[styles.name, {color: Theme.PrimaryText}]}>
            {data.name}
          </Text>
          <Text style={[styles.userName, {color: Theme.SecondaryText}]}>
            @{data.username}
          </Text>
        </View>

        <Text style={[styles.bio, {color: Theme.PrimaryText}]}>{data.bio}</Text>
      </View>

      <Text style={[styles.recent, {color: Theme.PrimaryText}]}>
        Recent Stories
      </Text>
    </>
  );
};

type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  storyViews: number;
  followerCount: number;
  followingCount: number;
  bio: string;
  isFollowedByYou: boolean;
};

const UserProfile = ({route}: {route: any}) => {
  const [isLoading, setIsLoading] = useState(true);
  const {Theme, type} = useContext(ThemeContext);
  const id = route.params.id;
  const [user, setUser] = useState<User | null>(null);
  const [recent, setRecent] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {state} = useContext(AuthContext);

  const loadRecent = async () => {
    try {
      const res = await axios.get(
        `${CONSTANTS.BACKEND_URI}/user-recent-stories/${id}`,
        {
          headers: {
            Authorization: state.token as string,
          },
          params: {
            loaded: !recent ? 0 : recent.length,
          },
        },
      );

      const data = res.data;

      if (data.success) {
        setIsLoading(false);
        if (recent) {
          setRecent(oldData => {
            return [...oldData, ...data.stories];
          });
        } else {
          setRecent(data.stories as Item[]);
        }
        setHasMore(data.hasMore as boolean);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(`${CONSTANTS.BACKEND_URI}/user/${id}`, {
          headers: {
            Authorization: state.token as string,
          },
        });

        const data = res.data;
        if (data.success) {
          setUser(data.data as User);
          // console.log(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadRecent();

    init();

    return () => {
      setUser(null);
      setRecent([]);
    };
  }, []);

  if (!user || !recent) {
    return (
      <View>
        <Text style={{color: Theme.PrimaryText}}>Loading</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
      <FlatList
        data={recent}
        renderItem={renderUserProfileFeed}
        ListHeaderComponent={<FlatListHeader data={user as User} />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: Theme.Placeholder,
              marginVertical: Spacing.Margin.Large,
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
        onEndReached={() => {
          if (hasMore) {
            setIsLoading(true);
            loadRecent();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  followCont: {
    marginTop: 60, // Half of header profile width
    paddingLeft: 145, // 120 image width and 25 left property in profile  header
    paddingRight: Spacing.Padding.Large,
    width: '100%',
  },
  followBtn: {
    width: '70%',
    borderRadius: 5,
    backgroundColor: '#9980FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 10,
    alignSelf: 'center',
  },
  followText: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 16,
  },
  bioCont: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Normal,
    marginBottom: 35,
    marginTop: 20,
  },
  name: {
    fontFamily: CustomFonts.Ubuntu.Bold,
    fontSize: 15,
    marginRight: Spacing.Margin.Small,
  },
  userName: {
    fontSize: 11,
  },
  bio: {
    fontSize: 13,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  recent: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: Spacing.Padding.Normal,
  },
});

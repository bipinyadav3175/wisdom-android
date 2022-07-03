import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import CONSTANTS from '../../../CONSTANTS';
import AuthContext from '../../contexts/AuthContext';

import HeaderProfile from '../../components/HeaderProfile';
//
import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
//
import ArticleItem from '../../components/ArticleItem';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

type Item = {
  id: string;
  title: string;
  bodyPreview: string;
  timeToRead: string;
  thumb: string;
  category: string;
  ownerId: string;
  ownerName: string;
  avatar_50: string;
  avatar_200: string;
  likes: number;
  commentCount: number;
  ownerUsername: string;
  shortBio: string;
  dateCreated: number;
  isFollowedByYou: boolean;
};

// Header for flatlist
const FlatListHeader = ({data}: {data: User}) => {
  const {Theme} = useContext(ThemeContext);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <View style={{width: '100%', height: 20}}></View>
      <HeaderProfile
        Theme={Theme}
        avatar_200={data.avatar_200}
        avatar_50={data.avatar_50}
        followerCount={data.followerCount}
        followingCount={data.followingCount}
        storyViews={data.storyViews}
        self={true}
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
        Your Stories
      </Text>
    </>
  );
};

type User = {
  id: string;
  name: string;
  username: string;
  avatar_50: string;
  avatar_200: string;
  banner: string;
  storyViews: number;
  followerCount: number;
  followingCount: number;
  bio: string;
  isFollowedByYou: boolean;
};

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {Theme, type} = useContext(ThemeContext);
  const [user, setUser] = useState<User | null>(null);
  const [recent, setRecent] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {state, logout} = useContext(AuthContext);
  const id = state.id;

  const deleteStory = async (id: string) => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/delete-story`,
        {
          id,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;
      ToastAndroid.show(resData?.message as string, ToastAndroid.SHORT);

      if (resData.success) {
        // Update the state
        setRecent(oldRecent => {
          return oldRecent.filter(
            story => story.id !== resData?.deletedStoryId,
          );
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderUserProfileFeed = ({item}: {item: Item}) => {
    return (
      <ArticleItem
        data={item}
        showFollowBtn={false}
        self={true}
        onStoryDelete={deleteStory}
      />
    );
  };

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

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // signOut();
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
  editCont: {
    marginTop: 60, // Half of header profile width
    paddingLeft: 145, // 120 image width and 25 left property in profile  header
    paddingRight: Spacing.Padding.Large,
    width: '100%',
  },
  editBtn: {
    width: '70%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  followText: {
    fontFamily: CustomFonts.Ubuntu.Regular,
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

// const signOut = async () => {
//   try {
//     await GoogleSignin.signOut();
//     await logout();
//   } catch (error) {
//     console.error(error);
//   }
// };

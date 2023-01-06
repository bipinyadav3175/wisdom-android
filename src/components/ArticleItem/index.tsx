import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

//
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';
import ListContext from '../../contexts/ListContext';

import {CustomFonts, Spacing} from '../../../theme';
// Custom Hooks
import useImageAspectRatio from '../../utils/AspectRatio';

import numberFormatter from '../../utils/numberFormatter';
import timeFormatter from '../../utils/timeFormatter';
// Types
import type {Item} from '../../pages/Home';
import CONSTANTS from '../../../CONSTANTS';

// Event emitter
import ArticleEmitter from '../../EventEmitters/ArticleEmitter';

const deviceWidth = Dimensions.get('window').width;
const thumbWidth = deviceWidth - 2 * Spacing.Padding.Normal;

type NavigationType = {
  navigate: (name: string, params?: object) => void;
};

const ArticleItem = ({
  data,
  showFollowBtn,
  self,
  onStoryDelete,
  onAddToReadingList,
}: {
  data: Item;
  showFollowBtn?: boolean;
  self: boolean;
  onStoryDelete?: (id: string) => void;
  onAddToReadingList?: (id: string) => void;
}) => {
  // For flash list issues
  // Flash list reuses the same components
  // For reference: https://shopify.github.io/flash-list/docs/recycling
  const lastItemId = useRef(data.id);

  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const {changeId} = useContext(ListContext);
  const [isFollowedByYou, setIsFollowedByYou] = useState(data.isFollowedByYou);
  const [isAddedToReadingList, setIsAddedToReadingList] = useState(
    data.isAddedToList,
  );
  const [date, setDate] = useState(timeFormatter(data.dateCreated));

  // Flash list anti bug code
  // For reference: https://shopify.github.io/flash-list/docs/recycling
  if (data.id !== lastItemId.current) {
    // Prevents infite loop
    lastItemId.current = data.id;

    setIsFollowedByYou(data.isFollowedByYou);
    setIsAddedToReadingList(data.isAddedToList);
    setDate(timeFormatter(data.dateCreated));
  }

  // Calculate height for thumb
  const calculateHeight = useCallback(
    (width: number, aspectRatio: number) => {
      const height = width / aspectRatio;
      const maxHeight = thumbWidth * 1.4;
      if (height >= maxHeight) {
        return maxHeight;
      }
      return height;
    },
    [data.id],
  );

  var aspectRatio;
  var thumbHeight;
  aspectRatio = useImageAspectRatio(data.thumb as string);
  if (data.thumb) {
    thumbHeight = calculateHeight(thumbWidth, aspectRatio);
  }

  const navigation = useNavigation<NavigationType>();

  const FollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/follow`,
        {
          id: data.ownerId.toString(),
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
        setIsFollowedByYou(resData?.isFollowedByYou);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  // useEffect(() => {
  //   if (!bookmarked) {
  //     return;
  //   }

  //   if (bookmarked.includes(data.id)) {
  //     setIsAddedToReadingList(true);
  //     return;
  //   }
  //   setIsAddedToReadingList(false);
  // }, bookmarked);

  useEffect(() => {
    async function init() {
      // console.log(data.id);
      // await AsyncStorage.setItem(STORAGE_KEY.THEME, 'dark');
      ArticleEmitter.addListener(
        'added-to-list',
        (info: [{storyId: string}]) => {
          const storyId = info[0].storyId;

          if (storyId === data.id) {
            setIsAddedToReadingList(true);
          }
        },
      );
    }

    init();

    return () => {
      ArticleEmitter.removeAllListeners();
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.userCont}>
          <Pressable
            style={styles.bioCont}
            onPress={() => {
              navigation.navigate('UserProfile', {id: data.ownerId});
            }}>
            <Image source={{uri: data.avatar_50}} style={styles.avatar} />

            <View style={styles.basicDetailCont}>
              <View style={{justifyContent: 'center'}}>
                <Text
                  style={[styles.name, {color: Theme.PrimaryText}]}
                  numberOfLines={1}>
                  {data.ownerName}
                  <Text
                    style={{
                      fontSize: 14,
                      color: Theme.SecondaryText,
                      fontFamily: CustomFonts.SSP.Regular,
                    }}>
                    {' '}
                    • {date} ago
                  </Text>
                </Text>

                <Text
                  style={[styles.bio, {color: Theme.SecondaryText}]}
                  numberOfLines={1}>
                  {data.bio}
                </Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            onPress={() => onStoryDelete?.(data.id)}
            style={{display: self ? 'flex' : 'none'}}>
            <AntDesign name="delete" size={18} color={Theme.SecondaryText} />
          </Pressable>
          <Pressable
            onPressIn={FollowOrUnfollow}
            style={[
              styles.followBtn,
              {display: showFollowBtn ? 'flex' : 'none'},
            ]}>
            <Text
              style={[
                styles.followText,
                {
                  color: isFollowedByYou
                    ? Theme.SecondaryText
                    : Theme.PrimaryText,
                },
              ]}>
              {isFollowedByYou ? 'Unfollow' : 'Follow'}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate('ReadingPage', {id: data.id})}>
          <Text
            style={[styles.title, {color: Theme.PrimaryText}]}
            numberOfLines={3}>
            {data.title}
          </Text>

          {data.thumb ? (
            <View
              style={{
                width: '100%',
                paddingHorizontal: Spacing.Padding.Normal,
              }}>
              <Image
                source={{uri: data.thumb}}
                style={[
                  styles.thumbImage,
                  {width: thumbWidth, height: thumbHeight},
                ]}
                resizeMethod="scale"
              />
            </View>
          ) : (
            <Text
              style={[styles.bPreview, {color: Theme.SecondaryText}]}
              numberOfLines={5}>
              {data.bodyPreview}
            </Text>
          )}

          <View style={styles.bottomCont}>
            <Text style={[styles.statText, {color: Theme.SecondaryText}]}>
              {numberFormatter(data.likes)} likes •{' '}
              {numberFormatter(data.commentCount)} comments • {data.timeToRead}{' '}
              min read
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={async () => {
                  await changeId(data.id);
                  onAddToReadingList?.(data.id);
                  // setIsAddedToReadingList(isAdded);
                }}>
                <Ionicons
                  name="bookmark"
                  size={20}
                  // color={Theme.SecondaryText}
                  color={Theme.Red}
                  style={{display: isAddedToReadingList ? 'flex' : 'none'}}
                />
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={Theme.SecondaryText}
                  style={{display: isAddedToReadingList ? 'none' : 'flex'}}
                />
              </Pressable>

              {/* <Pressable style={{marginLeft: Spacing.Margin.Normal}}>
                <Entypo
                  name="dots-three-horizontal"
                  size={22}
                  color={Theme.SecondaryText}
                />
              </Pressable> */}
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
};

ArticleItem.defaultProps = {
  showFollowBtn: true,
  self: false,
};

export default ArticleItem;

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  userCont: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Test
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: Theme.LightGray,
    // paddingBottom: 5,
  },
  bioCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: Spacing.Margin.Small,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdc3c7',
  },
  basicDetailCont: {
    maxWidth: 0.65 * deviceWidth,
  },
  name: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 15,
    marginRight: 10,
  },
  bio: {
    fontSize: 12,
  },
  followBtn: {
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  followText: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 15,
  },
  thumbImage: {
    maxHeight: thumbWidth * 1.4,
    marginTop: Spacing.Margin.Small,
    alignSelf: 'center',
    borderRadius: 13, // 13 seems better than 5
  },
  title: {
    width: '100%',
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 17,
    paddingHorizontal: Spacing.Padding.Normal,
    marginTop: Spacing.Margin.Small,
  },
  bottomCont: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  statText: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 14,
  },
  bPreview: {
    fontSize: 15,
    paddingHorizontal: Spacing.Padding.Normal,
  },
});

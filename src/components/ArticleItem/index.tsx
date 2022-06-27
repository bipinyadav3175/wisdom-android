import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

//
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

import {CustomFonts, Spacing} from '../../../theme';
// Custom Hooks
import useImageAspectRatio from '../../utils/AspectRatio';

import numberFormatter from '../../utils/numberFormatter';
// Types
import type {Item} from '../../pages/Home';
import CONSTANTS from '../../../CONSTANTS';
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
}: {
  data: Item;
  showFollowBtn?: boolean;
  self: boolean;
  onStoryDelete?: (id: string) => void;
}) => {
  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const [isFollowedByYou, setIsFollowedByYou] = useState(data.isFollowedByYou);

  var aspectRatio;
  var thumbHeight;
  if (data.thumb) {
    aspectRatio = useImageAspectRatio(data.thumb as string);
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

  useEffect(() => {
    async function init() {
      // await AsyncStorage.setItem(STORAGE_KEY.THEME, 'dark');
    }

    init();

    return () => {};
  }, []);

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
      maxWidth: 0.6 * deviceWidth,
    },
    name: {
      fontFamily: CustomFonts.Ubuntu.Bold,
      fontSize: 15,
      color: Theme.PrimaryText,
      marginRight: 10,
    },
    username: {
      fontSize: 12,
      color: Theme.Placeholder,
    },
    bio: {
      fontSize: 11,
      color: Theme.SecondaryText,
    },
    followBtn: {
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Theme.Placeholder,
    },
    followText: {
      fontFamily: CustomFonts.Ubuntu.Regular,
      fontSize: 15,
      color: Theme.PrimaryText,
    },
    thumbImage: {
      maxHeight: thumbWidth,
      marginTop: Spacing.Margin.Small,
      alignSelf: 'center',
      borderRadius: 13, // 13 seems better than 5
    },
    title: {
      width: '100%',
      fontFamily: CustomFonts.Ubuntu.Medium,
      fontSize: 17,
      paddingHorizontal: Spacing.Padding.Normal,
      color: Theme.PrimaryText,
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
      color: Theme.SecondaryText,
      fontSize: 11,
    },
    bPreview: {
      color: Theme.SecondaryText,
      fontSize: 15,
      paddingHorizontal: Spacing.Padding.Normal,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.userCont}>
        <Pressable
          style={styles.bioCont}
          onPress={() => {
            navigation.navigate('UserProfile', {id: data.ownerId});
          }}>
          <Image source={{uri: data.avatar_50}} style={styles.avatar} />

          <View style={styles.basicDetailCont}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.name} numberOfLines={1}>
                {data.ownerName}
              </Text>

              <Text style={styles.username} numberOfLines={1}>
                @{data.ownerUsername}
              </Text>
            </View>
            <Text style={styles.bio} numberOfLines={1}>
              {data.shortBio}
            </Text>
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
          <Text style={styles.followText}>
            {isFollowedByYou ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate('ReadingPage', {id: data.id})}>
        <Text style={styles.title} numberOfLines={3}>
          {data.title}
        </Text>

        {data.thumb ? (
          <View
            style={{width: '100%', paddingHorizontal: Spacing.Padding.Normal}}>
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
          <Text style={styles.bPreview} numberOfLines={5}>
            {data.bodyPreview}
          </Text>
        )}

        <View style={styles.bottomCont}>
          <Text style={styles.statText}>
            {numberFormatter(data.likes)} likes •{' '}
            {numberFormatter(data.commentCount)} comments • {data.timeToRead}{' '}
            min read
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable>
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={Theme.SecondaryText}
              />
            </Pressable>

            <Pressable style={{marginLeft: Spacing.Margin.Normal}}>
              <Entypo
                name="dots-three-horizontal"
                size={22}
                color={Theme.SecondaryText}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

ArticleItem.defaultProps = {
  showFollowBtn: true,
  self: false,
};

export default ArticleItem;

const calculateHeight = (width: number, aspectRatio: number) => {
  const height = width / aspectRatio;
  if (height >= thumbWidth) {
    return thumbWidth;
  }
  return height;
};

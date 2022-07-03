import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import type {Theme} from '../../utils/Theme';
import {CustomFonts, Spacing} from '../../../theme';
import numberFormatter from '../../utils/numberFormatter';
import CONSTANTS from '../../../CONSTANTS';
import AuthContext from '../../contexts/AuthContext';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const deviceWidth = Dimensions.get('window').width;

const HeaderProfile = ({
  Theme,
  avatar_50,
  avatar_200,
  storyViews,
  followerCount,
  followingCount,
  self,
  isFollowedByYou,
  userId,
}: {
  Theme: Theme;
  avatar_50: string;
  avatar_200: string;
  storyViews: number;
  followerCount: number;
  followingCount: number;
  self: boolean;
  isFollowedByYou: boolean;
  userId?: string;
}) => {
  const navigation = useNavigation();
  const [isFollowed, setIsFollowed] = useState(isFollowedByYou);
  const {state} = useContext(AuthContext);

  const FollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/follow`,
        {
          id: userId as string,
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
        setIsFollowed(resData?.isFollowedByYou);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Image source={{uri: avatar_200}} style={styles.avatar} />
        <View style={styles.rightBox}>
          <View style={styles.statBox}>
            <View style={styles.textBox}>
              <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
                Story views
              </Text>
              <Text style={[styles.count, {color: Theme.PrimaryText}]}>
                {numberFormatter(storyViews)}
              </Text>
            </View>

            <View style={styles.textBox}>
              <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
                Followers
              </Text>
              <Text style={[styles.count, {color: Theme.PrimaryText}]}>
                {numberFormatter(followerCount)}
              </Text>
            </View>

            <View style={styles.textBox}>
              <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
                Following
              </Text>
              <Text style={[styles.count, {color: Theme.PrimaryText}]}>
                {numberFormatter(followingCount)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={FollowOrUnfollow}
            style={[
              styles.followBtn,
              {
                display: self ? 'none' : 'flex',
                backgroundColor: isFollowed
                  ? Theme.PrimaryBackground
                  : '#0984e3',
                borderColor: isFollowed ? Theme.Placeholder : undefined,
                borderWidth: isFollowed ? StyleSheet.hairlineWidth : 0,
              },
            ]}>
            <Text
              style={[
                styles.fText,
                {color: isFollowed ? Theme.PrimaryText : '#ffffff'},
              ]}>
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.editBtn,
              {borderColor: Theme.Placeholder, display: self ? 'flex' : 'none'},
            ]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('EditProfile');
            }}>
            <Text style={[styles.editText, {color: Theme.PrimaryText}]}>
              Edit Proifle
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

HeaderProfile.defaultProps = {
  self: false,
  isFollowedByYou: false,
};

export default HeaderProfile;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  rightBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textBox: {
    marginHorizontal: Spacing.Margin.Small,
    alignItems: 'center',
  },
  heading: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 14,
  },
  count: {
    fontSize: 15,
  },
  followBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    width: '70%',
    borderRadius: 5,
  },
  fText: {
    fontSize: 17,
    fontWeight: '600',
  },
  editBtn: {
    width: '70%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  editText: {
    fontSize: 17,
    fontWeight: '600',
  },
});

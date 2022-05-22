import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import type {Theme} from '../../utils/Theme';
import {CustomFonts, Spacing} from '../../../theme';
import numberFormatter from '../../utils/numberFormatter';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const deviceWidth = Dimensions.get('window').width;

const HeaderProfile = ({
  Theme,
  avatar,
  storyViews,
  followerCount,
  followingCount,
  self,
  isFollowedByYou,
}: {
  Theme: Theme;
  avatar: string;
  storyViews: number;
  followerCount: number;
  followingCount: number;
  self: boolean;
  isFollowedByYou: boolean;
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Image source={{uri: avatar}} style={styles.avatar} />
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
            style={[
              styles.followBtn,
              {
                display: self ? 'none' : 'flex',
                backgroundColor: isFollowedByYou
                  ? Theme.PrimaryBackground
                  : '#0984e3',
                borderColor: isFollowedByYou ? Theme.Placeholder : undefined,
                borderWidth: isFollowedByYou ? StyleSheet.hairlineWidth : 0,
              },
            ]}>
            <Text
              style={[
                styles.fText,
                {color: isFollowedByYou ? Theme.PrimaryText : '#ffffff'},
              ]}>
              {isFollowedByYou ? 'Unfollow' : 'Follow'}
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
    fontSize: 16,
  },
  count: {
    fontSize: 18,
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

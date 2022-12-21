import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useEffect, useContext, useState, useRef, useMemo} from 'react';
import axios from 'axios';
import KeepAwake from 'react-native-keep-awake';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {CustomFonts, Spacing} from '../../../theme';
import ThemeContext from '../../contexts/ThemeContext';

import CONSTANTS from '../../../CONSTANTS';
import AuthContext from '../../contexts/AuthContext';
import numberFormatter from '../../utils/numberFormatter';

// Bottom Sheet for comments
import CommentsNav from '../../NavPages/CommentsNav';
import BottomSheet from '@gorhom/bottom-sheet';

// Components
import Paragraph from './Paragraph';
import Heading from './Heading';

const storyData = [
  {
    type: 'P',
    markup: null,
    id: 'dfds34r5',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore repudiandae recusandae nemo inventore quos, laborum error aspernatur nihil facilis sapiente?',
    url: null,
    aspectRatio: null,
  },
  {
    type: 'IMG',
    markup: null,
    id: 'dhfh434r5',
    content: null,
    url: 'https://i.picsum.photos/id/120/1000/1000.jpg?hmac=OnODzNmmO91Lp4FDGYWMAts6SNOYeTVO534UdctkP8g',
    aspectRatio: 1,
  },
  {
    type: 'P',
    markup: null,
    id: 'dfds64h5',
    content:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae atque nihil repellendus laboriosam, cumque itaque non illum aliquam quo minus obcaecati! Incidunt at aliquam non consectetur ad ea mollitia eos obcaecati tempora accusamus dolorem unde sequi perferendis quisquam perspiciatis, officiis nemo iusto harum, reprehenderit sit ipsam corrupti nesciunt sint? Reiciendis dolorum quasi eveniet dicta nostrum enim, similique ipsam ipsum velit.',
    url: null,
    aspectRatio: null,
  },
  {
    type: 'P',
    markup: null,
    id: 'df8764gegy',
    content:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut repudiandae sapiente aspernatur corporis autem magnam harum nesciunt expedita! Aperiam dolorem accusantium provident voluptatum commodi fuga adipisci mollitia illo. Doloremque molestiae possimus ipsa. Veniam amet, sunt alias iure facilis dignissimos itaque. Magnam temporibus ratione dicta provident.',
    url: null,
    aspectRatio: null,
  },
];

type StoryData = {
  id: string;
  type: string;
  markup: [] | null;
  content: string | null;
  url: string | null;
  aspectRatio: number | null;
  itemId: string;
};

type Story = {
  id: string;
  owner: {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatars: {
      avatar_50: string;
      avatar_200: string;
    };
  };
  status: {
    isFollowedByYou: boolean;
    isLiked: boolean;
  };
  title: string;
  dateCreated: number;
  tags: string[];
  category: string;
  likes: number;
  commentCount: number;
  data: StoryData[];
};

const ReadingPage = ({route}: {route: any}) => {
  const {id} = route.params; // For future purpose (it is the id of the clicked story | article)
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const [data, setData] = useState<Story>();
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isFollowedByYou, setIsFollowedByYou] = useState(false);

  // Bottom Sheet
  const bs = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [500, '100%'], []);

  const FollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/follow`,
        {
          id: data?.owner.id as string,
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

  const likeStory = async () => {
    try {
      const res = await axios.get(`${CONSTANTS.BACKEND_URI}/like/${id}`, {
        headers: {
          Authorization: state.token as string,
        },
      });

      const resData = res.data;
      if (resData.success) {
        setIsLiked(resData.liked);

        if (resData.liked) {
          setLikes(likes + 1);
        } else {
          setLikes(likes - 1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    KeepAwake.activate();
    async function init() {
      try {
        const res = await axios.get(`${CONSTANTS.BACKEND_URI}/story/${id}`, {
          headers: {
            Authorization: state.token as string,
          },
        });

        const resData = res.data;

        if (resData.success) {
          setData(resData?.story);
          setIsLiked(resData?.isLiked as boolean);
          setLikes(resData?.story?.likes as number);
          setIsFollowedByYou(resData?.story?.isFollowedByYou as boolean);
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }

    init();

    return () => {
      KeepAwake.deactivate();
      setData(undefined);
    };
  }, []);

  if (loading && !data) {
    return <View />;
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
        <Text style={[styles.title, {color: Theme.PrimaryText}]}>
          {data?.title}
        </Text>

        <View style={styles.userInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: data?.owner.avatars.avatar_50}}
              style={styles.avatar}
            />

            <View style={{maxWidth: '85%'}}>
              <Text
                numberOfLines={1}
                style={[styles.userName, {color: Theme.PrimaryText}]}>
                {data?.owner.name}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.bio, {color: Theme.SecondaryText}]}>
                {data?.owner.bio}
              </Text>
            </View>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Pressable
              onPress={FollowOrUnfollow}
              style={[
                styles.followBtn,
                {
                  backgroundColor: isFollowedByYou
                    ? Theme.LightGray
                    : Theme.Red,
                },
              ]}>
              <Text
                style={[
                  styles.followText,
                  {color: isFollowedByYou ? Theme.SecondaryText : Theme.Pure},
                ]}>
                {isFollowedByYou ? 'Unfollow' : 'Follow'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Story Data */}
        {data?.data.map((item, index) => {
          if (item.type === 'P') {
            return (
              <Paragraph
                content={item.content as string}
                markup={item.markup as []}
                key={index}
              />
            );
          }

          if (item.type === 'H1') {
            return <Heading text={item.content as string} key={index} />;
          }

          if (item.type === 'IMG') {
            return (
              <View
                style={{
                  paddingHorizontal: Spacing.Padding.Normal,
                }}
                key={item.itemId}>
                <Image
                  source={{uri: item.url as string}}
                  style={{
                    borderRadius: 13, // 13 seems quite good than 5
                    width: '100%',
                    marginVertical: Spacing.Margin.Normal,
                    aspectRatio: item.aspectRatio as number,
                  }}
                  resizeMode="contain"
                />
              </View>
            );
          }
        })}

        {/* <View style={styles.actionsCont}>
            <View style={styles.lncContainer}>
              <View style={{flexDirection: "row"}}>
                <Pressable>
                  "heart" for filled heart
                  <AntDesign name="hearto" size={24} color={Theme.SecondaryText} /> 
                </Pressable>  
                <Text style={[styles.statText, {color: Theme.SecondaryText}]}>24K likes</Text>

                <Text style={{color: Theme.SecondaryText, fontSize: 15}}>    •    </Text>

                <Pressable style={{flexDirection: "row"}}>
                  <Foundation name="comments" size={24} color={Theme.SecondaryText} /> 
                  <Text style={[styles.statText, {color: Theme.SecondaryText}]}>2K comments</Text>
                </Pressable>  
              </View>
            </View>

            <Pressable style={styles.followBtn}>
              <Text style={[styles.followText, {fontSize: 16}]}>Follow</Text>
            </Pressable>
          </View> */}

        <View style={styles.statCont}>
          <Text style={[styles.statText, {color: Theme.PrimaryText}]}>
            {`${numberFormatter(likes as number)} ${
              likes === 1 ? 'like' : 'likes'
            } • ${numberFormatter(data?.commentCount as number)} comments`}
          </Text>

          <View style={{justifyContent: 'center'}}>
            <Pressable
              onPress={FollowOrUnfollow}
              style={[
                styles.followBtn,
                {
                  backgroundColor: isFollowedByYou
                    ? Theme.LightGray
                    : Theme.Red,
                },
              ]}>
              <Text
                style={[
                  styles.followText,
                  {color: isFollowedByYou ? Theme.SecondaryText : Theme.Pure},
                ]}>
                {isFollowedByYou ? 'Unfollow' : 'Follow'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: StyleSheet.hairlineWidth,
            backgroundColor: Theme.Placeholder,
            marginTop: Spacing.Margin.Small,
          }}
        />

        <View style={styles.actionsCont}>
          <View style={styles.actionBtn}>
            {/* Use name="heart" for filled heart */}
            <Pressable onPress={likeStory}>
              {isLiked ? (
                <AntDesign name="heart" size={24} color="#fc5c65" />
              ) : (
                <AntDesign
                  name="hearto"
                  size={24}
                  color={Theme.SecondaryText}
                />
              )}
            </Pressable>
          </View>

          <View style={styles.actionBtn}>
            <Pressable
              onPress={() => {
                bs.current?.snapToIndex(0);
                bs.current?.snapToIndex(1);
              }}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={Theme.SecondaryText}
              />
            </Pressable>
          </View>
        </View>

        <View style={{width: '100%', height: 30}} />
      </ScrollView>
      <BottomSheet
        ref={bs}
        index={-1}
        backgroundStyle={{
          backgroundColor:
            type === 'dark' ? 'rgb(10,20,26)' : Theme.PrimaryBackground,
        }}
        handleIndicatorStyle={{backgroundColor: Theme.Placeholder}}
        snapPoints={snapPoints}
        enablePanDownToClose>
        <CommentsNav storyId={id} />
      </BottomSheet>
    </View>
  );
};

export default ReadingPage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingVertical: Spacing.Padding.Normal,
  },
  title: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 26,
    marginBottom: Spacing.Margin.Normal,
    paddingHorizontal: Spacing.Padding.Normal,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: Spacing.Margin.Small,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdc3c7',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: Spacing.Padding.Normal,
    maxWidth: '90%',
  },
  userName: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
  },
  bio: {
    fontSize: 12,
    fontWeight: '200',
  },
  followBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: 2,
  },
  followText: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 18,
  },
  actionsCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lncContainer: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
  },

  statCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.Padding.Normal,
  },
  actionBtn: {
    width: '50%',
    paddingVertical: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

import {View, Text, Pressable, Image, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';
import CONSTANTS from '../../../CONSTANTS';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import ActionSeperator from '../../components/CommentItem/ActionSeperator';

// Utils
import numberFormatter from '../../utils/numberFormatter';
import {Spacing} from '../../../theme';

type CommentType = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar_50: string;
    avatar_200: string;
  };
  text: string;
  stats: {
    likes: number;
  };
  isLikedByYou: boolean;
};

const Replies = ({route}: {route: any}) => {
  const id = route?.params?.id;
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const navigation = useNavigation();

  const [comment, setComment] = useState<CommentType | null>(null);
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [likeString, setLikeString] = useState('0');

  useEffect(() => {
    setLikeString(numberFormatter(likes));
  }, [likes]);

  const doLike = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/like-comment`,
        {
          commentId: id,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;
      if (resData.success) {
        setIsLikedByMe(resData.isLikedByYou);
        setLikes(resData.stats.likes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.post(
          `${CONSTANTS.BACKEND_URI}/fetch-comment`,
          {
            commentId: id,
          },
          {
            headers: {
              Authorization: state.token as string,
            },
          },
        );

        const resData = res.data;
        if (resData.success) {
          setComment(resData.data);
          setLikes(resData.data.stats.likes);
          setIsLikedByMe(resData.isLikedByYou);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }

    init();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          paddingVertical: Spacing.Padding.Large * 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator
          color={Theme.Black}
          animating={isLoading}
          size={35}
          // style={{display: isLoading ? 'flex' : 'none'}}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor:
            type === 'dark' ? 'rgb(10,20,26)' : Theme.PrimaryBackground,
        },
        styles.container,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.Padding.Normal,
          marginTop: Spacing.Margin.Large,
        }}>
        <Image source={{uri: comment?.user.avatar_50}} style={styles.avatar} />
        <View>
          <Text style={[styles.name, {color: Theme.PrimaryText}]}>
            {comment?.user.name}
          </Text>
          <Text style={[styles.username, {color: Theme.SecondaryText}]}>
            @{comment?.user.username}
          </Text>
        </View>
      </View>

      <View style={styles.commentCont}>
        <Text style={[styles.commentText, {color: Theme.PrimaryText}]}>
          {comment?.text}
        </Text>
      </View>

      <View style={styles.actionsCont}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable onPress={doLike}>
            {isLikedByMe ? (
              <AntDesign name="heart" size={24} color="#fc5c65" />
            ) : (
              <AntDesign name="hearto" size={24} color={Theme.PrimaryText} />
            )}
          </Pressable>
          <Text style={[{color: Theme.PrimaryText}, styles.statText]}>
            {likeString}
          </Text>
        </View>

        {/* <ActionSeperator /> */}

        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="back" size={24} color={Theme.SecondaryText} />
            <Text style={[{color: Theme.SecondaryText}, styles.statText]}>
              120 replies
            </Text>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

export default Replies;

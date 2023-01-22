import {View, Text, Image, Pressable} from 'react-native';
import React, {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import CONSTANTS from '../../../CONSTANTS';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

// Components
import ActionSeperator from './ActionSeperator';

// Utils
import trimCommentText from '../../utils/trimCommentText';
import numberFormatter from '../../utils/numberFormatter';

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

const CommentItem = ({id, user, text, stats, isLikedByYou}: CommentType) => {
  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const navigation = useNavigation();

  const commentText = text;
  const [likes, setLikes] = useState(numberFormatter(stats?.likes));
  const [isLikedByMe, setIsLikedByMe] = useState(isLikedByYou);

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
        setLikes(numberFormatter(resData?.stats?.likes));
      }
      console.log(resData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Image source={{uri: user.avatar_50}} style={styles.avatar} />

        <View style={styles.bodyWrapper}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text style={[styles.name, {color: Theme.PrimaryText}]}>
                {user.name}
              </Text>
              <Text style={[styles.username, {color: Theme.SecondaryText}]}>
                @{user.username}
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.commentCont}
            onPress={() => {
              //@ts-ignore
              navigation.navigate('Replies', {id});
            }}>
            <Text style={[styles.commentText, {color: Theme.PrimaryText}]}>
              {commentText.length > 250
                ? trimCommentText(commentText)
                : commentText}

              {commentText.length > 250 ? (
                <Text style={{color: Theme.SecondaryText}}>view more</Text>
              ) : null}
            </Text>
          </Pressable>

          <View style={styles.actionsCont}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={doLike}>
                {isLikedByMe ? (
                  <AntDesign name="heart" size={24} color="#fc5c65" />
                ) : (
                  <AntDesign
                    name="hearto"
                    size={22}
                    color={Theme.PrimaryText}
                  />
                )}
              </Pressable>
              <Text style={[{color: Theme.PrimaryText}, styles.statText]}>
                {stats?.likes != 0 ? likes : ''}
              </Text>
            </View>

            {/* Disabled replies (/for future) */}

            {/* <ActionSeperator />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="back" size={24} color={Theme.SecondaryText} />
            <Text style={[{color: Theme.SecondaryText}, styles.statText]}>
              120 replies
            </Text>
          </Pressable>
        </View> */}
          </View>
        </View>
      </View>
    </>
  );
};

export default CommentItem;

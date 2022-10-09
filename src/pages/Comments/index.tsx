import {View, Text, Pressable, ToastAndroid, Keyboard} from 'react-native';
import React, {useContext, useCallback, useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styles';
import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

// Components
import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import CommentItem from '../../components/CommentItem';
import {Spacing} from '../../../theme';
import CONSTANTS from '../../../CONSTANTS';

// Dummy data
const dummyData = [
  {
    id: 'sfdsffdsf545',
    user: {
      id: 'asdgdsgdsdsg',
      name: 'This is the name',
      username: 'username',
      avatar: 'https://i.pravatar.cc/100',
    },
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.',
    stats: {
      likes: 12054,
    },
  },
  {
    id: 'sfdsffftgjhdsf545',
    user: {
      id: 'asdgdsgdsdsg',
      name: 'This is the name',
      username: 'username',
      avatar: 'https://i.pravatar.cc/100',
    },
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.',
    stats: {
      likes: 12054,
    },
  },
  {
    id: 'sfdsffdfdfsf545',
    user: {
      id: 'asdgdsgdsdsg',
      name: 'This is the name',
      username: 'username',
      avatar: 'https://i.pravatar.cc/100',
    },
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.',
    stats: {
      likes: 12054,
    },
  },
  {
    id: 'sfdsffd96rdsf545',
    user: {
      id: 'asdgdsgdsdsg',
      name: 'This is the name',
      username: 'username',
      avatar: 'https://i.pravatar.cc/100',
    },
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.',
    stats: {
      likes: 12054,
    },
  },
  {
    id: 'sfdsffds24rfff545',
    user: {
      id: 'asdgdsgdsdsg',
      name: 'This is the name',
      username: 'username',
      avatar: 'https://i.pravatar.cc/100',
    },
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.',
    stats: {
      likes: 12054,
    },
  },
];

type SingleCommentType = {
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

const Comments = ({route}: {route: any}) => {
  const storyId = route.params.storyId;
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);

  const [comments, setComments] = useState<SingleCommentType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const publishComment = async (text: string) => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/add-comment`,
        {
          text,
          storyId,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;
      // if (resData.message) {
      //   ToastAndroid.show(resData.message, ToastAndroid.SHORT);
      // }
      if (resData.success) {
        setComments([resData.comment, ...comments]);
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const loadMore = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/fetch-comments`,
        {
          storyId,
          loaded: comments.length,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      // if (resData.message) {
      //   ToastAndroid.show(resData.message, ToastAndroid.SHORT);
      // }

      if (resData.success) {
        setComments([...comments, ...resData.data]);
      }

      if (resData.hasMore) {
        setHasMore(resData.hasMore);
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/fetch-comments`,
        {
          storyId,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      // if (resData.message) {
      //   ToastAndroid.show(resData.message, ToastAndroid.SHORT);
      // }

      if (resData.success) {
        if (resData.data) {
          setComments(resData.data);
        }
      }

      if (resData.hasMore) {
        setHasMore(resData.hasMore);
      }

      setIsRefreshing(false);
    } catch (err) {
      console.log(err);
      setIsRefreshing(false);
      setHasMore(false);
    }
  };

  const renderComments = useCallback(({item}: {item: SingleCommentType}) => {
    return (
      <CommentItem
        id={item.id}
        stats={item.stats}
        text={item.text}
        user={item.user}
        isLikedByYou={item.isLikedByYou}
      />
    );
  }, []);

  const Header = useCallback(() => {
    return (
      <RenderHeader
        onSendPress={async commentText => {
          Keyboard.dismiss();
          return await publishComment(commentText);
        }}
      />
    );
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.post(
          `${CONSTANTS.BACKEND_URI}/fetch-comments`,
          {
            storyId,
            loaded: comments.length,
          },
          {
            headers: {
              Authorization: state.token as string,
            },
          },
        );

        const resData = res.data;

        // if (resData.message) {
        //   ToastAndroid.show(resData.message, ToastAndroid.SHORT);
        // }

        if (resData.success) {
          if (resData.data) {
            setComments([...comments, ...resData.data]);
          }
        }

        if (resData.hasMore) {
          setHasMore(resData.hasMore);
        }

        setIsInitialLoading(false);
      } catch (err) {
        console.log(err);
        setIsInitialLoading(false);
        setHasMore(false);
      }
    }

    init();
  }, []);

  if (isInitialLoading) {
    return (
      <View>
        <Text style={{color: '#fff'}}>Loading...</Text>
      </View>
    );
  }

  if (!isInitialLoading && !comments) {
    return (
      <View>
        <Text style={{color: '#fff'}}>Be the first one to talk about this</Text>
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
      <BottomSheetFlatList
        keyboardShouldPersistTaps="handled"
        data={comments}
        renderItem={renderComments}
        ListHeaderComponent={Header}
        // ListHeaderComponent={() => (
        //   <RenderHeader
        //     onSendPress={async commentText => {
        //       Keyboard.dismiss();
        //       return await publishComment(commentText);
        //     }}
        //   />
        // )}

        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        initialNumToRender={4}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ItemSeparatorComponent={() => <Seperator color={Theme.Placeholder} />}
      />
    </View>
  );
};

const Seperator = ({color}: {color: string}) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        width: '80%',
        backgroundColor: color,
        height: 1,
        borderRadius: 3,
        marginVertical: Spacing.Margin.Large,
      }}
    />
  );
};

const RenderHeader = ({
  onSendPress,
}: {
  onSendPress: (commentText: string) => Promise<boolean>;
}) => {
  const [insideText, setInsideText] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const {Theme, type} = useContext(ThemeContext);

  useEffect(() => {
    if (insideText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    return () => {};
  }, [insideText]);

  return (
    <View style={styles.headerCont}>
      <Text style={[styles.heading, {color: Theme.SecondaryText}]}>
        Comments
      </Text>
      <BottomSheetTextInput
        // onContentSizeChange={() => {}}
        // onSubmitEditing={() => {}}
        value={insideText}
        onChangeText={val => {
          setInsideText(val);
          console.log(val);
        }}
        multiline
        placeholder="Write a comment"
        placeholderTextColor={Theme.Placeholder}
        style={[
          styles.input,
          {
            color: Theme.SecondaryText,
            backgroundColor:
              type === 'dark' ? 'rgb(37,47,53)' : 'rgb(200, 200, 200)',
          },
        ]}
      />
      <View style={styles.sendCont}>
        <Pressable
          disabled={isDisabled}
          onPress={async () => {
            const isSuccess = await onSendPress(insideText);
            if (isSuccess) {
              setInsideText('');
            }
          }}>
          <Text
            style={[
              styles.send,
              {
                color: isDisabled ? Theme.Placeholder : '#70a1ff',
                opacity: isDisabled ? 0.7 : 1,
              },
            ]}>
            Send
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Comments;

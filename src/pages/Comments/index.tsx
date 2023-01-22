import {
  View,
  Text,
  Pressable,
  ToastAndroid,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
        setComments(oldComments => [resData.comment, ...oldComments]);
        console.log(resData.comment);
        return true;
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  };

  const loadMore = async () => {
    if (!hasMore) {
      return;
    }

    setIsLoading(true);

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
        setComments(oldData => [...oldData, ...resData.data]);
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

  const ListHeader = useCallback(() => {
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
    <>
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
          ListHeaderComponent={ListHeader}
          ListFooterComponent={() => (
            <>
              {hasMore ? null : <Seperator color={Theme.LightGray as string} />}
              <View
                style={{
                  width: '100%',
                  height: Spacing.Margin.Large,
                  paddingVertical: hasMore ? Spacing.Padding.Large * 3 : 0,
                }}>
                <ActivityIndicator
                  color={Theme.Black}
                  animating={isLoading}
                  size={35}
                  style={{display: hasMore ? 'flex' : 'none'}}
                />
              </View>
            </>
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          initialNumToRender={4}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ItemSeparatorComponent={() => (
            <Seperator color={Theme.LightGray as string} />
          )}
        />
      </View>
    </>
  );
};

const Seperator = ({color}: {color: string}) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        width: '100%',
        backgroundColor: color,
        height: StyleSheet.hairlineWidth,
        marginVertical: Spacing.Margin.Normal,
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
  const [isSendingComment, setIsSendingComment] = useState(false);

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
      <BottomSheetTextInput
        // onContentSizeChange={() => {}}
        // onSubmitEditing={() => {}}
        value={insideText}
        onChangeText={val => {
          setInsideText(val);
        }}
        multiline
        placeholder="Write a comment"
        placeholderTextColor={Theme.Placeholder}
        style={[
          styles.input,
          {
            color: Theme.PrimaryText,
            backgroundColor: type === 'dark' ? 'rgb(37,47,53)' : Theme.Pure,
            borderColor: Theme.LightGray,
          },
        ]}
      />
      <View style={styles.sendCont}>
        <Pressable
          disabled={isDisabled || isSendingComment}
          onPress={async () => {
            setIsSendingComment(true);
            const isSuccess = await onSendPress(insideText);
            setIsSendingComment(false);
            if (isSuccess) {
              setInsideText('');
            }
          }}>
          <Text
            style={[
              styles.send,
              {
                color:
                  isDisabled || isSendingComment
                    ? Theme.Placeholder
                    : Theme.DarkPurple,
                opacity: isDisabled || isSendingComment ? 0.7 : 1,
              },
            ]}>
            {isSendingComment ? 'Sending...' : 'Send'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Comments;

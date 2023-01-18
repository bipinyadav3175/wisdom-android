import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Portal} from '@gorhom/portal';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

import CONSTANTS from '../../../CONSTANTS';
import {CustomFonts, Spacing} from '../../../theme';
// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BottomSheetTextInputProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';

const data = {
  id: 'g4w343',
  listname: 'Entertainment List',
  itemCount: 9,
  items: [
    {
      id: 'gj443587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj4433456587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'j45uhb',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj443u7587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj4435kluye87',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj44387645587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj44335hbf587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'gj443dsgfhj4587',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
    {
      id: 'jnt5dr4456',
      thumb:
        'https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU',
      title: 'This is the title of the awesome Story',
      avatar: 'https://i.pravatar.cc/400',
      authorName: 'John Doe',
    },
  ],
};

// Itemm
const Item = ({
  data,
  onRemovePress,
}: {
  data: any;
  onRemovePress: (id: string) => void;
}) => {
  const navigation = useNavigation();
  const {Theme} = useContext(ThemeContext);
  const user = data.user;

  const goRead = useCallback(() => {
    // @ts-ignore
    navigation.navigate('ReadingPage', {id: data.id});
  }, [data.id]);

  return (
    <Pressable onPress={goRead} style={styles.itemCont}>
      <Image
        source={
          data.thumb
            ? {uri: data.thumb}
            : require('../../../assets/dev/mountain.jpg')
        }
        style={styles.image}
      />

      <View style={[styles.rightBox]}>
        <Text
          style={[styles.title, {color: Theme.PrimaryText}]}
          numberOfLines={2}>
          {data.title}
        </Text>
        <View style={styles.bottomCont}>
          <View style={styles.authorCont}>
            <Image source={{uri: user.avatar_50}} style={styles.avatar} />
            <Text
              style={[{color: Theme.PrimaryText}, styles.authorName]}
              numberOfLines={1}>
              {user.name}
            </Text>
          </View>

          <Pressable
            onPress={() => onRemovePress(data.id as string)}
            style={styles.rippleCont}
            android_ripple={{borderless: true, color: Theme.RippleColor}}>
            <AntDesign name="delete" size={17} color={Theme.SecondaryText} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

type List = {
  id: string;
  thumb: null | string;
  title: string;
  user: {
    id: string;
    name: string;
    avatar_50: string;
    avatar_200: string;
  };
};

type Data = {
  id: string;
  listName: string;
  noOfStories: number;
  thumb: null | string;
  list: List[];
};

const ListPage = ({route}: {route: any}) => {
  const id = route.params.id;
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);

  const snapPoints = useMemo(() => ['40%'], []);
  const sheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<BottomSheetTextInput>(null);

  const navigation = useNavigation();

  const [data, setData] = useState<Data>({
    id: '',
    listName: '',
    noOfStories: 0,
    thumb: null,
    list: [],
  });

  //
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [text, setText] = useState('');

  // Render callback function for performance improvement
  const renderAllItems = useCallback(({item}: {item: any}) => {
    return (
      <Item data={item} key={item.id} onRemovePress={removeStoryFromList} />
    );
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const openChangeNameSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const deleteList = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/delete-reading-list`,
        {id},
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      if (resData.success) {
        navigation.goBack();

        Toast.show({
          type: 'success',
          text1: 'Reading list ' + data.listName + ' deleted',
        });
        return;
      }

      Toast.show({
        type: 'info',
        text1: resData?.message as string,
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Unable to delete list',
        text2: 'Please try again',
      });
    }
  };

  const removeStoryFromList = async (storyId: string) => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/remove-story-from-list`,
        {
          storyId,
          listId: id,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      if (resData.success && resData.removedId) {
        setData(oldData => {
          return {
            ...oldData,
            list: oldData.list.filter(
              list => list.id !== resData.removedId.toString(),
            ),
          };
        });

        Toast.show({
          type: 'success',
          text1: 'Story removed from list ' + data.listName,
        });
        return;
      }

      Toast.show({
        type: 'info',
        text1: resData?.message as string,
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Unable to remove story from list',
        text2: 'Please try again',
      });
    }
  };

  const changeName = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/change-list-name`,
        {
          name: text,
          listId: data.id,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      if (resData.success) {
        setData(oldData => ({...oldData, listName: resData.listName}));
        setText(resData.listName);

        sheetRef.current?.close();

        Toast.show({
          type: 'success',
          text1: 'List name changed to ' + resData.listName,
        });
        return;
      }

      sheetRef.current?.close();

      Toast.show({
        type: 'info',
        text1: resData.message,
      });
    } catch (err) {
      console.log();
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again',
      });
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.post(
          `${CONSTANTS.BACKEND_URI}/get-list`,
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

        console.log(resData);

        if (resData.success) {
          setData(resData.data);
          setText(resData.data.listName);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  return (
    <>
      <View
        style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
        <FlashList
          data={data.list}
          renderItem={renderAllItems}
          keyExtractor={item => item.id}
          estimatedItemSize={84}
          ItemSeparatorComponent={() => (
            <View style={{width: '100%', height: Spacing.Margin.Normal}} />
          )}
          ListFooterComponent={<View style={{width: '100%', height: 50}} />}
          ListHeaderComponent={
            <View style={styles.topBox}>
              <Text style={[styles.name, {color: Theme.PrimaryText}]}>
                {data.listName}
              </Text>
              <Text style={[styles.count, {color: Theme.SecondaryText}]}>
                {data?.noOfStories}{' '}
                {data?.noOfStories === 1 ? 'story' : 'stories'}
              </Text>
              <View style={styles.actionCont}>
                <Pressable
                  onPress={deleteList}
                  style={styles.rippleCont}
                  android_ripple={{borderless: true, color: Theme.RippleColor}}>
                  <AntDesign
                    name="delete"
                    size={24}
                    color={Theme.SecondaryText}
                  />
                </Pressable>

                <Pressable
                  onPress={openChangeNameSheet}
                  style={styles.rippleCont}
                  android_ripple={{borderless: true, color: Theme.RippleColor}}>
                  <AntDesign
                    name="edit"
                    size={24}
                    color={Theme.SecondaryText}
                  />
                </Pressable>
              </View>
            </View>
          }
        />
      </View>

      {/* Portal: Go anywhere */}
      <Portal>
        <BottomSheet
          index={-1}
          ref={sheetRef}
          onClose={() => inputRef.current?.blur()}
          snapPoints={snapPoints}
          onChange={index => {
            if (index === 0) {
              inputRef.current?.focus();
            }
          }}
          style={{
            paddingHorizontal: Spacing.Padding.Normal,
            paddingBottom: Spacing.Padding.Large,
          }}
          backgroundStyle={{
            backgroundColor:
              type === 'dark' ? 'rgb(10,20,26)' : Theme.PrimaryBackground,
          }}
          handleIndicatorStyle={{backgroundColor: Theme.LightGray}}
          backdropComponent={renderBackdrop}
          enablePanDownToClose>
          <Text style={[styles.btmHeading, {color: Theme.PrimaryText}]}>
            Change reading list's name
          </Text>

          <View style={styles.btmWrapper}>
            <BottomSheetTextInput
              ref={inputRef}
              maxLength={30}
              value={text}
              onChangeText={val => {
                setText(val);
                if (val.length === 0) {
                  setIsBtnDisabled(true);
                  return;
                }
                setIsBtnDisabled(false);
              }}
              placeholder="List name"
              placeholderTextColor={Theme.Placeholder}
              style={[
                styles.input,
                {
                  color: Theme.PrimaryText,
                  // backgroundColor: Theme.LightGray,
                  borderColor: Theme.LightGray,
                },
              ]}
            />

            <View style={styles.biCont}>
              <Pressable
                onPress={() => sheetRef.current?.close()}
                android_ripple={{color: Theme.RippleColor}}
                style={[
                  styles.basicBtn,
                  styles.outlineBtn,
                  {borderColor: Theme.Placeholder},
                ]}>
                <Text style={[styles.basicBtnText, {color: Theme.PrimaryText}]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={changeName}
                disabled={isBtnDisabled}
                android_ripple={{color: Theme.RippleColor}}
                style={[
                  styles.basicBtn,
                  styles.filledBtn,
                  {
                    backgroundColor: isBtnDisabled
                      ? Theme.LightGray
                      : Theme.LightBlue,
                    opacity: !isBtnDisabled ? 1 : 0.7,
                  },
                ]}>
                <Text style={[styles.basicBtnText, {color: Theme.PrimaryText}]}>
                  Change
                </Text>
              </Pressable>
            </View>
          </View>
        </BottomSheet>
      </Portal>
    </>
  );
};

export default ListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  topBox: {
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Normal,
    paddingBottom: Spacing.Padding.Large,
  },
  name: {
    fontFamily: CustomFonts.SSP.Bold,
    fontSize: 20,
  },
  count: {
    fontSize: 15,
  },
  actionCont: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: Spacing.Margin.Normal,
  },
  rippleCont: {
    padding: 5,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemCont: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  image: {
    width: '35%',
    height: 85,
    borderRadius: 5,
  },
  rightBox: {
    paddingLeft: Spacing.Padding.Normal,
    width: '65%',
  },
  title: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
  },
  authorCont: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: Spacing.Padding.Small,
  },
  authorName: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 14,
  },
  bottomCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  btmHeading: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 19,
    marginBottom: Spacing.Margin.Normal,
    marginTop: Spacing.Margin.Large,
  },
  biCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  basicBtn: {
    borderRadius: 7,
    paddingHorizontal: Spacing.Padding.Large * 2,
    paddingVertical: Spacing.Padding.Small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicBtnText: {
    fontSize: 18,
    fontWeight: '500',
  },
  filledBtn: {
    backgroundColor: '#5f27cd',
  },
  outlineBtn: {
    borderWidth: 1,
  },
  btmWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: '100%',
    borderRadius: 13,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: Spacing.Padding.Normal,
    marginVertical: Spacing.Margin.Normal,
    maxHeight: 300,
    marginBottom: Spacing.Margin.Large * 1.5,
  },
});

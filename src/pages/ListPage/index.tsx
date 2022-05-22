import {View, Text, StyleSheet, Pressable, Image, FlatList} from 'react-native';
import React, {useContext} from 'react';

import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

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
const Item = ({data}: {data: any}) => {
  const {Theme} = useContext(ThemeContext);

  return (
    <Pressable style={styles.itemCont}>
      <Image source={{uri: data.thumb}} style={styles.image} />

      <View style={[styles.rightBox]}>
        <Text
          style={[styles.title, {color: Theme.PrimaryText}]}
          numberOfLines={2}>
          {data.title}
        </Text>
        <View style={styles.bottomCont}>
          <View style={styles.authorCont}>
            <Image source={{uri: data.avatar}} style={styles.avatar} />
            <Text
              style={[{color: Theme.PrimaryText}, styles.authorName]}
              numberOfLines={1}>
              {data.authorName}
            </Text>
          </View>

          <Pressable
            style={styles.rippleCont}
            android_ripple={{borderless: true, color: Theme.RippleColor}}>
            <AntDesign name="delete" size={17} color={Theme.SecondaryText} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// Render function for performance improvement
const renderAllItems = ({item}: {item: any}) => {
  return <Item data={item} key={item.id} />;
};

const ListPage = ({route}: {route: any}) => {
  const id = route.params.id;
  const {Theme} = useContext(ThemeContext);
  return (
    <View
      style={[styles.container, {backgroundColor: Theme.PrimaryBackground}]}>
      <FlatList
        data={data.items}
        renderItem={renderAllItems}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View style={{width: '100%', height: Spacing.Margin.Normal}} />
        )}
        ListFooterComponent={<View style={{width: '100%', height: 50}} />}
        ListHeaderComponent={
          <View style={styles.topBox}>
            <Text style={[styles.name, {color: Theme.PrimaryText}]}>
              {data.listname}
            </Text>
            <Text style={[styles.count, {color: Theme.SecondaryText}]}>
              {data.itemCount} {data.itemCount === 1 ? 'story' : 'stories'}
            </Text>
            <View style={styles.actionCont}>
              <Pressable
                style={styles.rippleCont}
                android_ripple={{borderless: true, color: Theme.RippleColor}}>
                <AntDesign
                  name="delete"
                  size={24}
                  color={Theme.SecondaryText}
                />
              </Pressable>

              <Pressable
                style={styles.rippleCont}
                android_ripple={{borderless: true, color: Theme.RippleColor}}>
                <AntDesign name="edit" size={24} color={Theme.SecondaryText} />
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default ListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  topBox: {
    paddingHorizontal: Spacing.Padding.Large,
    paddingVertical: Spacing.Padding.Normal,
    paddingBottom: Spacing.Padding.Large,
  },
  name: {
    fontFamily: CustomFonts.Ubuntu.Bold,
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
    paddingHorizontal: Spacing.Padding.Large,
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
    fontFamily: CustomFonts.Ubuntu.Medium,
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
    fontFamily: CustomFonts.Ubuntu.Regular,
    fontSize: 14,
  },
  bottomCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
});

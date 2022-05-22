import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import type {Theme} from '../../utils/Theme';
import {CustomFonts, Spacing} from '../../../theme';

// const data = {
//     id: "grg46t4",
//     listName: "Entertainment List",
//     itemCount: 3,
//     thumb: "https://i.picsum.photos/id/439/600/450.jpg?hmac=lGXmo2zxmN0z_yhNJZtx6OuzejYabmg9vTDYS34UvUU",
//     categories: ["Movies", "Games", "Sports", "Games", "5th cat"]
// }

type Navigate = {
  navigate: (value: string, {id}: {id: string}) => never;
};

const ListItem = ({
  Theme,
  data,
}: {
  Theme: Theme;
  data: {
    id: string;
    listName: string;
    itemCount: number;
    thumb: string;
    categories: string[];
  };
}) => {
  const navigation = useNavigation<Navigate>();

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('ListPage', {id: data.id})}>
      <Image
        source={{uri: data.thumb}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textCont}>
        <Text style={[styles.name, {color: Theme.PrimaryText}]}>
          {data.listName}
        </Text>
        <Text style={[styles.count, {color: Theme.SecondaryText}]}>
          {data.itemCount} stories
        </Text>
        <View style={styles.catCont}>
          {data.categories.length <= 3
            ? data.categories.map((cat, index) => {
                return (
                  <Text
                    key={'catName' + index}
                    style={[styles.catName, {color: Theme.SecondaryText}]}>
                    {cat}
                  </Text>
                );
              })
            : data.categories.slice(0, 3).map((cat, index) => {
                if (index === 2) {
                  return (
                    <>
                      <Text
                        key={'catName' + index}
                        style={[styles.catName, {color: Theme.SecondaryText}]}>
                        {cat}
                      </Text>
                      <Text
                        key={'&more' + index}
                        style={{
                          color: Theme.SecondaryText,
                          fontSize: 12,
                          marginLeft: 10,
                          alignSelf: 'center',
                        }}>
                        & more
                      </Text>
                    </>
                  );
                } else {
                  return (
                    <Text
                      key={'catName' + index}
                      style={[styles.catName, {color: Theme.SecondaryText}]}>
                      {cat}
                    </Text>
                  );
                }
              })}
        </View>
      </View>
    </Pressable>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: '40%',
    height: 100,
    borderRadius: 5,
  },
  textCont: {
    height: 100,
    width: '60%',
    paddingLeft: Spacing.Padding.Normal,
  },
  name: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 18,
    marginBottom: Spacing.Margin.Small / 2,
  },
  count: {
    fontSize: 14,
    marginBottom: Spacing.Margin.Small / 2,
  },
  catCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  catName: {
    marginRight: Spacing.Margin.Small,
    marginBottom: 5,
    fontSize: 12,
    paddingHorizontal: 9,
    borderRadius: 50,
    backgroundColor: 'blue',
  },
});

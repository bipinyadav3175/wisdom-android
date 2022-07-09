import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CommentItem from '../CommentItem';
import {Spacing} from '../../../theme';

const Stack = createNativeStackNavigator();

const Page1 = () => {
  return (
    <View>
      <Text style={{color: '#fff'}}>This is the page 1</Text>
    </View>
  );
};
const Page2 = () => {
  return (
    <View>
      <Text style={{color: '#fff'}}>This is the page 2</Text>
    </View>
  );
};

const CommentsBottomSheetInsider = () => {
  return (
    // <View style={{paddingHorizontal: Spacing.Padding.Normal}}>
    //   <CommentItem />
    // </View>

    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen name="page1" component={Page1} />
      <Stack.Screen name="page2" component={Page2} />
    </Stack.Navigator>
  );
};

export default CommentsBottomSheetInsider;

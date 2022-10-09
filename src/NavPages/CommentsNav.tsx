import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Pages
import Comments from '../pages/Comments';
import Replies from '../pages/Replies';

const Stack = createNativeStackNavigator();

const CommentsNav = ({storyId}: {storyId: any}) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen
        name="Comments"
        component={Comments}
        initialParams={{storyId}}
      />
      <Stack.Screen name="Replies" component={Replies} />
    </Stack.Navigator>
  );
};

export default CommentsNav;

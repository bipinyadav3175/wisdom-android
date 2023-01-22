import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

// Pages
import Comments from '../pages/Comments';
import Replies from '../pages/Replies';

// Header
import Header from '../components/Header';

const Stack = createNativeStackNavigator();

const CommentsNav = ({storyId}: {storyId: any}) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: true, animation: 'slide_from_right'}}>
      <Stack.Screen
        name="Comments"
        component={Comments}
        initialParams={{storyId}}
        options={{
          header: () => <Header title="Comments" hideBackArrow showSeperator />,
        }}
      />
      <Stack.Screen
        name="Replies"
        component={Replies}
        options={{
          header: () => <Header title="Comment" showSeperator />,
        }}
      />
    </Stack.Navigator>
  );
};

export default CommentsNav;

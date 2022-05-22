import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import WritingPage from '../pages/WritingPage';
import StoryDetails from '../pages/StoryDetails';

const Stack = createNativeStackNavigator();

const EditorNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="WritingPage"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="WritingPage" component={WritingPage} />
      <Stack.Screen
        name="StoryDetails"
        component={StoryDetails}
        options={{headerShown: true, headerTitle: ''}}
      />
    </Stack.Navigator>
  );
};

export default EditorNav;

import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Pages inside profile nav
import ReadingList from '../pages/ReadingList';
import ListPage from '../pages/ListPage';
//
import ThemeContext from '../contexts/ThemeContext';
import Header from '../components/Header';

const Stack = createNativeStackNavigator();

const ListNav = () => {
  const {Theme} = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ReadingList">
      <Stack.Screen name="ReadingList" component={ReadingList} />
      <Stack.Screen
        name="ListPage"
        component={ListPage}
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};

export default ListNav;

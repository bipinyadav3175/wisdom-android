import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import axios from 'axios';
import CONSTANTS from '../../../CONSTANTS';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';
import StreakContext from '../../contexts/StreakContext';
import {CustomFonts, Spacing} from '../../../theme';

import Header from '../../components/Header';

// Icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import {formatDates} from './util';

const deviceWidth = Dimensions.get('window').width;

const Streak = () => {
  const {Theme} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const Streak = useContext(StreakContext);

  // States
  const [longestStreak, setLongestStreak] = useState(0);
  const [calendar, setCalendar] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(`${CONSTANTS.BACKEND_URI}/streak`, {
          headers: {
            Authorization: state.token as string,
          },
        });

        const resData = res.data;
        console.log(resData);

        if (resData.success) {
          setLongestStreak(resData.streak.longestStreak);
          setCalendar(formatDates(resData.streak.dates));
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Header title="Streak" />

        <View style={styles.wrapper}>
          <View
            style={[
              styles.box,
              {
                backgroundColor: '#ecf0f1',
                borderColor: Theme.PrimaryBackground,
              },
              styles.left,
            ]}>
            <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
              Current streak
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <FontAwesome5
                name="fire-alt"
                size={24}
                color={Theme.Green}
                style={{marginRight: Spacing.Margin.Small}}
              />
              <Text style={[styles.count, {color: Theme.Green}]}>
                {Streak.currentStreak}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.box,
              {
                backgroundColor: '#ecf0f1',
                borderColor: Theme.PrimaryBackground,
              },
              styles.right,
            ]}>
            <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
              Longest streak
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <Feather
                name="clock"
                size={24}
                color={Theme.LightPurple}
                style={{marginRight: Spacing.Margin.Small}}
              />
              <Text style={[styles.count, {color: Theme.LightPurple}]}>
                {longestStreak}
              </Text>
            </View>
          </View>
        </View>

        {/* Calender */}
        <Text style={[styles.history, {color: Theme.PrimaryText}]}>
          Streak history
        </Text>

        <View
          style={{
            marginHorizontal: Spacing.Padding.Normal,
            padding: 5,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: '#ecf0f1',
          }}>
          <Calendar
            displayLoadingIndicator={isLoading}
            disableArrowLeft
            disableArrowRight
            hideArrows
            theme={{
              backgroundColor: Theme.PrimaryBackground,
              calendarBackground: Theme.PrimaryBackground,
            }}
            markedDates={calendar}
            markingType="period"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Streak;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  box: {
    // width: deviceWidth - Spacing.Margin.Normal,
    borderRadius: 13,
    flex: 1,
    padding: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Small,
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.Margin.Normal,
    paddingTop: Spacing.Padding.Large,
  },
  left: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  right: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
  },
  count: {
    fontSize: 40,
    fontFamily: CustomFonts.SSP.SemiBold,
  },
  history: {
    marginTop: Spacing.Margin.Large * 2,
    marginBottom: Spacing.Margin.Large,
    marginLeft: Spacing.Margin.Normal,
    fontSize: 20,
    fontWeight: '700',
  },
});

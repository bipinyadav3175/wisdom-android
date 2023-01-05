import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEY from '../utils/storageKeyMap';

import AuthContext from './AuthContext';
import CONSTANTS from '../../CONSTANTS';

type Context = {
  startTimer: () => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  increment: () => void;
  getDetails: () => void;
  currentStreak: number;
  shouldShowCompleteModal: boolean;
  streakCompleteModalShown: () => void;
};

const StreakContext = createContext<Context>({
  startTimer: () => {},
  resetTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  increment: () => {},
  getDetails: () => {},
  currentStreak: 0,
  shouldShowCompleteModal: false,
  streakCompleteModalShown: () => {},
});

const StreakProvider = ({children}: {children: React.ReactNode}) => {
  const {state} = useContext(AuthContext);

  // Loading streak data
  const [isLoading, setIsLoading] = useState(true);

  // All times are stored in ms except timeSpent (in sec)
  const timeSpent = useRef(0);
  const lastRequestSentAt = useRef(0);

  const isPaused = useRef(true);
  const [isTodaysStreakDone, setIsTodaysStreakDone] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isTodaysModalShown, setIsTodaysModalShown] = useState(true);

  // For Modals
  const shouldShowCompleteModal = useRef(false);

  function increment() {
    if (!isPaused.current) {
      timeSpent.current = timeSpent.current + 1;
      console.log('Time Spent:', timeSpent.current);
      console.log('Last request sent at:', lastRequestSentAt.current);
    }

    if (timeSpent.current - lastRequestSentAt.current >= 30) {
      updateStreak();
    }
  }

  function startTimer() {
    isPaused.current = false;
  }

  function resetTimer() {
    isPaused.current = true;
    updateStreak({reset: true});
    timeSpent.current = 0;
  }

  function pauseTimer() {
    isPaused.current = true;
  }

  function resumeTimer() {
    isPaused.current = false;
  }

  async function streakCompleteModalShown() {
    setIsTodaysModalShown(true);
    shouldShowCompleteModal.current = false;
    await AsyncStorage.setItem(
      STORAGE_KEY.IS_STREAK_COMPLETE_MODAL_SHOWN,
      JSON.stringify(true),
    );
  }

  const updateStreak = async ({reset} = {reset: false}) => {
    console.log('Time Spent:', timeSpent);

    try {
      const timeOfRequest = timeSpent.current;

      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/streak/update`,
        {
          read: timeSpent.current - lastRequestSentAt.current,
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
        lastRequestSentAt.current = reset ? 0 : timeOfRequest;

        if (!isTodaysStreakDone) {
          setIsTodaysStreakDone(resData.streak.completedToday);
        }
        setCurrentStreak(resData.streak.currentStreak);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function getDetails() {
    try {
      const res = await axios.get(`${CONSTANTS.BACKEND_URI}/streak`, {
        params: {
          completed: true,
          currentStreak: true,
        },
        headers: {
          Authorization: state.token as string,
        },
      });

      const resData = res.data;
      console.log(resData);

      if (resData.success) {
        setIsTodaysStreakDone(resData.streak.completed);
        setCurrentStreak(resData.streak.currentStreak);

        // Loading Complete
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isTodaysStreakDone && !isTodaysModalShown) {
      shouldShowCompleteModal.current = true;
      return;
    }

    shouldShowCompleteModal.current = false;
  }, [isTodaysModalShown, isTodaysStreakDone]);

  useEffect(() => {
    async function init() {
      try {
        let modalShownString = await AsyncStorage.getItem(
          STORAGE_KEY.IS_STREAK_COMPLETE_MODAL_SHOWN,
        );

        if (modalShownString === null) {
          setIsTodaysModalShown(false);
          return;
        }

        setIsTodaysModalShown(JSON.parse(modalShownString));

        if (isLoading) return;

        if (!isTodaysStreakDone) {
          await AsyncStorage.setItem(
            STORAGE_KEY.IS_STREAK_COMPLETE_MODAL_SHOWN,
            JSON.stringify(false),
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, [isLoading]);

  return (
    <StreakContext.Provider
      value={{
        startTimer,
        resetTimer,
        pauseTimer,
        resumeTimer,
        increment,
        getDetails,
        currentStreak,
        shouldShowCompleteModal: shouldShowCompleteModal.current,
        streakCompleteModalShown,
      }}>
      {children}
    </StreakContext.Provider>
  );
};

export default StreakContext;
export {StreakProvider};

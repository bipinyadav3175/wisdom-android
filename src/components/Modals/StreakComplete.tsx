import {
  View,
  Text,
  Modal,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import React, {useEffect, useContext} from 'react';

// Lottie
import Lottie from 'lottie-react-native';
// Animations
const fire = require('../../../assets/animations/fire.json');

// Contexts
import ThemeContext from '../../contexts/ThemeContext';
import StreakContext from '../../contexts/StreakContext';
import {CustomFonts, Spacing} from '../../../theme';

type ModalProps = {
  visible: boolean;
  onContinue: () => void;
};

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

const StreakComplete = ({visible, onContinue}: ModalProps) => {
  const {Theme} = useContext(ThemeContext);
  const Streak = useContext(StreakContext);

  // useEffect(() => {
  //   async function init() {
  //     try {
  //       await SystemNavigationBar.setNavigationColor(
  //         Theme.Green as string,
  //         'light',
  //         'both',
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   init();
  // }, []);

  return (
    <>
      <Modal visible={visible}>
        <View style={[styles.container]}>
          <View style={styles.wrapper}>
            <Lottie
              source={fire}
              autoPlay
              loop
              resizeMode="contain"
              style={styles.fire}
            />
            <Text style={[styles.streak, {color: Theme.PrimaryText}]}>
              {Streak.currentStreak} day Streak!
            </Text>
            <Text style={[styles.about, {color: Theme.SecondaryText}]}>
              Read 10 minutes daily to build your streak
            </Text>
          </View>

          <Pressable
            onPress={() => onContinue()}
            style={[styles.button, {backgroundColor: Theme.Green}]}
            android_ripple={{color: Theme.RippleColor}}>
            <Text style={[styles.btnText, {color: Theme.Pure}]}>Continue</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

StreakComplete.defaultProps = {
  visible: false,
};

export default StreakComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.Margin.Large * 2,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fire: {
    width: deviceWidth * 0.6,
  },
  streak: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 24,
    marginTop: Spacing.Margin.Normal,
    marginBottom: Spacing.Margin.Small,
  },
  about: {
    fontSize: 20,
    width: deviceWidth * 0.6,
    fontFamily: CustomFonts.SSP.SemiBold,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth - Spacing.Padding.Large * 2,
    paddingVertical: Spacing.Padding.Normal,
    borderRadius: 13,
    marginTop: deviceHeight * 0.25,
  },
  btnText: {
    fontFamily: CustomFonts.SSP.SemiBold,
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

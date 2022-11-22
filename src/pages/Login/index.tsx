import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, {useContext, useMemo, useEffect} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CustomFonts, Spacing} from '../../../theme';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

const img_aspect_ratio = 0.563;
const img_resize_factor = 1.2; // value from 0 to 1

const img_width = Dimensions.get('window').width * img_resize_factor;
const img_height = img_width / img_aspect_ratio;

const Login = () => {
  const {addUser} = useContext(AuthContext);

  const {Theme} = useContext(ThemeContext);

  // For bottom sheet
  const snapPoints = useMemo(() => ['50%'], []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const response = await axios.post(
        'http://192.168.1.3:5000/google-login',
        {
          idToken,
        },
      );

      const data = response.data;
      console.log(data);
      if (data.success) {
        await addUser({
          token: data.token,
          name: data.name,
          email: data.email,
          username: data.username,
          id: data.id,
        });
      }
    } catch (error) {
      // @ts-ignore
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // @ts-ignore
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // @ts-ignore
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  // return (
  //   <View>
  //     <GoogleSigninButton
  //       // style={{width: "100%"}}
  //       onPress={signIn}
  //     />
  //     <Pressable onPress={signOut}>
  //       <Text>Signout</Text>
  //     </Pressable>
  //   </View>
  // );

  // useEffect(() => {
  //   signOut();
  // }, []);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/others/landscape.png')}
          style={styles.image}>
          <LinearGradient
            colors={['#FFFFFF00', '#2f0c29']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.gradientBox}>
            <View style={styles.contentWrapper}>
              <Text
                style={[styles.heroLine, {color: 'rgba(255, 255, 255, 0.9)'}]}>
                Explore the world of wisdom
              </Text>
              <Text
                style={[
                  styles.subHeroLine,
                  {color: 'rgba(255, 255, 255, 0.7)'},
                ]}>
                A place to get other's wisdom and share yours too
              </Text>

              <Pressable
                android_ripple={{color: 'rgba(0, 0, 0, 0.3)'}}
                style={[styles.signInBtn, {backgroundColor: Theme.Red}]}
                onPress={signIn}>
                <AntDesign name="google" size={24} color={Theme.Pure} />
                <Text style={[styles.signInText, {color: Theme.Pure}]}>
                  Continue with Google
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={'light-content'}
        translucent
      />
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: img_width,
    height: img_height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gradientBox: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Spacing.Padding.Large * 5,
  },
  contentWrapper: {
    paddingHorizontal: Spacing.Padding.Large * 3,
    paddingVertical: Spacing.Padding.Large * 2,
    alignItems: 'center',
    width: img_width,
  },
  heroLine: {
    fontSize: 45,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: Spacing.Margin.Normal,
    fontFamily: CustomFonts.SSP.SemiBold,
  },
  subHeroLine: {
    fontSize: 25,
    textAlign: 'center',
    fontFamily: CustomFonts.SSP.Regular,
  },
  signInBtn: {
    alignSelf: 'center',
    width: '100%',
    marginTop: Spacing.Margin.Large,
    paddingVertical: 10,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5f27cd',
  },
  signInText: {
    marginLeft: Spacing.Margin.Normal,
    fontSize: 20,
    fontFamily: CustomFonts.SSP.SemiBold,
  },
  wrapper: {
    width: '100%',
  },
});

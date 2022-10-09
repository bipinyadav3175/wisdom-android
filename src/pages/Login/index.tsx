import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, {useContext, useMemo, useEffect} from 'react';
import axios from 'axios';
import BottomSheet from '@gorhom/bottom-sheet';

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
        <Image
          source={require('../../../assets/others/waving-astronaut.png')}
          style={styles.image}
        />
      </View>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={'light-content'}
        translucent
      />

      <BottomSheet
        snapPoints={snapPoints}
        index={0}
        backgroundStyle={{backgroundColor: Theme.PrimaryBackground}}
        enableOverDrag={false}
        handleIndicatorStyle={{display: 'none'}}>
        <View style={styles.sheetCont}>
          <View style={styles.wrapper}>
            <Text style={[styles.heroTitle, {color: Theme.PrimaryText}]}>
              Welcome to the world of wisdom
            </Text>
            <Text style={[styles.desc, {color: Theme.SecondaryText}]}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
              nulla est! Consequuntur reprehenderit facilis recusandae
              voluptatum eaque, iste itaque quod.
            </Text>
          </View>

          {/* <GoogleSigninButton onPress={signIn} style={styles.signInBtn} /> */}
          <Pressable style={styles.signInBtn} onPress={signIn}>
            <AntDesign name="google" size={24} color={Theme.PrimaryText} />
            <Text style={[styles.signInText, {color: Theme.PrimaryText}]}>
              Continue with Google
            </Text>
          </Pressable>
        </View>
      </BottomSheet>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: img_width,
    height: img_height,
  },
  sheetCont: {
    paddingVertical: Spacing.Padding.Normal,
    paddingHorizontal: Spacing.Padding.Normal,
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: Spacing.Padding.Large,
  },
  heroTitle: {
    alignSelf: 'center',
    fontSize: 29,
    // fontFamily: CustomFonts.Ubuntu.Bold,
    textAlign: 'center',
    paddingHorizontal: Spacing.Padding.Large * 2,
    fontWeight: '600',
  },
  desc: {
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: Spacing.Padding.Large,
    fontWeight: '400',
    marginTop: Spacing.Margin.Normal,
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
  },
  wrapper: {
    width: '100%',
  },
});

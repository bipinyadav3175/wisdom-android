import {View, Text, Pressable} from 'react-native';
import React, {useContext} from 'react';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Login = () => {
  const {addUser} = useContext(AuthContext);

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

  return (
    <View>
      <GoogleSigninButton
        // style={{width: "100%"}}
        onPress={signIn}
      />
      <Pressable onPress={signOut}>
        <Text>Signout</Text>
      </Pressable>
    </View>
  );
};

export default Login;

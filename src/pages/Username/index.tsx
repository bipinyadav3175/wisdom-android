import {
  View,
  Text,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
//
import CONSTANTS from '../../../CONSTANTS';

import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
import AuthContext from '../../contexts/AuthContext';

const Username = () => {
  const {state, addUser} = useContext(AuthContext);
  const {Theme} = useContext(ThemeContext);

  const [username, setUsername] = useState('');
  const [tipText, setTipText] = useState('Minimum 5 characters');
  const [btnEnabled, setBtnEnabled] = useState(false);

  const check4username = async (username: string) => {
    try {
      const res = await axios.get(
        `${CONSTANTS.BACKEND_URI}/username-available/${username}`,
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      if (res.data.available) {
        setTipText('Username available :)');
        setBtnEnabled(true);
      } else {
        setTipText('Username is not available :(');
        setBtnEnabled(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const isAlphaNumUnderValid = /^[A-Za-z0-9_]+$/.test(username);
    const isValid = /^[A-Za-z0-9_]{5,15}$/.test(username);

    if (isValid) {
      setTipText('Checking for username availability');
      check4username(username);
    }

    if (username.length > 15) {
      setTipText('Maximum 15 characters');
    }

    if (!isAlphaNumUnderValid) {
      setTipText('Only alphabets, numbers and _ is allowed');
    }

    if (username.length < 5) {
      setTipText('Minimum 5 characters');
    }

    if (!isValid) {
      setBtnEnabled(false);
    }
  }, [username]);

  const saveUsername = async () => {
    try {
      const res = await axios.get(
        `${CONSTANTS.BACKEND_URI}/save-username/${username}`,
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      if (res.data.success) {
        await addUser({
          id: state.id as string,
          token: state.token as string,
          name: state.name as string,
          email: state.email as string,
          username: res.data.username,
        });
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Pressable onPress={Keyboard.dismiss}>
        <Text style={[{color: Theme.PrimaryText}, styles.title]}>
          Secure your username
        </Text>

        <View style={[styles.inputCont, {borderColor: Theme.Placeholder}]}>
          <Text
            style={{
              color: Theme.SecondaryText,
              fontFamily: CustomFonts.Ubuntu.Medium,
              fontSize: 18,
              marginRight: 10,
            }}>
            @
          </Text>
          <TextInput
            style={[styles.input, {color: Theme.PrimaryText}]}
            placeholderTextColor={Theme.Placeholder}
            placeholder="Create a username"
            value={username}
            onChangeText={val => setUsername(val.trim())}
          />
        </View>
        <Text style={[styles.tipText, {color: Theme.SecondaryText}]}>
          {tipText}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.btn,
          {
            backgroundColor: !btnEnabled ? Theme.Placeholder : '#5f27cd',
            opacity: btnEnabled ? 1 : 0.7,
          },
        ]}
        disabled={!btnEnabled}
        onPress={saveUsername}>
        <Text style={styles.btnText}>Proceed</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Username;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Large,
    position: 'relative',
    height: '100%',
  },
  title: {
    fontFamily: CustomFonts.Ubuntu.Bold,
    fontSize: 30,
    alignSelf: 'center',
    letterSpacing: 3,
    marginTop: 30,
    marginBottom: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 18,
  },
  inputCont: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  btn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 7,
    backgroundColor: '#5f27cd',
    position: 'absolute',
    bottom: 25,
    left: Spacing.Padding.Normal,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: CustomFonts.Ubuntu.Regular,
    fontSize: 20,
    color: '#fff',
  },
  tipText: {
    fontSize: 14,
    marginTop: 10,
  },
});

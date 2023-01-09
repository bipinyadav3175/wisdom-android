import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import axios from 'axios';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import {Spacing} from '../../../theme';
import CONSTANTS from '../../../CONSTANTS';

type Avatar = {
  uri: string;
  fileName: string | null;
  width: number | null;
  height: number | null;
  type: string | null;
};

const EditProfile = () => {
  const {state, addUser} = useContext(AuthContext);
  const id = state.id;
  const {Theme} = useContext(ThemeContext);
  // States
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string>('');

  const [tipText, setTipText] = useState('Minimum 5 characters');
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');

  const saveProfile = async () => {
    try {
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/update-profile`,
        {
          name: name,
          username: username,
          bio: bio,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      if (!resData.success) {
        Toast.show({
          type: 'info',
          text1: resData?.message as string,
        });
        return;
      }

      // If profile success fully updated then update the details in the edit profile page
      const profile = resData.profile;

      setName(profile.name);
      setSavedUsername(profile.username);
      setUsername(profile.username);
      setBio(profile.bio);

      await addUser({
        token: state.token as string,
        name: profile.name as string,
        email: state.email as string,
        id: state.id as string,
        username: profile.username as string,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Unable to update profile',
        text2: 'Please try again',
      });
    }
  };

  const uploadAvatar = async (rawData: {
    uri: string;
    type: string;
    name: string;
  }) => {
    try {
      const dataToSend = new FormData();

      dataToSend.append('avatar', {
        uri: rawData.uri,
        type: rawData.type,
        name: rawData.name,
      });

      const res = await fetch(`${CONSTANTS.BACKEND_URI}/upload-avatar`, {
        body: dataToSend,
        method: 'POST',
        headers: {
          Authorization: state.token as string,
        },
      });

      const resData = await res.json();

      if (!resData.success) {
        Toast.show({
          type: 'error',
          text1: 'Unable to change avatar',
        });
        return;
      }

      const profile = resData.profile;

      setAvatar(profile.avatar_200);

      Toast.show({
        type: 'success',
        text1: 'Avatar changed',
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Unable to change avatar',
        text2: 'Please try again',
      });
    }
  };

  const chooseAvatar = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});

      if (result.assets) {
        let avatar = result.assets[0];
        // setAvatar({
        //   fileName: avatar.fileName as string,
        //   type: avatar.type as string,
        //   height: avatar.height as number,
        //   width: avatar.width as number,
        //   uri: avatar.uri as string,
        // });

        await uploadAvatar({
          uri: avatar.uri as string,
          type: avatar.type as string,
          name: avatar.fileName as string,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    async function init() {
      try {
        const res = await axios.get(`${CONSTANTS.BACKEND_URI}/user/${id}`, {
          headers: {
            Authorization: state.token as string,
          },
        });

        const resData = res.data;
        if (resData.success) {
          setName(resData.data.name);
          setSavedUsername(resData.data.username);
          setUsername(resData.data.username);
          setBio(resData.data.bio);
          setAvatar(resData.data.avatar_200);

          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (username === savedUsername) {
      setTipText('You already own this username');
      setBtnEnabled(true);
      return;
    }

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
  }, [username, name]);

  useEffect(() => {
    if (!name.trim()) {
      setBtnEnabled(false);
    }
  }, [name, username]);

  if (isLoading) {
    return (
      <View>
        <Text style={{color: Theme.PrimaryText}}>Loading</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}
          contentContainerStyle={{alignItems: 'center', flex: 1}}>
          <Pressable onPress={chooseAvatar}>
            <Image source={{uri: avatar}} style={styles.avatar} />
          </Pressable>
          <Pressable onPress={chooseAvatar}>
            <Text style={[styles.change, {color: Theme.SecondaryText}]}>
              Change avatar
            </Text>
          </Pressable>

          <View
            style={{
              width: '100%',
              marginBottom: Spacing.Margin.Large,
              marginTop: Spacing.Margin.Large,
            }}>
            <Text style={[styles.inputTitle, {color: Theme.PrimaryText}]}>
              Name
            </Text>
            <TextInput
              placeholder="Name"
              style={[
                styles.input,
                {color: Theme.PrimaryText, borderColor: Theme.Placeholder},
              ]}
              placeholderTextColor={Theme.Placeholder}
              value={name}
              onChangeText={val => setName(val)}
            />
          </View>

          <View style={{width: '100%', marginBottom: Spacing.Margin.Large}}>
            <Text style={[styles.inputTitle, {color: Theme.PrimaryText}]}>
              Username
            </Text>

            <View
              style={[
                styles.input,
                {
                  borderColor: Theme.Placeholder,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <Text
                style={{
                  fontSize: 18,
                  color: Theme.Placeholder,
                  marginRight: 5,
                }}>
                @
              </Text>
              <TextInput
                placeholder="Username"
                style={{color: Theme.PrimaryText, fontSize: 18, flex: 1}}
                placeholderTextColor={Theme.Placeholder}
                value={username}
                onChangeText={val => setUsername(val.trim())}
              />
            </View>

            <Text style={[styles.tipText, {color: Theme.SecondaryText}]}>
              {tipText}
            </Text>
          </View>

          <View style={{width: '100%', marginBottom: Spacing.Margin.Large}}>
            <Text style={[styles.inputTitle, {color: Theme.PrimaryText}]}>
              Bio
            </Text>
            <TextInput
              placeholder="Tell more about you"
              style={[
                styles.input,
                {color: Theme.PrimaryText, borderColor: Theme.Placeholder},
              ]}
              placeholderTextColor={Theme.Placeholder}
              maxLength={120}
              multiline
              value={bio}
              onChangeText={val => setBio(val)}
            />
          </View>

          <Pressable
            onPress={saveProfile}
            android_ripple={{color: Theme.RippleColor}}
            style={[
              styles.saveBtn,
              {backgroundColor: !btnEnabled ? Theme.Placeholder : Theme.Green},
            ]}
            disabled={!btnEnabled}>
            <Text style={[styles.saveText, {color: Theme.Black}]}>Save</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EditProfile;

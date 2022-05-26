import {View, Text, Pressable, Image, TextInput} from 'react-native';
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

import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import {Spacing} from '../../../theme';
import CONSTANTS from '../../../CONSTANTS';

type Avatar = {
  uri: string;
  fileName: string | null;
  width: number | null;
  height: number | null;
  updated: boolean;
  type: string | null;
};

const EditProfile = () => {
  const {state} = useContext(AuthContext);
  const id = state.id;
  const {Theme} = useContext(ThemeContext);
  // States
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<Avatar>();

  const [tipText, setTipText] = useState('Minimum 5 characters');
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');

  const saveProfile = async () => {
    try {
      const dataToSend = new FormData();

      if (avatar?.updated) {
        dataToSend.append('avatar', {
          uri: avatar?.uri as string,
          type: avatar.type as string,
          name: avatar.fileName as string,
        });
      }
      dataToSend.append('name', name);
      dataToSend.append('username', username);
      dataToSend.append('bio', bio);

      const res = await fetch(`${CONSTANTS.BACKEND_URI}/update-profile`, {
        body: dataToSend,
        method: 'POST',
        headers: {
          Authorization: state.token as string,
        },
      });

      const resData = await res.json();

      if (!resData.success) {
        return;
      }

      // If profile success fully updated then update the details in the edit profile page
      const profile = resData.profile;

      setName(profile.name);
      setSavedUsername(profile.username);
      setUsername(profile.username);
      setBio(profile.bio);
      setAvatar({
        fileName: null,
        height: null,
        type: null,
        updated: false,
        uri: profile.avatar_200,
        width: null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const chooseAvatar = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});

      if (result.assets) {
        let avatar = result.assets[0];
        setAvatar({
          fileName: avatar.fileName as string,
          type: avatar.type as string,
          height: avatar.height as number,
          width: avatar.width as number,
          updated: true,
          uri: avatar.uri as string,
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
          setAvatar({
            fileName: null,
            height: null,
            type: null,
            updated: false,
            uri: resData.data.avatar_200,
            width: null,
          });

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
  }, [username]);

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
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: 'center', flex: 1}}>
        <Image source={{uri: avatar?.uri}} style={styles.avatar} />
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
              style={{fontSize: 18, color: Theme.Placeholder, marginRight: 5}}>
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
            {backgroundColor: !btnEnabled ? Theme.Placeholder : '#0984e3'},
          ]}
          disabled={!btnEnabled}>
          <Text style={[styles.saveText, {color: '#fff'}]}>Save</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditProfile;

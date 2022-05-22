import {View, Text, Pressable, Image, TextInput} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import {Spacing} from '../../../theme';
import CONSTANTS from '../../../CONSTANTS';

const EditProfile = () => {
  const {state} = useContext(AuthContext);
  const id = state.id;
  const {Theme} = useContext(ThemeContext);

  // States
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

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
          setUsername(resData.data.username);
          setBio(resData.data.bio);
          setAvatar(resData.data.avatar);

          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text style={{color: Theme.PrimaryText}}>Loading</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{alignItems: 'center'}}>
      <Image source={{uri: avatar}} style={styles.avatar} />
      <Pressable>
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
        <TextInput
          placeholder="Username"
          style={[
            styles.input,
            {color: Theme.PrimaryText, borderColor: Theme.Placeholder},
          ]}
          placeholderTextColor={Theme.Placeholder}
          value={username}
        />
      </View>

      <View style={{width: '100%', marginBottom: Spacing.Margin.Large}}>
        <Text style={[styles.inputTitle, {color: Theme.PrimaryText}]}>Bio</Text>
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

      <Pressable style={styles.saveBtn}>
        <Text style={[styles.saveText, {color: '#fff'}]}>Save</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {CustomFonts, Spacing} from '../../../theme';

import ThemeContext from '../../contexts/ThemeContext';
import AuthContext from '../../contexts/AuthContext';

// BottomSheet Components
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import CONSTANTS from '../../../CONSTANTS';

const ReadingListBottomSheet2 = ({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (isCreated: boolean) => void;
}) => {
  const {Theme, type} = useContext(ThemeContext);
  const {state} = useContext(AuthContext);
  const [text, setText] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  const createNewList = async () => {
    try {
      // sending request server side
      const res = await axios.post(
        `${CONSTANTS.BACKEND_URI}/create-reading-list`,
        {
          name: text,
        },
        {
          headers: {
            Authorization: state.token as string,
          },
        },
      );

      const resData = res.data;

      // if success:
      if (resData.success) {
        onCreate(true);
        // Empty the input
        setText('');
      } else {
        ToastAndroid.show(resData.message, ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisabled(true);
    } else {
      setIsBtnDisabled(false);
    }
  }, [text]);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, {color: Theme.PrimaryText}]}>
        Create new list
      </Text>
      <View>
        <BottomSheetTextInput
          maxLength={30}
          value={text}
          onChangeText={val => {
            setText(val);
          }}
          placeholder="List name"
          placeholderTextColor={Theme.Placeholder}
          style={[
            styles.input,
            {
              color: Theme.PrimaryText,
              // backgroundColor: Theme.LightGray,
              borderColor: Theme.LightGray,
            },
          ]}
        />

        <View style={styles.biCont}>
          <Pressable
            onPress={() => {
              onCancel();
              setText('');
            }}
            android_ripple={{color: Theme.RippleColor}}
            style={[
              styles.basicBtn,
              styles.outlineBtn,
              {borderColor: Theme.Placeholder},
            ]}>
            <Text style={[styles.basicBtnText, {color: Theme.PrimaryText}]}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              createNewList();
              setText('');
            }}
            disabled={isBtnDisabled}
            android_ripple={{color: Theme.RippleColor}}
            style={[
              styles.basicBtn,
              styles.filledBtn,
              {
                backgroundColor: isBtnDisabled
                  ? Theme.LightGray
                  : Theme.LightBlue,
                opacity: !isBtnDisabled ? 1 : 0.7,
              },
            ]}>
            <Text style={[styles.basicBtnText, {color: Theme.PrimaryText}]}>
              Create
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ReadingListBottomSheet2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.Padding.Normal,
  },
  heading: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 19,
    alignSelf: 'center',
    marginBottom: Spacing.Margin.Normal,
    marginTop: Spacing.Margin.Large,
  },
  input: {
    width: '100%',
    borderRadius: 13,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: Spacing.Padding.Normal,
    marginVertical: Spacing.Margin.Normal,
    maxHeight: 300,
    marginBottom: Spacing.Margin.Large * 1.5,
  },
  biCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  basicBtn: {
    borderRadius: 7,
    paddingHorizontal: Spacing.Padding.Large * 2,
    paddingVertical: Spacing.Padding.Small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicBtnText: {
    fontSize: 18,
    fontWeight: '500',
  },
  filledBtn: {
    backgroundColor: '#5f27cd',
  },
  outlineBtn: {
    borderWidth: 1,
  },
});

import {
  View,
  Dimensions,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

import type {Theme} from '../../../utils/Theme';
import {Spacing} from '../../../../theme';

const DeviceWidth = Dimensions.get('window').width;

type EditorItemType = {
  type: string;
  markup: [] | null;
  // id: string;
  content: string | null;
  url: string | null;
  aspectRatio: number | null;
};

type EditorDataType = EditorItemType[];

const Input = ({
  Theme,
  onChangeText,
  index,
  value,
  onFocus,
  type,
  onSelectionChange,
  editorData,
  onPressDelete,
}: {
  Theme: Theme;
  onChangeText: (val: string) => void;
  index: number;
  value: string;
  onFocus: () => void;
  type: string;
  onSelectionChange: (val: {start: number; end: number}) => void;
  editorData: EditorDataType;
  onPressDelete: (index: number) => void;
}) => {
  const inputRef = useRef<TextInput>(null);

  // For giving the option to delete the input if it is empty and there is another element next to it
  const [showDelete, setShowDelete] = useState(
    editorData[index].content?.trim() === '' && editorData[index + 1]
      ? true
      : false,
  );

  useEffect(() => {
    if (editorData[index].content?.trim() === '' && editorData[index + 1]) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  }, [editorData]);

  // useEffect(()=> {
  //     if(currentFocusedInput === index){
  //         inputRef.current?.focus()
  //     }
  // }, [currentFocusedInput])

  return (
    <View
      style={{
        marginHorizontal: Spacing.Padding.Normal,
        alignSelf: 'center',
        position: 'relative',
        width: DeviceWidth - 2 * Spacing.Padding.Normal,
      }}>
      <TextInput
        ref={inputRef}
        value={value}
        placeholder={index === 0 ? 'Start writing...' : 'continue writing...'}
        onChangeText={val => {
          onChangeText(val);

          if (val.trim() === '' && editorData[index + 1]) {
            setShowDelete(true);
          } else {
            setShowDelete(false);
          }
        }}
        onFocus={() => onFocus()}
        style={{
          width: '100%',
          color: type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
          fontSize: 18,
          maxHeight: 1000000,
        }}
        placeholderTextColor={
          type === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }
        multiline
        onSelectionChange={e => {
          onSelectionChange(e.nativeEvent.selection);
        }}
      />

      <Pressable
        style={{
          position: 'absolute',
          right: Spacing.Padding.Small,
          top: 9,
          bottom: 9,
          padding: 5,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          display: showDelete ? 'flex' : 'none',
        }}
        onPress={() => onPressDelete(index)}>
        <AntDesign name="delete" size={18} color={Theme.SecondaryText} />
      </Pressable>
    </View>
  );
};

export default Input;

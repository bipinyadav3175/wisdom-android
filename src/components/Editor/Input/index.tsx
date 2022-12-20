import {
  View,
  Dimensions,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Pressable,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

import type {Theme} from '../../../utils/Theme';
import {Spacing, CustomFonts} from '../../../../theme';
import {formatData} from '../utils';

const DeviceWidth = Dimensions.get('window').width;

type EditorItemType = {
  type: string;
  markup:
    | {
        type: string;
        start: number;
        end: number;
      }[]
    | null;
  content: string | null;
  // id: string;
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
  onDoubleEnter,
  forceFocus,
  onBackspaceWithNoText,
}: {
  Theme: Theme;
  onChangeText: (val: string) => void;
  index: number;
  value: EditorItemType;
  onFocus: () => void;
  type: string;
  onSelectionChange: (val: {start: number; end: number}) => void;
  editorData: EditorDataType;
  onPressDelete: (index: number) => void;
  onDoubleEnter?: () => void;
  forceFocus: number | null;
  onBackspaceWithNoText?: () => void;
}) => {
  const inputRef = useRef<TextInput>(null);

  const [previousContent, setPreviousContent] = useState('');

  const data = useMemo(() => {
    const formatedData = formatData(
      value.content as string,
      value.markup as [{type: string; start: number; end: number}],
    );
    console.log('formated Data =', formatedData);
    return formatedData;
  }, [value.content, value.markup]);

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

  useEffect(() => {
    if (forceFocus === index) {
      inputRef.current?.focus();
    }
  }, [forceFocus]);

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
        // value={value}
        placeholder={index === 0 ? 'Start writing...' : 'continue writing...'}
        onChangeText={val => {
          onChangeText(val);

          // if (val.trim() === '' && editorData[index + 1]) {
          //   setShowDelete(true);
          // } else {
          //   setShowDelete(false);
          // }

          if (val.length < 2) {
            return;
          }

          let lastCharacter = val[val.length - 1];
          let secondLastCharacter = val[val.length - 2];
          if (lastCharacter.match(/\n/g) && secondLastCharacter.match(/\n/g)) {
            onDoubleEnter?.();
          }
        }}
        onKeyPress={e => {
          // Do not delete this code
          // (Cause this is the only way it works)
          if (e.nativeEvent.key === 'Backspace' && !previousContent) {
            onBackspaceWithNoText?.();
          }

          setPreviousContent(value.content as string);
        }}
        onFocus={() => onFocus()}
        style={{
          width: '100%',
          color: type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
          fontSize: 21,
          maxHeight: 1000000,
          fontFamily: CustomFonts.SSP.Regular,
        }}
        placeholderTextColor={
          type === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }
        multiline
        onSelectionChange={e => {
          onSelectionChange(e.nativeEvent.selection);
        }}>
        {data.map((item, ind) => {
          let font = CustomFonts.SSP.Regular;
          let underline = false;
          switch (item.type) {
            case 'BOLD':
              font = CustomFonts.SSP.SemiBold;
              break;

            case 'ITALIC':
              font = CustomFonts.SSP.Italic;
              break;

            case 'UNDERLINE':
              underline = true;
              break;

            default:
              break;
          }

          return (
            <Text
              key={'text-' + ind}
              style={{
                color:
                  type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
                fontSize: 21,
                fontFamily: font,
                textDecorationLine: underline ? 'underline' : undefined,
              }}>
              {item.text}
            </Text>
          );
        })}
      </TextInput>

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
          // display: showDelete ? 'flex' : 'none',
          display: 'none',
        }}
        onPress={() => onPressDelete(index)}>
        <AntDesign name="delete" size={18} color={Theme.SecondaryText} />
      </Pressable>
    </View>
  );
};

export default Input;

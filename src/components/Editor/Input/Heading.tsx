import {View, Text, Dimensions, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CustomFonts, Spacing} from '../../../../theme';
import type {Theme} from '../../../utils/Theme';

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

const Heading = ({
  Theme,
  onChangeText,
  index,
  value,
  onFocus,
  type,
  onSelectionChange,
  forceFocus,
  placeholder,
  onBackspaceWithNoText,
  onEnter,
}: {
  Theme: Theme;
  onChangeText: (val: string) => void;
  index: number;
  value: EditorItemType;
  onFocus: () => void;
  type: string;
  onSelectionChange: (val: {start: number; end: number}) => void;
  forceFocus: number | null;
  placeholder?: string;
  onBackspaceWithNoText?: () => void;
  onEnter?: () => void;
}) => {
  const inputRef = useRef<TextInput>(null);
  const [previousContent, setPreviousContent] = useState('');

  // useEffect(() => {
  //   console.log(lastKeyPressed, 'KEYYYYY');
  //   if (!value.content && lastKeyPressed === 'Backspace' && !previousContent) {
  //     onBackspaceWithNoText?.();
  //   }

  //   setPreviousContent(value.content);
  // }, [lastKeyPressed]);

  useEffect(() => {
    if (forceFocus === index) {
      inputRef.current?.focus();
    }
  }, [forceFocus]);

  return (
    <View
      style={{
        marginHorizontal: Spacing.Padding.Normal,
        alignSelf: 'center',
        position: 'relative',
        width: Dimensions.get('window').width - 2 * Spacing.Padding.Normal,
      }}>
      <TextInput
        ref={inputRef}
        value={value.content as string}
        placeholder={placeholder}
        onChangeText={val => {
          onChangeText(val.replace('\n', ''));
        }}
        // blurOnSubmit={true}
        // onBlur={() => {
        //   onEnter?.();
        // }}
        onKeyPress={e => {
          if (e.nativeEvent.key === 'Enter') {
            onEnter?.();
          }
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
          fontSize: 24,
          maxHeight: 1000000,
          fontFamily: CustomFonts.SSP.SemiBold,
        }}
        placeholderTextColor={
          type === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }
        multiline
        onSelectionChange={e => {
          onSelectionChange(e.nativeEvent.selection);
        }}></TextInput>
    </View>
  );
};

export default Heading;

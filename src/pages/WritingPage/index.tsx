import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useContext, useEffect, useRef} from 'react';
import EditorContext from '../../contexts/EditorContext';
//
import {useNavigation} from '@react-navigation/native';

import Editor from '../../components/Editor';
import Toolbar from '../../components/Toolbar';
import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
import type {EditorContentType} from '../../components/Editor';
//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

type Action = {
  id: string;
  type: string;
} | null;

const WritingPage = () => {
  const {update} = useContext(EditorContext);
  const {Theme, type} = useContext(ThemeContext);
  const [action, setAction] = useState<Action>(null);

  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  const [editorData, setEditorData] = useState<EditorContentType>();
  const [title, setTitle] = useState('');

  const [btnDisabled, setBtnDisabled] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    if (
      !title.trim() ||
      // @ts-ignore
      (editorData[0].type === 'P' && !editorData[0].content?.trim()) ||
      !editorData
    ) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [editorData, title]);

  return (
    <View style={{position: 'relative', flex: 1}}>
      {/* <KeyboardAvoidingView style={{position: 'relative'}}> */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color={Theme.PrimaryText} />
        </Pressable>

        <Pressable
          disabled={btnDisabled}
          style={[
            styles.publishBtn,
            {
              backgroundColor: btnDisabled
                ? Theme.Placeholder
                : Theme.Chocolate,
              opacity: !btnDisabled ? 1 : 0.7,
            },
          ]}
          onPress={() => {
            update(editorData as EditorContentType, title);
            // @ts-ignore
            navigation.navigate('StoryDetails');
          }}>
          <Text style={styles.publishText}>Publish</Text>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{backgroundColor: Theme.PrimaryBackground}}
        keyboardShouldPersistTaps="handled">
        <Editor
          scrollRef={scrollRef}
          action={action}
          editorData={val => setEditorData(val)}
          onTitle={val => setTitle(val)}
        />
        {/* For spacing at the end */}
        {/* <View style={{width: '100%', height: 200}} /> */}
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
      <Toolbar type={type} onActionTriggered={val => setAction(val)} />
    </View>
  );
};

export default WritingPage;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Normal,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishText: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 19,
    color: '#fff',
  },
  publishBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#575fcf',
    borderRadius: 100,
  },
});
